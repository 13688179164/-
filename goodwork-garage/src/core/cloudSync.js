/**
 * 腾讯云开发 CloudBase PostgreSQL 同步
 * 团队共享一个工作区：所有设备使用 CloudBase 匿名登录，
 * 通过 app.rdb() (PostgREST RESTful API) 读写 PostgreSQL 实例。
 *
 * 表结构（四张表）：
 *   goodwork_tasks       报销记录主表
 *   goodwork_attachments 附件元数据表（外键 → goodwork_tasks）
 *   goodwork_processed   已报销事件表（去重追踪）
 *   goodwork_meta        工作区元数据（版本号等）
 *
 * 实时同步：定时轮询 (3s) + updated_at 增量拉取。
 * 冲突解决：最近写入优先 (updated_at DESC)。
 */
const SETTINGS_KEY = 'goodwork.cloud.settings.v1';
const DEVICE_KEY = 'goodwork.cloud.device.v1';
const DEFAULT_ENV_ID = 'attractive-starfish-d0bp2e865971';
const POLL_INTERVAL_MS = 3000; // 3 秒轮询一次
const PUSH_DEBOUNCE_MS = 1500;  // 本地修改后的上传防抖

function nowIso() {
  return new Date().toISOString();
}

function readJson(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function makeDeviceId() {
  if (crypto?.randomUUID) return crypto.randomUUID();
  return `dev-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function withTimeout(promise, ms, message) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    Promise.resolve(promise).then(
      (value) => { clearTimeout(timer); resolve(value); },
      (err) => { clearTimeout(timer); reject(err); }
    );
  });
}

/**
 * 把 PostgREST 的 { data, error } 返回值解析成纯数据或抛错。
 */
function assertOk(res, what) {
  if (res?.error) {
    const e = res.error;
    const msg = typeof e === 'string' ? e : (e.message || e.details || e);
    const err = new Error(`${what}失败：${msg}`);
    err.__code = e?.code;
    throw err;
  }
  return res?.data;
}

function rowsOf(data) {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  if (Array.isArray(data.data)) return data.data;
  return [];
}

export class CloudSync {
  constructor({
    getState,
    applyState,
    getAttachmentBlob,
    onAttachmentsUploaded,
    onStatus,
    onToast,
  }) {
    this.getState = getState;
    this.applyState = applyState;
    this.getAttachmentBlob = getAttachmentBlob;
    this.onAttachmentsUploaded = onAttachmentsUploaded || (() => {});
    this.onStatus = onStatus || (() => {});
    this.onToast = onToast || (() => {});

    this.settings = readJson(SETTINGS_KEY, {
      envId: DEFAULT_ENV_ID,
      autoSync: true,
      lastSyncAt: '',
    });
    if (!this.settings.envId) this.settings.envId = DEFAULT_ENV_ID;
    this.autoSync = this.settings.autoSync !== false;
    this.deviceId = localStorage.getItem(DEVICE_KEY) || makeDeviceId();
    try { localStorage.setItem(DEVICE_KEY, this.deviceId); } catch { /* noop */ }

    this.app = null;
    this.auth = null;
    this.rdb = null;
    this.connected = false;
    this.dirty = false;
    this.syncing = false;
    this.applying = false;
    this.uploading = false;
    this.localChangedAt = '';
    this.localVersion = 0;
    this.pushTimer = null;
    this.pollTimer = null;
    this.lastPollAt = null;          // 上次成功拉取的 updated_at 阈值
    this.lastRemoteUpdatedAt = '';   // 云端最新 updated_at
    this.errorDetail = '';
  }

  get envId() { return this.settings.envId || ''; }
  get lastSyncAt() { return this.settings.lastSyncAt || ''; }

  isConnected() { return this.connected; }
  isConfigured() { return !!this.settings.envId; }

  getStatus() {
    return {
      status: this.connected ? (this.syncing ? 'syncing' : 'connected') : 'need-login',
      connected: this.connected,
      envId: this.envId,
      deviceId: this.deviceId.slice(0, 8),
      lastSyncAt: this.lastSyncAt,
      autoSync: this.autoSync,
      error: this.errorDetail,
    };
  }

  emit(status, detail = {}) {
    this.onStatus(status, { ...this.getStatus(), ...detail });
  }

  saveSettings() {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings)); } catch { /* noop */ }
  }

  // ========== SDK 初始化 ==========

  async loadSdk() {
    if (window.cloudbase) return window.cloudbase;
    const url = new URL('vendor/cloudbase.full.js', document.baseURI).href;
    await new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-goodwork-cloudbase]');
      if (existing) {
        if (window.cloudbase) resolve();
        else existing.addEventListener('load', resolve, { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = url;
      script.dataset.goodworkCloudbase = '1';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('云开发 SDK 加载失败'));
      document.head.appendChild(script);
    });
    if (!window.cloudbase) throw new Error('云开发 SDK 未就绪');
    return window.cloudbase;
  }

  async ensureApp(envId = this.envId) {
    if (this.app && this.settings.envId === envId && this.rdb) return;
    this.resetConnection();
    const sdk = await this.loadSdk();
    this.settings.envId = envId;
    this.saveSettings();
    this.app = sdk.init({ env: envId });
    this.auth = this.app.auth({ persistence: 'local' });
    // rdb() 返回 PostgREST 查询构造器
    if (typeof this.app.rdb === 'function') {
      this.rdb = this.app.rdb();
    } else {
      throw new Error('当前 CloudBase SDK 版本不支持 PostgreSQL (app.rdb)。请升级 SDK。');
    }
  }

  resetConnection() {
    this.stopPoll();
    this.app = null;
    this.auth = null;
    this.rdb = null;
    this.connected = false;
    this.dirty = false;
    this.lastPollAt = null;
    this.lastRemoteUpdatedAt = '';
  }

  // ========== 匿名登录 ==========

  async init() {
    if (!this.envId) {
      this.emit('disabled');
      return;
    }
    try {
      await this.ensureApp();
      const loginState = await withTimeout(
        this.auth.getLoginState(),
        15000,
        '检查云开发登录态超时，请检查网络或点击重新连接。'
      );
      if (loginState?.user) {
        this.connected = true;
        await this.afterConnect({ auto: this.autoSync, silent: true });
      } else {
        this.emit('need-login');
      }
    } catch (err) {
      this.emit('need-login', { message: this.friendlyError(err) });
    }
  }

  async connect({ envId, autoSync } = {}) {
    const targetEnv = (envId && envId.trim()) || this.envId;
    if (!targetEnv) throw new Error('请先填写云开发环境 ID。');
    this.autoSync = autoSync !== false;
    this.settings.autoSync = this.autoSync;
    this.saveSettings();

    await this.ensureApp(targetEnv);
    this.emit('connecting');
    try {
      await withTimeout(
        this.auth.signInAnonymously(),
        30000,
        '匿名登录超时，请检查网络或云开发环境。'
      );
    } catch (err) {
      const message = this.friendlyError(err);
      this.connected = false;
      this.emit('error', { message });
      throw new Error(message);
    }
    this.connected = true;
    await this.afterConnect({ auto: this.autoSync });
    return true;
  }

  async disconnect() {
    this.stopPoll();
    try { await this.auth?.signOut?.(); } catch { /* noop */ }
    this.connected = false;
    this.dirty = false;
    this.lastPollAt = null;
    this.emit('need-login');
  }

  async afterConnect({ auto = true, silent = false } = {}) {
    this.emit('connecting');
    try {
      await this.connectData('auto');
      if (this.autoSync) this.startPoll();
      this.emit('connected');
      if (!silent) this.onToast('云开发 PostgreSQL 已连接', `匿名设备 · ${this.deviceId.slice(0, 8)}`, 'ok');
      if (this.autoSync) this.syncAllAttachments({ silent: true });
    } catch (err) {
      const message = this.friendlyError(err);
      this.connected = false;
      this.emit('error', { message });
      throw new Error(message);
    }
  }

  // ========== 数据库读写 ==========

  /** 把 PG 行转成本地 Task 对象 */
  rowToTask(row) {
    // attachments 在关联查询里返回 rows，在批量 push 时传 JSONB
    const attachRows = row.attachments || [];
    return {
      id: row.id,
      applicant: row.applicant || '',
      amount: Number(row.amount) || 0,
      department: row.department || '',
      category: row.category || '',
      appliedAt: row.applied_at,
      content: row.content || '',
      status: row.status || 'pending',
      hasInvoice: !!row.has_invoice,
      invoiceReceived: !!row.invoice_received,
      invoiceReceivedAt: row.invoice_received_at || null,
      reimbursedAt: row.reimbursed_at || null,
      reimbursedFrom: row.reimbursed_from || null,
      highValuePart: row.high_value_part === null ? null : !!row.high_value_part,
      crossMonth: row.cross_month === null ? null : !!row.cross_month,
      stockingCost: row.stocking_cost === null ? null : !!row.stocking_cost,
      order: Number(row.order_num) || 0,
      attachments: Array.isArray(attachRows) ? attachRows.map((a) => ({
        id: a.id,
        name: a.name || '',
        size: Number(a.size) || 0,
        type: a.mime_type || '',
        cloudFileId: a.cloud_file_id || '',
      })) : [],
      createdAt: row.created_at,
      updatedAt: row.updated_at,
    };
  }

  /** 把本地 Task 转成 PG 行（不含附件表，附件单写） */
  taskToRow(task, updatedAt) {
    return {
      id: task.id,
      applicant: task.applicant || '',
      amount: task.amount || 0,
      department: task.department || '',
      category: task.category || '',
      applied_at: task.appliedAt,
      content: task.content || '',
      status: task.status || 'pending',
      has_invoice: !!task.hasInvoice,
      invoice_received: !!task.invoiceReceived,
      invoice_received_at: task.invoiceReceivedAt || null,
      reimbursed_at: task.reimbursedAt || null,
      reimbursed_from: task.reimbursedFrom || null,
      high_value_part: task.highValuePart ?? null,
      cross_month: task.crossMonth ?? null,
      stocking_cost: task.stockingCost ?? null,
      order_num: task.order ?? 0,
      cloud_file_ids: (task.attachments || [])
        .filter((a) => a.cloudFileId)
        .map((a) => ({ id: a.id, cloudFileId: a.cloudFileId })),
      writer_device_id: this.deviceId,
      created_at: task.createdAt || updatedAt,
      updated_at: updatedAt,
    };
  }

  async connectData(mode = 'auto') {
    // 拉全量（带附件关联）
    let rows = [];
    try {
      const res = await withTimeout(
        this.rdb.from('goodwork_tasks')
          .select('*, attachments(*)')
          .order('updated_at', { ascending: false })
          .limit(5000),
        20000,
        '读取云端任务超时，请检查数据库权限。'
      );
      rows = assertOk(res, '读取任务');
    } catch (err) {
      // 表不存在 → 首次使用
      if (/relation|does not exist|42P01/.test(err.message) || err.__code === '42P01') {
        rows = [];
      } else {
        throw err;
      }
    }

    let processed = [];
    try {
      const pRows = await withTimeout(
        this.rdb.from('goodwork_processed').select(),
        20000,
        '读取已报销事件超时'
      );
      processed = assertOk(pRows, '读取已报销');
    } catch { processed = []; }

    // PG 返回的 attachments 是嵌套数组，需要在 rowToTask 里处理
    const remoteTasks = rows.map((r) => {
      const t = this.rowToTask(r);
      // 如果 attachments 关联查询没返回，而 cloud_file_ids 里有 → 补 cloudFileId
      if (!t.attachments?.length && r.cloud_file_ids) {
        try {
          const cids = typeof r.cloud_file_ids === 'string' ? JSON.parse(r.cloud_file_ids) : r.cloud_file_ids;
          if (Array.isArray(cids)) {
            t.attachments = cids.map((c) => ({
              id: c.id, cloudFileId: c.cloudFileId || '', name: '', size: 0, type: '',
            }));
          }
        } catch { /* noop */ }
      }
      return t;
    });

    const remoteProcessed = processed.map((r) => ({
      taskId: r.task_id,
      eventDate: r.event_date,
      amount: Number(r.amount) || 0,
      applicant: r.applicant || '',
      category: r.category || '',
      writerDeviceId: r.writer_device_id || '',
      createdAt: r.created_at,
    }));

    const local = this.getState();
    const localHasData = (local.tasks?.length || 0) + (local.processedEvents?.length || 0) > 0;

    if (mode === 'push') {
      await this.pushNow({ force: true, silent: true });
      return;
    }
    if (mode === 'pull' || (remoteTasks.length > 0)) {
      this.applyRemote(remoteTasks, remoteProcessed, { force: true, silent: true });
      return;
    }
    // auto + 云端为空 → 看本地有没有数据
    if (localHasData) {
      this.dirty = true;
      this.localChangedAt = nowIso();
      await this.pushNow({ force: true, silent: true });
    } else {
      // 都空，不做什么
    }
  }

  applyRemote(tasks, processed, { force = false, silent = false } = {}) {
    this.applying = true;
    try {
      this.applyState(
        { tasks, processedEvents: processed },
        { source: 'cloud', silent }
      );
    } finally {
      this.applying = false;
    }
    this.dirty = false;
    this.localChangedAt = nowIso();
    this.lastPollAt = Date.now();
    this.lastRemoteUpdatedAt = tasks.reduce((m, t) => (t.updatedAt > m ? t.updatedAt : m), '');
    this.settings.lastSyncAt = this.localChangedAt;
    this.saveSettings();
    if (!silent) {
      this.onToast('云端数据已更新', `${tasks.length} 笔报销记录`, 'ok');
    }
  }

  markLocalChange() {
    if (this.applying) return;
    this.localVersion++;
    this.dirty = true;
    this.localChangedAt = nowIso();
    if (this.connected && this.autoSync) this.schedulePush();
  }

  schedulePush() {
    clearTimeout(this.pushTimer);
    this.pushTimer = setTimeout(() => {
      this.pushNow({ silent: true });
    }, PUSH_DEBOUNCE_MS);
  }

  // ========== 上传（本地 → PG）==========

  async pushNow({ force = false, silent = false } = {}) {
    if (!this.connected || !this.rdb) return false;
    if (this.syncing) { return false; }
    if (!force && !this.dirty) return true;
    this.syncing = true;
    const versionAtStart = this.localVersion;
    this.emit('syncing');

    try {
      const state = this.getState();
      const now = nowIso();

      // --- 1. upsert 所有 tasks ---
      const taskRows = (state.tasks || []).map((t) => this.taskToRow(t, now));
      // PostgREST 通过 POST + Prefer: resolution=merge-duplicates 实现 upsert
      // CloudBase PG 的 upsert 方式：insert 时 Prefer: resolution=merge-duplicates
      if (taskRows.length > 0) {
        const res = await withTimeout(
          this.rdb.from('goodwork_tasks').upsert(taskRows).select('id, updated_at'),
          20000,
          '上传任务到云端超时'
        );
        assertOk(res, '上传任务');
      }

      // --- 2. upsert 所有 attachments ---
      const attachRows = [];
      for (const t of state.tasks || []) {
        for (const a of t.attachments || []) {
          attachRows.push({
            id: a.id,
            task_id: t.id,
            name: a.name || '',
            size: a.size || 0,
            mime_type: a.type || '',
            cloud_file_id: a.cloudFileId || '',
            blob_hash: '',
          });
        }
      }
      if (attachRows.length > 0) {
        // 先删后插（避免外键冲突）
        const attachRes = await withTimeout(
          this.rdb.from('goodwork_attachments').upsert(attachRows).select('id'),
          20000,
          '上传附件元数据超时'
        );
        assertOk(attachRes, '上传附件元数据');
      }

      // --- 3. upsert 所有 processed events ---
      const procRows = (state.processedEvents || []).map((e) => ({
        task_id: e.taskId,
        event_date: e.eventDate,
        amount: e.amount || 0,
        applicant: e.applicant || '',
        category: e.category || '',
        writer_device_id: e.writerDeviceId || this.deviceId,
        created_at: e.createdAt || now,
      }));
      if (procRows.length > 0) {
        const pRes = await withTimeout(
          this.rdb.from('goodwork_processed').upsert(procRows).select('task_id'),
          20000,
          '上传已报销事件超时'
        );
        assertOk(pRes, '上传已报销事件');
      }

      // --- 4. 更新 meta ---
      await withTimeout(
        this.rdb.from('goodwork_meta').upsert([{
          key: 'workspace',
          value: JSON.stringify({
            name: 'GOODWORK 古德車房',
            last_writer: this.deviceId,
            last_written_at: now,
          }),
          updated_at: now,
        }]),
        10000,
        '更新 meta 超时'
      ).catch(() => { /* meta 失败不阻塞 */ });

      this.localChangedAt = now;
      this.settings.lastSyncAt = now;
      this.saveSettings();

      if (versionAtStart === this.localVersion) {
        this.dirty = false;
      } else {
        this.dirty = true;
        this.schedulePush();
      }

      this.emit('connected');
      if (!silent) {
        this.onToast('已上传到 PostgreSQL', `${taskRows.length} 笔任务 · ${formatClock(now)}`, 'ok');
      }
      return true;
    } catch (err) {
      this.emit('error', { message: this.friendlyError(err) });
      if (!silent) this.onToast('云端上传失败', this.friendlyError(err));
      return false;
    } finally {
      this.syncing = false;
    }
  }

  // ========== 手动拉取 ==========

  async pullNow({ silent = false } = {}) {
    await this.connectData('pull');
    if (!silent) this.onToast('已从云端拉取', 'PostgreSQL 最新数据', 'ok');
  }

  // ========== 定时轮询（替代 doc.watch）==========

  startPoll() {
    this.stopPoll();
    if (!this.connected || !this.rdb) return;
    this.pollTimer = setInterval(() => this.pollTick(), POLL_INTERVAL_MS);
  }

  stopPoll() {
    clearInterval(this.pollTimer);
    this.pollTimer = null;
  }

  async pollTick() {
    if (!this.connected || this.applying || this.syncing) return;
    try {
      // 只拉比 lastRemoteUpdatedAt 更新的数据
      const since = this.lastRemoteUpdatedAt || '1970-01-01T00:00:00.000Z';
      const res = await this.rdb.from('goodwork_tasks')
        .select('*, attachments(*)')
        .gt('updated_at', since)
        .order('updated_at', { ascending: false })
        .limit(500);
      const rows = assertOk(res, '增量拉取');

      // 再拉 processed 的增量
      const pres = await this.rdb.from('goodwork_processed')
        .select()
        .gt('created_at', since);
      const pRows = assertOk(pres, '增量拉取已报销');

      if ((rows?.length || 0) + (pRows?.length || 0) === 0) {
        this.lastPollAt = Date.now();
        return;
      }

      // 合并更新：我们 applyRemote 会用全量数据，所以拉全量比较简单
      // 但为了高效，我们只覆盖有变化的行
      // 简化策略：直接拉全量 → 应用
      await this.connectData('pull');
    } catch (err) {
      // 轮询失败不致命，下次重试
      if (Date.now() - (this.lastPollAt || 0) > 30000) {
        this.emit('error', { message: '轮询云端超时：' + this.friendlyError(err) });
      }
    }
  }

  // ========== 附件 ==========

  async uploadAttachment(meta, blob) {
    if (!this.connected || !this.app) throw new Error('尚未连接云开发。');
    const ext = (String(meta.name).match(/\.[A-Za-z0-9]{1,10}$/) || [''])[0];
    const cloudPath = `goodwork/team/${meta.id}${ext}`;
    let file = blob;
    if (!(blob instanceof File)) {
      file = new File([blob], meta.name || '附件', {
        type: meta.type || 'application/octet-stream',
      });
    }
    const res = await withTimeout(
      this.app.uploadFile({ cloudPath, filePath: file }),
      120000,
      '附件上传云端超时，请检查网络后重试。'
    );
    if (!res?.fileID) throw new Error('云存储未返回 fileID。');
    return res.fileID;
  }

  async downloadAttachment(fileID) {
    if (!this.connected || !this.app) throw new Error('尚未连接云开发。');
    const res = await withTimeout(
      this.app.getTempFileURL({ fileList: [fileID] }),
      30000,
      '获取云端附件链接超时，请检查网络。'
    );
    const item = res?.fileList?.find((x) => x.fileID === fileID) || res?.fileList?.[0];
    const tempUrl = item?.tempFileURL || item?.download_url;
    if (!tempUrl) throw new Error('无法获取云端附件链接。');
    const resp = await fetch(tempUrl);
    if (!resp.ok) throw new Error('云端附件下载失败。');
    return await resp.blob();
  }

  async syncTaskAttachments(task) {
    if (!this.connected) return 0;
    let uploaded = 0;
    for (const meta of task.attachments || []) {
      if (meta.cloudFileId) continue;
      let blob = null;
      try { blob = await this.getAttachmentBlob(meta.id); } catch { blob = null; }
      if (!blob) continue;
      try {
        meta.cloudFileId = await this.uploadAttachment(meta, blob);
        uploaded++;
      } catch (err) {
        console.warn('附件上传云端失败', meta.name, err);
      }
    }
    if (uploaded) {
      this.onAttachmentsUploaded();
      this.markLocalChange();
    }
    return uploaded;
  }

  async syncAllAttachments({ silent = false } = {}) {
    if (!this.connected || this.uploading) return 0;
    this.uploading = true;
    let uploaded = 0;
    const tasks = this.getState().tasks || [];
    for (const task of tasks) {
      for (const meta of task.attachments || []) {
        if (meta.cloudFileId) continue;
        let blob = null;
        try { blob = await this.getAttachmentBlob(meta.id); } catch { blob = null; }
        if (!blob) continue;
        try {
          meta.cloudFileId = await this.uploadAttachment(meta, blob);
          uploaded++;
          this.emit('syncing', { message: `正在同步附件 ${uploaded}` });
        } catch (err) {
          console.warn('附件上传云端失败', meta.name, err);
        }
      }
    }
    this.uploading = false;
    if (uploaded) {
      this.onAttachmentsUploaded();
      this.markLocalChange();
      await this.pushNow({ force: true, silent: true });
      if (!silent) this.onToast('附件已同步到云端', `${uploaded} 个文件上传完成。`, 'ok');
    } else if (!silent) {
      this.onToast('没有需要同步的附件', '所有附件都已存在于云端。');
    }
    this.emit(this.connected ? 'connected' : 'need-login');
    return uploaded;
  }

  setAutoSync(value) {
    this.autoSync = !!value;
    this.settings.autoSync = this.autoSync;
    this.saveSettings();
    if (this.connected) {
      if (this.autoSync) {
        this.startPoll();
        if (this.dirty) this.schedulePush();
      } else {
        this.stopPoll();
      }
    }
  }

  // ========== 错误解析 ==========

  friendlyError(err) {
    const code = String(err?.code || err?.__code || err?.error?.code || '');
    const detail = err?.error?.message || err?.error?.details || err?.message || '';
    const msg = `${code} ${detail || String(err || '未知错误')}`;

    if (/anonymous.*(not|disabled|enable)|匿名.*(未|不)/i.test(msg)) {
      return '云开发「匿名登录」未开启，请在控制台 → 登录授权 → 开启匿名登录。';
    }
    if (/relation.*does not exist|does not exist|42P01/i.test(msg) || err?.__code === '42P01') {
      return '数据库表不存在 —— 请在云开发控制台 PostgreSQL → SQL 编辑器里执行建表 SQL。';
    }
    if (/permission denied|42501|GRANT|权限/i.test(msg)) {
      return '数据库权限不足 —— 请在控制台 SQL 编辑器里执行 GRANT 语句（给 anon 角色授权）。';
    }
    if (/violates row-level security policy|23503|RLS|row level/i.test(msg)) {
      return 'RLS 策略拦截 —— 请在控制台 SQL 编辑器里执行 RLS Policy 创建语句。';
    }
    if (/domain|origin|cors|安全域名/i.test(msg)) {
      return '当前站点未加入云开发安全域名，请在控制台添加本站域名。';
    }
    if (/env.*(not.*exist|invalid)|环境.*(不存在|无效)/i.test(msg)) {
      return '云开发环境 ID 无效或不存在。';
    }
    if (/network|timeout|ETIMEDOUT/i.test(msg)) {
      return '网络超时，请检查网络连接后重试。';
    }
    return msg || '未知错误';
  }
}

function formatClock(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
