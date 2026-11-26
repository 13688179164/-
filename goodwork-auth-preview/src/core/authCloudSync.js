/**
 * AuthCloudSync：账号登录 + 云函数数据层
 * 与 CloudSync 保持相同的外部接口，供 ReimburseBoard / main.js 直接替换。
 */
import cloudbase from '../../vendor/cloudbase-v3.esm.js';
import { resolveEnv } from './env.js?v=20261127v1';

const ENV = resolveEnv();
const LS_TASKS = 'goodwork.reimburse.tasks.v3';
const LS_PROCESSED = 'goodwork.reimburse.processed.v1';
const POLL_MS = 15000;

// datetime-local 的值没有时区，统一按门店本地时间 +08:00 提交，
// 兼容尚未升级时区解析的云函数版本
function withStoreOffset(value) {
  const v = String(value == null ? '' : value).trim();
  if (!v) return v;
  if (/(?:Z|[+-]\d{2}:?\d{2})$/i.test(v)) return v;
  return /T\d{2}:\d{2}$/.test(v) ? `${v}:00+08:00` : `${v}+08:00`;
}

const app = cloudbase.init({ env: ENV });
const auth = app.auth();

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function isSample(t) {
  return String(t?.id || '').startsWith('GW-RB-SAMPLE');
}

function extOf(name, type) {
  const m = String(name || '').match(/\.([A-Za-z0-9]{1,6})$/);
  if (m) return m[1].toLowerCase();
  const sub = String(type || '').split('/')[1] || 'bin';
  return sub.replace(/[^a-z0-9]/gi, '').slice(0, 6) || 'bin';
}

function fileSafe(name) {
  return String(name || 'file').replace(/[^\w.\-\u4e00-\u9fa5]/g, '_').slice(-80);
}

function compressImage(blob) {
  return new Promise((resolve) => {
    if (!blob || !String(blob.type || '').startsWith('image/')) return resolve(blob);
    const img = new Image();
    const url = URL.createObjectURL(blob);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const max = 1600;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((out) => resolve(out || blob), 'image/jpeg', 0.82);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(blob); };
    img.src = url;
  });
}

export class AuthCloudSync {
  constructor({ getState, applyState, getAttachmentBlob, onAttachmentsUploaded, onStatus, onToast }) {
    this.getState = () => {
      const tasks = (readJson(LS_TASKS, []) || []).filter((t) => !isSample(t));
      const processedEvents = (readJson(LS_PROCESSED, []) || []).filter((e) => !isSample({ id: e.taskId }));
      return { tasks, processedEvents };
    };
    this.applyState = applyState || (() => {});
    this.getAttachmentBlob = getAttachmentBlob || (async () => null);
    this.onAttachmentsUploaded = onAttachmentsUploaded || (() => {});
    this.onStatus = onStatus || (() => {});
    this.onToast = onToast || (() => {});

    this.status = 'idle';
    this.connected = false;
    this.syncing = false;
    this.applying = false;
    this.errorDetail = '';
    this.user = null;
    this._remote = new Map();
    this._pushTimer = null;
    this._pollTimer = null;
    this._pushing = false;
    this._pushQueued = false;
    this._visBound = false;
    this._initialized = false;
  }

  isConnected() { return this.connected; }

  getStatus() {
    return {
      connected: this.connected,
      syncing: this.syncing,
      status: this.status,
      user: this.user,
      taskCount: this._remote.size,
      error: this.errorDetail,
      lastSyncAt: this.lastSyncAt || '',
    };
  }

  async api(action, data = {}) {
    const res = await app.callFunction({ name: 'api', data: { action, ...data } });
    const out = res && res.result;
    if (!out) throw new Error('云函数没有返回结果');
    if (!out.ok) throw new Error(out.message || '操作失败');
    return out;
  }

  async init() {
    if (this._initialized && this.connected) return;
    this.status = 'connecting';
    this.onStatus('connecting', { message: '正在登录云开发…' });
    try {
      const state = await auth.getLoginState();
      if (!state) throw new Error('请先登录');
      const profile = await this.api('profile');
      this.user = profile.user;
      window.__AUTH_USER__ = profile.user;
      this.connected = true;
      this.status = 'connected';
      this._initialized = true;
      this.onStatus('connected', { message: '云已连接' });
      await this.pullNow({ silent: true });
      this.startPoll();
      if (!this._visBound) {
        this._visBound = true;
        // 页面从后台切回前台时立即补拉一次，避免管理员长时间看不到成员新提交
        document.addEventListener('visibilitychange', () => {
          if (!document.hidden) this.pullNow({ silent: true }).catch(() => {});
        });
      }
    } catch (e) {
      this.connected = false;
      this.status = 'error';
      this.errorDetail = e.message || String(e);
      this.onStatus('error', { message: this.errorDetail });
      throw e;
    }
  }

  async connect() { return this.init(); }

  disconnect() {
    this.stopPoll();
    this.connected = false;
    this.status = 'disconnected';
    this.onStatus('disconnected', { message: '已断开' });
  }

