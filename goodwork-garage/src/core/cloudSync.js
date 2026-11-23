/**
 * 腾讯云开发 CloudBase 同步
 * 团队共享工作区：所有设备使用同一个工作区账号登录，共享台账与附件。
 */
const SETTINGS_KEY = 'goodwork.cloud.settings.v1';
const DEVICE_KEY = 'goodwork.cloud.device.v1';
const COLLECTION = 'goodwork_workspaces';
const DOC_ID = 'team';
const STORAGE_PREFIX = 'goodwork/team';

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
      envId: '',
      email: '',
      autoSync: true,
      lastSyncAt: '',
    });
    this.autoSync = this.settings.autoSync !== false;
    this.deviceId = localStorage.getItem(DEVICE_KEY) || makeDeviceId();
    try { localStorage.setItem(DEVICE_KEY, this.deviceId); } catch { /* noop */ }

    this.app = null;
    this.auth = null;
    this.db = null;
    this.watcher = null;
    this.status = 'disabled';
    this.connected = false;
    this.dirty = false;
    this.syncing = false;
    this.pendingPush = false;
    this.applying = false;
    this.uploading = false;
    this.rev = 0;
    this.lastRemoteAt = '';
    this.localChangedAt = '';
    this.localVersion = 0;
    this.pushTimer = null;
    this.errorDetail = '';
  }

  get envId() { return this.settings.envId || ''; }
  get email() { return this.settings.email || ''; }
  get lastSyncAt() { return this.settings.lastSyncAt || ''; }

  isConnected() { return this.connected; }
  isConfigured() { return !!this.settings.envId; }

  getStatus() {
    return {
      status: this.status,
      connected: this.connected,
      envId: this.envId,
      email: this.email,
      lastSyncAt: this.lastSyncAt,
      autoSync: this.autoSync,
      error: this.errorDetail,
    };
  }

  emit(status, detail = {}) {
    this.status = status;
    if (detail.message) this.errorDetail = detail.message;
    if (status === 'connected') this.errorDetail = '';
    this.onStatus(status, { ...this.getStatus(), ...detail });
  }

  saveSettings() {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings)); } catch { /* noop */ }
  }

  async init() {
    if (!this.envId) {
      this.emit('disabled');
      return;
    }
    if (!this.email) {
      this.emit('need-login');
      return;
    }
    try {
      await this.ensureApp();
      const loginState = await this.auth.getLoginState();
      if (loginState?.user) {
        this.connected = true;
        await this.afterLogin({ auto: this.autoSync, silent: true });
      } else {
        this.emit('need-login');
      }
    } catch (err) {
      this.emit('error', { message: this.friendlyError(err) });
    }
  }

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
    if (this.app && this.settings.envId === envId) return;
    this.resetConnection();
    const sdk = await this.loadSdk();
    this.settings.envId = envId;
    this.saveSettings();
    this.app = sdk.init({ env: envId });
    this.auth = this.app.auth({ persistence: 'local' });
    this.db = this.app.database();
  }

  resetConnection() {
    this.stopWatch();
    this.app = null;
    this.auth = null;
    this.db = null;
    this.connected = false;
    this.rev = 0;
    this.lastRemoteAt = '';
    this.dirty = false;
  }

  async login({ envId, email, password, autoSync }) {
    if (!envId || !email || !password) throw new Error('请填写环境 ID、邮箱和密码。');
    await this.ensureApp(envId);
    this.settings.email = email;
    this.autoSync = autoSync !== false;
    this.settings.autoSync = this.autoSync;
    this.saveSettings();
    this.emit('connecting');
    try {
      await this.auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      throw new Error(this.friendlyError(err));
    }
    this.connected = true;
    await this.afterLogin({ auto: this.autoSync });
    return true;
  }

  async register({ envId, email, password, autoSync }) {
    if (!envId || !email || !password) throw new Error('请填写环境 ID、邮箱和密码。');
    if (password.length < 6) throw new Error('密码至少 6 位。');
    await this.ensureApp(envId);
    this.settings.email = email;
    this.autoSync = autoSync !== false;
    this.settings.autoSync = this.autoSync;
    this.saveSettings();
    this.emit('connecting');
    try {
      await this.auth.signUpWithEmailAndPassword(email, password);
      const state = await this.auth.getLoginState();
      if (!state?.user) await this.auth.signInWithEmailAndPassword(email, password);
    } catch (err) {
      throw new Error(this.friendlyError(err));
    }
    this.connected = true;
    await this.afterLogin({ auto: this.autoSync });
    return true;
  }

  async logout() {
    this.stopWatch();
    try { await this.auth?.signOut?.(); } catch { /* noop */ }
    this.connected = false;
    this.dirty = false;
    this.rev = 0;
    this.lastRemoteAt = '';
    this.emit('need-login');
  }

  async afterLogin({ auto = true, silent = false } = {}) {
    this.emit('connecting');
    await this.connectData(auto ? 'auto' : 'pull');
    if (this.autoSync) this.startWatch();
    this.emit('connected');
    if (!silent) this.onToast('云同步已连接', `团队工作区 · ${this.email}`, 'ok');
    if (this.autoSync) this.syncAllAttachments({ silent: true });
  }

  docRef() {
    return this.db.collection(COLLECTION).doc(DOC_ID);
  }

  async fetchCloudDoc() {
    const res = await this.docRef().get();
    return Array.isArray(res.data) && res.data.length ? res.data[0] : null;
  }

  async connectData(mode = 'auto') {
    const cloud = await this.fetchCloudDoc();
    const local = this.getState();
    if (!cloud) {
      this.dirty = true;
      this.localChangedAt = nowIso();
      await this.pushNow({ force: true, silent: true });
      return;
    }
    this.rev = Number(cloud.rev) || 0;
    this.lastRemoteAt = cloud.updatedAt || '';
    if (mode === 'push') {
      await this.pushNow({ force: true, silent: true });
      return;
    }
    if (mode === 'pull') {
      this.applyRemote(cloud, { force: true, silent: true });
      return;
    }
    const localHasData = (local.tasks?.length || 0) + (local.processedEvents?.length || 0) > 0;
    if (this.dirty && localHasData && (this.localChangedAt || '') > (cloud.updatedAt || '')) {
      await this.pushNow({ force: true, silent: true });
    } else {
      this.applyRemote(cloud, { force: true, silent: true });
    }
  }

  applyRemote(doc, { force = false, silent = false } = {}) {
    if (!doc?.state) return;
    if (!force && doc.updatedBy === this.deviceId) return;
    if (!force && (Number(doc.rev) || 0) <= this.rev) return;
    this.applying = true;
    try {
      this.applyState(doc.state, { ...doc, silent });
    } finally {
      this.applying = false;
    }
    this.lastRemoteAt = doc.updatedAt || nowIso();
    this.rev = Number(doc.rev) || this.rev;
    this.dirty = false;
    this.localChangedAt = this.lastRemoteAt;
    this.settings.lastSyncAt = this.lastRemoteAt;
    this.saveSettings();
    if (!silent) {
      this.onToast('云端数据已更新', `${doc.state.tasks?.length || 0} 笔报销记录`, 'ok');
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
    }, 1500);
  }

  sanitizeState(state) {
    return {
      ...state,
      tasks: (state.tasks || []).map((t) => ({
        ...t,
        attachments: (t.attachments || []).map((a) => ({
          ...a,
          written: false,
          voucherName: '',
        })),
      })),
    };
  }

  async pushNow({ force = false, silent = false, override = false } = {}) {
    if (!this.connected || !this.db) return false;
    if (this.syncing) {
      this.pendingPush = true;
      return false;
    }
    if (!force && !this.dirty) return true;
    this.syncing = true;
    const versionAtStart = this.localVersion;
    this.emit('syncing');
    try {
      // 推送前先检查云端是否有其他设备的新版本，避免直接覆盖
      const current = override ? null : await this.fetchCloudDoc();
      if (current && Number(current.rev) > this.rev && current.updatedBy !== this.deviceId) {
        if ((current.updatedAt || '') > (this.localChangedAt || '')) {
          this.applyRemote(current, { silent: true });
          return false;
        }
        this.rev = Number(current.rev) || this.rev;
      }
      const state = this.getState();
      const payload = this.sanitizeState(state);
      const rev = this.rev + 1;
      const updatedAt = nowIso();
      await this.docRef().set({
        schemaVersion: 1,
        workspace: 'GOODWORK 古德車房',
        state: payload,
        rev,
        updatedAt,
        updatedBy: this.deviceId,
        appVersion: 'v4',
      });
      this.rev = rev;
      this.lastRemoteAt = updatedAt;
      this.settings.lastSyncAt = updatedAt;
      if (versionAtStart === this.localVersion) {
        this.localChangedAt = updatedAt;
        this.dirty = false;
      } else {
        this.dirty = true;
        this.schedulePush();
      }
      this.saveSettings();
      this.emit('connected');
      if (!silent) {
        this.onToast('已上传到云端', `${state.tasks?.length || 0} 笔记录 · ${formatClock(updatedAt)}`, 'ok');
      }
      return true;
    } catch (err) {
      this.emit('error', { message: this.friendlyError(err) });
      if (!silent) this.onToast('云端上传失败', this.friendlyError(err));
      return false;
    } finally {
      this.syncing = false;
      if (this.pendingPush) {
        this.pendingPush = false;
        this.dirty = true;
        this.schedulePush();
      }
    }
  }

  async pullNow({ silent = false } = {}) {
    if (!this.connected) throw new Error('尚未连接云开发。');
    const doc = await this.fetchCloudDoc();
    if (!doc) throw new Error('云端还没有工作区数据，请先上传本机数据。');
    this.applyRemote(doc, { force: true, silent });
    if (!silent) this.onToast('已从云端拉取', `${doc.state?.tasks?.length || 0} 笔报销记录`, 'ok');
    return true;
  }

  startWatch() {
    this.stopWatch();
    if (!this.db) return;
    try {
      this.watcher = this.docRef().watch({
        onChange: (snapshot) => {
          const doc = this.extractDoc(snapshot);
          if (!doc?.state) return;
          if (doc.updatedBy === this.deviceId) return;
          if ((Number(doc.rev) || 0) <= this.rev) return;
          if (this.dirty && (doc.updatedAt || '') <= (this.localChangedAt || '')) return;
          this.applyRemote(doc);
        },
        onError: (err) => {
          this.emit('error', { message: this.friendlyError(err) });
        },
      });
    } catch (err) {
      this.emit('error', { message: this.friendlyError(err) });
    }
  }

  stopWatch() {
    try { this.watcher?.close?.(); } catch { /* noop */ }
    this.watcher = null;
  }

  extractDoc(snapshot) {
    const docs = snapshot?.docs;
    if (!docs) return null;
    if (Array.isArray(docs)) return docs.find((d) => d._id === DOC_ID) || docs[0] || null;
    return docs[DOC_ID] || Object.values(docs)[0] || null;
  }

  setAutoSync(value) {
    this.autoSync = !!value;
    this.settings.autoSync = this.autoSync;
    this.saveSettings();
    if (this.connected) {
      if (this.autoSync) {
        this.startWatch();
        if (this.dirty) this.schedulePush();
      } else {
        this.stopWatch();
      }
    }
  }

  async uploadAttachment(meta, blob) {
    if (!this.connected || !this.app) throw new Error('尚未连接云开发。');
    const ext = (String(meta.name).match(/\.[A-Za-z0-9]{1,10}$/) || [''])[0];
    const cloudPath = `${STORAGE_PREFIX}/${meta.id}${ext}`;
    let file = blob;
    if (!(blob instanceof File)) {
      file = new File([blob], meta.name || '附件', {
        type: meta.type || 'application/octet-stream',
      });
    }
    const res = await this.app.uploadFile({ cloudPath, filePath: file });
    if (!res?.fileID) throw new Error('云存储未返回 fileID。');
    return res.fileID;
  }

  async downloadAttachment(fileID) {
    if (!this.connected || !this.app) throw new Error('尚未连接云开发。');
    const res = await this.app.getTempFileURL({ fileList: [fileID] });
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

  friendlyError(err) {
    const msg = err?.message || err?.errMsg || String(err || '未知错误');
    if (/collection.*not.*exist|集合.*不存在/i.test(msg)) {
      return `数据库集合 ${COLLECTION} 不存在，请在云开发控制台创建并设置权限。`;
    }
    if (/domain|origin|cors|安全域名/i.test(msg)) {
      return '当前站点未加入云开发安全域名，请在控制台添加本站域名。';
    }
    return msg;
  }
}

function formatClock(value) {
  if (!value) return '—';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '—';
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}
