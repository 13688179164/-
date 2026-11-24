/**
 * 腾讯云开发 PostgreSQL 同步 —— 纯 fetch 版本（零 SDK 依赖）
 * CloudSync v10.0 · 支持附件云端上传与跨设备下载
 */
const CLOUD_SYNC_VERSION = 'v10.0-cloud-attachments';
const SETTINGS_KEY = 'goodwork.cloud.settings.v1';
const DEVICE_KEY = 'goodwork.cloud.device.v1';
const DEFAULT_ENV_ID = 'attractive-starfish-d0bp2e865971';
// CloudBase Publishable Key — anon 角色的完整 JWT，直接当 Bearer token 用
const PUBLISHABLE_KEY = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjIxMTE1ZTA4LWJjYjQtNGViZS1iMzQ2LTRkMDBhOWUxMWY4NCJ9.eyJpc3MiOiJodHRwczovL2F0dHJhY3RpdmUtc3RhcmZpc2gtZDBicDJlODY1OTcxLmFwLXNoYW5naGFpLnRjYi1hcGkudGVuY2VudGNsb3VkYXBpLmNvbSIsInN1YiI6ImFub24iLCJhdWQiOiJhdHRyYWN0aXZlLXN0YXJmaXNoLWQwYnAyZTg2NTk3MSIsImV4cCI6NDA5OTEwNDgzOCwiaWF0IjoxNzk1NDIxNjM4LCJub25jZSI6IkM2OXNFOVRWU2E2N09TRmNfbEFBLWciLCJhdF9oYXNoIjoiQzY5c0U5VFZTYTY3T1NGY19sQUEtZyIsIm5hbWUiOiJBbm9ueW1vdXMiLCJzY29wZSI6ImFub255bW91cyIsInByb2plY3RfaWQiOiJhdHRyYWN0aXZlLXN0YXJmaXNoLWQwYnAyZTg2NTk3MSIsIm1ldGEiOnsicGxhdGZvcm0iOiJQdWJsaXNoYWJsZUtleSJ9LCJyb2xlIjoiYW5vbiIsImlzX2Fub255bW91cyI6dHJ1ZSwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiYW5vbnltb3VzIiwicHJvdmlkZXJzIjpbImFub255bW91cyJdfSwidXNlcl9tZXRhZGF0YSI6eyJuYW1lIjoiQW5vbnltb3VzIn0sInVzZXJfdHlwZSI6IiIsImNsaWVudF90eXBlIjoiY2xpZW50X3VzZXIiLCJpc19zeXN0ZW1fYWRtaW4iOmZhbHNlfQ.BbEqc_mku1-zXHvEAI3bUhUyDfjlkPhbyE_gHrUsF2mDuc0FlgskbZ9qziNP9Bk3gW4mWNDetSt7fq70Z6Y3fsypBOZz9MGb5Hgf1Cm1LPZsdXi8Vaw5nDnUnR9wx6YgxhjGYUwI9hYRGMmy7FR4YtRZMQC9wR0VJAda6G1Ac_YF00R1Ptdw_ljUmyB5-W5osDiklvP_XcsbboR4ph9Poo8tCJtpzDkIhvZ9A0ypSfM9HZnqHRpV-X3VJy3fDyeQ6tKZGt6iCbrUuFDqUXBZ8oCCRWAYXKS2gUg5OyGa538Sj6llJDlJxJjEqgz9lfaiWRnYuGTQv78E-5WEkdINuA';
const POLL_INTERVAL_MS = 3000;
const PUSH_DEBOUNCE_MS = 1500;
const DB_ATTACHMENT_PREFIX = 'attachment:';
const STORAGE_BUCKET = 'goodwork';
let cloudBaseSdkPromise = null;

function loadCloudBaseSDK() {
  if (typeof window !== 'undefined' && window.cloudbase?.init) {
    return Promise.resolve(window.cloudbase);
  }
  if (!cloudBaseSdkPromise) {
    cloudBaseSdkPromise = new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = new URL('../../vendor/cloudbase.full.js', import.meta.url).href;
      script.onload = () => {
        if (window.cloudbase?.init) resolve(window.cloudbase);
        else reject(new Error('CloudBase SDK 加载后不可用。'));
      };
      script.onerror = () => reject(new Error('CloudBase SDK 加载失败，请检查网络后重试。'));
      document.head.appendChild(script);
    }).catch((err) => {
      cloudBaseSdkPromise = null;
      throw err;
    });
  }
  return cloudBaseSdkPromise;
}

async function blobToBase64(blob) {
  const bytes = new Uint8Array(await blob.arrayBuffer());
  let binary = '';
  for (let offset = 0; offset < bytes.length; offset += 32768) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 32768));
  }
  return btoa(binary);
}

function base64ToBlob(base64, type = '') {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return new Blob([bytes], { type: type || 'application/octet-stream' });
}

// ========== PostgREST 辅助函数 ==========

function pgBaseUrl(envId) {
  return `https://${envId}.api.tcloudbasegateway.com/v1/rdb/rest`;
}