  startPoll() {
    this.stopPoll();
    this._pollTimer = setInterval(() => {
      if (document.visibilityState === 'hidden') return;
      this.pullNow({ silent: true }).catch(() => {});
    }, POLL_MS);
  }

  stopPoll() {
    if (this._pollTimer) clearInterval(this._pollTimer);
    this._pollTimer = null;
  }

  mapTask(t, atts) {
    const s = t.status;
    const uiStatus = s === 'reimbursed' ? 'reimbursed' : (s === 'supplemented' ? 'supplemented' : 'pending');
    return {
      id: t.id,
      applicant: t.applicant || '',
      amount: Number(t.amount) || 0,
      department: t.department || '其他',
      category: t.category || '其他',
      appliedAt: t.applied_at,
      content: t.content || '',
      status: uiStatus,
      serverStatus: s,
      hasInvoice: !!t.has_invoice,
      invoiceReceived: !!t.invoice_received,
      invoiceReceivedAt: t.invoice_received_at || null,
      reimbursedAt: t.reimbursed_at || null,
      reimbursedFrom: null,
      highValuePart: !!t.high_value_part,
      crossMonth: t.cross_month,
      stockingCost: t.stocking_cost,
      legacyUnclaimed: !!t.legacy_unclaimed,
      attachments: (atts || []).map((a) => ({
        id: a.id,
        name: a.name || '附件',
        size: Number(a.size) || 0,
        type: a.mime_type || '',
        cloudFileId: a.cloud_file_id || '',
      })),
      createdAt: t.applied_at,
      updatedAt: t.updated_at,
      order: Date.parse(t.applied_at) || Date.now(),
    };
  }

  async pullNow({ silent = true } = {}) {
    if (this.applying || !this.connected) return false;
    const out = await this.api('list', {});
    const byTask = new Map();
    for (const a of out.attachments || []) {
      if (!byTask.has(a.task_id)) byTask.set(a.task_id, []);
      byTask.get(a.task_id).push(a);
    }
    const serverIds = new Set((out.tasks || []).map((t) => t.id));
    // 🔧 本地刚保存、还没被任何一次成功推送确认过的记录，不能被云端列表直接覆盖丢失
    // （否则新建后若推送被并发轮询打断，卡片会消失且再也找不回来）
    const localOnly = this.getState().tasks.filter(
      (t) => !this._remote.has(t.id) && !serverIds.has(t.id)
    );
    const tasks = [
      ...localOnly,
      ...(out.tasks || []).map((t) => this.mapTask(t, byTask.get(t.id))),
    ].sort((a, b) => (Number(b.order) || 0) - (Number(a.order) || 0));
    this._remote = new Map((out.tasks || []).map((t) => [t.id, t]));
    this.applying = true;
    try {
      this.applyState({ tasks, processedEvents: this.getState().processedEvents }, { source: 'cloud', silent });
    } finally {
      this.applying = false;
    }
    this.lastSyncAt = new Date().toISOString();
    this.onStatus('connected', { message: '已同步' });
    return true;
  }

  markLocalChange() {
    if (this._pushTimer) clearTimeout(this._pushTimer);
    this._pushTimer = setTimeout(() => {
      this.pushNow({ silent: true }).catch((e) => {
        this.errorDetail = e.message;
        this.onStatus('error', { message: e.message });
      });
    }, 700);
  }

  async uploadAttachment(taskId, att) {
    if (!att || att.cloudFileId) return att;
    let blob = null;
    try { blob = await this.getAttachmentBlob(att.id); } catch { blob = null; }
    if (!blob) return att;
    const compressed = await compressImage(blob);
    const path = `attachments/${this.user.username}/${taskId}/${att.id}-${Date.now()}.${extOf(att.name, compressed.type)}`;
    const upRes = await app.storage.from('tasks').upload(path, compressed);
    if (upRes && upRes.error) {
      throw new Error(`附件上传失败：${upRes.error.message || upRes.error}`);
    }
    const fileID = `cos:tasks/${path}`;
    att.cloudFileId = fileID;
    await this.api('attach', {
      taskId,
      name: att.name,
      size: compressed.size,
      mime: compressed.type || att.type || 'application/octet-stream',
      fileID,
    });
    return att;
  }

  async uploadTaskAttachments(task) {
    for (const att of task.attachments || []) {
      if (!att.cloudFileId) await this.uploadAttachment(task.id, att);
    }
  }

