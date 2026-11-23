/**
 * 腾讯云开发 CloudBase 同步 · 匿名直连版
 * 团队共享一个工作区：所有设备使用 CloudBase 匿名登录，
 * 共享同一个 goodwork_workspaces.team 文档，多设备实时同步台账与附件。
 *
 * CloudBase 控制台需要：
 *   1. 开启「匿名登录」
 *   2. 创建数据库集合 goodwork_workspaces，权限设为「所有用户可读，仅创建者可写」
 *      或自定义安全规则允许匿名用户读写 _id === 'team' 的文档
 *   3. 安全域名添加本站部署域名
 */
const SETTINGS_KEY = 'goodwork.cloud.settings.v1';
const DEVICE_KEY = 'goodwork.cloud.device.v1';
const COLLECTION = 'goodwork_workspaces';
const DOC_ID = 'team';
const STORAGE_PREFIX = 'goodwork/team';
const DEFAULT_ENV_ID = 'attractive-starfish-d0bp2e865971';

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
  get lastSyncAt() { return this.settings.lastSyncAt || ''; }

  isConnected() { return this.connected; }
  isConfigured() { return !!this.settings.envId; }

  getStatus() {
    return {
      status: this.status,
      connected: this.connected,
      envId: this.envId,
      deviceId: this.deviceId.slice(0, 8),
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

  /**
   * 自动恢复匿名登录态；若未连接过则标记为 need-login 等待用户点击「连接」。
   */
  async init() {
    if (!this.envId) {
      this.emit('disabled');
      return;
    }
    try {
      await this.ensureApp();
      // 检查是否有匿名登录态
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

  /**
   * 一键连接 —— 匿名登录，无需账号密码。
   */
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
      // 兼容部分 SDK 版本使用 anonymousLogin
      try {
        await withTimeout(
          this.auth.anonymousLogin?.() || this.auth.signInAnonymously?.(),
          30000,
          '匿名登录超时，请检查网络或云开发环境。'
        );
      } catch {
        const message = this.friendlyError(err);
        this.connected = false;
        this.emit('error', { message });
        throw new Error(message);
      }
    }
    this.connected = true;
    await this.afterConnect({ auto: this.autoSync });
    return true;
  }

  /**
   * 兼容旧的 login() 调用 —— 直接走匿名连接。
   */
  async login(opts = {}) {
    return this.connect(opts);
  }

  /**
   * 兼容旧的 register() 调用 —— 直接走匿名连接。
   */
  async register(opts = {}) {
    return this.connect(opts);
  }

  async disconnect() {
    this.stopWatch();
    try { await this.auth?.signOut?.(); } catch { /* noop */ }
    this.connected = false;
    this.dirty = false;
    this.rev = 0;
    this.lastRemoteAt = '';
    this.emit('need-login');
  }

  /**
   * 兼容旧的 logout() 调用。
   */
  async logout() {
    return this.disconnect();
  }

  async afterConnect({ auto = true, silent = false } = {}) {
    this.emit('connecting');
    try {
      await this.connectData(auto ? 'auto' : 'pull');
      if (this.autoSync) this.startWatch();
      this.emit('connected');
      if (!silent) this.onToast('云开发已连接', `匿名设备 · ${this.deviceId.slice(0, 8)}`, 'ok');
      if (this.autoSync) this.syncAllAttachments({ silent: true });
    } catch (err) {
      const message = this.friendlyError(err);
      this.connected = false;
      this.emit('error', { message });
      throw new Error(message);
    }
  }

  docRef() {
    return this.db.collection(COLLECTION).doc(DOC_ID);
  }

  async fetchCloudDoc() {
    const res = await withTimeout(
      this.docRef().get(),
      20000,
      '读取云端工作区超时，请检查数据库集合与安全域名配置。'
    );
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
      await withTimeout(
        this.docRef().set({
          schemaVersion: 1,
          workspace: 'GOODWORK 古德車房',
          state: payload,
          rev,
          updatedAt,
          updatedBy: this.deviceId,
          appVersion: 'v4',
        }),
        20000,
        '上传云端超时，请检查数据库权限与网络。'
      );
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

  friendlyError(err) {
    const code = String(err?.code || err?.errCode || '');
    const detail = err?.error_description || err?.message || err?.errMsg || err?.error || '';
    const msg = `${code} ${detail || String(err || '未知错误')}`;
    if (/anonymous.*(not|disabled|enable)|匿名.*(未|不)|anonymous login/i.test(msg)) {
      return '云开发「匿名登录」未开启，请在云开发控制台 → 登录授权 → 开启匿名登录。';
    }
    if (/INVALID_USERNAME_OR_PASSWORD|invalid_username_or_password|用户名或密码不正确|INVALID_PASSWORD/i.test(msg)) {
      return '认证失败。请确认云开发环境 ID 是否正确。';
    }
    if (/USER_NOT_EXIST|user_not_exist|用户不存在/i.test(msg)) {
      return '云开发未找到用户，请检查是否开启了匿名登录。';
    }
    if (/EMAIL_NOT_VERIFIED|email.*not.*verif|邮箱.*未验证/i.test(msg)) {
      return '认证方式错误。本版本使用匿名登录，请在控制台开启匿名登录。';
    }
    if (/INVALID_EMAIL|invalid_email|邮箱格式/i.test(msg)) {
      return '认证方式错误。本版本使用匿名登录，请在控制台开启匿名登录。';
    }
    if (/env.*(not.*exist|invalid)|环境.*(不存在|无效)/i.test(msg)) {
      return '云开发环境 ID 无效或不存在，请检查上方环境 ID。';
    }
    if (/collection.*not.*exist|集合.*不存在|DATABASE_COLLECTION_NOT_EXIST/i.test(msg)) {
      return `数据库集合 ${COLLECTION} 不存在，请在云开发控制台创建它。`;
    }
    if (/permission|PERMISSION_DENIED|ACCESS_DENIED|权限|auth/i.test(msg)) {
      return `数据库或存储权限不足：请在云开发控制台把集合 ${COLLECTION} 的权限设为「所有用户可读，仅创建者可写」或自定义安全规则允许匿名读写。`;
    }
    if (/login.*(type|method|provider).*(not|disabled|enable)|登录方式.*(未|不)/i.test(msg)) {
      return '云开发登录方式未开启，请在控制台 → 登录授权 → 开启匿名登录。';
    }
    if (/domain|origin|cors|安全域名|域名.*(白名单|未)/i.test(msg)) {
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