function pgHeaders() {
  return {
    'Authorization': `Bearer ${PUBLISHABLE_KEY}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  };
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
 * 直接调 PostgREST REST API
 * @param {string} method - GET / POST / PATCH / DELETE
 * @param {string} envId - 云开发环境 ID
 * @param {string} table - 表名
 * @param {object} opts - { select, order, limit, filter, body, prefer }
 * @returns {Promise<Array|object>} 解析后的 JSON 数组或对象
 */
let _pgDebug = null;
function pgLog() {
  if (_pgDebug === null) {
    try { _pgDebug = localStorage.getItem('goodwork.cloud.debug') === '1'; } catch { _pgDebug = false; }
  }
  return _pgDebug;
}

async function pgRequest(method, envId, table, opts = {}) {
  const url = new URL(`${pgBaseUrl(envId)}/${table}`);

  if (opts.select) url.searchParams.set('select', opts.select);
  if (opts.order) {
    const o = Array.isArray(opts.order) ? opts.order : [opts.order];
    o.forEach((item, i) => url.searchParams.set(`order${i > 0 ? '.' + i : ''}`, item));
  }
  if (opts.limit != null) url.searchParams.set('limit', String(opts.limit));
  if (opts.offset != null) url.searchParams.set('offset', String(opts.offset));
  if (opts.filter) {
    for (const [k, v] of Object.entries(opts.filter)) {
      url.searchParams.set(k, v);
    }
  }

  const headers = pgHeaders();
  if (opts.prefer) headers['Prefer'] = opts.prefer;

  const fetchOpts = { method, headers };
  if (opts.body != null) {
    let body = opts.body;
    // 终极防线：确保 POST/PATCH body 里没有 undefined 字段
    if (Array.isArray(body)) body = sanitizeRows(body);
    else if (body && typeof body === 'object') body = sanitizeRow(body);
    fetchOpts.body = typeof body === 'string' ? body : JSON.stringify(body);
  }

  const fullUrl = url.toString();
  const start = Date.now();
  if (pgLog()) console.log(`[pg] ${method} ${table} ${url.search} →`, fullUrl);

  let resp;
  try {
    resp = await fetch(fullUrl, fetchOpts);
  } catch (netErr) {
    // 网络级错误（CORS、DNS、连接拒绝等）
    const diag = `fetch ${method} ${table} 网络错误: ${netErr?.name || ''} ${netErr?.message || netErr}`;
    console.error('[pg] FATAL', diag);
    const e = new Error(diag);
    e.code = 'NETWORK';
    e.cause = netErr;
    throw e;
  }

  const elapsed = Date.now() - start;

  if (resp.status === 204) {
    if (pgLog()) console.log(`[pg] ✓ 204 ${table} (${elapsed}ms)`);
    return null;
  }

  let text;
  try { text = await resp.text(); } catch { text = ''; }
  let data;
  try { data = text ? JSON.parse(text) : null; } catch { data = text; }

  if (!resp.ok) {
    const errMsg = data?.message || String(data || resp.statusText);
    const diag = `POSTGREST ${resp.status} ${method} ${table} → ${errMsg}`;
    console.error('[pg] ✗', diag, '\n  full:', fullUrl, '\n  body:', JSON.stringify(data).slice(0, 400));
    const err = new Error(errMsg);
    err.code = data?.code || `HTTP_${resp.status}`;
    err.details = data?.details;
    err.hint = data?.hint;
    err.status = resp.status;
    err._fullUrl = fullUrl;
    throw err;
  }

  if (pgLog()) {
    const len = Array.isArray(data) ? data.length : (data ? 'obj' : 'null');
    console.log(`[pg] ✓ ${resp.status} ${table} → ${len} (${elapsed}ms)`);
  }

  return data;
}

function nowIso() {
  return new Date().toISOString();
}

/**
 * 把两组相同类型的任务/事件按 id 合并，同 id 取 updatedAt 更新的那条。
 * local 和 remote 都是本地格式（前端用的格式，有 tasks[i].updatedAt）。
 * 没有 id 的条目跳过。
 */
/**
 * 🔧 把各种时间格式统一成毫秒数再比较。
 * 云端返回 "2026-11-23T23:24:31.123+00:00"、本地是 "2026-11-23T23:24:31.123Z"，
 * 直接字符串比较会把「同一时刻」判成不同、甚至让旧数据覆盖新数据（状态变回待报销）。
 */
function tsMs(v) {
  if (!v) return 0;
  if (typeof v === 'number') return v;
  const t = Date.parse(v);
  return Number.isFinite(t) ? t : 0;
}

function mergeByUpdatedAt(local, remote) {
  const byId = new Map();
  const addOne = (item) => {
    if (!item || !item.id) return;
    const existing = byId.get(item.id);
    if (!existing) {
      byId.set(item.id, item);
    } else {
      const eTime = tsMs(existing.updatedAt || existing.updated_at || existing.timestamp);
      const iTime = tsMs(item.updatedAt || item.updated_at || item.timestamp);
      // 只有严格更新才覆盖；同一时刻保留已存在的（本地优先），避免状态被旧数据回滚
      if (iTime > eTime) {
        byId.set(item.id, item);
      }
    }
  };
  for (const x of local || []) addOne(x);
  for (const x of remote || []) addOne(x);
  return [...byId.values()].sort((a, b) => {
    return tsMs(b.updatedAt || b.updated_at) - tsMs(a.updatedAt || a.updated_at);
  });
}

/**
 * 把对象里所有 undefined 值替换成 null。
 * 原因：PostgREST POST 数组要求所有元素的顶层 key 完全一致，
 *       JSON.stringify 会把 undefined 字段完全去掉，导致 key 集合不匹配，
 *       触发 PGRST102 "All object keys must match" 错误。
 */
function sanitizeRow(obj) {
  if (!obj || typeof obj !== 'object') return obj;
  const out = {};
  for (const [k, v] of Object.entries(obj)) {
    out[k] = v === undefined ? null : v;
  }
  return out;
}

function sanitizeRows(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.map(sanitizeRow);
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

/**
 * 把 PostgREST 的异常直接 throw —— 因为纯 fetch 版本返回值就是 data 或 throw
 */
function checkOk(data, what) {
  // pgRequest 已经 throw on error，这里只是占位保持 API 一致
  return data;
}

// ========== CloudSync 类 ==========

export class CloudSync {
  constructor({
    getState,
    applyState,
    getAttachmentBlob,
    onAttachmentsUploaded,
    onStatus,
    onToast,
  }) {
    // 🔧 getState 永远从 localStorage 读真实数据，忽略传入回调的 buggy 版本
    // localStorage key 由 reimburse.js 定义：goodwork.reimburse.tasks.v3 / processed.v1
    this.getState = () => {
      const LS_TASKS = 'goodwork.reimburse.tasks.v3';
      const LS_PROCESSED = 'goodwork.reimburse.processed.v1';
      let tasks = [], processedEvents = [];
      try {
        const rawT = localStorage.getItem(LS_TASKS);
        if (rawT) tasks = JSON.parse(rawT);
      } catch (e) { /* noop */ }
      try {
        const rawP = localStorage.getItem(LS_PROCESSED);
        if (rawP) processedEvents = JSON.parse(rawP);
      } catch (e) {}
      // 内置示例任务（GW-RB-SAMPLE-*）不再参与同步
      const isSample = (t) => String(t?.id || '').startsWith('GW-RB-SAMPLE');
      tasks = Array.isArray(tasks) ? tasks.filter((t) => !isSample(t)) : [];
      processedEvents = Array.isArray(processedEvents)
        ? processedEvents.filter((e) => !String(e?.taskId || '').startsWith('GW-RB-SAMPLE'))
        : [];
      return { tasks, processedEvents };
    };
    this.applyState = applyState || (() => {});
    this.getAttachmentBlob = getAttachmentBlob || (async () => null);
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

    this.connected = false;
    this.dirty = false;
    this.syncing = false;
    this.applying = false;
    this.uploading = false;
    this.localChangedAt = '';
    this.localVersion = 0;
    this.pushTimer = null;
    this.pollTimer = null;
    this.lastPollAt = null;
    this.lastRemoteUpdatedAt = '';
    this.errorDetail = '';
    // 🔧 删除墓碑：id → 删除时间戳(ms)。只有"更新时间早于删除时间"的任务才会被清除，
    //    避免误删，也允许删除后重新创建/编辑同一条记录。
    this.deletedIds = new Map();
    const legacyDel = Array.isArray(this.settings.deletedIds) ? this.settings.deletedIds : [];
    for (const it of legacyDel) {
      if (typeof it === 'string') this.deletedIds.set(it, Date.now());
      else if (it && it.id) this.deletedIds.set(it.id, Number(it.at) || Date.now());
    }

    // 🛠️ 调试：挂到 window 上，方便 Console 手动测
    if (typeof window !== 'undefined') {
      window.__cloudSync = this;
      window.__pgDebug = {
        async testPostgrest() {
          const headers = {
            'Authorization': `Bearer ${PUBLISHABLE_KEY}`,
            'Content-Type': 'application/json',
          };
          try {
            const r = await fetch(`${pgBaseUrl(this.settings?.envId || DEFAULT_ENV_ID)}/goodwork_tasks?select=*&limit=1`, { headers });
            console.log('[pgDebug] GET goodwork_tasks → HTTP', r.status, r.status >= 200 && r.status < 300 ? '✅' : '❌');
            let body; try { body = await r.json(); } catch { body = await r.text(); }
            console.log('[pgDebug] body:', JSON.stringify(body).slice(0, 300));
            return { status: r.status, body };
          } catch (e) {
            console.error('[pgDebug] FATAL:', e);
            return { error: String(e) };
          }
        },
      };
      console.log(`%c[CloudSync ${CLOUD_SYNC_VERSION}]`, 'background:#0052cc;color:#fff;padding:2px 6px;border-radius:3px;font-weight:bold;',
        `env=${this.settings.envId} device=${this.deviceId.slice(0,8)} autoSync=${this.autoSync}`);
      console.log('[CloudSync] 调试接口: window.__cloudSync (实例) / window.__pgDebug.testPostgrest()');
    }
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
    // 存详细错误到 errorDetail，让 UI 能显示
    if (status === 'error' || detail.message) {
      this.errorDetail = detail.message || this.errorDetail;
      if (detail.err) {
        const e = detail.err;
        this.errorDetail = `${this.errorDetail}${e.code ? ` (${e.code})` : ''}${e.status ? ` [HTTP ${e.status}]` : ''}${e._fullUrl ? ` — ${e._fullUrl}` : ''}`;
      }
    }
    this.onStatus(status, { ...this.getStatus(), ...detail });
  }

  saveSettings() {
    try { localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings)); } catch { /* noop */ }
  }

  // ========== 连接（纯 fetch 版：Publishable Key 就是一切，无需 SDK 初始化）==========

  async ensureApp(envId = this.envId) {
    if (this.connected && this.settings.envId === envId) return;
    this.resetConnection();
    this.settings.envId = envId;
    this.saveSettings();
    // 发一个轻量请求验证连通性 —— 读 goodwork_meta 表
    await withTimeout(
      pgRequest('GET', envId, 'goodwork_meta', { select: 'key', limit: 1 }),
      10000,
      '连接 PostgreSQL 超时，请检查网络或安全域名配置。'
    );
    this.connected = true;
  }

  resetConnection() {
    this.stopPoll();
    this.connected = false;
    this.dirty = false;
    this.lastPollAt = null;
    this.lastRemoteUpdatedAt = '';
  }

  async init() {
    if (!this.envId) {
      this.emit('disabled');
      return;
    }
    // 🔧 只初始化一次：页面里可能同时存在全局单例和 ReimburseBoard 的两次 init 调用
    if (this._initPromise) return this._initPromise;
    // 🔧 保存 init Promise，让 schedulePush 能等
    this._initPromise = (async () => {
      try {
        await this.ensureApp();
        this.connected = true;
        await this.afterConnect({ auto: this.autoSync, silent: true });
        // 🔧 init 完成后，如果之前标记了 dirty，立刻推
        if (this.dirty) {
          console.log('[cloudSync] init 完成，补推之前的 dirty 数据');
          await this.pushNow({ force: true, silent: true, _internal: true });
        }
      } catch (err) {
        console.warn('[cloudSync] init 自动连接失败（用户需手动点连接）:', err?.message || err);
        this.emit('need-login', { message: this.friendlyError(err), err });
      }
    })();
    return this._initPromise;
  }

  async connect({ envId, autoSync } = {}) {
    const targetEnv = (envId && envId.trim()) || this.envId;
    if (!targetEnv) throw new Error('请先填写云开发环境 ID。');
    this.autoSync = autoSync !== false;
    this.settings.autoSync = this.autoSync;
    this.saveSettings();

    this.emit('connecting');
    try {
      await withTimeout(
        this.ensureApp(targetEnv),
        15000,
        '连接 PostgreSQL 超时，请检查网络或安全域名配置。'
      );
    } catch (err) {
      console.error('[cloudSync] connect FAILED:', err);
      const message = this.friendlyError(err);
      this.connected = false;
      this.emit('error', { message, err });
      throw new Error(message);
    }
    await this.afterConnect({ auto: this.autoSync });
    return true;
  }

  async disconnect() {
    this.stopPoll();
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
      console.error('[cloudSync] afterConnect FAILED:', err);
      const message = this.friendlyError(err);
      this.connected = false;
      this.emit('error', { message, err });
      throw new Error(message);
    }
  }

  // ========== 数据库读写 ==========

  rowToTask(row) {
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

  hydrateTaskAttachments(rows, attachRows) {
    const attachByTask = new Map();
    for (const a of attachRows || []) {
      const list = attachByTask.get(a.task_id) || [];
      list.push(a);
      attachByTask.set(a.task_id, list);
    }
    return (rows || []).map((row) => {
      const task = this.rowToTask(row);
      const linked = attachByTask.get(row.id) || [];
      if (linked.length) {
        task.attachments = linked.map((a) => ({
          id: a.id,
          cloudFileId: a.cloud_file_id || '',
          name: a.name || '',
          size: Number(a.size) || 0,
          type: a.mime_type || '',
        }));
      }
      if (!task.attachments?.length && row.cloud_file_ids) {
        try {
          const ids = typeof row.cloud_file_ids === 'string' ? JSON.parse(row.cloud_file_ids) : row.cloud_file_ids;
          if (Array.isArray(ids)) {
            task.attachments = ids.map((item) => ({
              id: item.id,
              cloudFileId: item.cloudFileId || '',
              name: item.name || '',
              size: Number(item.size) || 0,
              type: item.type || '',
            }));
          }
        } catch { /* 忽略旧字段中的无效 JSON */ }
      }
      return task;
    });
  }

  taskToRow(task, updatedAt) {
    // 🔧 PostgreSQL 字段长度保护（已实测）：
    //    id varchar(40) / writer_device_id varchar(40)
    //    status varchar(20) / reimbursed_from varchar(20)
    //    applicant、department、category 更宽，无需截断
    const v40 = (v) => String(v ?? '').slice(0, 40);
    const v20 = (v) => String(v ?? '').slice(0, 20);
    // 🔧 order_num 是 integer(int4)，上限 2147483647；毫秒时间戳(1.8e12)会溢出 → 22003
    const orderInt = (v) => {
      const n = Number(v);
      if (!Number.isFinite(n)) return 0;
      let i = Math.trunc(n);
      if (i > 2147483647) i = Math.floor(i / 1000);
      if (i < -2147483648) i = 0;
      return i;
    };
    const row = {
      id: v40(task.id),
      applicant: String(task.applicant ?? ''),
      amount: task.amount ?? 0,
      department: String(task.department ?? ''),
      category: String(task.category ?? ''),
      applied_at: task.appliedAt ?? null,
      content: task.content ?? '',  // text 类型，没长度限制
      status: v20(task.status),
      has_invoice: !!task.hasInvoice,
      invoice_received: !!task.invoiceReceived,
      invoice_received_at: task.invoiceReceivedAt ?? null,
      reimbursed_at: task.reimbursedAt ?? null,
      reimbursed_from: task.reimbursedFrom == null ? null : v20(task.reimbursedFrom),
      high_value_part: task.highValuePart ?? null,
      cross_month: task.crossMonth ?? null,
      stocking_cost: task.stockingCost ?? null,
      order_num: orderInt(task.order),
      cloud_file_ids: (task.attachments || [])
        .filter((a) => a.cloudFileId)
        .map((a) => ({ id: a.id, cloudFileId: a.cloudFileId })),
      writer_device_id: v40(this.deviceId),
      created_at: task.createdAt ?? updatedAt,
      updated_at: updatedAt,
    };
    // 保险起见：把所有 undefined 替换成 null，
    // 避免 PostgREST PGRST102 "All object keys must match" 错误
    return sanitizeRow(row);
  }

  async connectData(mode = 'auto') {
    // 🔧 先同步删除墓碑，避免已被删除的记录又被拉回来
    await this.loadTombstonesFromCloud();
    let rows = [];
    try {
      rows = await withTimeout(
        pgRequest('GET', this.envId, 'goodwork_tasks', {
          select: '*',
          order: ['updated_at.desc'],
          limit: 5000,
        }),
        20000,
        '读取云端任务超时，请检查数据库权限。'
      );
    } catch (err) {
      if (/relation|does not exist|42P01|PGRST200/i.test(err.message)) {
        rows = [];
      } else {
        throw err;
      }
    }

    // 单独拉附件
    let attachRows = [];
    if (rows.length > 0) {
      try {
        attachRows = await withTimeout(
          pgRequest('GET', this.envId, 'goodwork_attachments', { select: '*' }),
          20000, '读取附件超时'
        );
      } catch { attachRows = []; }
    }

    let processed = [];
    try {
      processed = await withTimeout(
        pgRequest('GET', this.envId, 'goodwork_processed', { select: '*' }),
        20000,
        '读取已报销事件超时'
      );
    } catch { processed = []; }

    const remoteTasks = this.hydrateTaskAttachments(rows, attachRows)
      .filter((t) => !this.isTombstoned(t));

    const remoteProcessed = processed.map((r) => ({
      taskId: r.task_id,
      eventDate: r.event_date,
      amount: Number(r.amount) || 0,
      applicant: r.applicant || '',
      category: r.category || '',
      writerDeviceId: r.writer_device_id || '',
      createdAt: r.created_at,
    })).filter((e) => !this.deletedIds.has(e.taskId));

    const local = this.getState();
    // 🔧 墓碑过滤：本地已被删除的任务不再参与合并/推送
    const localTasks = (local.tasks || []).filter((t) => !this.isTombstoned(t));
    const localHasData = localTasks.length + (local.processedEvents?.length || 0) > 0;

    if (mode === 'push') {
      await this.pushNow({ force: true, silent: true, _internal: true });
      return;
    }
    if (mode === 'pull') {
      // 用户主动拉取 → 用云端完全覆盖本地（符合用户预期）
      this.applyRemote(remoteTasks, remoteProcessed, { force: true, silent: true });
      return;
    }

    // ===== auto 模式：智能合并，绝不丢失本地数据 =====
    // 规则：按 id 合并；同 id 取 updatedAt 更新的那条；本地独有（云端没有）的保留
    // 这样 pushNow 失败也不会让用户的数据被云端旧数据覆盖

    const localProc = (local.processedEvents || []).filter((e) => !this.deletedIds.has(e.taskId));

    if (!localHasData && remoteTasks.length > 0) {
      // 本地完全空 → 直接用云端
      this.applyRemote(remoteTasks, remoteProcessed, { force: true, silent: true });
      return;
    }

    if (localHasData && remoteTasks.length === 0) {
      // 云端空 → 推送本地
      this.dirty = true;
      await this.pushNow({ force: true, silent: true, _internal: true });
      return;
    }

    // 两边都有数据 → 按 id 合并，取 updatedAt 较新的
    const mergedTasks = mergeByUpdatedAt(localTasks, remoteTasks);
    const mergedProc = mergeByUpdatedAt(localProc, remoteProcessed);

    console.log('[cloudSync] auto merge:',
      `localTasks=${localTasks.length} + remoteTasks=${remoteTasks.length} → merged=${mergedTasks.length}`,
      `| localProc=${localProc.length} + remoteProc=${remoteProcessed.length} → merged=${mergedProc.length}`);

    // 用合并结果覆盖本地状态
    this.applying = true;
    try {
      this.applyState(
        { tasks: mergedTasks, processedEvents: mergedProc },
        { source: 'cloud', silent: true }
      );
    } finally {
      this.applying = false;
    }
    this.dirty = true;  // 合并后可能有本地独有数据需要上云
    this.localChangedAt = nowIso();
    this.lastPollAt = Date.now();
    this.lastRemoteUpdatedAt = mergedTasks.reduce((m, t) => (t.updatedAt > m ? t.updatedAt : m), '');
    this.settings.lastSyncAt = this.localChangedAt;
    this.saveSettings();
    // 立刻推送合并后的结果到云端
    await this.pushNow({ force: true, silent: true, _internal: true });
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
    // 🔧 不管当前是否 connected，都 schedulePush
    // 如果还没连，pushNow 内部会自动等 connected 后执行
    if (this.autoSync) this.schedulePush();
  }

  schedulePush() {
    clearTimeout(this.pushTimer);
    this.pushTimer = setTimeout(() => {
      // 🔧 如果还没连，先等 init 完成再推
      if (!this.connected && this._initPromise) {
        this._initPromise.then(() => this.pushNow({ silent: true }));
      } else {
        this.pushNow({ silent: true });
      }
    }, PUSH_DEBOUNCE_MS);
  }

  // ========== 删除墓碑（多设备删除同步）==========

  saveTombstones() {
    // 只保留最近 500 条
    this.settings.deletedIds = [...this.deletedIds]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 500)
      .map(([id, at]) => ({ id, at }));
    this.saveSettings();
  }

  /** 某条任务是否已被删除（任务更新时间晚于删除时间则视为"删除后重新编辑"，保留） */
  isTombstoned(task) {
    if (!task || !task.id) return false;
    const at = this.deletedIds.get(task.id);
    if (!at) return false;
    const t = Date.parse(task.updatedAt || task.createdAt || '') || 0;
    return t <= at;
  }

  async loadTombstonesFromCloud() {
    try {
      const rows = await pgRequest('GET', this.envId, 'goodwork_meta', {
        select: 'value', filter: { key: 'eq.deleted_ids' }, limit: 1,
      });
      const row = Array.isArray(rows) ? rows[0] : null;
      // 云端为空 → 以云端为准（清空本地墓碑），防止历史错误墓碑继续删数据
      const next = new Map();
      if (row && row.value) {
        let ids = [];
        try { ids = JSON.parse(row.value); } catch { ids = []; }
        if (Array.isArray(ids)) {
          for (const it of ids) {
            if (typeof it === 'string') next.set(it, Date.now());
            else if (it && it.id) next.set(it.id, Number(it.at) || Date.now());
          }
        }
      }
      const changed = next.size !== this.deletedIds.size
        || [...next].some(([id, at]) => this.deletedIds.get(id) !== at);
      this.deletedIds = next;
      if (changed) this.saveTombstones();
      return changed;
    } catch (e) { /* meta 表不存在时忽略 */ return false; }
  }

  async pushTombstones() {
    try {
      const value = JSON.stringify([...this.deletedIds].map(([id, at]) => ({ id, at })));
      await pgRequest('POST', this.envId, 'goodwork_meta', {
        body: [{ key: 'deleted_ids', value, updated_at: nowIso() }],
        prefer: 'resolution=merge-duplicates',
      });
    } catch (e) { console.warn('[cloudSync] 写入删除墓碑失败:', e?.message); }
  }

  /** 删除一条报销：本地立即移除 + 云端删行 + 写墓碑，防止其他设备再推回来 */
  async recordDeletion(id) {
    if (!id) return;
    this.deletedIds.set(id, Date.now());
    this.saveTombstones();
    try {
      const st = this.getState();
      const tasks = (st.tasks || []).filter((t) => t.id !== id);
      // 🔧 删除该笔时，同时移除它在「当日已处理待报销」中的记录，金额栏不再计入
      const processedEvents = (st.processedEvents || []).filter((e) => e.taskId !== id);
      this.applying = true;
      try { this.applyState({ tasks, processedEvents }, { source: 'cloud', silent: true }); }
      finally { this.applying = false; }
    } catch { /* noop */ }
    if (!this.connected) return;
    try {
      await pgRequest('DELETE', this.envId, 'goodwork_tasks', { filter: { id: `eq.${id}` } });
    } catch (e) { console.warn('[cloudSync] 删除云端任务失败:', e?.message); }
    try {
      await pgRequest('DELETE', this.envId, 'goodwork_attachments', { filter: { task_id: `eq.${id}` } });
    } catch { /* 附件表可能为空 */ }
    try {
      await pgRequest('DELETE', this.envId, 'goodwork_processed', { filter: { task_id: `eq.${id}` } });
    } catch (e) { console.warn('[cloudSync] 删除云端已处理记录失败:', e?.message); }
    await this.pushTombstones();
  }

  /** 修复本地超长字段：id > 40 位重新生成，status/reimbursedFrom 截断到 20 */
  repairLongValues() {
    const st = this.getState();
    let changed = false;
    const tasks = (st.tasks || []).map((t) => {
      const next = { ...t };
      if (!next.id || String(next.id).length > 40) {
        next.id = 'GW-RB-' + Math.random().toString(36).slice(2, 10);
        changed = true;
      }
      if (next.status && String(next.status).length > 20) { next.status = String(next.status).slice(0, 20); changed = true; }
      if (next.reimbursedFrom && String(next.reimbursedFrom).length > 20) { next.reimbursedFrom = String(next.reimbursedFrom).slice(0, 20); changed = true; }
      return next;
    });
    if (changed) {
      console.warn('[cloudSync] 已修复超长字段，重新写入本地');
      this.applyState({ tasks, processedEvents: st.processedEvents || [] }, { source: 'cloud', silent: true });
    }
    return changed;
  }

  // ========== 上传（本地 → PG）==========

  async pushNow({ force = false, silent = false, _internal = false, _retried = false } = {}) {
    // 🔧 如果还没连但 init 在跑，等它
    if (!this.connected && this._initPromise) {
      console.log('[cloudSync] pushNow: 等待 init 完成...');
      await this._initPromise;
    }
    if (!this.connected) {
      console.log('[cloudSync] pushNow: 仍然未连接，跳过');
      return false;
    }
    if (this.syncing) { return false; }
    if (!force && !this.dirty) return true;
    this.syncing = true;
    const versionAtStart = this.localVersion;
    this.emit('syncing');

    try {
      console.log('[cloudSync] pushNow ▶️ start connected=' + this.connected + ' dirty=' + this.dirty + ' force=' + force);
      const state = this.getState();
      console.log('[cloudSync] pushNow ▶️ state.tasks=' + (state?.tasks?.length || 0) + ' processedEvents=' + (state?.processedEvents?.length || 0));
      const now = nowIso();

      // 🔧 上传前先把云端数据拉下来做一次合并：按 id 取 updatedAt 较新的那条。
      //    避免某台设备用"旧副本"覆盖另一台设备刚保存的新内容。
      let remoteTasks = [];
      try {
        const [rRows, attachmentRows] = await Promise.all([
          pgRequest('GET', this.envId, 'goodwork_tasks', {
            select: '*', order: ['updated_at.desc'], limit: 5000,
          }),
          pgRequest('GET', this.envId, 'goodwork_attachments', { select: '*' }),
        ]);
        remoteTasks = this.hydrateTaskAttachments(rRows, attachmentRows);
      } catch (e) {
        console.warn('[cloudSync] push 前拉取云端失败，跳过合并:', e?.message);
      }
      const finalTasks = mergeByUpdatedAt(state.tasks || [], remoteTasks)
        .filter((t) => !this.isTombstoned(t));

      // --- 1. upsert 所有 tasks（每条用它自己的 updatedAt，保持不变）---
      const taskRows = finalTasks.map((t) => this.taskToRow(t, t.updatedAt || now));
      console.log('[cloudSync] pushNow ▶️ taskRows=' + taskRows.length);
      if (taskRows.length > 0) {
        try {
          const pgRes = await withTimeout(
            pgRequest('POST', this.envId, 'goodwork_tasks', {
              body: taskRows,
              prefer: 'resolution=merge-duplicates',
            }),
            20000, '上传任务到云端超时'
          );
          console.log('[cloudSync] pushNow ✅ tasks upsert OK');
        } catch (pgErr) {
          console.error('[cloudSync] pushNow ❌ tasks upsert FAILED:', pgErr);
          throw pgErr;  // 让外层 catch 处理
        }
      }

      // --- 2. upsert 所有 attachments ---
      const attachRows = [];
      for (const t of finalTasks) {
        for (const a of t.attachments || []) {
          attachRows.push(sanitizeRow({
            id: a.id ?? '',
            task_id: t.id ?? '',
            name: a.name ?? '',
            size: a.size ?? 0,
            mime_type: a.type ?? '',
            cloud_file_id: a.cloudFileId ?? '',
            blob_hash: '',
          }));
        }
      }
      if (attachRows.length > 0) {
        await withTimeout(
          pgRequest('POST', this.envId, 'goodwork_attachments', {
            body: attachRows,
            prefer: 'resolution=merge-duplicates',
          }),
          20000, '上传附件元数据超时'
        ).catch((e) => console.warn('[cloudSync] attachments upsert 失败（不阻塞任务）:', e.message));
      }

      // --- 3. upsert 所有 processed events（墓碑任务的历史记录不再上传）---
      const procRows = sanitizeRows((state.processedEvents || [])
        .filter((e) => !this.deletedIds.has(e.taskId))
        .map((e) => ({
        task_id: e.taskId ?? '',
        event_date: e.eventDate ?? null,
        amount: e.amount ?? 0,
        applicant: e.applicant ?? '',
        category: e.category ?? '',
        writer_device_id: e.writerDeviceId ?? this.deviceId,
        created_at: e.createdAt ?? now,
      })));
      if (procRows.length > 0) {
        await withTimeout(
          pgRequest('POST', this.envId, 'goodwork_processed', {
            body: procRows,
            prefer: 'resolution=merge-duplicates',
          }),
          20000, '上传已报销事件超时'
        );
      }

      // --- 4. 更新 meta ---
      await withTimeout(
        pgRequest('POST', this.envId, 'goodwork_meta', {
          body: [{
            key: 'workspace',
            value: JSON.stringify({
              name: 'GOODWORK 古德車房',
              last_writer: this.deviceId,
              last_written_at: now,
            }),
            updated_at: now,
          }],
          prefer: 'resolution=merge-duplicates',
        }),
        10000, '更新 meta 超时'
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
      console.error('[cloudSync] pushNow FAILED:', err);
      const errMsg = String(err?.message || '');
      // 🔧 自愈：老数据里 id 超过 40 位 / 字段超长 → 修复本地数据后重试一次
      if (!_retried && /22001|too long for type character varying/i.test(errMsg)) {
        console.warn('[cloudSync] 检测到字段超长（22001），自动修复本地数据后重试…');
        try {
          this.repairLongValues();
          return await this.pushNow({ force, silent, _internal, _retried: true });
        } catch (e2) { /* 继续走失败分支 */ }
      }
      const friendlyMsg = this.friendlyError(err);
      // 🔧 内部自动推送（init/connectData/15s定时）失败不 emit('error')，不破坏 UI 状态
      // 只有用户主动触发（非 _internal）才显示"同步异常"
      if (!_internal) {
        this.emit('error', { message: friendlyMsg, err });
        if (!silent) this.onToast('云端上传失败', friendlyMsg);
      }
      return false;
    } finally {
      this.syncing = false;
    }
  }

  async pullNow({ silent = false } = {}) {
    await this.connectData('pull');
    if (!silent) this.onToast('已从云端拉取', 'PostgreSQL 最新数据', 'ok');
  }

  // ========== 定时轮询 ==========

  startPoll() {
    this.stopPoll();
    if (!this.connected) return;
    this.pollTimer = setInterval(() => this.pollTick(), POLL_INTERVAL_MS);
    // 🔧 终极保险：每 15 秒自动把 localStorage 数据推上云（不管 markLocalChange 有没有被调用）
    this.autoPushTimer = setInterval(() => {
      if (this.connected && !this.syncing) {
        const state = this.getState();
        if ((state.tasks || []).length > 0) {
          console.log('[cloudSync] ⏰ 定时自动推 (15s) tasks=' + state.tasks.length);
          this.pushNow({ silent: true, _internal: true }).catch(() => {});
        }
      }
    }, 15000);
  }

  stopPoll() {
    clearInterval(this.pollTimer);
    clearInterval(this.autoPushTimer);
    this.pollTimer = null;
    this.autoPushTimer = null;
  }

  async pollTick() {
    if (!this.connected || this.applying || this.syncing) return;
    try {
      // 🔧 全量拉取（数据量小），不再依赖 updated_at 时间过滤：
      //    多台设备的系统时钟可能有偏差，用 gt.since 会漏掉"时钟慢"的那台设备写入的数据。
      const rows = await pgRequest('GET', this.envId, 'goodwork_tasks', {
        select: '*',
        order: ['updated_at.desc'],
        limit: 2000,
      });

      const pRows = await pgRequest('GET', this.envId, 'goodwork_processed', {
        select: '*',
        order: ['created_at.desc'],
        limit: 2000,
      });

      // 🔧 同步删除墓碑：其他设备的删除要传到本机
      await this.loadTombstonesFromCloud();

      let remoteAllTasks = rows.map((r) => this.rowToTask(r))
        .filter((t) => !this.isTombstoned(t));
      const local = this.getState();
      const localTasks = (local.tasks || []).filter((t) => !this.isTombstoned(t));
      const tombstoneChanged = localTasks.length !== (local.tasks || []).length;
      const localById = new Map(localTasks.map((t) => [t.id, t]));

      // 判断云端是否有"更新的/本地没有的"数据
      const hasNewRemoteTask = remoteAllTasks.some((rt) => {
        const lt = localById.get(rt.id);
        if (!lt) return true;
        return tsMs(rt.updatedAt) > tsMs(lt.updatedAt);
      });
      const localProcIds = new Set(
        (local.processedEvents || []).map((e) => `${e.taskId}|${e.eventDate}|${e.createdAt || ''}`)
      );
      const hasNewRemoteProc = pRows.some(
        (r) => !localProcIds.has(`${r.task_id}|${r.event_date}|${r.created_at || ''}`)
      );
      const hasNewRemote = hasNewRemoteTask || hasNewRemoteProc;

      // 如果云端没有新数据，只是本地 dirty 了（用户在别的设备改了），触发 push
      if (!hasNewRemote) {
        // 有墓碑命中 → 本地也要移除这些已被删除的记录
        if (tombstoneChanged) {
          this.applying = true;
          try {
            this.applyState({ tasks: localTasks, processedEvents: local.processedEvents || [] }, { source: 'cloud', silent: true });
          } finally {
            this.applying = false;
          }
        }
        // 检查有没有本地还没推上去的新数据
        if (this.dirty) {
          await this.pushNow({ silent: true });
        }
        this.lastPollAt = Date.now();
        return;
      }

      // 有新任务时同时拉附件元数据，避免用空附件列表覆盖本地。
      // 读取失败会直接进入外层 catch，本轮不合并，等待下次轮询。
      if (hasNewRemoteTask) {
        const attachmentRows = await pgRequest('GET', this.envId, 'goodwork_attachments', { select: '*' });
        remoteAllTasks = this.hydrateTaskAttachments(rows, attachmentRows)
          .filter((t) => !this.isTombstoned(t));
      }

      // 有新的云端数据 → 合并（按 id 取 updatedAt 较新），不要拉全量覆盖本地！
      const remoteIncrementalTasks = remoteAllTasks;
      const remoteIncrementalProc = pRows.map((r) => ({
        taskId: r.task_id,
        eventDate: r.event_date,
        amount: Number(r.amount) || 0,
        applicant: r.applicant || '',
        category: r.category || '',
        writerDeviceId: r.writer_device_id || '',
        createdAt: r.created_at,
      })).filter((e) => !this.deletedIds.has(e.taskId));

      const mergedTasks = mergeByUpdatedAt(localTasks, remoteIncrementalTasks);
      // 🔧 墓碑过滤：被删除的报销，其「已处理」记录也不再参与合并
      const mergedProc = mergeByUpdatedAt(
        (local.processedEvents || []).filter((e) => !this.deletedIds.has(e.taskId)),
        remoteIncrementalProc
      );

      console.log('[cloudSync] poll merge:',
        `remoteIncTasks=${remoteIncrementalTasks.length} → merged=${mergedTasks.length}`);

      this.applying = true;
      try {
        this.applyState(
          { tasks: mergedTasks, processedEvents: mergedProc },
          { source: 'cloud', silent: true }
        );
      } finally {
        this.applying = false;
      }

      // 更新 lastRemoteUpdatedAt 用合并后最新的那条
      const allUpdated = [
        ...localTasks.map(t => t.updatedAt || ''),
        ...remoteIncrementalTasks.map(t => t.updatedAt || ''),
      ].filter(Boolean);
      this.lastRemoteUpdatedAt = allUpdated.length ? allUpdated.reduce((a, b) => a > b ? a : b) : '';
      this.lastPollAt = Date.now();
      this.settings.lastSyncAt = nowIso();
      this.saveSettings();

      // 增量处理完后，如果还有本地独有数据 dirty，继续推送
      if (this.dirty) {
        await this.pushNow({ silent: true, _internal: true });
      }
    } catch (err) {
      // 🔧 轮询是后台静默行为，失败只 log 不 emit —— 不让 UI 显示「同步异常」
      console.warn('[cloudSync] pollTick 失败（静默）:', err?.message?.slice(0, 100));
    }
  }

  // ========== 附件云存储（业务数据仍走纯 fetch PostgreSQL）==========

  async ensureStorageApp() {
    const envId = this.envId;
    if (this._storageAppPromise && this._storageAppEnvId === envId) {
      return this._storageAppPromise;
    }
    this._storageAppEnvId = envId;
    this._storageAppPromise = (async () => {
      const cloudbase = await loadCloudBaseSDK();
      const app = cloudbase.init({
        env: envId,
        accessKey: PUBLISHABLE_KEY,
        apiOrigin: `https://${envId}.api.tcloudbasegateway.com`,
      });
      const auth = app.auth();
      if (auth?.signInAnonymously) {
        await withTimeout(auth.signInAnonymously(), 20000, '附件云端匿名登录超时。');
      }
      return app;
    })();
    try {
      return await this._storageAppPromise;
    } catch (err) {
      this._storageAppPromise = null;
      throw err;
    }
  }

  async uploadAttachment(meta, blob) {
    if (!blob) throw new Error('本地附件缓存不存在，无法上传。');
    const id = String(meta?.id || '');
    if (!id) throw new Error('附件缺少有效 ID，无法上传。');
    const data = await blobToBase64(blob);
    const value = JSON.stringify({
      v: 1,
      name: meta.name || '附件',
      size: Number(meta.size) || blob.size || 0,
      type: meta.type || blob.type || 'application/octet-stream',
      data,
    });
    await withTimeout(
      pgRequest('POST', this.envId, 'goodwork_meta', {
        body: [{ key: `${DB_ATTACHMENT_PREFIX}${id}`, value, updated_at: nowIso() }],
        prefer: 'resolution=merge-duplicates',
      }),
      60000,
      `附件「${meta.name || id}」上传超时。`
    );
    return `db:${id}`;
  }

  async downloadAttachment(fileID) {
    if (!fileID) throw new Error('附件尚未上传到云端。');
    if (String(fileID).startsWith('db:')) {
      const id = String(fileID).slice(3);
      const rows = await withTimeout(
        pgRequest('GET', this.envId, 'goodwork_meta', {
          select: 'value',
          filter: { key: `eq.${DB_ATTACHMENT_PREFIX}${id}` },
          limit: 1,
        }),
        60000,
        '云端附件下载超时。'
      );
      const value = rows?.[0]?.value;
      if (!value) throw new Error('云端附件内容不存在。');
      let payload;
      try { payload = JSON.parse(value); } catch { throw new Error('云端附件内容格式无效。'); }
      if (!payload?.data) throw new Error('云端附件内容为空。');
      return base64ToBlob(payload.data, payload.type);
    }
    const app = await this.ensureStorageApp();
    if (String(fileID).startsWith('pg:')) {
      const path = String(fileID).slice(3);
      const result = await withTimeout(
        app.storage.from(STORAGE_BUCKET).download(path),
        60000,
        '云端附件下载超时。'
      );
      if (result?.error) throw result.error;
      const data = result?.data ?? result;
      if (data instanceof Blob) return data;
      if (data instanceof ArrayBuffer || ArrayBuffer.isView(data)) return new Blob([data]);
      throw new Error('云端附件下载返回格式无效。');
    }
    if (String(fileID).startsWith('cloud://')) {
      const result = await app.getTempFileURL({ fileList: [fileID] });
      const item = result?.fileList?.[0];
      if (!item?.tempFileURL) throw new Error(item?.errMsg || '未能获取旧附件下载地址。');
      const response = await fetch(item.tempFileURL);
      if (!response.ok) throw new Error(`旧附件下载失败（HTTP ${response.status}）。`);
      return response.blob();
    }
    throw new Error('无法识别附件的云端文件 ID。');
  }

  async uploadTaskAttachments(task) {
    const result = { uploaded: 0, failed: 0, missing: 0 };
    for (const meta of task?.attachments || []) {
      if (meta.cloudFileId) continue;
      let blob = null;
      try { blob = await this.getAttachmentBlob(meta.id); } catch { blob = null; }
      if (!blob) {
        result.missing++;
        continue;
      }
      try {
        const fileId = await this.uploadAttachment(meta, blob);
        if (!fileId) throw new Error('云端未返回文件 ID。');
        meta.cloudFileId = fileId;
        result.uploaded++;
      } catch (err) {
        result.failed++;
        console.warn('[cloudSync] 附件上传失败:', meta.name, err?.message || err);
      }
    }
    if (result.uploaded > 0) task.updatedAt = nowIso();
    return result;
  }

  async syncTaskAttachments(task) {
    if (!this.connected || !task || this.uploading) return 0;
    this.uploading = true;
    try {
      const result = await this.uploadTaskAttachments(task);
      if (result.uploaded > 0) {
        this.onAttachmentsUploaded();
        await this.pushNow({ force: true, silent: true, _internal: true });
      }
      if (result.failed > 0) {
        this.onToast('部分附件上传失败', `${result.failed} 个附件将在下次同步时重试。`);
      }
      return result.uploaded;
    } finally {
      this.uploading = false;
    }
  }

  async syncAllAttachments({ silent = false } = {}) {
    if (!this.connected || this.uploading) return 0;
    this.uploading = true;
    const total = { uploaded: 0, failed: 0, missing: 0 };
    try {
      const state = this.getState();
      const tasks = state.tasks || [];
      for (const task of tasks) {
        const result = await this.uploadTaskAttachments(task);
        total.uploaded += result.uploaded;
        total.failed += result.failed;
        total.missing += result.missing;
      }
      if (total.uploaded > 0) {
        this.applying = true;
        try {
          this.applyState(
            { tasks, processedEvents: state.processedEvents || [] },
            { source: 'cloud', silent: true }
          );
        } finally {
          this.applying = false;
        }
        this.markLocalChange();
        await this.pushNow({ force: true, silent: true, _internal: true });
      }
      this.emit('connected');
      if (!silent) {
        const detail = `${total.uploaded} 个上传成功`
          + (total.failed ? ` · ${total.failed} 个失败` : '')
          + (total.missing ? ` · ${total.missing} 个本地无缓存` : '');
        this.onToast(total.failed ? '附件同步未全部完成' : '附件云同步完成', detail, total.failed ? '' : 'ok');
      }
      return total.uploaded;
    } finally {
      this.uploading = false;
    }
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
    const code = String(err?.code || '');
    const detail = err?.message || err?.details || String(err || '');
    const msg = `${code} ${detail}`.trim();

    if (/relation.*does not exist|does not exist|42P01/i.test(msg)) {
      return '数据库表不存在 —— 请在云开发控制台 PostgreSQL → SQL 编辑器里执行建表 SQL。';
    }
    if (/permission denied|42501|GRANT/i.test(msg)) {
      return '数据库权限不足 —— 请在控制台 SQL 编辑器里执行 GRANT 语句（给 anon 角色授权）。';
    }
    if (/domain|origin|cors/i.test(msg)) {
      return '当前站点未加入云开发安全域名，请在控制台添加本站域名。';
    }
    if (/network|timeout|ETIMEDOUT/i.test(msg)) {
      return '网络超时，请检查网络连接后重试。';
    }
    if (/not found|404/i.test(msg)) {
      return '云开发环境不存在或 Publishable Key 已失效。';
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