  async pushNow({ force = false, silent = true } = {}) {
    if (!this.connected) return false;
    // 🔧 正在推送或正在应用云端状态时不要直接丢弃本次变更，排队等当前任务结束后重试
    if (this._pushing || this.applying) {
      this._pushQueued = true;
      return false;
    }
    this._pushing = true;
    const state = this.getState();
    const local = state.tasks || [];
    const localIds = new Set(local.map((t) => t.id));
    try {
      for (const t of local) {
        const remote = this._remote.get(t.id);
        if (!remote) {
          try {
            await this.api('create', {
              clientId: t.id,
              amount: t.amount,
              department: t.department,
              category: t.category,
              appliedAt: withStoreOffset(t.appliedAt),
              content: t.content,
              hasInvoice: t.hasInvoice,
            });
          } catch (createErr) {
            // 上一次推送已创建成功（例如提交阶段失败后重试），不重复报错
            if (!/duplicate|已存在|23505/i.test(createErr?.message || '')) throw createErr;
          }
          await this.uploadTaskAttachments(t);
          try {
            await this.api('submit', { taskId: t.id });
          } catch (submitErr) {
            // 已经提交过（并发重试），视为成功
            if (!/状态|INVALID_STATE/i.test(submitErr?.message || '')) throw submitErr;
          }
          continue;
        }
        const rs = remote.status;
        if (t.status === 'reimbursed') {
          if (rs === 'submitted' && this.user.role === 'admin') {
            await this.api('review', { taskId: t.id, decision: 'approve', note: '' });
            await this.api('reimburse', { taskId: t.id });
          } else if (rs === 'approved') {
            await this.api('reimburse', { taskId: t.id });
          }
          continue;
        }
        // 字段修改：仅草稿/待审批允许
        if (['draft', 'submitted'].includes(rs)) {
          const changed = Number(remote.amount) !== Number(t.amount)
            || remote.department !== t.department
            || remote.category !== t.category
            || (remote.content || '') !== (t.content || '')
            || !!remote.has_invoice !== !!t.hasInvoice
            || String(remote.applied_at || '').slice(0, 16) !== String(t.appliedAt || '').slice(0, 16);
          if (changed) {
            await this.api('update', {
              taskId: t.id, amount: t.amount, department: t.department,
              category: t.category, appliedAt: withStoreOffset(t.appliedAt), content: t.content,
              hasInvoice: t.hasInvoice,
            });
          }
          await this.uploadTaskAttachments(t);
          // 之前提交失败的记录会停留在 draft，这里补交一次
          if (rs === 'draft') {
            try {
              await this.api('submit', { taskId: t.id });
            } catch (submitErr) {
              if (!/状态|INVALID_STATE/i.test(submitErr?.message || '')) throw submitErr;
            }
          }
        }
      }
      // 本地删除 → 云端撤销/删除草稿
      for (const [id, remote] of this._remote) {
        if (localIds.has(id)) continue;
        if (remote.status === 'draft') await this.api('remove', { taskId: id });
        else if (remote.status === 'submitted') await this.api('cancel', { taskId: id });
      }
      await this.pullNow({ silent });
      return true;
    } catch (e) {
      this.errorDetail = e.message || String(e);
      this.onStatus('error', { message: this.errorDetail });
      if (!silent) this.onToast('同步失败', this.errorDetail, 'error');
      throw e;
    } finally {
      this._pushing = false;
      if (this._pushQueued) {
        this._pushQueued = false;
        setTimeout(() => { this.pushNow({ silent: true }).catch(() => {}); }, 300);
      }
    }
  }

  async reviewTask(taskId, decision, note = '') {
    await this.api('review', { taskId, decision, note });
    await this.pullNow({ silent: false });
  }

  async reimburseTask(taskId) {
    await this.api('reimburse', { taskId });
    await this.pullNow({ silent: false });
  }

  async reassignTask(taskId, username) {
    await this.api('reassign', { taskId, username });
    await this.pullNow({ silent: false });
  }

  async recordDeletion(taskId) {
    const remote = this._remote.get(taskId);
    if (!remote) return;
    if (remote.status === 'draft') await this.removeDraft(taskId);
    else if (remote.status === 'submitted') await this.cancelTask(taskId);
  }

  async cancelTask(taskId) {
    await this.api('cancel', { taskId });
    await this.pullNow({ silent: false });
  }

  async removeDraft(taskId) {
    await this.api('remove', { taskId });
    await this.pullNow({ silent: false });
  }

  // 管理员删除任意状态的报销记录（成员走 removeDraft / cancelTask）
  async deleteTask(taskId) {
    await this.api('remove', { taskId });
    await this.pullNow({ silent: false });
  }

  async syncTaskAttachments(task) {
    if (!this.connected || !this._remote.has(task.id)) return;
    await this.uploadTaskAttachments(task);
  }

  async syncAllAttachments() {
    if (!this.connected) return;
    for (const t of this.getState().tasks) {
      if (this._remote.has(t.id)) await this.uploadTaskAttachments(t);
    }
  }

  async downloadAttachment(fileID) {
    const raw = String(fileID || '');
    let bucket = 'tasks';
    let path = raw;
    if (raw.startsWith('cos:')) {
      const rest = raw.slice(4);
      const slash = rest.indexOf('/');
      bucket = slash > 0 ? rest.slice(0, slash) : 'tasks';
      path = slash > 0 ? rest.slice(slash + 1) : rest;
    } else if (raw.startsWith('pg:')) {
      path = raw.slice(3);
    }
    const res = await app.storage.from(bucket).download(path);
    if (res?.error) throw res.error;
    const data = res?.data ?? res;
    if (data instanceof Blob) return data;
    if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) return new Blob([data]);
    if (typeof data === 'string') return new Blob([data]);
    throw new Error('附件下载返回格式无效');
  }

  async pullFullState() { return this.pullNow({ silent: true }); }
}
