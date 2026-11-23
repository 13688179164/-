/**
 * 腾讯云开发 PostgreSQL 同步 —— 纯 fetch 版本（零 SDK 依赖）
 * CloudSync v9.1
 */
const CLOUD_SYNC_VERSION = 'v9.1-pure-fetch';
const SETTINGS_KEY = 'goodwork.cloud.settings.v1';
const DEVICE_KEY = 'goodwork.cloud.device.v1';
const DEFAULT_ENV_ID = 'attractive-starfish-d0bp2e865971';
// CloudBase Publishable Key — anon 角色的完整 JWT，直接当 Bearer token 用
const PUBLISHABLE_KEY = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjIxMTE1ZTA4LWJjYjQtNGViZS1iMzQ2LTRkMDBhOWUxMWY4NCJ9.eyJpc3MiOiJodHRwczovL2F0dHJhY3RpdmUtc3RhcmZpc2gtZDBicDJlODY1OTcxLmFwLXNoYW5naGFpLnRjYi1hcGkudGVuY2VudGNsb3VkYXBpLmNvbSIsInN1YiI6ImFub24iLCJhdWQiOiJhdHRyYWN0aXZlLXN0YXJmaXNoLWQwYnAyZTg2NTk3MSIsImV4cCI6NDA5OTEwNDgzOCwiaWF0IjoxNzk1NDIxNjM4LCJub25jZSI6IkM2OXNFOVRWU2E2N09TRmNfbEFBLWciLCJhdF9oYXNoIjoiQzY5c0U5VFZTYTY3T1NGY19sQUEtZyIsIm5hbWUiOiJBbm9ueW1vdXMiLCJzY29wZSI6ImFub255bW91cyIsInByb2plY3RfaWQiOiJhdHRyYWN0aXZlLXN0YXJmaXNoLWQwYnAyZTg2NTk3MSIsIm1ldGEiOnsicGxhdGZvcm0iOiJQdWJsaXNoYWJsZUtleSJ9LCJyb2xlIjoiYW5vbiIsImlzX2Fub255bW91cyI6dHJ1ZSwiYXBwX21ldGFkYXRhIjp7InByb3ZpZGVyIjoiYW5vbnltb3VzIiwicHJvdmlkZXJzIjpbImFub255bW91cyJdfSwidXNlcl9tZXRhZGF0YSI6eyJuYW1lIjoiQW5vbnltb3VzIn0sInVzZXJfdHlwZSI6IiIsImNsaWVudF90eXBlIjoiY2xpZW50X3VzZXIiLCJpc19zeXN0ZW1fYWRtaW4iOmZhbHNlfQ.BbEqc_mku1-zXHvEAI3bUhUyDfjlkPhbyE_gHrUsF2mDuc0FlgskbZ9qziNP9Bk3gW4mWNDetSt7fq70Z6Y3fsypBOZz9MGb5Hgf1Cm1LPZsdXi8Vaw5nDnUnR9wx6YgxhjGYUwI9hYRGMmy7FR4YtRZMQC9wR0VJAda6G1Ac_YF00R1Ptdw_ljUmyB5-W5osDiklvP_XcsbboR4ph9Poo8tCJtpzDkIhvZ9A0ypSfM9HZnqHRpV-X3VJy3fDyeQ6tKZGt6iCbrUuFDqUXBZ8oCCRWAYXKS2gUg5OyGa538Sj6llJDlJxJjEqgz9lfaiWRnYuGTQv78E-5WEkdINuA';
const POLL_INTERVAL_MS = 3000;
const PUSH_DEBOUNCE_MS = 1500;

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
function mergeByUpdatedAt(local, remote) {
  const byId = new Map();
  const addOne = (item) => {
    if (!item || !item.id) return;
    const existing = byId.get(item.id);
    if (!existing) {
      byId.set(item.id, item);
    } else {
      // 取 updatedAt 更新的那条
      const eTime = existing.updatedAt || existing.updated_at || '';
      const iTime = item.updatedAt || item.updated_at || '';
      if (iTime >= eTime) {
        byId.set(item.id, item);
      }
    }
  };
  for (const x of local || []) addOne(x);
  for (const x of remote || []) addOne(x);
  return [...byId.values()].sort((a, b) => {
    const ta = a.updatedAt || a.updated_at || '';
    const tb = b.updatedAt || b.updated_at || '';
    return tb.localeCompare(ta);
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
      return { tasks: Array.isArray(tasks) ? tasks : [], processedEvents: Array.isArray(processedEvents) ? processedEvents : [] };
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
    // 🔧 删除墓碑：记录被删除的任务 id，防止它被其他设备/云端重新"复活"
    this.deletedIds = new Set(Array.isArray(this.settings.deletedIds) ? this.settings.deletedIds : []);

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

  taskToRow(task, updatedAt) {
    // 🔧 PostgreSQL 字段长度保护：以下字段全是 varchar(40)
    const v40 = (v) => String(v ?? '').slice(0, 40);
    const row = {
      id: v40(task.id),
      applicant: v40(task.applicant),
      amount: task.amount ?? 0,
      department: v40(task.department),
      category: v40(task.category),
      applied_at: task.appliedAt ?? null,
      content: task.content ?? '',  // text 类型，没长度限制
      status: v40(task.status),
      has_invoice: !!task.hasInvoice,
      invoice_received: !!task.invoiceReceived,
      invoice_received_at: task.invoiceReceivedAt ?? null,
      reimbursed_at: task.reimbursedAt ?? null,
      reimbursed_from: v40(task.reimbursedFrom),
      high_value_part: task.highValuePart ?? null,
      cross_month: task.crossMonth ?? null,
      stocking_cost: task.stockingCost ?? null,
      order_num: task.order ?? 0,
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

    const attachByTask = new Map();
    for (const a of attachRows) {
      const list = attachByTask.get(a.task_id) || [];
      list.push(a);
      attachByTask.set(a.task_id, list);
    }

    let processed = [];
    try {
      processed = await withTimeout(
        pgRequest('GET', this.envId, 'goodwork_processed', { select: '*' }),
        20000,
        '读取已报销事件超时'
      );
    } catch { processed = []; }

    const remoteTasks = rows.map((r) => {
      const t = this.rowToTask(r);
      const linked = attachByTask.get(r.id) || [];
      if (linked.length) {
        t.attachments = linked.map((a) => ({
          id: a.id, cloudFileId: a.cloud_file_id || '', name: a.name || '',
          size: Number(a.size) || 0, type: a.mime_type || '',
        }));
      }
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
    }).filter((t) => !this.deletedIds.has(t.id));

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
    // 🔧 墓碑过滤：本地已被删除的任务不再参与合并/推送
    const localTasks = (local.tasks || []).filter((t) => !this.deletedIds.has(t.id));
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

    const localProc = local.processedEvents || [];

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
    this.settings.deletedIds = [...this.deletedIds].slice(-2000);
    this.saveSettings();
  }

  async loadTombstonesFromCloud() {
    try {
      const rows = await pgRequest('GET', this.envId, 'goodwork_meta', {
        select: 'value', filter: { key: 'eq.deleted_ids' }, limit: 1,
      });
      const row = Array.isArray(rows) ? rows[0] : null;
      if (!row || !row.value) return false;
      const ids = JSON.parse(row.value);
      if (!Array.isArray(ids)) return false;
      let changed = false;
      for (const id of ids) {
        if (id && !this.deletedIds.has(id)) { this.deletedIds.add(id); changed = true; }
      }
      if (changed) this.saveTombstones();
      return changed;
    } catch (e) { /* meta 表不存在时忽略 */ return false; }
  }

  async pushTombstones() {
    try {
      await pgRequest('POST', this.envId, 'goodwork_meta', {
        body: [{ key: 'deleted_ids', value: JSON.stringify([...this.deletedIds]), updated_at: nowIso() }],
        prefer: 'resolution=merge-duplicates',
      });
    } catch (e) { console.warn('[cloudSync] 写入删除墓碑失败:', e?.message); }
  }

  /** 删除一条报销：本地立即移除 + 云端删行 + 写墓碑，防止其他设备再推回来 */
  async recordDeletion(id) {
    if (!id) return;
    this.deletedIds.add(id);
    this.saveTombstones();
    try {
      const st = this.getState();
      const tasks = (st.tasks || []).filter((t) => t.id !== id);
      this.applying = true;
      try { this.applyState({ tasks, processedEvents: st.processedEvents || [] }, { source: 'cloud', silent: true }); }
      finally { this.applying = false; }
    } catch { /* noop */ }
    if (!this.connected) return;
    try {
      await pgRequest('DELETE', this.envId, 'goodwork_tasks', { filter: { id: `eq.${id}` } });
    } catch (e) { console.warn('[cloudSync] 删除云端任务失败:', e?.message); }
    try {
      await pgRequest('DELETE', this.envId, 'goodwork_attachments', { filter: { task_id: `eq.${id}` } });
    } catch { /* 附件表可能为空 */ }
    await this.pushTombstones();
  }

  // ========== 上传（本地 → PG）==========

  async pushNow({ force = false, silent = false, _internal = false } = {}) {
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
        const rRows = await pgRequest('GET', this.envId, 'goodwork_tasks', {
          select: '*', order: ['updated_at.desc'], limit: 5000,
        });
        remoteTasks = rRows.map((r) => this.rowToTask(r));
      } catch (e) {
        console.warn('[cloudSync] push 前拉取云端失败，跳过合并:', e?.message);
      }
      const finalTasks = mergeByUpdatedAt(state.tasks || [], remoteTasks)
        .filter((t) => !this.deletedIds.has(t.id));

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

      // --- 3. upsert 所有 processed events ---
      const procRows = sanitizeRows((state.processedEvents || []).map((e) => ({
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

      const remoteAllTasks = rows.map((r) => this.rowToTask(r))
        .filter((t) => !this.deletedIds.has(t.id));
      const local = this.getState();
      const localTasks = (local.tasks || []).filter((t) => !this.deletedIds.has(t.id));
      const tombstoneChanged = localTasks.length !== (local.tasks || []).length;
      const localById = new Map(localTasks.map((t) => [t.id, t]));

      // 判断云端是否有"更新的/本地没有的"数据
      const hasNewRemoteTask = remoteAllTasks.some((rt) => {
        const lt = localById.get(rt.id);
        if (!lt) return true;
        return (rt.updatedAt || '') > (lt.updatedAt || '');
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
      }));

      const mergedTasks = mergeByUpdatedAt(localTasks, remoteIncrementalTasks);
      const mergedProc = mergeByUpdatedAt(local.processedEvents || [], remoteIncrementalProc);

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

  // ========== 附件（纯 fetch 版暂不支持云存储 —— 用 IndexedDB 本地缓存）==========
  // 注：云存储需要 SDK 的 uploadFile / getTempFileURL，这里没有 SDK。
  // 附件元数据已通过 goodwork_attachments 表同步，blob 保留在本地 IndexedDB。

  async uploadAttachment(meta, blob) {
    // 纯 fetch 版本跳过云存储上传（blob 保留本地）
    // 附件元数据会在 pushNow 里通过 goodwork_attachments 表同步
    return '';
  }

  async downloadAttachment(fileID) {
    throw new Error('纯 fetch 版本暂不支持云端附件下载，请升级到完整 SDK 版本。');
  }

  async syncTaskAttachments(task) {
    if (!this.connected) return 0;
    // 纯 fetch 版本：只同步附件元数据到 goodwork_attachments 表（已在 pushNow 里做）
    // blob 仍留在本地 IndexedDB
    this.markLocalChange();
    return 0;
  }

  async syncAllAttachments({ silent = false } = {}) {
    if (!this.connected) return 0;
    // 触发一次 push 让附件元数据同步
    await this.pushNow({ force: true, silent: true, _internal: true });
    this.emit('connected');
    return 0;
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
