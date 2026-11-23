/**
 * GOODWORK 古德車房 · 二级报销工作台
 * 三列看板 / 本地持久化 / 附件凭证 / D 盘文件夹授权写入 / Excel 与统计报告
 */
import {
  DEPARTMENTS, DEPT_CATEGORIES, STATUS_LIST, STATUS_MAP,
  EMPLOYEE_NAMES, ATTACHMENT_ACCEPT, categoriesFor, isHighValuePart, highValueText,
  createSampleTasks, BUSINESS_UNITS, MONTHLY_COST_ROWS, mapCostToStatement,
} from '../core/reimburseConfig.js?v=20261123v914';
import { CloudSync } from '../core/cloudSync.js?v=20261123v921';

/* ------------------------------------------------------------------ */
/* 基础工具                                                            */
/* ------------------------------------------------------------------ */

const TASKS_KEY = 'goodwork.reimburse.tasks.v3';
const PROCESSED_KEY = 'goodwork.reimburse.processed.v1';
const SETTINGS_KEY = 'goodwork.reimburse.settings.v3';
const DB_NAME = 'goodwork-reimburse';
const DB_VERSION = 1;
const VOUCHER_FOLDER = '车房凭证';

const STATUS_ORDER = { pending: 0, reimbursed: 1, supplemented: 2 };
const STATUS_LABEL = Object.fromEntries(STATUS_LIST.map((s) => [s.id, s.label]));

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function esc(value) {
  return String(value ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function pad(n) { return String(n).padStart(2, '0'); }
function toDateKey(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}
function dateKeyOf(value) {
  if (!value) return toDateKey();
  const s = String(value);
  const m = s.match(/^(\d{4}-\d{2}-\d{2})/);
  if (m) return m[1];
  const d = new Date(s);
  return Number.isNaN(d.getTime()) ? toDateKey() : toDateKey(d);
}
function parseLocalDate(key) {
  const [y, m, d] = String(key).split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1);
}
function addDays(key, delta) {
  const d = parseLocalDate(key);
  d.setDate(d.getDate() + delta);
  return toDateKey(d);
}
function formatDateTime(value) {
  if (!value) return '—';
  return String(value).replace('T', ' ').slice(0, 16);
}
function localTimestamp(date = new Date()) {
  return `${toDateKey(date)} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}
function formatDateLabel(key) {
  const d = parseLocalDate(key);
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`;
}
function money(n) {
  const num = Number(n) || 0;
  return num.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
function compactMoney(n) {
  const num = Number(n) || 0;
  return num.toLocaleString('zh-CN', { maximumFractionDigits: 0 });
}
function monthStartKey(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-01`;
}
function weekStartKey(d = new Date()) {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const day = x.getDay() || 7;
  x.setDate(x.getDate() - day + 1);
  return toDateKey(x);
}
function nowTimeValue() {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function currentMonthValue(d = new Date()) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}`;
}
function monthRange(month) {
  const [y, m] = String(month).split('-').map(Number);
  const start = `${y}-${pad(m)}-01`;
  const last = new Date(y, m, 0).getDate();
  return { start, end: `${y}-${pad(m)}-${pad(last)}`, last, year: y, month: m };
}
function localTimeFromIso(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function localDateTimeFromIso(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '—';
  return `${toDateKey(d)} ${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
function uid(prefix = 'GW') {
  // 🔧 数据库 id 字段是 varchar(40)，必须严格 ≤ 40 chars
  // 用 short uuid (8 chars) 替代完整 UUID (36 chars)
  // 这样前缀 + short = 安全在 40 以内
  const shortId = () => Math.random().toString(36).slice(2, 10); // 8 chars
  const p = (prefix || '').slice(0, 10); // 前缀也截断防超长
  if (crypto?.randomUUID) {
    // UUID 前 8 位短 id 更够了，8 chars 足够
    const full = crypto.randomUUID();
    return `${p}-${full.slice(0, 8)}`;  // 前缀 + 8 chars = ≤ 19 chars，安全！
  }
  return `${p}-${Date.now().toString(36).slice(-4)}${shortId()}`;  // ≤ 16 chars
}
function sanitizeNamePart(value) {
  return String(value ?? '')
    .replace(/[\\/:*?"<>|\u0000-\u001f]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, 40) || '未命名';
}
function fileExtension(name = '') {
  const m = String(name).match(/(\.[A-Za-z0-9]{1,10})$/);
  return m ? m[1].toLowerCase() : '';
}
function isImageFile(file) {
  return file?.type?.startsWith('image/') || /\.(png|jpe?g|webp|gif|bmp|svg)$/i.test(file?.name || '');
}
function isAllowedFile(file) {
  const name = String(file?.name || '');
  const type = String(file?.type || '');
  if (type.startsWith('image/')) return true;
  if (/\.(png|jpe?g|webp|gif|bmp|svg|pdf|docx?|xlsx?|txt|csv)$/i.test(name)) return true;
  return false;
}
function formatBytes(bytes) {
  const b = Number(bytes) || 0;
  if (b < 1024) return `${b} B`;
  if (b < 1024 * 1024) return `${(b / 1024).toFixed(1)} KB`;
  return `${(b / 1024 / 1024).toFixed(1)} MB`;
}
function startOfDay(key) { return parseLocalDate(key); }
function inRange(task, start, end) {
  const key = dateKeyOf(task.appliedAt);
  return key >= start && key <= end;
}

/* ------------------------------------------------------------------ */
/* SVG icons                                                           */
/* ------------------------------------------------------------------ */

const ICON = {
  close: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 6l12 12M18 6L6 18" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  plus: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 5v14M5 12h14" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/></svg>',
  back: '<svg viewBox="0 0 24 24" fill="none"><path d="M19 12H6M11 6l-5.5 6 5.5 6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  edit: '<svg viewBox="0 0 24 24" fill="none"><path d="M4 20l4.2-1 10-10a2.1 2.1 0 0 0-3-3l-10 10L4 20z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M13.6 7.6l3 3" stroke="currentColor" stroke-width="1.3"/></svg>',
  trash: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 7h14M9 7V4.5h6V7M7.5 7l.8 12h7.4l.8-12M10 11v4.5M14 11v4.5" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  grip: '<svg viewBox="0 0 20 20" fill="currentColor"><circle cx="6" cy="5" r="1.1"/><circle cx="14" cy="5" r="1.1"/><circle cx="6" cy="10" r="1.1"/><circle cx="14" cy="10" r="1.1"/><circle cx="6" cy="15" r="1.1"/><circle cx="14" cy="15" r="1.1"/></svg>',
  folder: '<svg viewBox="0 0 24 24" fill="none"><path d="M3.5 7.5h6l1.8 2H20.5v9.8H3.5V7.5z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M3.5 7.5V5.7h5.2l1.5 1.8" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/></svg>',
  sync: '<svg viewBox="0 0 24 24" fill="none"><path d="M19 8.5A7.5 7.5 0 0 0 5.7 6.8L4 8.5M4 4.5v4h4M5 15.5a7.5 7.5 0 0 0 13.3 1.7L20 15.5M20 19.5v-4h-4" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  file: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 3.5h8l4 4V20.5H6V3.5z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round"/><path d="M14 3.5v4h4M9 12h6M9 15h6" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
  image: '<svg viewBox="0 0 24 24" fill="none"><rect x="3.5" y="5.5" width="17" height="13" rx="1.4" stroke="currentColor" stroke-width="1.3"/><circle cx="9" cy="10" r="1.5" stroke="currentColor" stroke-width="1.2"/><path d="M5 17l4.5-4.2L13 16l2.2-2.1L19.5 18" stroke="currentColor" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  paperclip: '<svg viewBox="0 0 24 24" fill="none"><path d="M8.5 12.5l5.4-5.4a2.8 2.8 0 0 1 4 4l-7.1 7.1a4.6 4.6 0 0 1-6.5-6.5l6.7-6.7" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  invoice: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 3.5h14v17l-2.3-1.5-2.3 1.5-2.4-1.5-2.3 1.5L7.3 19 5 20.5v-17z" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/><path d="M8.5 8h7M8.5 11.5h7M8.5 15h4" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
  download: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 4v11M7.5 10.5L12 15l4.5-4.5M5 19.5h14" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  report: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 19.5V10M12 19.5V4.5M19 19.5v-6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round"/><path d="M3.5 19.5h17" stroke="currentColor" stroke-width="1.2" stroke-linecap="round"/></svg>',
  excel: '<svg viewBox="0 0 24 24" fill="none"><path d="M5 3.5h14v17H5v-17z" stroke="currentColor" stroke-width="1.3"/><path d="M8 8l5 8M13 8l-5 8" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/></svg>',
  check: '<svg viewBox="0 0 16 16" fill="none"><path d="M3 8.4l3.2 3.2L13 4.8" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chevronLeft: '<svg viewBox="0 0 24 24" fill="none"><path d="M14.5 6l-6 6 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chevronRight: '<svg viewBox="0 0 24 24" fill="none"><path d="M9.5 6l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  chevronDown: '<svg viewBox="0 0 24 24" fill="none"><path d="M6 9.5l6 6 6-6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  drop: '<svg viewBox="0 0 24 24" fill="none"><path d="M12 4v10M8 10.5l4 4 4-4M6 19h12" stroke="currentColor" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round"/></svg>',
  cloud: '<svg viewBox="0 0 24 24" fill="none"><path d="M7.2 18h9.6a4.2 4.2 0 0 0 .6-8.36A6.1 6.1 0 0 0 6 8.9 4.7 4.7 0 0 0 7.2 18z" stroke="currentColor" stroke-width="1.25" stroke-linejoin="round"/><path d="M9.5 13.4l2.5 2.4 2.5-2.4" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>',
};

/* ------------------------------------------------------------------ */
/* IndexedDB                                                           */
/* ------------------------------------------------------------------ */

let dbPromise = null;
function openDb() {
  if (dbPromise) return dbPromise;
  dbPromise = new Promise((resolve, reject) => {
    if (!('indexedDB' in window)) { reject(new Error('IndexedDB 不可用')); return; }
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains('attachments')) db.createObjectStore('attachments', { keyPath: 'id' });
      if (!db.objectStoreNames.contains('meta')) db.createObjectStore('meta', { keyPath: 'key' });
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error || new Error('IndexedDB 打开失败'));
  });
  return dbPromise;
}
async function dbPut(storeName, value) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).put(value);
    tx.oncomplete = () => resolve(value);
    tx.onerror = () => reject(tx.error);
  });
}
async function dbGet(storeName, key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const req = tx.objectStore(storeName).get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}
async function dbDelete(storeName, key) {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}
async function storeAttachmentBlob(id, file) {
  return dbPut('attachments', {
    id,
    name: file.name,
    type: file.type || 'application/octet-stream',
    size: file.size || 0,
    blob: file,
    savedAt: new Date().toISOString(),
  });
}
async function readAttachmentBlob(id) {
  const rec = await dbGet('attachments', id);
  return rec?.blob || null;
}
async function deleteAttachmentBlob(id) {
  try { await dbDelete('attachments', id); } catch { /* noop */ }
}

/* ------------------------------------------------------------------ */
/* 主类                                                                */
/* ------------------------------------------------------------------ */

export class ReimburseBoard {
  constructor({ onClose, onToast } = {}) {
    console.log('%c[ReimburseBoard] 构造函数开始', 'color:#0066cc;font-weight:bold');
    try {
      this.onClose = onClose || (() => {});
      this.onToast = onToast || (() => {});
      this._seededTasks = false;
      this.tasks = this.loadTasks();
      this.processedEvents = this.loadProcessedEvents();
      this.settings = this.loadSettings();
    this.viewDate = toDateKey();
    this.exportStart = this.settings.exportStart || monthStartKey();
    this.exportEnd = this.settings.exportEnd || toDateKey();
    this.filterApplicant = 'all';
    this.filterInvoice = 'all';
    this.filterStart = this.viewDate;
    this.filterEnd = this.viewDate;
    this.lastProcessedTotal = -1;
    this.openFlag = false;
    this.closing = false;
    this.drawerOpen = false;
    this.drawerMode = null;
    this.editingId = null;
    this.draft = null;
    this.draftExisting = [];
    this.draftNewFiles = [];
    this.draftRemoved = new Set();
    this.draftLoading = false;
    this.drag = null;
    this.suppressClick = false;
    this.reportOpen = false;
    this.invoiceOpen = false;
    this.invoiceTab = 'pending';
    this.invoiceFilterApplicant = 'all';
    this.invoiceFilterStart = '';
    this.invoiceFilterEnd = '';
    this.statementOpen = false;
    this.statementMonth = currentMonthValue();
    this.cloudOpen = false;
    this.cloudBusy = false;
    this.applyingCloud = false;
    this.previewUrl = null;
    this.folderHandle = null;
    this.folderStatus = 'checking';
    this.folderBusy = false;
    this.exporting = false;
    this.syncing = false;
    this.lastPct = 0;
    this._buildShell();
    this._bind();
    this.renderAll({ animate: false });
    this.initFolder();
    this.cloud = window.__cloudSync || new CloudSync({
      getState: () => this.getCloudState(),
      applyState: (state, meta) => this.applyCloudState(state, meta),
      getAttachmentBlob: (id) => readAttachmentBlob(id),
      onAttachmentsUploaded: () => this.persistTasks(),
      onStatus: (status, detail) => this.onCloudStatus(status, detail),
      onToast: (title, desc, type) => this.toast(title, desc, type),
    });
    // 🔧 不再覆盖 getState —— 让 CloudSync 自己从 localStorage 读（更可靠，不依赖 ReimburseBoard 是否初始化完成）
    // this.cloud.getState = () => this.getCloudState();
    this.cloud.applyState = (state, meta) => this.applyCloudState(state, meta);
    this.cloud.onStatus = (status, detail) => this.onCloudStatus(status, detail);
    this.cloud.onToast = (title, desc, type) => this.toast(title, desc, type);
    window.__cloudSync = this.cloud;
    window.__cloudSyncApp = this.cloud;
    this.cloud.onStatus(this.cloud.status, this.cloud.getStatus());
    console.log('%c[ReimburseBoard] CloudSync 实例就绪', 'color:#0a6', `connected=${this.cloud.isConnected()}`);
    // 如果还没连，手动 init 一次
    if (!this.cloud.isConnected()) {
      this.cloud.init().then(() => {
        const s = this.cloud.getStatus();
        console.log('%c[reimburse] cloud.init() 完成', 'color:#0a6', `connected=${s.connected}`);
        if (s.error) console.warn('[reimburse] init error detail:', s.error);
      }).catch(e => {
        console.error('[reimburse] cloud.init() 抛异常:', e);
      });
    }
    } catch (e) {
      console.error('[ReimburseBoard] 构造函数抛异常:', e);
      console.error('  栈:', e.stack);
    }
    console.log('%c[ReimburseBoard] 构造函数结束', 'color:#0066cc;font-weight:bold');
  }

  /* ---------------- 存储 ---------------- */

  loadTasks() {
    try {
      const raw = localStorage.getItem(TASKS_KEY);
      if (raw === null) {
        const samples = createSampleTasks();
        localStorage.setItem(TASKS_KEY, JSON.stringify(samples));
        this._seededTasks = true;
        return samples;
      }
      const parsed = JSON.parse(raw);
      if (!Array.isArray(parsed)) throw new Error('tasks not array');
      return parsed.map((t) => this.normalizeTask(t));
    } catch (err) {
      console.warn('报销数据读取失败，使用示例数据', err);
      const samples = createSampleTasks();
      this._seededTasks = true;
      try { localStorage.setItem(TASKS_KEY, JSON.stringify(samples)); } catch { /* noop */ }
      return samples;
    }
  }

  loadProcessedEvents() {
    try {
      const raw = localStorage.getItem(PROCESSED_KEY);
      if (raw !== null) {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
      }
      if (this._seededTasks) {
        const seeded = this.tasks.find((t) => t.status === 'reimbursed');
        if (seeded) {
          const event = this.makeProcessedEvent(seeded);
          try { localStorage.setItem(PROCESSED_KEY, JSON.stringify([event])); } catch { /* noop */ }
          return [event];
        }
      }
    } catch (err) {
      console.warn('已处理记录读取失败', err);
    }
    return [];
  }

  makeProcessedEvent(task) {
    const now = new Date();
    return {
      id: uid('evt'),
      taskId: task.id,
      eventDate: toDateKey(now),
      timestamp: now.toISOString(),
      amount: Number(task.amount) || 0,
      applicant: task.applicant,
      department: task.department,
      category: task.category,
      content: task.content,
      hasInvoice: !!task.hasInvoice,
    };
  }

  persistProcessed() {
    try {
      localStorage.setItem(PROCESSED_KEY, JSON.stringify(this.processedEvents));
      if (!this.applyingCloud) this.cloud?.markLocalChange();
    } catch (err) {
      console.warn('已处理记录保存失败', err);
    }
  }

  recordProcessed(task, fromStatus, toStatus) {
    if (fromStatus !== 'pending' || toStatus !== 'reimbursed') return;
    const today = toDateKey();
    const existing = this.processedEvents.find((e) => e.taskId === task.id && e.eventDate === today);
    if (existing) {
      existing.amount = Number(task.amount) || 0;
      existing.applicant = task.applicant;
      existing.department = task.department;
      existing.category = task.category;
      existing.content = task.content;
      existing.hasInvoice = !!task.hasInvoice;
      existing.timestamp = new Date().toISOString();
    } else {
      this.processedEvents.push(this.makeProcessedEvent(task));
    }
    this.persistProcessed();
  }

  removeProcessed(taskId) {
    const today = toDateKey();
    const before = this.processedEvents.length;
    this.processedEvents = this.processedEvents.filter((e) => !(e.taskId === taskId && e.eventDate === today));
    if (this.processedEvents.length !== before) this.persistProcessed();
  }

  syncProcessed(task, fromStatus) {
    const hasEvent = this.processedEvents.some((e) => e.taskId === task.id && e.eventDate === toDateKey());
    if (task.status === 'reimbursed' && (fromStatus === 'pending' || hasEvent)) {
      this.recordProcessed(task, 'pending', 'reimbursed');
    } else if (task.status !== 'reimbursed' && hasEvent) {
      this.removeProcessed(task.id);
    }
  }

  normalizeTask(t) {
    return {
      // 🔧 云端 id 字段是 varchar(40)，旧数据里超过 40 位的 id 会导致 DATABASE_22001
      id: (t.id && String(t.id).length > 0 && String(t.id).length <= 40) ? t.id : uid('GW-RB'),
      applicant: String(t.applicant || ''),
      amount: Number(t.amount) || 0,
      department: DEPARTMENTS.includes(t.department) ? t.department : '其他',
      category: t.category || categoriesFor(t.department)[0],
      appliedAt: t.appliedAt || `${toDateKey()}T${nowTimeValue()}`,
      hasInvoice: !!t.hasInvoice,
      content: String(t.content || ''),
      status: STATUS_MAP[t.status] ? t.status : 'pending',
      highValuePart: !!t.highValuePart,
      crossMonth: t.highValuePart ? !!t.crossMonth : null,
      stockingCost: t.highValuePart ? !!t.stockingCost : null,
      attachments: Array.isArray(t.attachments) ? t.attachments.map((a) => ({
        id: a.id || uid('att'),
        name: a.name || '附件',
        size: Number(a.size) || 0,
        type: a.type || '',
        written: !!a.written,
        voucherName: a.voucherName || '',
        cloudFileId: a.cloudFileId || '',
      })) : [],
      collapsed: !!t.collapsed,
      invoiceReceived: !!t.invoiceReceived,
      invoiceReceivedAt: t.invoiceReceivedAt || null,
      reimbursedAt: t.reimbursedAt || null,
      reimbursedFrom: t.reimbursedFrom || null,
      order: Number.isFinite(Number(t.order)) ? Number(t.order) : Date.now(),
      createdAt: t.createdAt || new Date().toISOString(),
      updatedAt: t.updatedAt || new Date().toISOString(),
    };
  }

  loadSettings() {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch { return {}; }
  }

  persistTasks() {
    try {
      localStorage.setItem(TASKS_KEY, JSON.stringify(this.tasks));
      if (!this.applyingCloud) {
        console.log('[reimburse] persistTasks → markLocalChange (connected=' + this.cloud?.isConnected() + ')');
        this.cloud?.markLocalChange();
      } else {
        console.log('[reimburse] persistTasks → 跳过 markLocalChange (applyingCloud=true)');
      }
      return true;
    } catch (err) {
      console.warn('保存报销数据失败', err);
      this.toast('本地保存失败', '浏览器存储空间不足，请先导出或删除部分记录。');
      return false;
    }
  }

  persistSettings() {
    try {
      this.settings.exportStart = this.exportStart;
      this.settings.exportEnd = this.exportEnd;
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(this.settings));
    } catch { /* noop */ }
  }

  toast(title, desc = '', type = '') {
    this.onToast(title, desc, type);
  }

  /* ---------------- DOM ---------------- */

  _buildShell() {
    const statusColumns = STATUS_LIST.map((s) => `
      <section class="rb-col rb-col--${s.id}" data-status="${s.id}" aria-label="${s.label}">
        <header class="rb-col-head">
          <div class="rb-col-title">
            <i class="rb-col-dot"></i>
            <h3>${s.label}</h3>
            <span class="rb-col-en">${s.en}</span>
          </div>
          <div class="rb-col-meta">
            <span class="rb-col-count" data-count="${s.id}">0</span>
            <b class="rb-col-sum" data-sum="${s.id}">¥0.00</b>
          </div>
          <p class="rb-col-hint">${s.hint}</p>
        </header>
        <div class="rb-col-scroll">
          <div class="rb-cards" data-cards="${s.id}"></div>
          <div class="rb-empty" data-empty="${s.id}">
            <span>${s.id === 'pending' ? '今天还没有待报销申请' : s.id === 'reimbursed' ? '还没有已报销记录' : '还没有补充附件的记录'}</span>
            ${s.id === 'pending' ? '<button type="button" class="rb-empty-btn" data-rb="new">新建第一笔 ' + ICON.plus + '</button>' : '<small>可将卡片拖拽至此列</small>'}
          </div>
        </div>
      </section>
    `).join('');

    const shell = document.createElement('div');
    shell.className = 'rboard';
    shell.id = 'reimburseBoard';
    shell.setAttribute('aria-hidden', 'true');
    shell.innerHTML = `
      <div class="rb-shell">
        <header class="rb-top">
          <div class="rb-brand">
            <div class="rb-mark">G</div>
            <div class="rb-brand-copy">
              <div class="rb-brand-name">GOODWORK <span>古德車房</span></div>
              <div class="rb-brand-sub">FINANCE OS · REIMBURSEMENT WORKSPACE</div>
            </div>
          </div>
          <div class="rb-day-nav">
            <button type="button" class="rb-icon-btn" data-rb="prev-day" aria-label="前一天">${ICON.chevronLeft}</button>
            <label class="rb-day-field">
              <span id="rbDayKicker">今天 / TODAY</span>
              <input type="date" id="rbViewDate" aria-label="选择报销日期" />
            </label>
            <button type="button" class="rb-icon-btn" data-rb="next-day" aria-label="后一天">${ICON.chevronRight}</button>
            <button type="button" class="rb-today-btn" data-rb="today">回到今天</button>
          </div>
          <div class="rb-top-actions">
            <button type="button" class="rb-cloud-btn" data-rb="cloud" id="rbCloudBtn" title="腾讯云开发 · 多设备同步">
              ${ICON.cloud}<span id="rbCloudLabel">云同步</span><i class="rb-cloud-dot" id="rbCloudDot"></i>
            </button>
            <button type="button" class="rb-invoice-btn" data-rb="invoice" title="发票追踪 · 自动抓取已报销中有发票的记录">
              ${ICON.invoice}<span>发票追踪</span><b class="rb-inv-badge" id="rbInvoiceBadge">0</b>
            </button>
            <button type="button" class="rb-new-btn" data-rb="new">${ICON.plus}<span>新增报销</span></button>
            <button type="button" class="rb-back-btn" data-rb="close">${ICON.back}<span>返回场景</span></button>
          </div>
        </header>

        <section class="rb-processed" id="rbProcessed">
          <div class="rb-processed-main">
            <span class="rb-processed-kicker"><i></i>TODAY PROCESSED · 当日已处理待报销</span>
            <div class="rb-processed-value">
              <b id="rbProcessedAmount">¥0.00</b>
              <span id="rbProcessedCount">0 笔</span>
            </div>
          </div>
          <div class="rb-processed-list" id="rbProcessedList"></div>
          <button type="button" class="rb-btn ghost rb-processed-export" data-rb="processed-export" id="rbProcessedExport">
            ${ICON.excel}<span>导出本月日报</span>
          </button>
        </section>

        <section class="rb-hero">
          <div class="rb-hero-main">
            <div class="rb-eyebrow"><i></i><span id="rbHeroEyebrow">今日未完成报销 / UNFINISHED</span></div>
            <div class="rb-pct-wrap">
              <span class="rb-pct" id="rbPct">0.0</span><em class="rb-pct-sign">%</em>
            </div>
            <div class="rb-pct-label">未完成报销 <span id="rbHeroScope">待报销金额 / 当日总金额</span></div>
            <div class="rb-mini-row">
              <span><b id="rbHeroCount">0</b> 笔申请</span>
              <span><b id="rbHeroInvoice">0%</b> 有发票</span>
              <span><b id="rbHeroHigh">0</b> 笔高额配件</span>
              <span><b id="rbHeroFiles">0</b> 个附件</span>
            </div>
          </div>

          <div class="rb-hero-progress">
            <div class="rb-progress-head">
              <span id="rbHeroComposition">今日报销构成</span>
              <b id="rbHeroTotal">¥0.00</b>
            </div>
            <div class="rb-progress" id="rbProgress" aria-label="今日报销金额分段进度">
              <i class="rb-seg rb-seg--pending" data-seg="pending"></i>
              <i class="rb-seg rb-seg--reimbursed" data-seg="reimbursed"></i>
              <i class="rb-seg rb-seg--supplemented" data-seg="supplemented"></i>
            </div>
            <div class="rb-legend" id="rbLegend"></div>
            <div class="rb-progress-foot">
              <span>卡片可在三列间拖拽流转</span>
              <span>数据自动保存于本机</span>
            </div>
          </div>

          <div class="rb-export-card">
            <div class="rb-export-head">
              <span class="rb-export-kicker">EXPORT / 导出</span>
              <span class="rb-export-range-hint" id="rbExportHint">0 笔 · ¥0.00</span>
            </div>
            <div class="rb-range">
              <input type="date" id="rbExportStart" aria-label="导出开始日期" />
              <span>至</span>
              <input type="date" id="rbExportEnd" aria-label="导出结束日期" />
            </div>
            <div class="rb-presets">
              <button type="button" data-preset="today">今天</button>
              <button type="button" data-preset="week">本周</button>
              <button type="button" data-preset="month">本月</button>
              <button type="button" data-preset="all">全部</button>
            </div>
            <div class="rb-export-actions">
              <button type="button" class="rb-btn ghost" data-rb="report">${ICON.report}<span>统计报告</span></button>
              <button type="button" class="rb-btn primary" data-rb="export">${ICON.excel}<span>导出 Excel</span></button>
            </div>
            <div class="rb-folder-row">
              <div class="rb-folder-info">
                <span class="rb-folder-icon">${ICON.folder}</span>
                <div>
                  <b>D:\\${VOUCHER_FOLDER}</b>
                  <span id="rbFolderStatus">正在检查凭证文件夹…</span>
                </div>
              </div>
              <button type="button" class="rb-folder-btn" data-rb="folder">绑定</button>
            </div>
          </div>
        </section>

        <section class="rb-filterbar" id="rbFilterBar" aria-label="报销筛选查询">
          <div class="rb-filter-lead">
            <span>QUERY</span>
            <b>筛选查询</b>
          </div>
          <label class="rb-filter-field">
            <span>申请人</span>
            <select id="rbFilterApplicant" aria-label="按申请人筛选"></select>
          </label>
          <label class="rb-filter-field">
            <span>是否有发票</span>
            <select id="rbFilterInvoice" aria-label="按是否有发票筛选">
              <option value="all">全部</option>
              <option value="yes">有发票</option>
              <option value="no">无发票</option>
            </select>
          </label>
          <div class="rb-filter-field rb-filter-date">
            <span>申请日期</span>
            <div class="rb-filter-range">
              <input type="date" id="rbFilterStart" aria-label="申请日期开始" />
              <em>→</em>
              <input type="date" id="rbFilterEnd" aria-label="申请日期结束" />
            </div>
          </div>
          <div class="rb-filter-actions">
            <button type="button" class="rb-filter-chip" data-rb="filter-today">今天</button>
            <button type="button" class="rb-filter-chip" data-rb="filter-month">本月</button>
            <button type="button" class="rb-filter-chip" data-rb="filter-reset">重置</button>
          </div>
          <span class="rb-filter-result" id="rbFilterResult">0 笔</span>
        </section>

        <main class="rb-kanban" id="rbKanban">${statusColumns}</main>

        <footer class="rb-bottom">
          <div class="rb-total rb-total--pending">
            <span>待报销总额</span>
            <b id="rbTotalPending">¥0.00</b>
            <small>PENDING</small>
          </div>
          <div class="rb-total rb-total--reimbursed">
            <span>已报销总额</span>
            <b id="rbTotalReimbursed">¥0.00</b>
            <small>REIMBURSED</small>
          </div>
          <div class="rb-total rb-total--supplemented">
            <span>已补充附件</span>
            <b id="rbTotalSupplemented">¥0.00</b>
            <small>SUPPLEMENTED</small>
          </div>
          <div class="rb-bottom-note">
            <span class="rb-live-dot"></span>
            本地自动保存 · 附件会同步至已授权的凭证文件夹
          </div>
        </footer>
      </div>

      <div class="rb-drawer-scrim" id="rbDrawerScrim"></div>
      <aside class="rb-drawer" id="rbDrawer" aria-hidden="true">
        <form class="rb-form" id="rbTaskForm" novalidate>
          <header class="rb-drawer-head">
            <div>
              <span class="rb-export-kicker" id="rbDrawerKicker">NEW / 新建</span>
              <h2 id="rbDrawerTitle">新增报销申请</h2>
            </div>
            <button type="button" class="rb-icon-btn" data-rb="drawer-close" aria-label="关闭">${ICON.close}</button>
          </header>
          <div class="rb-drawer-body" id="rbDrawerBody"></div>
          <footer class="rb-drawer-foot" id="rbDrawerFoot">
            <button type="button" class="rb-btn ghost" data-rb="drawer-close">取消</button>
            <button type="submit" class="rb-btn primary" id="rbSaveBtn">保存报销</button>
          </footer>
        </form>
      </aside>

      <div class="rb-modal rb-report-modal" id="rbReportModal" aria-hidden="true">
        <div class="rb-report-sheet">
          <header class="rb-report-head">
            <div>
              <span class="rb-export-kicker">STATISTICS REPORT</span>
              <h2>报销统计报告</h2>
              <p id="rbReportRange"></p>
            </div>
            <div class="rb-report-head-actions">
              <button type="button" class="rb-btn ghost" data-rb="statement">${ICON.report}<span>月度财务报表</span></button>
              <button type="button" class="rb-btn ghost" data-rb="report-export">${ICON.excel}<span>导出 Excel</span></button>
              <button type="button" class="rb-icon-btn" data-rb="report-close" aria-label="关闭报告">${ICON.close}</button>
            </div>
          </header>
          <div class="rb-report-body" id="rbReportBody"></div>
        </div>
      </div>

      <div class="rb-modal rb-invoice-modal" id="rbInvoiceModal" aria-hidden="true">
        <div class="rb-invoice-sheet">
          <header class="rb-report-head">
            <div>
              <span class="rb-export-kicker">INVOICE TRACKING</span>
              <h2>发票追踪</h2>
              <p id="rbInvoiceMeta"></p>
            </div>
            <div class="rb-report-head-actions">
              <button type="button" class="rb-icon-btn" data-rb="invoice-close" aria-label="关闭发票追踪">${ICON.close}</button>
            </div>
          </header>
          <div class="rb-invoice-tabs">
            <button type="button" class="rb-invoice-tab is-active" data-rb="invoice-tab" data-tab="pending">
              未取得发票 <b id="rbInvoicePendingCount">0</b>
            </button>
            <button type="button" class="rb-invoice-tab" data-rb="invoice-tab" data-tab="received">
              已取得发票 <b id="rbInvoiceReceivedCount">0</b>
            </button>
          </div>
          <div class="rb-invoice-filters">
            <label class="rb-filter-field">
              <span>申请人</span>
              <select id="rbInvoiceApplicant" aria-label="按申请人筛选发票"></select>
            </label>
            <div class="rb-filter-field rb-filter-date">
              <span>时间范围</span>
              <div class="rb-filter-range">
                <input type="date" id="rbInvoiceStart" aria-label="发票记录开始日期" />
                <em>→</em>
                <input type="date" id="rbInvoiceEnd" aria-label="发票记录结束日期" />
              </div>
            </div>
            <button type="button" class="rb-filter-chip" data-rb="invoice-reset">重置筛选</button>
          </div>
          <div class="rb-invoice-body" id="rbInvoiceBody"></div>
        </div>
      </div>

      <div class="rb-modal rb-statement-modal" id="rbStatementModal" aria-hidden="true">
        <div class="rb-statement-sheet">
          <header class="rb-report-head">
            <div>
              <span class="rb-export-kicker">MONTHLY FINANCIAL STATEMENT</span>
              <h2>月度财务报表</h2>
              <p id="rbStatementMeta"></p>
            </div>
            <div class="rb-report-head-actions">
              <label class="rb-month-picker">
                <span>编制月份</span>
                <input type="month" id="rbStatementMonth" aria-label="选择报表月份" />
              </label>
              <button type="button" class="rb-btn primary" data-rb="statement-export">${ICON.excel}<span>导出 Excel</span></button>
              <button type="button" class="rb-icon-btn" data-rb="statement-close" aria-label="关闭月度财务报表">${ICON.close}</button>
            </div>
          </header>
          <div class="rb-statement-body" id="rbStatementBody"></div>
        </div>
      </div>

      <div class="rb-modal rb-cloud-modal" id="rbCloudModal" aria-hidden="true">
        <div class="rb-cloud-sheet">
          <header class="rb-report-head">
            <div>
              <span class="rb-export-kicker">TENCENT CLOUDBASE SYNC</span>
              <h2>腾讯云开发同步</h2>
              <p id="rbCloudMeta">团队共享一个工作区 · 多设备自动实时同步</p>
            </div>
            <div class="rb-report-head-actions">
              <span class="rb-cloud-status" id="rbCloudStatus">未配置</span>
              <button type="button" class="rb-icon-btn" data-rb="cloud-close" aria-label="关闭云同步设置">${ICON.close}</button>
            </div>
          </header>
          <div class="rb-cloud-body">
            <section class="rb-cloud-section">
              <div class="rb-cloud-section-head">
                <span>01</span>
                <div><h3>一键连接云开发</h3><p>使用匿名登录，无需账号密码。所有设备连接同一个环境即可共享工作区。</p></div>
              </div>
              <label class="rb-field rb-cloud-field">
                <span>云开发环境 ID <em>ENV ID</em></span>
                <input id="rbCloudEnv" placeholder="attractive-starfish-d0bp2e865971" autocomplete="off" />
              </label>
              <div class="rb-cloud-actions">
                <button type="button" class="rb-btn primary" data-rb="cloud-connect" id="rbCloudConnectBtn">${ICON.cloud}<span>连接云开发</span></button>
                <button type="button" class="rb-btn ghost" data-rb="cloud-disconnect" id="rbCloudDisconnectBtn">断开连接</button>
              </div>
              <p class="rb-cloud-hint">首次连接会在云端自动创建工作区；之后每台设备都点同一个「连接云开发」即可同步。</p>
              <div class="rb-cloud-message" id="rbCloudMessage"></div>
            </section>

            <section class="rb-cloud-section">
              <div class="rb-cloud-section-head">
                <span>02</span>
                <div><h3>同步控制</h3><p>自动同步会在修改后约 1.5 秒上传，并监听其他设备的变化。</p></div>
              </div>
              <div class="rb-cloud-sync-row">
                <label class="rb-cloud-switch">
                  <input type="checkbox" id="rbCloudAuto" checked />
                  <span>自动实时同步</span>
                </label>
                <span class="rb-cloud-last" id="rbCloudLast">尚未同步</span>
              </div>
              <div class="rb-cloud-actions">
                <button type="button" class="rb-btn ghost" data-rb="cloud-upload">${ICON.drop}<span>上传本机到云端</span></button>
                <button type="button" class="rb-btn ghost" data-rb="cloud-download">${ICON.cloud}<span>从云端拉取</span></button>
                <button type="button" class="rb-btn ghost" data-rb="cloud-attachments">${ICON.paperclip}<span>同步附件</span></button>
              </div>
              <p class="rb-cloud-hint">本机数据始终保留；云同步只负责让多台设备看到同一份工作区。</p>
            </section>

            <section class="rb-cloud-section">
              <div class="rb-cloud-section-head">
                <span>03</span>
                <div><h3>云开发配置清单</h3><p>首次使用需要先在腾讯云开发控制台完成以下配置。</p></div>
              </div>
              <ol class="rb-cloud-steps">
                <li>环境 ID 已预填为 <code>attractive-starfish-d0bp2e865971</code>；如使用其他环境，直接替换上方 ID。</li>
                <li>在「登录授权」中开启「匿名登录」（本版本免账号密码）。</li>
                <li>创建数据库集合 <code>goodwork_workspaces</code>，权限选「<strong>所有用户可读，仅创建者可写</strong>」或自定义安全规则允许匿名用户读写 <code>_id === 'team'</code> 的文档。</li>
                <li>开启云存储；附件会保存到 <code>goodwork/team/</code>。</li>
                <li>在「安全域名」中加入当前站点：<code id="rbCloudDomain"></code>。</li>
              </ol>
              <p class="rb-cloud-hint">所有设备通过匿名登录共享同一个 <code>goodwork_workspaces.team</code> 文档，自动实时同步。本机数据始终保留，离线时仍可继续使用。</p>
            </section>
          </div>
          <footer class="rb-cloud-foot">
            <span>数据会同时保存在本机与云开发，离线时仍可继续使用。</span>
            <button type="button" class="rb-btn ghost" data-rb="cloud-close">关闭</button>
          </footer>
        </div>
      </div>

      <div class="rb-modal rb-confirm-modal" id="rbConfirmModal" aria-hidden="true">
        <div class="rb-confirm-card">
          <span class="rb-confirm-icon">${ICON.trash}</span>
          <h3>删除这条报销记录？</h3>
          <p id="rbConfirmText"></p>
          <div class="rb-confirm-actions">
            <button type="button" class="rb-btn ghost" data-rb="confirm-cancel">取消</button>
            <button type="button" class="rb-btn danger" data-rb="confirm-delete">确认删除</button>
          </div>
        </div>
      </div>

      <div class="rb-modal rb-preview-modal" id="rbPreviewModal" aria-hidden="true">
        <div class="rb-preview-card">
          <button type="button" class="rb-icon-btn" data-rb="preview-close" aria-label="关闭预览">${ICON.close}</button>
          <div class="rb-preview-content" id="rbPreviewContent"></div>
        </div>
      </div>
    `;
    document.body.appendChild(shell);
    this.root = shell;
    this.el = {
      shell: $('.rb-shell', shell),
      viewDate: $('#rbViewDate', shell),
      dayKicker: $('#rbDayKicker', shell),
      pct: $('#rbPct', shell),
      heroCount: $('#rbHeroCount', shell),
      heroInvoice: $('#rbHeroInvoice', shell),
      heroHigh: $('#rbHeroHigh', shell),
      heroFiles: $('#rbHeroFiles', shell),
      heroTotal: $('#rbHeroTotal', shell),
      legend: $('#rbLegend', shell),
      progress: $('#rbProgress', shell),
      exportStart: $('#rbExportStart', shell),
      exportEnd: $('#rbExportEnd', shell),
      exportHint: $('#rbExportHint', shell),
      folderStatus: $('#rbFolderStatus', shell),
      folderBtn: $('.rb-folder-btn', shell),
      totalPending: $('#rbTotalPending', shell),
      totalReimbursed: $('#rbTotalReimbursed', shell),
      totalSupplemented: $('#rbTotalSupplemented', shell),
      drawer: $('#rbDrawer', shell),
      drawerScrim: $('#rbDrawerScrim', shell),
      drawerBody: $('#rbDrawerBody', shell),
      drawerTitle: $('#rbDrawerTitle', shell),
      drawerKicker: $('#rbDrawerKicker', shell),
      form: $('#rbTaskForm', shell),
      saveBtn: $('#rbSaveBtn', shell),
      report: $('#rbReportModal', shell),
      reportBody: $('#rbReportBody', shell),
      reportRange: $('#rbReportRange', shell),
      confirm: $('#rbConfirmModal', shell),
      confirmText: $('#rbConfirmText', shell),
      preview: $('#rbPreviewModal', shell),
      previewContent: $('#rbPreviewContent', shell),
      heroEyebrow: $('#rbHeroEyebrow', shell),
      heroScope: $('#rbHeroScope', shell),
      heroComposition: $('#rbHeroComposition', shell),
      processedAmount: $('#rbProcessedAmount', shell),
      processedCount: $('#rbProcessedCount', shell),
      processedList: $('#rbProcessedList', shell),
      processedExport: $('#rbProcessedExport', shell),
      invoiceBadge: $('#rbInvoiceBadge', shell),
      filterBar: $('#rbFilterBar', shell),
      filterApplicantEl: $('#rbFilterApplicant', shell),
      filterInvoiceEl: $('#rbFilterInvoice', shell),
      filterStartEl: $('#rbFilterStart', shell),
      filterEndEl: $('#rbFilterEnd', shell),
      filterResult: $('#rbFilterResult', shell),
      invoice: $('#rbInvoiceModal', shell),
      invoiceMeta: $('#rbInvoiceMeta', shell),
      invoiceApplicantEl: $('#rbInvoiceApplicant', shell),
      invoiceStartEl: $('#rbInvoiceStart', shell),
      invoiceEndEl: $('#rbInvoiceEnd', shell),
      invoiceBody: $('#rbInvoiceBody', shell),
      invoicePendingCount: $('#rbInvoicePendingCount', shell),
      invoiceReceivedCount: $('#rbInvoiceReceivedCount', shell),
      statement: $('#rbStatementModal', shell),
      statementMonthEl: $('#rbStatementMonth', shell),
      statementMeta: $('#rbStatementMeta', shell),
      statementBody: $('#rbStatementBody', shell),
      cloudBtn: $('#rbCloudBtn', shell),
      cloudLabel: $('#rbCloudLabel', shell),
      cloudDot: $('#rbCloudDot', shell),
      cloud: $('#rbCloudModal', shell),
      cloudMeta: $('#rbCloudMeta', shell),
      cloudStatus: $('#rbCloudStatus', shell),
      cloudEnv: $('#rbCloudEnv', shell),
      cloudAuto: $('#rbCloudAuto', shell),
      cloudLast: $('#rbCloudLast', shell),
      cloudMessage: $('#rbCloudMessage', shell),
      cloudDomain: $('#rbCloudDomain', shell),
      cloudConnectBtn: $('#rbCloudConnectBtn', shell),
      cloudDisconnectBtn: $('#rbCloudDisconnectBtn', shell),
    };
    this.cardRects = new Map();
  }

  _bind() {
    // 看板 / 导出 / 弹层通用动作
    this.root.addEventListener('click', (e) => {
      const actionEl = e.target.closest('[data-rb]');
      if (actionEl) {
        e.preventDefault();
        this.handleAction(actionEl.dataset.rb, actionEl);
        return;
      }
      const preset = e.target.closest('[data-preset]');
      if (preset) {
        e.preventDefault();
        this.applyPreset(preset.dataset.preset);
        return;
      }
      const removeAttach = e.target.closest('[data-remove-attach]');
      if (removeAttach) {
        e.preventDefault();
        this.removeDraftAttachment(removeAttach.dataset.removeAttach, removeAttach.dataset.origin);
        return;
      }
      const downloadAttach = e.target.closest('[data-download-attach]');
      if (downloadAttach) {
        e.preventDefault();
        this.downloadAttachment(downloadAttach.dataset.downloadAttach);
        return;
      }
      // 点击卡片主体折叠 / 展开
      if (!this.suppressClick) {
        const card = e.target.closest('.rb-card');
        if (card && !e.target.closest('button, a, input, select, textarea')) {
          this.toggleCardById(card.dataset.id);
        }
      }
    });

    this.el.viewDate.addEventListener('change', () => {
      if (!this.el.viewDate.value) return;
      this.viewDate = this.el.viewDate.value;
      this.filterStart = this.viewDate;
      this.filterEnd = this.viewDate;
      this.renderAll();
    });

    const rerenderFiltered = () => {
      const before = this.captureCardRects();
      this.renderAll({ fromRects: before });
    };
    this.el.filterApplicantEl.addEventListener('change', () => {
      this.filterApplicant = this.el.filterApplicantEl.value || 'all';
      rerenderFiltered();
    });
    this.el.filterInvoiceEl.addEventListener('change', () => {
      this.filterInvoice = this.el.filterInvoiceEl.value || 'all';
      rerenderFiltered();
    });
    this.el.filterStartEl.addEventListener('change', () => {
      this.filterStart = this.el.filterStartEl.value || this.viewDate;
      if (this.filterEnd && this.filterStart > this.filterEnd) this.filterEnd = this.filterStart;
      rerenderFiltered();
    });
    this.el.filterEndEl.addEventListener('change', () => {
      this.filterEnd = this.el.filterEndEl.value || this.filterStart || this.viewDate;
      if (this.filterStart && this.filterStart > this.filterEnd) this.filterStart = this.filterEnd;
      rerenderFiltered();
    });

    this.el.invoiceApplicantEl.addEventListener('change', () => {
      this.invoiceFilterApplicant = this.el.invoiceApplicantEl.value || 'all';
      this.renderInvoice();
    });
    this.el.invoiceStartEl.addEventListener('change', () => {
      this.invoiceFilterStart = this.el.invoiceStartEl.value || '';
      this.renderInvoice();
    });
    this.el.invoiceEndEl.addEventListener('change', () => {
      this.invoiceFilterEnd = this.el.invoiceEndEl.value || '';
      this.renderInvoice();
    });
    this.el.statementMonthEl.addEventListener('change', () => {
      this.statementMonth = this.el.statementMonthEl.value || currentMonthValue();
      this.renderStatement();
    });

    this.el.cloudAuto.addEventListener('change', () => {
      this.cloud?.setAutoSync(this.el.cloudAuto.checked);
      this.renderCloudSettings();
    });

    this.el.cloudEnv.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        this.cloudConnect();
      }
    });

    this.el.exportStart.addEventListener('change', () => {
      this.exportStart = this.el.exportStart.value || monthStartKey();
      this.persistSettings();
      this.renderExportMeta();
    });
    this.el.exportEnd.addEventListener('change', () => {
      this.exportEnd = this.el.exportEnd.value || toDateKey();
      this.persistSettings();
      this.renderExportMeta();
    });

    this.el.drawerScrim.addEventListener('click', () => this.closeDrawer());

    // 表单字段
    this.el.form.addEventListener('input', (e) => this.onFormInput(e));
    this.el.form.addEventListener('change', (e) => this.onFormChange(e));
    this.el.form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.saveDrawer();
    });
    this.el.form.addEventListener('click', (e) => {
      const toggle = e.target.closest('[data-toggle-field]');
      if (toggle) {
        e.preventDefault();
        this.setDraftToggle(toggle.dataset.toggleField, toggle.dataset.toggleValue === 'true');
        return;
      }
      if (e.target.closest('[data-rb="add-files"]')) {
        e.preventDefault();
        $('#rbFileInput', this.el.form)?.click();
        return;
      }
      if (e.target.closest('[data-rb="drawer-close"]')) {
        e.preventDefault();
        this.closeDrawer();
      }
    });
    this.el.form.addEventListener('change', (e) => {
      if (e.target.id === 'rbFileInput') {
        this.addFiles(e.target.files);
        e.target.value = '';
      }
    });
    const drop = this.el.drawerBody;
    drop.addEventListener('dragover', (e) => {
      if (!e.target.closest('.rb-drop')) return;
      e.preventDefault();
      e.target.closest('.rb-drop')?.classList.add('is-dragover');
    });
    drop.addEventListener('dragleave', (e) => {
      e.target.closest('.rb-drop')?.classList.remove('is-dragover');
    });
    drop.addEventListener('drop', (e) => {
      const zone = e.target.closest('.rb-drop');
      if (!zone) return;
      e.preventDefault();
      zone.classList.remove('is-dragover');
      if (e.dataTransfer?.files?.length) this.addFiles(e.dataTransfer.files);
    });

    // 卡片拖拽
    this.root.addEventListener('pointerdown', (e) => this.onCardPointerDown(e));
    document.addEventListener('keydown', (e) => {
      if (!this.openFlag) return;
      if ((e.key === 'Enter' || e.key === ' ') && e.target?.classList?.contains('rb-card')) {
        e.preventDefault();
        this.toggleCardById(e.target.dataset.id);
        return;
      }
      if (e.key !== 'Escape') return;
      if (this.cloudOpen) { this.closeCloudModal(); return; }
      if (this.statementOpen) { this.closeStatement(); return; }
      if (this.invoiceOpen) { this.closeInvoice(); return; }
      if ($('#rbPreviewModal', this.root).classList.contains('is-open')) { this.closePreview(); return; }
      if (this.el.confirm.classList.contains('is-open')) { this.closeConfirm(); return; }
      if (this.reportOpen) { this.closeReport(); return; }
      if (this.drawerOpen) { this.closeDrawer(); return; }
      this.close();
    });
  }

  /* ---------------- 打开 / 关闭 ---------------- */

  open() {
    if (this.openFlag) return;
    this.openFlag = true;
    this.closing = false;
    this.viewDate = toDateKey();
    this.filterStart = this.viewDate;
    this.filterEnd = this.viewDate;
    this.filterApplicant = 'all';
    this.filterInvoice = 'all';
    this.lastPct = 0;
    this.lastProcessedTotal = -1;
    this.renderAll({ animate: false });
    this.el.shell.scrollTop = 0;
    this.root.classList.add('is-open');
    this.root.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-reimburse');
    requestAnimationFrame(() => {
      this.root.classList.add('is-visible');
      this.animatePercentage();
    });
  }

  close() {
    if (!this.openFlag || this.closing) return;
    this.closing = true;
    this.closeDrawer(true);
    this.closeReport(true);
    this.closeStatement(true);
    this.closeInvoice(true);
    this.closeCloudModal(true);
    this.closeConfirm(true);
    this.cancelDrag();
    this.root.classList.remove('is-visible');
    this.root.classList.add('is-closing');
    setTimeout(() => {
      this.root.classList.remove('is-open', 'is-closing');
      this.root.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('is-reimburse');
      this.openFlag = false;
      this.closing = false;
      this.onClose();
    }, 420);
  }

  isOpen() { return this.openFlag; }

  handleAction(action, el) {
    switch (action) {
      case 'close': this.close(); break;
      case 'new': this.openDrawer(); break;
      case 'prev-day':
        this.viewDate = addDays(this.viewDate, -1);
        this.filterStart = this.viewDate;
        this.filterEnd = this.viewDate;
        this.renderAll();
        break;
      case 'next-day':
        this.viewDate = addDays(this.viewDate, 1);
        this.filterStart = this.viewDate;
        this.filterEnd = this.viewDate;
        this.renderAll();
        break;
      case 'today':
        this.viewDate = toDateKey();
        this.filterStart = this.viewDate;
        this.filterEnd = this.viewDate;
        this.renderAll();
        break;
      case 'filter-today':
        this.viewDate = toDateKey();
        this.filterStart = this.viewDate;
        this.filterEnd = this.viewDate;
        this.renderAll();
        break;
      case 'filter-month':
        this.filterStart = monthStartKey();
        this.filterEnd = toDateKey();
        this.renderAll();
        break;
      case 'filter-reset':
        this.filterApplicant = 'all';
        this.filterInvoice = 'all';
        this.viewDate = toDateKey();
        this.filterStart = this.viewDate;
        this.filterEnd = this.viewDate;
        this.renderAll();
        break;
      case 'toggle-card': this.toggleCardById(el.dataset.id); break;
      case 'edit-task': this.openDrawer(el.dataset.id); break;
      case 'delete-task': this.openDeleteConfirm(el.dataset.id); break;
      case 'drawer-close': this.closeDrawer(); break;
      case 'report': this.openReport(); break;
      case 'report-close': this.closeReport(); break;
      case 'report-export': this.exportExcel(true); break;
      case 'statement': this.openStatement(); break;
      case 'statement-close': this.closeStatement(); break;
      case 'statement-export': this.exportStatement(); break;
      case 'cloud': this.openCloudModal(); break;
      case 'cloud-close': this.closeCloudModal(); break;
      case 'cloud-connect': this.cloudConnect(); break;
      case 'cloud-disconnect': this.cloudDisconnect(); break;
      case 'cloud-upload': this.cloudUpload(); break;
      case 'cloud-download': this.cloudDownload(); break;
      case 'cloud-attachments': this.cloudSyncAttachments(); break;
      case 'processed-export': this.exportProcessed(); break;
      case 'invoice': this.openInvoice(); break;
      case 'invoice-close': this.closeInvoice(); break;
      case 'invoice-tab':
        this.invoiceTab = el.dataset.tab === 'received' ? 'received' : 'pending';
        $$('.rb-invoice-tab', this.root).forEach((b) => b.classList.toggle('is-active', b.dataset.tab === this.invoiceTab));
        this.renderInvoice();
        break;
      case 'invoice-reset':
        this.invoiceFilterApplicant = 'all';
        this.invoiceFilterStart = '';
        this.invoiceFilterEnd = '';
        this.renderInvoice();
        break;
      case 'invoice-mark': this.markInvoiceReceived(el.dataset.id); break;
      case 'export': this.exportExcel(false); break;
      case 'folder': this.folderAction(); break;
      case 'confirm-cancel': this.closeConfirm(); break;
      case 'confirm-delete': this.confirmDelete(); break;
      case 'preview-close': this.closePreview(); break;
      case 'remove-attach': break;
      default: break;
    }
  }

  /* ---------------- 渲染：整体 ---------------- */

  filtersActive() {
    return this.filterApplicant !== 'all'
      || this.filterInvoice !== 'all'
      || this.filterStart !== this.filterEnd
      || this.filterStart !== this.viewDate;
  }

  scopeLabel() {
    const today = toDateKey();
    if (this.filterStart === this.filterEnd) {
      return this.filterStart === today ? '今日' : `${this.filterStart}`;
    }
    if (this.filterStart === monthStartKey() && this.filterEnd === today) return '本月';
    return '筛选范围';
  }

  dayTasks() {
    return this.tasks.filter((t) => {
      const key = dateKeyOf(t.appliedAt);
      if (this.filterStart && key < this.filterStart) return false;
      if (this.filterEnd && key > this.filterEnd) return false;
      if (this.filterApplicant !== 'all' && t.applicant !== this.filterApplicant) return false;
      if (this.filterInvoice === 'yes' && !t.hasInvoice) return false;
      if (this.filterInvoice === 'no' && t.hasInvoice) return false;
      return true;
    });
  }

  tasksByStatus(status) {
    return this.dayTasks()
      .filter((t) => t.status === status)
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0) || String(a.createdAt).localeCompare(String(b.createdAt)));
  }

  captureCardRects() {
    const map = new Map();
    $$('.rb-card', this.root).forEach((card) => {
      map.set(card.dataset.id, card.getBoundingClientRect());
    });
    return map;
  }

  renderAll({ animate = true, fromRects = null } = {}) {
    const previous = fromRects || (animate ? this.captureCardRects() : new Map());
    this.el.viewDate.value = this.viewDate;
    const scope = this.scopeLabel();
    this.el.dayKicker.textContent = this.filtersActive()
      ? (scope === '今日' ? '今天 / TODAY' : '筛选范围 / RANGE')
      : (this.viewDate === toDateKey() ? '今天 / TODAY' : '历史日报 / ARCHIVE');
    this.renderFilters();
    this.renderCards(previous);
    this.renderStats();
    this.renderProcessed();
    this.renderInvoiceBadge();
    this.renderExportMeta();
    this.renderFolderStatus();
    if (animate) this.animateNewCards();
  }

  renderFilters() {
    const names = [...new Set(this.tasks.map((t) => t.applicant).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b, 'zh-CN'));
    if (this.filterApplicant !== 'all' && !names.includes(this.filterApplicant)) {
      this.filterApplicant = 'all';
    }
    this.el.filterApplicantEl.innerHTML = [
      '<option value="all">全部申请人</option>',
      ...names.map((n) => `<option value="${esc(n)}">${esc(n)}</option>`),
    ].join('');
    this.el.filterApplicantEl.value = this.filterApplicant;
    this.el.filterInvoiceEl.value = this.filterInvoice;
    this.el.filterStartEl.value = this.filterStart;
    this.el.filterEndEl.value = this.filterEnd;
    const tasks = this.dayTasks();
    const total = tasks.reduce((s, t) => s + t.amount, 0);
    this.el.filterResult.innerHTML = tasks.length
      ? `${this.filterStart}${this.filterStart === this.filterEnd ? '' : ' 至 ' + this.filterEnd} · <b>${tasks.length}</b> 笔 · ¥${money(total)}`
      : `${this.filterStart}${this.filterStart === this.filterEnd ? '' : ' 至 ' + this.filterEnd} · 无匹配记录`;
    this.el.filterBar?.classList.toggle('is-filtered', this.filtersActive());
  }

  renderProcessed() {
    const today = toDateKey();
    const aliveIds = new Set(this.tasks.map((t) => t.id));
    const events = this.processedEvents
      // 🔧 报销已被删除的，不再计入当日已处理金额
      .filter((e) => e.eventDate === today && aliveIds.has(e.taskId))
      .sort((a, b) => String(b.timestamp).localeCompare(String(a.timestamp)));
    const total = events.reduce((s, e) => s + (Number(e.amount) || 0), 0);
    this.el.processedAmount.textContent = `¥${money(total)}`;
    this.el.processedCount.textContent = `${events.length} 笔 · 待报销 → 已报销`;
    this.el.processedList.innerHTML = events.length
      ? events.slice(0, 4).map((e) => `
          <span class="rb-processed-chip">
            <em>${localTimeFromIso(e.timestamp)}</em>
            <b>${esc(e.applicant || '未填写')}</b>
            <i>¥${money(e.amount)}</i>
          </span>`).join('')
      : '<span class="rb-processed-empty">今天还没有「待报销 → 已报销」的流转记录</span>';
    this.el.processedExport.title = `导出 ${currentMonthValue()} 每日已处理待报销金额汇总`;
    if (this.lastProcessedTotal >= 0 && Math.abs(total - this.lastProcessedTotal) > 0.001) {
      this.el.processedAmount.classList.remove('is-bump');
      void this.el.processedAmount.offsetWidth;
      this.el.processedAmount.classList.add('is-bump');
    }
    this.lastProcessedTotal = total;
  }

  invoicePendingTasks() {
    return this.tasks.filter((t) => t.status === 'reimbursed' && t.hasInvoice && !t.invoiceReceived);
  }

  invoiceReceivedTasks() {
    return this.tasks.filter((t) => t.status === 'reimbursed' && t.hasInvoice && t.invoiceReceived);
  }

  renderInvoiceBadge() {
    if (!this.el.invoiceBadge) return;
    const pending = this.invoicePendingTasks().length;
    this.el.invoiceBadge.textContent = String(pending);
    this.el.invoiceBadge.classList.toggle('is-zero', pending === 0);
    if (this.invoiceOpen) this.renderInvoice();
  }

  toggleCardById(id) {
    const task = this.tasks.find((t) => t.id === id);
    const card = $(`.rb-card[data-id="${CSS.escape(id)}"]`, this.root);
    if (!task || !card) return;
    task.collapsed = !task.collapsed;
    this.persistTasks();
    card.classList.toggle('is-collapsed', task.collapsed);
    card.setAttribute('aria-expanded', String(!task.collapsed));
    const btn = $('.rb-card-toggle', card);
    if (btn) btn.setAttribute('aria-label', task.collapsed ? '展开报销详情' : '折叠报销详情');
    if (task.collapsed) {
      card.animate?.(
        [{ boxShadow: '0 0 0 1px rgba(217,255,67,0.18)' }, { boxShadow: '0 0 0 1px rgba(217,255,67,0)' }],
        { duration: 420, easing: 'ease-out' }
      );
    }
  }

  renderCards(previousRects = new Map()) {
    for (const status of STATUS_LIST) {
      const list = $(`[data-cards="${status.id}"]`, this.root);
      const empty = $(`[data-empty="${status.id}"]`, this.root);
      const tasks = this.tasksByStatus(status.id);
      $(`[data-count="${status.id}"]`, this.root).textContent = String(tasks.length);
      $(`[data-sum="${status.id}"]`, this.root).textContent = `¥${money(tasks.reduce((s, t) => s + t.amount, 0))}`;
      list.innerHTML = tasks.map((t) => this.cardHtml(t)).join('');
      empty.classList.toggle('is-visible', tasks.length === 0);
      const emptyLabel = empty.querySelector('span');
      if (emptyLabel) {
        emptyLabel.textContent = this.filtersActive()
          ? '没有符合筛选条件的记录'
          : status.id === 'pending'
            ? '今天还没有待报销申请'
            : status.id === 'reimbursed'
              ? '还没有已报销记录'
              : '还没有补充附件的记录';
      }
    }
    // FLIP 布局动画
    if (previousRects.size) {
      requestAnimationFrame(() => {
        $$('.rb-card', this.root).forEach((card) => {
          const before = previousRects.get(card.dataset.id);
          if (!before) return;
          const after = card.getBoundingClientRect();
          const dx = before.left - after.left;
          const dy = before.top - after.top;
          if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
            card.animate(
              [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0,0)' }],
              { duration: 340, easing: 'cubic-bezier(.22,1,.36,1)' }
            );
          }
        });
      });
    }
  }

  renderStats() {
    const tasks = this.dayTasks();
    const count = tasks.length;
    const sum = (arr) => arr.reduce((s, t) => s + t.amount, 0);
    const pending = tasks.filter((t) => t.status === 'pending');
    const reimbursed = tasks.filter((t) => t.status === 'reimbursed');
    const supplemented = tasks.filter((t) => t.status === 'supplemented');
    const totalAmount = sum(tasks);
    const pendingAmount = sum(pending);
    const reimbursedAmount = sum(reimbursed);
    const supplementAmount = sum(supplemented);
    const pct = totalAmount > 0 ? (pendingAmount / totalAmount) * 100 : 0;
    this.lastPct = pct;
    const scope = this.scopeLabel();
    this.el.heroEyebrow.textContent = `${scope}未完成报销 / UNFINISHED`;
    this.el.heroScope.textContent = `待报销金额 / ${scope}总金额`;
    this.el.heroComposition.textContent = `${scope}报销构成`;
    this.el.pct.textContent = pct.toFixed(1);
    this.el.heroCount.textContent = String(count);
    const invoiceCount = tasks.filter((t) => t.hasInvoice).length;
    this.el.heroInvoice.textContent = count ? `${Math.round(invoiceCount / count * 100)}%` : '0%';
    this.el.heroHigh.textContent = String(tasks.filter((t) => t.highValuePart).length);
    this.el.heroFiles.textContent = String(tasks.reduce((s, t) => s + t.attachments.length, 0));
    this.el.heroTotal.textContent = `¥${money(totalAmount)}`;
    this.el.legend.innerHTML = STATUS_LIST.map((s) => {
      const arr = tasks.filter((t) => t.status === s.id);
      return `<span class="rb-legend-item"><i class="rb-legend-dot rb-legend-dot--${s.id}"></i><b>${s.label}</b><em>${arr.length} 笔</em><strong>¥${money(sum(arr))}</strong></span>`;
    }).join('');
    const segAmounts = { pending: pendingAmount, reimbursed: reimbursedAmount, supplemented: supplementAmount };
    STATUS_LIST.forEach((s) => {
      const seg = $(`[data-seg="${s.id}"]`, this.root);
      if (!seg) return;
      const value = segAmounts[s.id];
      seg.style.flexGrow = String(value > 0 ? value : 0);
      seg.style.minWidth = value > 0 ? '3px' : '0';
      seg.classList.toggle('is-zero', value <= 0);
    });
    this.el.totalPending.textContent = `¥${money(pendingAmount)}`;
    this.el.totalReimbursed.textContent = `¥${money(reimbursedAmount)}`;
    this.el.totalSupplemented.textContent = `¥${money(supplementAmount)}`;
    this.animatePercentage();
  }

  animatePercentage() {
    const target = Number(this.lastPct) || 0;
    const start = Number(this.el.pct.textContent) || 0;
    if (Math.abs(target - start) < 0.05) {
      this.el.pct.textContent = target.toFixed(1);
      return;
    }
    const t0 = performance.now();
    const dur = 520;
    const step = (now) => {
      const k = Math.min(1, (now - t0) / dur);
      const eased = 1 - Math.pow(1 - k, 3);
      this.el.pct.textContent = (start + (target - start) * eased).toFixed(1);
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  animateNewCards() {
    $$('.rb-card', this.root).forEach((card) => {
      if (!card.dataset.justRendered) {
        card.dataset.justRendered = '1';
        card.animate(
          [{ opacity: 0, transform: 'translateY(10px) scale(.985)' }, { opacity: 1, transform: 'none' }],
          { duration: 300, easing: 'cubic-bezier(.22,1,.36,1)' }
        );
      }
    });
  }

  cardHtml(task) {
    const files = task.attachments.length;
    const high = task.highValuePart;
    const invoice = task.hasInvoice;
    const cleanContent = esc(task.content).slice(0, 150);
    const collapsed = !!task.collapsed;
    return `
      <article class="rb-card rb-card--${task.status} ${collapsed ? 'is-collapsed' : ''}" data-id="${esc(task.id)}" data-card-id="${esc(task.id)}" tabindex="0" aria-expanded="${!collapsed}" aria-label="${esc(task.applicant)} ${esc(task.department)} ${money(task.amount)}，点击${collapsed ? '展开' : '折叠'}详情">
        <div class="rb-card-glow"></div>
        <header class="rb-card-top">
          <div class="rb-card-person">
            <span class="rb-avatar">${esc(task.applicant.slice(0, 1) || '?')}</span>
            <div>
              <b>${esc(task.applicant || '未填写')}</b>
              <span>${esc(task.department)} · ${esc(task.category)}</span>
            </div>
          </div>
          <div class="rb-card-amount">¥${money(task.amount)}</div>
          <button type="button" class="rb-drag-handle" data-drag-handle aria-label="拖拽排序">${ICON.grip}</button>
        </header>
        <div class="rb-card-body">
          <div class="rb-card-body-inner">
            <p class="rb-card-content">${cleanContent || '未填写报销内容'}</p>
            <div class="rb-card-badges">
              <span class="rb-badge ${invoice ? 'rb-badge--ok' : 'rb-badge--warn'}">${invoice ? '有发票' : '无发票'}</span>
              ${high ? `<span class="rb-badge rb-badge--high">高额配件成本属性</span>` : ''}
              ${files ? `<span class="rb-badge rb-badge--file">${ICON.paperclip}<span>附件 ${files}</span></span>` : ''}
            </div>
            ${high ? `<div class="rb-high-note">跨月：${task.crossMonth ? '是' : '否'} · 备货成本：${task.stockingCost ? '是' : '否'}</div>` : ''}
          </div>
        </div>
        <footer class="rb-card-foot">
          <span class="rb-card-time">${ICON.invoice}<span>${formatDateTime(task.appliedAt)}</span></span>
          <div class="rb-card-actions">
            <button type="button" class="rb-card-action rb-card-toggle" data-rb="toggle-card" data-id="${esc(task.id)}" aria-label="${collapsed ? '展开报销详情' : '折叠报销详情'}" title="${collapsed ? '展开' : '折叠'}">${ICON.chevronDown}</button>
            <button type="button" class="rb-card-action" data-rb="edit-task" data-id="${esc(task.id)}" aria-label="编辑此报销">${ICON.edit}</button>
            <button type="button" class="rb-card-action danger" data-rb="delete-task" data-id="${esc(task.id)}" aria-label="删除此报销">${ICON.trash}</button>
          </div>
        </footer>
      </article>
    `;
  }

  /* ---------------- 导出时间范围 ---------------- */

  renderExportMeta() {
    this.el.exportStart.value = this.exportStart;
    this.el.exportEnd.value = this.exportEnd;
    const tasks = this.tasks.filter((t) => inRange(t, this.exportStart, this.exportEnd));
    const total = tasks.reduce((s, t) => s + t.amount, 0);
    this.el.exportHint.textContent = `${tasks.length} 笔 · ¥${money(total)}`;
    $$('.rb-presets [data-preset]', this.root).forEach((b) => b.classList.remove('is-active'));
    const today = toDateKey();
    if (this.exportStart === today && this.exportEnd === today) $('[data-preset="today"]', this.root)?.classList.add('is-active');
    else if (this.exportStart === weekStartKey() && this.exportEnd === today) $('[data-preset="week"]', this.root)?.classList.add('is-active');
    else if (this.exportStart === monthStartKey() && this.exportEnd === today) $('[data-preset="month"]', this.root)?.classList.add('is-active');
    const allDates = this.tasks.map((t) => dateKeyOf(t.appliedAt)).sort();
    if (allDates.length && this.exportStart === allDates[0] && this.exportEnd === allDates[allDates.length - 1]) {
      $('[data-preset="all"]', this.root)?.classList.add('is-active');
    }
  }

  applyPreset(preset) {
    const today = toDateKey();
    if (preset === 'today') {
      this.exportStart = today;
      this.exportEnd = today;
    } else if (preset === 'week') {
      this.exportStart = weekStartKey();
      this.exportEnd = today;
    } else if (preset === 'month') {
      this.exportStart = monthStartKey();
      this.exportEnd = today;
    } else if (preset === 'all') {
      const dates = this.tasks.map((t) => dateKeyOf(t.appliedAt)).sort();
      this.exportStart = dates[0] || today;
      this.exportEnd = dates[dates.length - 1] || today;
    }
    this.persistSettings();
    this.renderExportMeta();
  }

  ensureValidRange() {
    if (!this.exportStart || !this.exportEnd) {
      this.toast('请选择完整的时间范围', '导出与统计需要开始日期和结束日期。');
      return false;
    }
    if (this.exportStart > this.exportEnd) {
      this.toast('时间范围不正确', '开始日期不能晚于结束日期。');
      return false;
    }
    return true;
  }

  rangeTasks() {
    return this.tasks
      .filter((t) => inRange(t, this.exportStart, this.exportEnd))
      .sort((a, b) => String(a.appliedAt).localeCompare(String(b.appliedAt)));
  }

  /* ---------------- 新增 / 编辑表单 ---------------- */

  openDrawer(taskId = null) {
    const editing = !!taskId;
    this.drawerMode = editing ? 'edit' : 'create';
    this.editingId = editing ? taskId : null;
    this.draftRemoved = new Set();
    this.revokeDraftPreviews();
    this.draftNewFiles = [];
    if (editing) {
      const task = this.tasks.find((t) => t.id === taskId);
      if (!task) return;
      this.draft = JSON.parse(JSON.stringify(task));
      this.draftExisting = this.draft.attachments.map((a) => ({ ...a }));
      this.draft.attachments = [];
    } else {
      const now = new Date();
      const time = nowTimeValue();
      this.draft = {
        id: uid('GW-RB'),
        applicant: '',
        amount: '',
        department: DEPARTMENTS[0],
        category: DEPT_CATEGORIES[DEPARTMENTS[0]][0],
        appliedAt: `${this.viewDate}T${time}`,
        hasInvoice: true,
        content: '',
        status: 'pending',
        highValuePart: false,
        crossMonth: null,
        stockingCost: null,
        attachments: [],
      };
      this.draftExisting = [];
    }
    this.drawerOpen = true;
    this.el.drawerTitle.textContent = editing ? '编辑报销申请' : '新增报销申请';
    this.el.drawerKicker.textContent = editing ? 'EDIT / 编辑' : 'NEW / 新建';
    this.el.drawerBody.innerHTML = this.drawerHtml();
    this.el.drawer.classList.add('is-open');
    this.el.drawer.setAttribute('aria-hidden', 'false');
    this.el.drawerScrim.classList.add('is-open');
    document.body.classList.add('is-reimburse-drawer');
    this.renderDrawerAttachments();
    this.updateHighValueSection();
    setTimeout(() => $('#rbApplicant', this.el.form)?.focus(), 260);
  }

  closeDrawer(immediate = false) {
    if (!this.drawerOpen) return;
    this.drawerOpen = false;
    this.el.drawer.classList.remove('is-open');
    this.el.drawer.setAttribute('aria-hidden', 'true');
    this.el.drawerScrim.classList.remove('is-open');
    document.body.classList.remove('is-reimburse-drawer');
    this.revokeDraftPreviews();
    this.draftNewFiles = [];
    if (!immediate) this.draft = null;
  }

  drawerHtml() {
    const d = this.draft;
    const deptOptions = DEPARTMENTS.map((x) => `<option value="${esc(x)}" ${d.department === x ? 'selected' : ''}>${esc(x)}</option>`).join('');
    const cats = categoriesFor(d.department);
    if (!cats.includes(d.category)) d.category = cats[0];
    const catOptions = cats.map((x) => `<option value="${esc(x)}" ${d.category === x ? 'selected' : ''}>${esc(x)}</option>`).join('');
    const statusOptions = STATUS_LIST.map((s) => `<option value="${s.id}" ${d.status === s.id ? 'selected' : ''}>${s.label}</option>`).join('');
    const employeeList = [...new Set([...EMPLOYEE_NAMES, ...this.tasks.map((t) => t.applicant)])].filter(Boolean);
    return `
      <div class="rb-form-grid">
        <label class="rb-field">
          <span>报销人员 <em>APPLICANT</em></span>
          <input id="rbApplicant" name="applicant" value="${esc(d.applicant)}" placeholder="输入姓名" list="rbEmployeeList" autocomplete="off" />
          <datalist id="rbEmployeeList">${employeeList.map((n) => `<option value="${esc(n)}"></option>`).join('')}</datalist>
        </label>
        <label class="rb-field">
          <span>金额 <em>AMOUNT</em></span>
          <div class="rb-amount-input"><i>¥</i><input id="rbAmount" name="amount" type="number" min="0" step="0.01" value="${d.amount === '' ? '' : Number(d.amount).toFixed(2)}" placeholder="0.00" /></div>
        </label>
        <label class="rb-field">
          <span>部门 <em>DEPARTMENT</em></span>
          <select id="rbDepartment" name="department">${deptOptions}</select>
        </label>
        <label class="rb-field">
          <span>报销分类 <em>CATEGORY</em></span>
          <select id="rbCategory" name="category">${catOptions}</select>
        </label>
        <label class="rb-field">
          <span>申请时间 <em>APPLIED AT</em></span>
          <input id="rbAppliedAt" name="appliedAt" type="datetime-local" value="${esc(String(d.appliedAt).slice(0, 16))}" />
        </label>
        <label class="rb-field">
          <span>是否有发票 <em>INVOICE</em></span>
          <div class="rb-toggle" role="group" aria-label="是否有发票">
            <button type="button" class="${d.hasInvoice ? 'is-active' : ''}" data-toggle-field="hasInvoice" data-toggle-value="true">有发票</button>
            <button type="button" class="${!d.hasInvoice ? 'is-active' : ''}" data-toggle-field="hasInvoice" data-toggle-value="false">无发票</button>
          </div>
        </label>
      </div>

      <div class="rb-section-label"><span>01</span><h4>报销内容 / DETAILS</h4></div>
      <label class="rb-field">
        <span>内容 <em>DESCRIPTION</em></span>
        <textarea id="rbContent" name="content" rows="3" placeholder="填写费用发生事由、供应商或对应项目……">${esc(d.content)}</textarea>
      </label>

      <div class="rb-section-label"><span>02</span><h4>状态与高额配件属性 / FLAGS</h4></div>
      <label class="rb-field">
        <span>当前状态 <em>STATUS</em></span>
        <select id="rbStatus" name="status">${statusOptions}</select>
      </label>
      <div class="rb-high-panel" id="rbHighPanel">
        <div class="rb-high-head">
          <div>
            <span class="rb-high-kicker">HIGH-VALUE PART</span>
            <h5>高额配件成本属性</h5>
            <p>当报销分类为「配件」且金额 ≥ ¥3,000 时填写。</p>
          </div>
          <span class="rb-high-badge">自动识别</span>
        </div>
        <div class="rb-high-grid">
          <div class="rb-toggle-group">
            <span>是否跨月</span>
            <div class="rb-toggle">
              <button type="button" class="${d.crossMonth === true ? 'is-active' : ''}" data-toggle-field="crossMonth" data-toggle-value="true">是</button>
              <button type="button" class="${d.crossMonth === false ? 'is-active' : ''}" data-toggle-field="crossMonth" data-toggle-value="false">否</button>
            </div>
          </div>
          <div class="rb-toggle-group">
            <span>备货成本</span>
            <div class="rb-toggle">
              <button type="button" class="${d.stockingCost === true ? 'is-active' : ''}" data-toggle-field="stockingCost" data-toggle-value="true">是</button>
              <button type="button" class="${d.stockingCost === false ? 'is-active' : ''}" data-toggle-field="stockingCost" data-toggle-value="false">否</button>
            </div>
          </div>
        </div>
      </div>

      <div class="rb-section-label"><span>03</span><h4>附件 / VOUCHERS</h4></div>
      <input type="file" id="rbFileInput" hidden multiple accept="${ATTACHMENT_ACCEPT}" />
      <div class="rb-drop" data-rb="add-files" role="button" tabindex="0">
        <span class="rb-drop-icon">${ICON.drop}</span>
        <div><b>点击上传图片或文档</b><span>支持 PNG、JPG、WEBP、PDF、DOC、XLS、TXT，可多选</span></div>
        <em>${ICON.paperclip}</em>
      </div>
      <div class="rb-attachment-list" id="rbAttachList"></div>
      <div class="rb-folder-note" id="rbFolderNote">附件会保存在本机；绑定 D:\\${VOUCHER_FOLDER} 后自动写入。</div>

      <div class="rb-form-error" id="rbFormError"></div>
    `;
  }

  onFormChange(e) {
    const t = e.target;
    if (t.id === 'rbDepartment') {
      this.draft.department = t.value;
      const cats = categoriesFor(t.value);
      this.draft.category = cats[0];
      const cat = $('#rbCategory', this.el.form);
      if (cat) cat.innerHTML = cats.map((x) => `<option value="${esc(x)}">${esc(x)}</option>`).join('');
      this.updateHighValueSection();
    } else if (t.id === 'rbCategory') {
      this.draft.category = t.value;
      this.updateHighValueSection();
    } else if (t.id === 'rbStatus') {
      this.draft.status = t.value;
    }
  }

  onFormInput(e) {
    const t = e.target;
    if (t.id === 'rbApplicant') this.draft.applicant = t.value;
    else if (t.id === 'rbAmount') {
      this.draft.amount = t.value;
      this.updateHighValueSection();
    } else if (t.id === 'rbAppliedAt') this.draft.appliedAt = t.value;
    else if (t.id === 'rbContent') this.draft.content = t.value;
  }

  setDraftToggle(field, value) {
    if (!this.draft) return;
    if (field === 'hasInvoice') this.draft.hasInvoice = value;
    else if (field === 'crossMonth') this.draft.crossMonth = value;
    else if (field === 'stockingCost') this.draft.stockingCost = value;
    $$(`[data-toggle-field="${field}"]`, this.el.form).forEach((btn) => {
      btn.classList.toggle('is-active', String(btn.dataset.toggleValue) === String(value));
    });
    if (field === 'crossMonth' || field === 'stockingCost') this.updateHighValueSection();
  }

  isDraftHighValue() {
    return isHighValuePart(this.draft?.category, this.draft?.amount);
  }

  updateHighValueSection() {
    const panel = $('#rbHighPanel', this.el.form);
    if (!panel) return;
    const active = this.isDraftHighValue();
    panel.classList.toggle('is-active', active);
    panel.classList.toggle('is-inactive', !active);
    if (!active) {
      this.draft.highValuePart = false;
      this.draft.crossMonth = null;
      this.draft.stockingCost = null;
      $$('[data-toggle-field="crossMonth"], [data-toggle-field="stockingCost"]', panel).forEach((btn) => btn.classList.remove('is-active'));
    } else {
      this.draft.highValuePart = true;
    }
  }

  addFiles(fileList) {
    if (!fileList?.length) return;
    const files = [...fileList];
    let added = 0;
    for (const file of files) {
      if (!isAllowedFile(file)) {
        this.toast('不支持的文件类型', `${file.name} 不是支持的图片或文档格式。`);
        continue;
      }
      if (file.size > 50 * 1024 * 1024) {
        this.toast('文件过大', `${file.name} 超过 50 MB，请压缩后再上传。`);
        continue;
      }
      this.draftNewFiles.push({
        tempId: uid('rb-file'),
        file,
        preview: isImageFile(file) ? URL.createObjectURL(file) : '',
      });
      added++;
    }
    if (added) this.renderDrawerAttachments();
  }

  renderDrawerAttachments() {
    const list = $('#rbAttachList', this.el.form);
    if (!list) return;
    const existing = this.draftExisting.filter((a) => !this.draftRemoved.has(a.id));
    const rows = [
      ...existing.map((a) => `
        <div class="rb-attach-row" data-existing-id="${esc(a.id)}">
          <span class="rb-attach-icon">${isImageFile({ name: a.name, type: a.type }) ? ICON.image : ICON.file}</span>
          <div class="rb-attach-copy"><b>${esc(a.name)}</b><span>${formatBytes(a.size)} · ${a.written ? '已写入凭证文件夹' : '本地暂存'}</span></div>
          <button type="button" class="rb-attach-download" data-download-attach="${esc(a.id)}" aria-label="下载附件">${ICON.download}</button>
          <button type="button" class="rb-attach-remove" data-remove-attach="${esc(a.id)}" data-origin="existing" aria-label="移除附件">${ICON.close}</button>
        </div>
      `),
      ...this.draftNewFiles.map((f) => `
        <div class="rb-attach-row" data-new-id="${esc(f.tempId)}">
          <span class="rb-attach-icon">${f.preview ? `<img src="${f.preview}" alt="" />` : (isImageFile(f.file) ? ICON.image : ICON.file)}</span>
          <div class="rb-attach-copy"><b>${esc(f.file.name)}</b><span>${formatBytes(f.file.size)} · 待保存</span></div>
          <button type="button" class="rb-attach-remove" data-remove-attach="${esc(f.tempId)}" data-origin="new" aria-label="移除附件">${ICON.close}</button>
        </div>
      `),
    ];
    list.innerHTML = rows.length ? rows.join('') : '<div class="rb-attach-empty">尚未添加附件</div>';
    const note = $('#rbFolderNote', this.el.form);
    if (note) {
      note.innerHTML = this.folderStatus === 'connected'
        ? '已连接凭证文件夹：保存时会自动写入 D:\\' + VOUCHER_FOLDER + '。'
        : '附件会保存在本机；绑定 D:\\' + VOUCHER_FOLDER + ' 后自动写入。';
    }
  }

  removeDraftAttachment(id, origin) {
    if (origin === 'existing') {
      this.draftRemoved.add(id);
      this.draftExisting = this.draftExisting.filter((a) => a.id !== id);
    } else {
      const idx = this.draftNewFiles.findIndex((f) => f.tempId === id);
      if (idx >= 0) {
        if (this.draftNewFiles[idx].preview) URL.revokeObjectURL(this.draftNewFiles[idx].preview);
        this.draftNewFiles.splice(idx, 1);
      }
    }
    this.renderDrawerAttachments();
  }

  revokeDraftPreviews() {
    this.draftNewFiles?.forEach((f) => { if (f.preview) URL.revokeObjectURL(f.preview); });
  }

  async saveDrawer() {
    if (this.draftLoading) return;
    const d = this.draft;
    const err = $('#rbFormError', this.el.form);
    const fail = (msg) => {
      if (err) {
        err.textContent = msg;
        err.classList.add('is-on');
        err.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
      this.el.form.querySelector('.rb-form-error')?.focus?.();
    };
    if (err) err.classList.remove('is-on');
    const applicant = String(d.applicant || '').trim();
    const amount = Number(d.amount);
    const content = String(d.content || '').trim();
    if (!applicant) return fail('请填写报销人员。');
    if (!Number.isFinite(amount) || amount <= 0) return fail('请输入大于 0 的报销金额。');
    if (!d.department || !d.category) return fail('请选择部门和报销分类。');
    if (!d.appliedAt) return fail('请选择申请时间。');
    if (content.length < 2) return fail('请填写报销内容。');
    if (this.isDraftHighValue() && (d.crossMonth === null || d.stockingCost === null)) {
      return fail('高额配件需要选择是否跨月及备货成本。');
    }
    this.draftLoading = true;
    this.el.saveBtn.disabled = true;
    this.el.saveBtn.textContent = '保存中…';
    try {
      const now = new Date().toISOString();
      const isEditing = this.drawerMode === 'edit';
      const original = isEditing ? this.tasks.find((t) => t.id === this.editingId) : null;
      const highValue = this.isDraftHighValue();
      const task = {
        id: isEditing ? this.editingId : uid('GW-RB'),
        applicant,
        amount: Math.round(amount * 100) / 100,
        department: d.department,
        category: d.category,
        appliedAt: d.appliedAt,
        hasInvoice: !!d.hasInvoice,
        content,
        status: STATUS_MAP[d.status] ? d.status : 'pending',
        highValuePart: highValue,
        crossMonth: highValue ? !!d.crossMonth : null,
        stockingCost: highValue ? !!d.stockingCost : null,
        attachments: [],
        collapsed: original ? !!original.collapsed : false,
        invoiceReceived: original ? !!original.invoiceReceived : false,
        invoiceReceivedAt: original?.invoiceReceivedAt || null,
        reimbursedAt: (STATUS_MAP[d.status] ? d.status : 'pending') === 'reimbursed'
          ? (original?.reimbursedAt || now)
          : null,
        reimbursedFrom: (STATUS_MAP[d.status] ? d.status : 'pending') === 'reimbursed'
          ? (original?.reimbursedFrom || 'pending')
          : null,
        order: original ? original.order : this.nextOrder(d.status),
        createdAt: original?.createdAt || now,
        updatedAt: now,
      };
      const attachments = [];
      for (const a of this.draftExisting.filter((x) => !this.draftRemoved.has(x.id))) {
        attachments.push({ ...a });
      }
      for (const f of this.draftNewFiles) {
        const attachId = uid('att');
        await storeAttachmentBlob(attachId, f.file);
        const meta = {
          id: attachId,
          name: f.file.name,
          size: f.file.size,
          type: f.file.type || '',
          written: false,
          voucherName: '',
          cloudFileId: '',
        };
        attachments.push(meta);
      }
      task.attachments = attachments;
      let writeFailures = 0;
      if (this.folderStatus === 'connected') {
        for (let i = 0; i < task.attachments.length; i++) {
          const meta = task.attachments[i];
          if (meta.written) continue;
          const blob = await this.ensureAttachmentBlob(meta);
          if (!blob) continue;
          try {
            const fileName = await this.writeVoucherFile(task, blob, meta.name, i);
            meta.written = true;
            meta.voucherName = fileName;
          } catch (writeErr) {
            writeFailures++;
            console.warn('凭证写入失败', writeErr);
          }
        }
      }
      // 删除被移除的附件缓存
      for (const id of this.draftRemoved) await deleteAttachmentBlob(id);
      if (isEditing) {
        const idx = this.tasks.findIndex((t) => t.id === this.editingId);
        if (idx >= 0) this.tasks[idx] = task;
        else this.tasks.push(task);
      } else {
        this.tasks.unshift(task);
      }
      this.syncProcessed(task, original ? original.status : null);
      this.persistTasks();
      // 🔧 保存后强制立即上云，不等 debounce
      try {
        const pushed = await this.cloud?.pushNow({ force: true, silent: true });
        console.log('[reimburse] pushNow 结果:', pushed ? '✅ 已上云' : '⏳ 未上云 (可能还没连接)');
      } catch (pushErr) {
        console.warn('[reimburse] pushNow 异常（不影响本地保存）:', pushErr?.message);
      }
      this.viewDate = dateKeyOf(task.appliedAt);
      this.filterStart = this.viewDate;
      this.filterEnd = this.viewDate;
      this.closeDrawer(true);
      this.renderAll();
      this.cardRects = new Map();
      if (this.cloud?.isConnected() && task.attachments.length) {
        this.cloud.syncTaskAttachments(task).catch((err) => console.warn('附件云同步失败', err));
      }
      const localOnly = task.attachments.length > 0 && this.folderStatus !== 'connected';
      this.toast(
        isEditing ? '报销申请已更新' : '报销申请已创建',
        localOnly
          ? '附件已本地暂存；绑定凭证文件夹后可自动写入 D 盘。'
          : writeFailures
            ? `${applicant} · ¥${money(task.amount)}，${writeFailures} 个附件写入 D 盘失败，已保留本地缓存。`
            : `${applicant} · ¥${money(task.amount)} · ${STATUS_LABEL[task.status]}`,
        'ok'
      );
    } catch (err2) {
      console.error(err2);
      this.toast('保存失败', err2?.message || '浏览器本地存储不可用。');
    } finally {
      this.draftLoading = false;
      this.el.saveBtn.disabled = false;
      this.el.saveBtn.textContent = '保存报销';
    }
  }

  nextOrder(status) {
    const same = this.tasks.filter((t) => t.status === status);
    if (!same.length) return Date.now();
    return Math.min(...same.map((t) => t.order)) - 10;
  }

  /* ---------------- 删除 ---------------- */

  openDeleteConfirm(id) {
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return;
    this.confirmId = id;
    this.el.confirmText.innerHTML = `将删除 <b>${esc(task.applicant)}</b> · ${esc(task.department)} · <b>¥${money(task.amount)}</b> 的本地记录。已写入 D 盘凭证文件夹的文件不会被自动删除。`;
    this.el.confirm.classList.add('is-open');
    this.el.confirm.setAttribute('aria-hidden', 'false');
  }

  closeConfirm(immediate = false) {
    this.el.confirm.classList.remove('is-open');
    this.el.confirm.setAttribute('aria-hidden', 'true');
    if (!immediate) this.confirmId = null;
  }

  async confirmDelete() {
    const id = this.confirmId;
    if (!id) return;
    const before = this.captureCardRects();
    const task = this.tasks.find((t) => t.id === id);
    if (task) {
      for (const a of task.attachments) await deleteAttachmentBlob(a.id);
      this.tasks = this.tasks.filter((t) => t.id !== id);
      this.persistTasks();
      // 🔧 同步移除该笔在「当日已处理待报销」中的记录，金额栏不再计入
      const beforeProc = this.processedEvents.length;
      this.processedEvents = this.processedEvents.filter((e) => e.taskId !== id);
      if (this.processedEvents.length !== beforeProc) this.persistProcessed();
      // 🔧 同步删除到云端（含墓碑与已处理记录），防止被其他设备或轮询重新拉回来
      try { await this.cloud?.recordDeletion(id); }
      catch (e) { console.warn('[reimburse] 云端删除失败:', e?.message); }
    }
    this.closeConfirm(true);
    this.renderAll({ fromRects: before });
    this.toast('报销记录已删除', '本地记录与附件缓存已移除。');
  }

  /* ---------------- 拖拽 ---------------- */

  onCardPointerDown(e) {
    if (!this.openFlag || this.drawerOpen || this.reportOpen) return;
    if (e.button !== 0 && e.pointerType === 'mouse') return;
    if (e.target.closest('button, a, input, textarea, select, .rb-drag-handle')) {
      if (!e.target.closest('.rb-drag-handle')) return;
    } else if (e.pointerType !== 'mouse') {
      return;
    }
    const card = e.target.closest('.rb-card');
    if (!card) return;
    const id = card.dataset.id;
    const task = this.tasks.find((t) => t.id === id);
    if (!task) return;
    const rect = card.getBoundingClientRect();
    const drag = {
      id,
      card,
      startX: e.clientX,
      startY: e.clientY,
      offsetX: e.clientX - rect.left,
      offsetY: e.clientY - rect.top,
      width: rect.width,
      height: rect.height,
      moved: false,
      ghost: null,
      targetStatus: task.status,
      targetIndex: -1,
      pointerId: e.pointerId,
      beforeTask: task,
    };
    this.drag = drag;
    const move = (ev) => this.onCardPointerMove(ev);
    const up = (ev) => this.onCardPointerUp(ev);
    drag.moveHandler = move;
    drag.upHandler = up;
    window.addEventListener('pointermove', move, { passive: false });
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  }

  onCardPointerMove(e) {
    const d = this.drag;
    if (!d) return;
    if (!d.moved) {
      if (Math.hypot(e.clientX - d.startX, e.clientY - d.startY) < 4) return;
      d.moved = true;
      this.suppressClick = true;
      d.card.classList.add('is-source');
      this.startGhost(d, e);
      document.body.classList.add('is-reimburse-drag');
    }
    if (!d.moved) return;
    e.preventDefault();
    d.ghost.style.left = `${e.clientX - d.offsetX}px`;
    d.ghost.style.top = `${e.clientY - d.offsetY}px`;
    const col = this.columnAtPoint(e.clientX, e.clientY);
    $$('.rb-col', this.root).forEach((c) => c.classList.toggle('is-drop-target', c === col));
    if (!col) {
      d.targetStatus = d.beforeTask.status;
      d.targetIndex = -1;
      this.clearDropMarks();
      return;
    }
    d.targetStatus = col.dataset.status;
    const cardsWrap = $('.rb-cards', col);
    const cards = $$('.rb-card', cardsWrap).filter((c) => c !== d.card);
    let index = cards.length;
    for (let i = 0; i < cards.length; i++) {
      const r = cards[i].getBoundingClientRect();
      if (e.clientY < r.top + r.height / 2) { index = i; break; }
    }
    d.targetIndex = index;
    this.clearDropMarks();
    if (cards[index]) cards[index].classList.add('drop-before');
    else if (cards[index - 1]) cards[index - 1].classList.add('drop-after');
    else cardsWrap.classList.add('drop-empty');
    // 滚动边缘
    const scroll = $('.rb-col-scroll', col);
    const sr = scroll.getBoundingClientRect();
    if (e.clientY < sr.top + 48) scroll.scrollTop -= 8;
    else if (e.clientY > sr.bottom - 48) scroll.scrollTop += 8;
  }

  startGhost(d, e) {
    const ghost = d.card.cloneNode(true);
    ghost.classList.add('rb-ghost');
    ghost.removeAttribute('tabindex');
    ghost.style.width = `${d.width}px`;
    ghost.style.height = `${d.height}px`;
    ghost.style.left = `${e.clientX - d.offsetX}px`;
    ghost.style.top = `${e.clientY - d.offsetY}px`;
    ghost.style.transform = 'rotate(1.4deg) scale(1.015)';
    document.body.appendChild(ghost);
    d.ghost = ghost;
    d.card.style.opacity = '0.22';
  }

  columnAtPoint(x, y) {
    const cols = $$('.rb-col', this.root);
    for (const c of cols) {
      const r = c.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top - 40 && y <= r.bottom) return c;
    }
    // 横向最近列
    let best = null;
    let bestDist = Infinity;
    for (const c of cols) {
      const r = c.getBoundingClientRect();
      if (y < r.top || y > r.bottom) continue;
      const dist = Math.abs((r.left + r.right) / 2 - x);
      if (dist < bestDist) { best = c; bestDist = dist; }
    }
    return best;
  }

  clearDropMarks() {
    $$('.rb-card.drop-before, .rb-card.drop-after', this.root).forEach((c) => c.classList.remove('drop-before', 'drop-after'));
    $$('.rb-cards.drop-empty', this.root).forEach((c) => c.classList.remove('drop-empty'));
  }

  onCardPointerUp() {
    const d = this.drag;
    if (!d) return;
    const moved = d.moved;
    const task = this.tasks.find((t) => t.id === d.id);
    const targetStatus = d.targetStatus;
    const targetIndex = d.targetIndex;
    this.cleanupDrag();
    if (!moved || !task || targetIndex < 0 || !STATUS_MAP[targetStatus]) return;
    const before = this.captureCardRects();
    const targetList = this.tasksByStatus(targetStatus).filter((t) => t.id !== task.id);
    const insertAt = targetIndex >= 0 ? Math.min(targetIndex, targetList.length) : targetList.length;
    const prev = targetList[insertAt - 1];
    const next = targetList[insertAt];
    let newOrder;
    if (prev && next) newOrder = (prev.order + next.order) / 2;
    else if (prev) newOrder = prev.order + 10;
    else if (next) newOrder = next.order - 10;
    else newOrder = this.nextOrder(targetStatus);
    const statusChanged = task.status !== targetStatus;
    const fromStatus = task.status;
    task.status = targetStatus;
    task.order = newOrder;
    task.updatedAt = new Date().toISOString();
    this.syncProcessed(task, fromStatus);
    this.persistTasks();
    this.renderAll({ fromRects: before });
    if (statusChanged) {
      this.toast('状态已更新', `${task.applicant} · ¥${money(task.amount)} → ${STATUS_LABEL[targetStatus]}${targetStatus === 'reimbursed' ? '，已计入当日已处理待报销' : ''}`, 'ok');
    }
  }

  cleanupDrag() {
    const d = this.drag;
    if (!d) return;
    this.drag = null;
    d.ghost?.remove();
    d.card?.classList.remove('is-source');
    if (d.card) d.card.style.opacity = '';
    window.removeEventListener('pointermove', d.moveHandler);
    window.removeEventListener('pointerup', d.upHandler);
    window.removeEventListener('pointercancel', d.upHandler);
    document.body.classList.remove('is-reimburse-drag');
    $$('.rb-col.is-drop-target', this.root).forEach((c) => c.classList.remove('is-drop-target'));
    this.clearDropMarks();
    setTimeout(() => { this.suppressClick = false; }, 0);
  }

  cancelDrag() {
    if (!this.drag) return;
    this.cleanupDrag();
  }

  /* ---------------- 附件下载 ---------------- */

  async downloadAttachment(id) {
    const meta = this.findAttachmentMeta(id);
    const rec = meta ? await this.ensureAttachmentBlob(meta) : await readAttachmentBlob(id);
    if (!rec) { this.toast('附件不存在', '本地缓存或云端中未找到该文件。'); return; }
    const url = URL.createObjectURL(rec);
    const a = document.createElement('a');
    a.href = url;
    a.download = rec.name || meta?.name || '附件';
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 4000);
  }

  /* ---------------- D 盘凭证文件夹 ---------------- */

  async initFolder() {
    this.folderSupported = typeof window.showDirectoryPicker === 'function';
    if (!this.folderSupported) {
      this.folderStatus = 'unsupported';
      this.renderFolderStatus();
      return;
    }
    try {
      const rec = await dbGet('meta', 'voucherDir');
      if (rec?.value) {
        this.folderHandle = rec.value;
        const perm = await this.queryPermission(this.folderHandle);
        this.folderStatus = perm === 'granted' ? 'connected' : perm === 'prompt' ? 'prompt' : 'denied';
      } else {
        this.folderStatus = 'unbound';
      }
    } catch (err) {
      console.warn('凭证文件夹读取失败', err);
      this.folderStatus = 'unbound';
    }
    this.renderFolderStatus();
  }

  async queryPermission(handle) {
    if (!handle?.queryPermission) return 'granted';
    try { return await handle.queryPermission({ mode: 'readwrite' }); } catch { return 'denied'; }
  }

  async ensureFolderPermission(interactive = false) {
    if (!this.folderHandle) return false;
    let perm = await this.queryPermission(this.folderHandle);
    if (perm === 'prompt' && interactive && this.folderHandle.requestPermission) {
      try { perm = await this.folderHandle.requestPermission({ mode: 'readwrite' }); } catch { perm = 'denied'; }
    }
    if (perm === 'granted') { this.folderStatus = 'connected'; this.renderFolderStatus(); return true; }
    this.folderStatus = perm === 'prompt' ? 'prompt' : 'denied';
    this.renderFolderStatus();
    return false;
  }

  async folderAction() {
    if (this.folderBusy) return;
    if (this.folderStatus === 'connected') {
      await this.syncAllAttachments(false);
      return;
    }
    if (this.folderStatus === 'prompt') {
      this.folderBusy = true;
      this.renderFolderStatus();
      const ok = await this.ensureFolderPermission(true);
      this.folderBusy = false;
      this.renderFolderStatus();
      if (ok) await this.syncAllAttachments(false);
      else this.toast('文件夹授权未恢复', '请重新绑定 D:\\' + VOUCHER_FOLDER + '。');
      return;
    }
    if (this.folderStatus === 'unsupported') {
      this.toast('当前浏览器无法直写文件夹', '附件仍保存在本机，可在编辑中单独下载。建议使用 Chrome / Edge。');
      return;
    }
    await this.bindVoucherFolder();
  }

  async bindVoucherFolder() {
    if (this.folderBusy) return;
    if (this.folderStatus === 'unsupported') {
      this.toast('当前浏览器不支持文件夹直写', '请使用 Chrome / Edge，或单独下载附件。');
      return;
    }
    this.folderBusy = true;
    this.renderFolderStatus();
    try {
      const picked = await window.showDirectoryPicker({ id: 'goodwork-voucher', mode: 'readwrite' });
      let target = picked;
      if (picked.name !== VOUCHER_FOLDER) {
        target = await picked.getDirectoryHandle(VOUCHER_FOLDER, { create: true });
      }
      let perm = await this.queryPermission(target);
      if (perm !== 'granted' && target.requestPermission) perm = await target.requestPermission({ mode: 'readwrite' });
      if (perm !== 'granted') throw new Error('未获得文件夹写入权限');
      this.folderHandle = target;
      this.folderStatus = 'connected';
      await dbPut('meta', { key: 'voucherDir', value: target, name: target.name });
      this.toast('凭证文件夹已连接', '附件保存时会自动写入「车房凭证」文件夹。', 'ok');
      this.renderFolderStatus();
      await this.syncAllAttachments(false);
    } catch (err) {
      if (err?.name === 'AbortError') {
        this.folderStatus = this.folderHandle ? 'connected' : 'unbound';
      } else {
        console.warn('绑定凭证文件夹失败', err);
        this.folderStatus = this.folderHandle ? 'prompt' : 'unbound';
        this.toast('文件夹绑定失败', err?.message || '请在浏览器弹窗中选择 D 盘或车房凭证文件夹。');
      }
      this.renderFolderStatus();
    } finally {
      this.folderBusy = false;
      this.renderFolderStatus();
    }
  }

  async syncAllAttachments(silent = false) {
    if (this.syncing) return;
    if (!this.folderHandle) return;
    const ok = await this.ensureFolderPermission(true);
    if (!ok) { this.toast('需要文件夹写入权限', '请点击「恢复授权」后重试。'); return; }
    this.syncing = true;
    this.folderBusy = true;
    this.renderFolderStatus();
    let count = 0;
    let failed = 0;
    try {
      for (const task of this.tasks) {
        for (let i = 0; i < task.attachments.length; i++) {
          const meta = task.attachments[i];
          if (meta.written) continue;
          const blob = await this.ensureAttachmentBlob(meta);
          if (!blob) continue;
          try {
            const fileName = await this.writeVoucherFile(task, blob, meta.name, i);
            meta.written = true;
            meta.voucherName = fileName;
            count++;
          } catch (err) {
            failed++;
            console.warn('凭证写入失败', task.id, meta.name, err);
          }
        }
      }
      if (count) this.persistTasks();
      this.renderAll({ animate: false });
      if (!silent || count || failed) {
        if (count) this.toast('附件已写入凭证文件夹', `成功写入 ${count} 个文件${failed ? `，${failed} 个失败` : ''}。`, 'ok');
        else if (failed) this.toast('附件写入失败', '请检查文件夹权限后重试。');
        else this.toast('没有需要同步的附件', '当前所有附件都已写入或尚未上传。');
      }
    } finally {
      this.syncing = false;
      this.folderBusy = false;
      this.renderFolderStatus();
    }
  }

  voucherFileName(task, originalName, index) {
    const date = dateKeyOf(task.appliedAt);
    const person = sanitizeNamePart(task.applicant);
    const amount = money(task.amount).replace(/,/g, '');
    const dept = sanitizeNamePart(task.department);
    const ext = fileExtension(originalName);
    const suffix = index > 0 ? `_${index + 1}` : '';
    return `${date}_${person}_${amount}_${dept}${suffix}${ext}`;
  }

  async writeVoucherFile(task, blob, originalName, index) {
    if (!this.folderHandle) throw new Error('未绑定凭证文件夹');
    const fileName = this.voucherFileName(task, originalName, index);
    const fh = await this.folderHandle.getFileHandle(fileName, { create: true });
    const writable = await fh.createWritable();
    await writable.write(blob);
    await writable.close();
    return fileName;
  }

  renderFolderStatus() {
    if (!this.el.folderStatus || !this.el.folderBtn) return;
    const map = {
      checking: ['正在检查凭证文件夹…', '检查中', 'is-muted'],
      unbound: ['未绑定 · 首次需授权', '绑定', ''],
      connected: ['已连接 · 自动写入 D:\\' + VOUCHER_FOLDER, this.folderBusy ? '同步中…' : '同步', 'is-ok'],
      prompt: ['写入授权已过期 · 请恢复', '恢复授权', 'is-warn'],
      denied: ['没有写入授权', '重新绑定', 'is-warn'],
      unsupported: ['当前浏览器不支持直写文件夹', '使用 Chrome / Edge', 'is-muted'],
    };
    const [text, btnText, cls] = map[this.folderStatus] || map.unbound;
    this.el.folderStatus.textContent = text;
    this.el.folderStatus.className = cls;
    this.el.folderBtn.textContent = this.folderBusy ? '请稍候…' : btnText;
    this.el.folderBtn.title = this.folderStatus === 'unbound'
      ? '绑定 D:\\' + VOUCHER_FOLDER + '（首次需要手动授权一次）'
      : this.folderStatus === 'connected'
        ? '将尚未写入的附件同步到 D:\\' + VOUCHER_FOLDER
        : btnText;
    this.el.folderBtn.disabled = this.folderBusy || this.folderStatus === 'unsupported';
    this.el.folderBtn.classList.toggle('is-ok', this.folderStatus === 'connected');
    const note = $('#rbFolderNote', this.el.form);
    if (note) {
      note.innerHTML = this.folderStatus === 'connected'
        ? '已连接「车房凭证」文件夹，保存时附件会自动写入 D 盘。'
        : '附件会保存在本机；绑定 D:\\' + VOUCHER_FOLDER + ' 后自动写入。';
    }
  }

  /* ---------------- 统计 ---------------- */

  computeStats(tasks) {
    const sum = (arr, fn = (t) => t.amount) => arr.reduce((s, t) => s + (Number(fn(t)) || 0), 0);
    const statusCounts = Object.fromEntries(STATUS_LIST.map((s) => [s.id, tasks.filter((t) => t.status === s.id).length]));
    const statusAmounts = Object.fromEntries(STATUS_LIST.map((s) => [s.id, sum(tasks.filter((t) => t.status === s.id))]));
    const invoiceCount = tasks.filter((t) => t.hasInvoice).length;
    const highValueTasks = tasks.filter((t) => t.highValuePart);
    const fileCount = tasks.reduce((s, t) => s + (t.attachments?.length || 0), 0);
    const deptMap = new Map();
    for (const t of tasks) {
      if (!deptMap.has(t.department)) deptMap.set(t.department, []);
      deptMap.get(t.department).push(t);
    }
    const depts = DEPARTMENTS.filter((d) => deptMap.has(d)).map((department) => {
      const arr = deptMap.get(department);
      const catMap = new Map();
      for (const t of arr) {
        if (!catMap.has(t.category)) catMap.set(t.category, []);
        catMap.get(t.category).push(t);
      }
      const categories = [...catMap.entries()].map(([category, list]) => ({
        category,
        count: list.length,
        amount: sum(list),
        pending: sum(list.filter((t) => t.status === 'pending')),
        reimbursed: sum(list.filter((t) => t.status === 'reimbursed')),
        supplemented: sum(list.filter((t) => t.status === 'supplemented')),
        invoice: list.filter((t) => t.hasInvoice).length,
        highValue: list.filter((t) => t.highValuePart).length,
      })).sort((a, b) => b.amount - a.amount);
      return {
        department,
        count: arr.length,
        amount: sum(arr),
        pending: sum(arr.filter((t) => t.status === 'pending')),
        reimbursed: sum(arr.filter((t) => t.status === 'reimbursed')),
        supplemented: sum(arr.filter((t) => t.status === 'supplemented')),
        invoice: arr.filter((t) => t.hasInvoice).length,
        highValue: arr.filter((t) => t.highValuePart).length,
        files: arr.reduce((s, t) => s + (t.attachments?.length || 0), 0),
        categories,
      };
    }).sort((a, b) => DEPARTMENTS.indexOf(a.department) - DEPARTMENTS.indexOf(b.department));
    const empMap = new Map();
    for (const t of tasks) {
      if (!empMap.has(t.applicant)) empMap.set(t.applicant, []);
      empMap.get(t.applicant).push(t);
    }
    const employees = [...empMap.entries()].map(([name, arr]) => ({
      name,
      count: arr.length,
      amount: sum(arr),
      pending: sum(arr.filter((t) => t.status === 'pending')),
      reimbursed: sum(arr.filter((t) => t.status === 'reimbursed')),
      supplemented: sum(arr.filter((t) => t.status === 'supplemented')),
      noInvoice: arr.filter((t) => !t.hasInvoice).length,
      highValue: arr.filter((t) => t.highValuePart).length,
      files: arr.reduce((s, t) => s + (t.attachments?.length || 0), 0),
    })).sort((a, b) => b.amount - a.amount);
    return {
      count: tasks.length,
      amount: sum(tasks),
      statusCounts,
      statusAmounts,
      invoiceCount,
      invoiceRate: tasks.length ? invoiceCount / tasks.length : 0,
      highValueCount: highValueTasks.length,
      highValueAmount: sum(highValueTasks),
      fileCount,
      departments: depts,
      employees,
      tasks,
    };
  }

  reportHtml(stats) {
    if (!stats.count) {
      return `<div class="rb-report-empty"><span>RANGE EMPTY</span><h3>该时间范围内没有报销记录</h3><p>调整顶部导出时间范围，或回到看板创建一个新的报销申请。</p></div>`;
    }
    const topDept = stats.departments.slice().sort((a, b) => b.amount - a.amount)[0];
    const topEmployee = stats.employees[0];
    const topCategory = stats.departments.flatMap((d) => d.categories.map((c) => ({ department: d.department, ...c }))).sort((a, b) => b.amount - a.amount)[0];
    const deptRows = stats.departments.flatMap((d) => [
      ...d.categories.map((c) => `
        <tr>
          <td class="rb-report-dept">${esc(d.department)}</td>
          <td>${esc(c.category)}</td>
          <td class="num">${c.count}</td>
          <td class="num strong">¥${money(c.amount)}</td>
          <td class="num">¥${money(c.pending)}</td>
          <td class="num">¥${money(c.reimbursed)}</td>
          <td class="num">¥${money(c.supplemented)}</td>
          <td class="num">${c.invoice}</td>
          <td class="num">${c.highValue}</td>
        </tr>
      `),
      `<tr class="rb-report-subtotal">
        <td class="rb-report-dept">${esc(d.department)} · 小计</td>
        <td>全部分类</td>
        <td class="num">${d.count}</td>
        <td class="num strong">¥${money(d.amount)}</td>
        <td class="num">¥${money(d.pending)}</td>
        <td class="num">¥${money(d.reimbursed)}</td>
        <td class="num">¥${money(d.supplemented)}</td>
        <td class="num">${d.invoice}</td>
        <td class="num">${d.highValue}</td>
      </tr>`,
    ]).join('');
    const empRows = stats.employees.map((e) => `
      <tr>
        <td class="rb-report-dept">${esc(e.name)}</td>
        <td class="num">${e.count}</td>
        <td class="num strong">¥${money(e.amount)}</td>
        <td class="num">¥${money(e.pending)}</td>
        <td class="num">¥${money(e.reimbursed)}</td>
        <td class="num">${e.noInvoice}</td>
        <td class="num">${e.highValue}</td>
      </tr>
    `).join('');
    const attachments = stats.tasks.flatMap((t) => (t.attachments || []).map((a) => ({
      date: dateKeyOf(t.appliedAt), applicant: t.applicant, department: t.department,
      amount: t.amount, name: a.name, size: a.size, written: a.written,
    })));
    const attachmentRows = attachments.length
      ? attachments.map((a) => `
        <tr>
          <td>${esc(a.date)}</td><td>${esc(a.applicant)}</td><td>${esc(a.department)}</td>
          <td class="num">¥${money(a.amount)}</td><td>${esc(a.name)}</td><td class="num">${formatBytes(a.size)}</td>
          <td>${a.written ? '已写入 D 盘' : '本地暂存'}</td>
        </tr>`).join('')
      : '<tr><td colspan="7" class="rb-report-none">该范围内没有附件</td></tr>';
    return `
      <div class="rb-report-metrics">
        <div class="rb-report-metric hero"><span>报销总额</span><b>¥${money(stats.amount)}</b><small>${stats.count} 笔申请</small></div>
        <div class="rb-report-metric"><span>待报销</span><b>¥${money(stats.statusAmounts.pending)}</b><small>${stats.statusCounts.pending} 笔</small></div>
        <div class="rb-report-metric"><span>已报销</span><b>¥${money(stats.statusAmounts.reimbursed)}</b><small>${stats.statusCounts.reimbursed} 笔</small></div>
        <div class="rb-report-metric"><span>已补充附件</span><b>¥${money(stats.statusAmounts.supplemented)}</b><small>${stats.statusCounts.supplemented} 笔</small></div>
        <div class="rb-report-metric"><span>有发票比例</span><b>${Math.round(stats.invoiceRate * 100)}%</b><small>${stats.invoiceCount} / ${stats.count}</small></div>
        <div class="rb-report-metric"><span>高额配件成本</span><b>¥${money(stats.highValueAmount)}</b><small>${stats.highValueCount} 笔 · ${stats.fileCount} 个附件</small></div>
      </div>
      <div class="rb-report-highlights">
        <div><span>金额最高部门</span><b>${esc(topDept?.department || '—')}</b><em>¥${money(topDept?.amount || 0)}</em></div>
        <div><span>金额最高员工</span><b>${esc(topEmployee?.name || '—')}</b><em>¥${money(topEmployee?.amount || 0)}</em></div>
        <div><span>金额最高分类</span><b>${esc(topCategory ? `${topCategory.department} / ${topCategory.category}` : '—')}</b><em>¥${money(topCategory?.amount || 0)}</em></div>
      </div>
      <section class="rb-report-section">
        <div class="rb-report-section-head"><div><span>DEPARTMENT × CATEGORY</span><h3>部门 · 报销分类统计</h3></div><p>按部门拆分到每个报销分类，并附小计。</p></div>
        <div class="rb-report-table-wrap">
          <table class="rb-report-table">
            <thead><tr><th>部门</th><th>报销分类</th><th>笔数</th><th>合计金额</th><th>待报销</th><th>已报销</th><th>已补充</th><th>有发票</th><th>高额配件</th></tr></thead>
            <tbody>${deptRows}</tbody>
          </table>
        </div>
      </section>
      <section class="rb-report-section">
        <div class="rb-report-section-head"><div><span>EMPLOYEE SUMMARY</span><h3>员工报销金额统计</h3></div><p>按申请人员汇总金额、状态与无发票笔数。</p></div>
        <div class="rb-report-table-wrap">
          <table class="rb-report-table">
            <thead><tr><th>报销人员</th><th>笔数</th><th>合计金额</th><th>待报销</th><th>已报销</th><th>无发票</th><th>高额配件</th></tr></thead>
            <tbody>${empRows}</tbody>
          </table>
        </div>
      </section>
      <section class="rb-report-section">
        <div class="rb-report-section-head"><div><span>VOUCHER FILES</span><h3>附件与凭证清单</h3></div><p>导出 Excel 时附件名称会一并写入明细表。</p></div>
        <div class="rb-report-table-wrap">
          <table class="rb-report-table">
            <thead><tr><th>日期</th><th>报销人员</th><th>部门</th><th>金额</th><th>附件</th><th>大小</th><th>写入状态</th></tr></thead>
            <tbody>${attachmentRows}</tbody>
          </table>
        </div>
      </section>
      <div class="rb-report-foot">统计范围：${esc(this.exportStart)} 至 ${esc(this.exportEnd)} · 生成于 ${localTimestamp()} · GOODWORK FINANCE OS</div>
    `;
  }

  openReport() {
    if (!this.ensureValidRange()) return;
    const stats = this.computeStats(this.rangeTasks());
    this.el.reportRange.textContent = `${this.exportStart} 至 ${this.exportEnd} · ${stats.count} 笔 · ¥${money(stats.amount)}`;
    this.el.reportBody.innerHTML = this.reportHtml(stats);
    this.reportOpen = true;
    this.el.report.classList.add('is-open');
    this.el.report.setAttribute('aria-hidden', 'false');
    this.syncModalBodyClass();
  }

  closeReport(immediate = false) {
    this.reportOpen = false;
    this.el.report.classList.remove('is-open');
    this.el.report.setAttribute('aria-hidden', 'true');
    this.syncModalBodyClass();
  }

  syncModalBodyClass() {
    document.body.classList.toggle(
      'is-reimburse-modal',
      this.reportOpen || this.invoiceOpen || this.statementOpen || this.cloudOpen
    );
  }

  /* ---------------- 发票追踪 ---------------- */

  openInvoice() {
    this.invoiceOpen = true;
    this.el.invoice.classList.add('is-open');
    this.el.invoice.setAttribute('aria-hidden', 'false');
    this.syncModalBodyClass();
    this.renderInvoice();
  }

  closeInvoice(immediate = false) {
    this.invoiceOpen = false;
    this.el.invoice.classList.remove('is-open');
    this.el.invoice.setAttribute('aria-hidden', 'true');
    this.syncModalBodyClass();
  }

  invoiceFilteredTasks(tab) {
    const base = (tab === 'received' ? this.invoiceReceivedTasks() : this.invoicePendingTasks())
      .filter((t) => this.invoiceFilterApplicant === 'all' || t.applicant === this.invoiceFilterApplicant);
    return base
      .filter((t) => {
        const key = dateKeyOf(t.appliedAt);
        if (this.invoiceFilterStart && key < this.invoiceFilterStart) return false;
        if (this.invoiceFilterEnd && key > this.invoiceFilterEnd) return false;
        return true;
      })
      .sort((a, b) => String(b.appliedAt).localeCompare(String(a.appliedAt)));
  }

  renderInvoice() {
    const pending = this.invoicePendingTasks();
    const received = this.invoiceReceivedTasks();
    this.el.invoicePendingCount.textContent = String(pending.length);
    this.el.invoiceReceivedCount.textContent = String(received.length);
    const pendingAmount = pending.reduce((s, t) => s + t.amount, 0);
    this.el.invoiceMeta.textContent = `自动抓取「已报销 + 有发票」记录 · 未取得 ${pending.length} 笔 · 待收发票金额 ¥${money(pendingAmount)}`;

    const allInvoiceTasks = [...pending, ...received];
    const names = [...new Set(allInvoiceTasks.map((t) => t.applicant).filter(Boolean))].sort((a, b) => a.localeCompare(b, 'zh-CN'));
    if (this.invoiceFilterApplicant !== 'all' && !names.includes(this.invoiceFilterApplicant)) {
      this.invoiceFilterApplicant = 'all';
    }
    this.el.invoiceApplicantEl.innerHTML = [
      '<option value="all">全部申请人</option>',
      ...names.map((n) => `<option value="${esc(n)}">${esc(n)}</option>`),
    ].join('');
    this.el.invoiceApplicantEl.value = this.invoiceFilterApplicant;
    this.el.invoiceStartEl.value = this.invoiceFilterStart;
    this.el.invoiceEndEl.value = this.invoiceFilterEnd;

    $$('.rb-invoice-tab', this.root).forEach((b) => b.classList.toggle('is-active', b.dataset.tab === this.invoiceTab));

    const tasks = this.invoiceFilteredTasks(this.invoiceTab);
    if (!tasks.length) {
      this.el.invoiceBody.innerHTML = `
        <div class="rb-invoice-empty">
          <span>NO RECORDS</span>
          <h3>${this.invoiceTab === 'pending' ? '没有未取得发票的记录' : '还没有已取得发票的记录'}</h3>
          <p>${this.invoiceTab === 'pending'
            ? '当「已报销」列中出现有发票的申请时，会自动生成待取得发票记录。'
            : '在「未取得发票」中点击「已取得发票」后，记录会归档到这里。'}</p>
        </div>`;
      return;
    }
    this.el.invoiceBody.innerHTML = tasks.map((t) => {
      const vouchers = t.attachments?.length
        ? t.attachments.map((a) => `
            <button type="button" class="rb-inv-voucher" data-download-attach="${esc(a.id)}" title="下载凭证附件">
              ${isImageFile({ name: a.name, type: a.type }) ? ICON.image : ICON.file}
              <span>${esc(a.voucherName || a.name)}</span>
            </button>`).join('')
        : '<span class="rb-inv-novoucher">无凭证附件</span>';
      return `
        <article class="rb-inv-row">
          <div class="rb-inv-main">
            <div class="rb-inv-line">
              <span class="rb-inv-avatar">${esc(t.applicant.slice(0, 1) || '?')}</span>
              <b>${esc(t.applicant)}</b>
              <em>${formatDateTime(t.appliedAt)}</em>
              <span class="rb-badge">${esc(t.department)} · ${esc(t.category)}</span>
              <span class="rb-badge rb-badge--ok">有发票</span>
            </div>
            <p class="rb-inv-content">${esc(t.content) || '未填写报销内容'}</p>
            <div class="rb-inv-vouchers">${vouchers}</div>
          </div>
          <div class="rb-inv-side">
            <b class="rb-inv-amount">¥${money(t.amount)}</b>
            ${this.invoiceTab === 'pending'
              ? `<button type="button" class="rb-btn primary" data-rb="invoice-mark" data-id="${esc(t.id)}">${ICON.check}<span>已取得发票</span></button>`
              : `<span class="rb-inv-done">${ICON.check} 已取得 · ${formatDateTime(t.invoiceReceivedAt)}</span>`}
          </div>
        </article>`;
    }).join('');
  }

  markInvoiceReceived(id) {
    const task = this.tasks.find((t) => t.id === id && t.status === 'reimbursed' && t.hasInvoice);
    if (!task || task.invoiceReceived) return;
    task.invoiceReceived = true;
    task.invoiceReceivedAt = new Date().toISOString();
    task.updatedAt = new Date().toISOString();
    this.persistTasks();
    this.renderInvoiceBadge();
    this.renderInvoice();
    this.toast('已标记取得发票', `${task.applicant} · ¥${money(task.amount)} 已移入「已取得发票」。`, 'ok');
  }

  /* ---------------- 月度财务报表 ---------------- */

  openStatement() {
    this.statementOpen = true;
    this.statementMonth = this.statementMonth || currentMonthValue();
    this.el.statementMonthEl.value = this.statementMonth;
    this.el.statement.classList.add('is-open');
    this.el.statement.setAttribute('aria-hidden', 'false');
    this.syncModalBodyClass();
    this.renderStatement();
  }

  closeStatement(immediate = false) {
    this.statementOpen = false;
    this.el.statement.classList.remove('is-open');
    this.el.statement.setAttribute('aria-hidden', 'true');
    this.syncModalBodyClass();
  }

  /* ---------------- 腾讯云开发同步 ---------------- */

  getCloudState() {
    return {
      workspace: 'GOODWORK 古德車房',
      schemaVersion: 1,
      tasks: this.tasks.map((t) => ({ ...t })),
      processedEvents: this.processedEvents.map((e) => ({ ...e })),
    };
  }

  applyCloudState(state, meta = {}) {
    if (!state || !Array.isArray(state.tasks)) return;
    this.applyingCloud = true;
    try {
      const localWritten = new Map();
      for (const task of this.tasks) {
        for (const att of task.attachments || []) {
          if (att.written) localWritten.set(att.id, { written: true, voucherName: att.voucherName || '' });
        }
      }
      const incoming = state.tasks.map((t) => this.normalizeTask(t));
      for (const task of incoming) {
        for (const att of task.attachments || []) {
          const local = localWritten.get(att.id);
          if (local) {
            att.written = local.written;
            att.voucherName = local.voucherName;
          }
        }
      }
      // 🔧 内容没有实际变化时跳过重渲染，避免轮询每 3 秒刷新一次导致界面闪烁
      const sigOf = (tasks) => tasks.map((t) => [
        t.id, t.status, t.amount, t.applicant, t.department, t.category, t.appliedAt,
        t.order, t.updatedAt, t.hasInvoice, t.invoiceReceived, t.invoiceReceivedAt,
        t.reimbursedAt, t.reimbursedFrom, t.content,
        (t.attachments || []).map((a) => a.id + ':' + (a.written ? 1 : 0)).join('|'),
      ].join('~')).join('\n');
      const nextProc = Array.isArray(state.processedEvents) ? state.processedEvents : [];
      const sameTasks = sigOf(incoming) === sigOf(this.tasks || []);
      const sameProc = JSON.stringify(nextProc) === JSON.stringify(this.processedEvents || []);
      if (sameTasks && sameProc) return;
      this.tasks = incoming;
      this.processedEvents = Array.isArray(state.processedEvents) ? state.processedEvents : [];
      try {
        localStorage.setItem(TASKS_KEY, JSON.stringify(this.tasks));
        localStorage.setItem(PROCESSED_KEY, JSON.stringify(this.processedEvents));
      } catch (err) {
        console.warn('云端数据写入本地失败', err);
      }
      this.renderAll({ animate: false });
      if (!meta.silent) {
        this.toast(
          '云端数据已同步',
          `${this.tasks.length} 笔记录 · ${this.processedEvents.length} 条已处理${meta.updatedAt ? ` · ${localDateTimeFromIso(meta.updatedAt)}` : ''}`,
          'ok'
        );
      }
    } finally {
      this.applyingCloud = false;
    }
  }

  onCloudStatus(status, detail = {}) {
    if (!this.el.cloudBtn) return;
    const labels = {
      disabled: '云同步',
      'need-login': '需登录',
      connecting: '连接中',
      syncing: '同步中',
      connected: '已连接',
      error: '同步异常',
      offline: '离线',
    };
    const label = labels[status] || '云同步';
    this.el.cloudLabel.textContent = label;
    this.el.cloudBtn.dataset.status = status;
    this.el.cloudBtn.classList.toggle('is-connected', status === 'connected');
    this.el.cloudBtn.classList.toggle('is-syncing', status === 'connecting' || status === 'syncing');
    this.el.cloudBtn.classList.toggle('is-error', status === 'error');
    this.el.cloudBtn.classList.toggle('is-warn', status === 'need-login');
    this.el.cloudBtn.title = detail.message
      ? `云同步：${detail.message}`
      : `腾讯云开发 · ${label}`;
    if (this.cloudOpen) this.renderCloudSettings();
  }

  openCloudModal() {
    this.cloudOpen = true;
    this.el.cloud.classList.add('is-open');
    this.el.cloud.setAttribute('aria-hidden', 'false');
    this.syncModalBodyClass();
    this.renderCloudSettings(true);
  }

  closeCloudModal(immediate = false) {
    this.cloudOpen = false;
    this.el.cloud.classList.remove('is-open');
    this.el.cloud.setAttribute('aria-hidden', 'true');
    this.syncModalBodyClass();
  }

  renderCloudSettings(populate = false) {
    if (!this.cloud || !this.el.cloudEnv) return;
    const cs = this.cloud;
    if (populate) {
      this.el.cloudEnv.value = cs.envId;
    }
    this.el.cloudAuto.checked = cs.autoSync;
    this.el.cloudDomain.textContent = location.host || location.origin;
    const statusLabels = {
      disabled: '未配置',
      'need-login': '未连接',
      connecting: '连接中',
      syncing: '同步中',
      connected: '已连接',
      error: '同步异常',
      offline: '离线',
    };
    this.el.cloudStatus.textContent = statusLabels[cs.status] || '未配置';
    this.el.cloudStatus.className = `rb-cloud-status is-${cs.status}`;
    this.el.cloudMeta.textContent = cs.isConnected()
      ? `匿名设备 · ${cs.deviceId}`
      : (cs.envId ? '已填写环境，点击连接开始同步' : '填写环境 ID 后连接云开发即可同步');
    this.el.cloudLast.textContent = cs.lastSyncAt
      ? `最近同步 ${localDateTimeFromIso(cs.lastSyncAt)}`
      : '尚未同步';
    this.el.cloudMessage.textContent = cs.errorDetail || '';
    this.el.cloudMessage.classList.toggle('is-error', !!cs.errorDetail);
    this.el.cloudConnectBtn.disabled = this.cloudBusy || cs.isConnected();
    this.el.cloudDisconnectBtn.disabled = this.cloudBusy || !cs.isConnected();
    const connectLabel = this.el.cloudConnectBtn.querySelector('span');
    if (connectLabel) connectLabel.textContent = this.cloudBusy ? '连接中…' : '连接云开发';
  }

  setCloudBusy(busy) {
    this.cloudBusy = busy;
    this.renderCloudSettings();
  }

  showCloudError(message) {
    if (this.cloud) this.cloud.errorDetail = message;
    if (this.el.cloudMessage) {
      this.el.cloudMessage.textContent = message;
      this.el.cloudMessage.classList.add('is-error');
    }
    this.toast('云同步失败', message);
  }

  clearCloudError() {
    if (this.cloud) this.cloud.errorDetail = '';
    if (this.el.cloudMessage) {
      this.el.cloudMessage.textContent = '';
      this.el.cloudMessage.classList.remove('is-error');
    }
  }

  async cloudConnect() {
    if (this.cloudBusy || !this.cloud) return;
    const envId = this.el.cloudEnv.value.trim();
    if (!envId) {
      this.showCloudError('请先填写云开发环境 ID。');
      return;
    }
    this.clearCloudError();
    this.setCloudBusy(true);
    try {
      await this.cloud.connect({ envId, autoSync: this.el.cloudAuto.checked });
      this.renderCloudSettings();
    } catch (err) {
      this.showCloudError(err.message || '连接云开发失败');
    } finally {
      this.setCloudBusy(false);
    }
  }

  async cloudDisconnect() {
    if (this.cloudBusy || !this.cloud) return;
    this.setCloudBusy(true);
    try {
      await this.cloud.disconnect();
      this.renderCloudSettings();
      this.toast('已断开云开发', '本机数据仍保留，可随时重新连接。');
    } finally {
      this.setCloudBusy(false);
    }
  }

  async cloudUpload() {
    if (!this.cloud?.isConnected()) {
      this.showCloudError('请先连接云开发。');
      return;
    }
    await this.cloud.pushNow({ force: true, override: true });
    this.renderCloudSettings();
  }

  async cloudDownload() {
    if (!this.cloud?.isConnected()) {
      this.showCloudError('请先连接云开发。');
      return;
    }
    try {
      await this.cloud.pullNow();
      this.renderCloudSettings();
    } catch (err) {
      this.showCloudError(err.message || '从云端拉取失败');
    }
  }

  async cloudSyncAttachments() {
    if (!this.cloud?.isConnected()) {
      this.showCloudError('请先连接云开发。');
      return;
    }
    await this.cloud.syncAllAttachments();
    this.renderCloudSettings();
  }

  findAttachmentMeta(id) {
    for (const task of this.tasks) {
      for (const meta of task.attachments || []) {
        if (meta.id === id) return meta;
      }
    }
    return null;
  }

  async ensureAttachmentBlob(meta) {
    if (!meta) return null;
    let blob = null;
    try { blob = await readAttachmentBlob(meta.id); } catch { blob = null; }
    if (blob) return blob;
    if (meta.cloudFileId && this.cloud?.isConnected()) {
      try {
        const downloaded = await this.cloud.downloadAttachment(meta.cloudFileId);
        if (downloaded) {
          const file = new File([downloaded], meta.name || '附件', {
            type: meta.type || 'application/octet-stream',
          });
          await storeAttachmentBlob(meta.id, file);
          return file;
        }
      } catch (err) {
        console.warn('云端附件下载失败', meta.name, err);
      }
    }
    return null;
  }

  statementTasks(month) {
    const { start, end } = monthRange(month);
    return this.tasks.filter((t) => {
      const key = dateKeyOf(t.appliedAt);
      return key >= start && key <= end && (t.status === 'reimbursed' || t.status === 'supplemented');
    });
  }

  buildStatement(month) {
    const { start, end, year, month: monthNumber, last } = monthRange(month);
    const tasks = this.statementTasks(month);
    const cells = new Map();
    let recognized = 0;
    for (const t of tasks) {
      const { unit, costRow, amount } = mapCostToStatement(t);
      const key = `${costRow}|${unit}`;
      cells.set(key, (cells.get(key) || 0) + amount);
      recognized += amount;
    }
    const rows = MONTHLY_COST_ROWS.map((label, i) => {
      const unitAmounts = {};
      let total = 0;
      for (const u of BUSINESS_UNITS) {
        const value = cells.get(`${label}|${u.key}`) || 0;
        unitAmounts[u.key] = value;
        total += value;
      }
      return { code: i + 2, label, unitAmounts, total };
    });
    const unitTotals = {};
    for (const u of BUSINESS_UNITS) {
      unitTotals[u.key] = rows.reduce((s, r) => s + (r.unitAmounts[u.key] || 0), 0);
    }
    const grand = rows.reduce((s, r) => s + r.total, 0);
    return {
      month, start, end, year, monthNumber, last,
      label: `${year}.${pad(monthNumber)}`,
      tasks, count: tasks.length, recognized, rows, unitTotals, grand,
      generatedAt: localTimestamp(),
    };
  }

  statementHtml(data) {
    const unit = (v) => (v > 0 ? money(v) : '');
    const unitHeads = BUSINESS_UNITS.map((u) => `<th>${u.label}</th>`).join('');
    const rows = data.rows.map((r, i) => `
      <tr>
        <td class="is-code">${r.code}</td>
        ${i === 0 ? `<td rowspan="${data.rows.length}" class="is-groupcell">运营支出</td>` : ''}
        <td class="is-item">${r.label}</td>
        ${BUSINESS_UNITS.map((u) => `<td class="is-money">${unit(r.unitAmounts[u.key])}</td>`).join('')}
        <td class="is-money is-total">${unit(r.total)}</td>
      </tr>`).join('');
    return `
      <div class="rb-fin-paper">
        <div class="rb-fin-head">
          <div class="rb-fin-meta">
            <span>编制对象：GOOD WORK</span>
            <span>编制人：财务部</span>
            <span>统计口径：当月已报销成本（含已补充附件）</span>
          </div>
          <div class="rb-fin-title-wrap">
            <h3>GOODWORK 车房现金流量表</h3>
            <span>CASH FLOW STATEMENT · ${data.label}</span>
          </div>
          <div class="rb-fin-meta is-right">
            <span>编制月份：${data.label}</span>
            <span>账期：${data.start} 至 ${data.end}</span>
            <span>文件编号：1000 Y008</span>
          </div>
        </div>
        ${data.count === 0 ? '<div class="rb-fin-empty-note">本月暂无已报销成本，表格按标准模板展示；将待报销记录拖入「已报销」后即可自动填入。</div>' : ''}
        <div class="rb-fin-table-wrap">
          <table class="rb-fin-table">
            <colgroup>
              <col class="col-code" />
              <col class="col-group" />
              <col class="col-item" />
              ${BUSINESS_UNITS.map(() => '<col class="col-unit" />').join('')}
              <col class="col-total" />
            </colgroup>
            <thead>
              <tr>
                <th class="is-code">行次</th>
                <th colspan="2">项目</th>
                ${unitHeads}
                <th class="is-total">总额</th>
              </tr>
            </thead>
            <tbody>
              <tr class="is-group">
                <td class="is-code">1</td>
                <td colspan="2" class="is-center">实际收入</td>
                ${BUSINESS_UNITS.map(() => '<td></td>').join('')}
                <td class="is-total"></td>
              </tr>
              ${rows}
              <tr class="is-subtotal">
                <td class="is-code">32</td>
                <td colspan="2" class="is-center">小计</td>
                ${BUSINESS_UNITS.map((u) => `<td class="is-money">${money(data.unitTotals[u.key] || 0)}</td>`).join('')}
                <td class="is-money is-total">${money(data.grand)}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="rb-fin-foot">
          <span>共 ${data.count} 笔已报销成本 · 已识别金额 ¥${money(data.recognized)}</span>
          <span>生成于 ${data.generatedAt} · 成本分类自动映射</span>
        </div>
      </div>`;
  }

  renderStatement() {
    const data = this.buildStatement(this.statementMonth);
    this.el.statementMonthEl.value = this.statementMonth;
    this.el.statementMeta.textContent = `${data.label} · 账期 ${data.start} 至 ${data.end} · ${data.count} 笔已报销成本 · ¥${money(data.grand)}`;
    this.el.statementBody.innerHTML = this.statementHtml(data);
    this._statementData = data;
  }

  buildStatementWorkbook(XLSX, data) {
    const wb = XLSX.utils.book_new();
    const blank = (n) => new Array(n).fill('');
    const aoa = [];
    aoa.push(['GOODWORK 车房现金流量表', ...blank(10)]);
    aoa.push(['编制对象：GOOD WORK', '', '', '', '', '', '', '', `编制月份：${data.label}`, '', '']);
    aoa.push(['编制人：财务部', '', '', '', '', '', '', '', `账期：${data.start} 至 ${data.end}`, '', '']);
    aoa.push(['统计口径：当月已报销成本（含已补充附件）', '', '', '', '', '', '', '', '文件编号：1000 Y008', '', '']);
    aoa.push(['行次', '项目', '', ...BUSINESS_UNITS.map((u) => u.label), '总额']);
    aoa.push(['1', '实际收入', '', ...blank(8)]);
    data.rows.forEach((r, i) => {
      aoa.push([
        r.code,
        i === 0 ? '运营支出' : '',
        r.label,
        ...BUSINESS_UNITS.map((u) => (r.unitAmounts[u.key] > 0 ? r.unitAmounts[u.key] : '')),
        r.total > 0 ? r.total : '',
      ]);
    });
    aoa.push(['32', '小计', '', ...BUSINESS_UNITS.map((u) => data.unitTotals[u.key] || 0), data.grand]);
    aoa.push(blank(11));
    aoa.push(['说明：成本按报销分类自动映射至本表项目；待报销记录不计入本表。', ...blank(10)]);
    const ws = XLSX.utils.aoa_to_sheet(aoa);

    ws['!merges'] = [
      { s: { r: 0, c: 0 }, e: { r: 0, c: 10 } },
      { s: { r: 1, c: 0 }, e: { r: 1, c: 2 } },
      { s: { r: 2, c: 0 }, e: { r: 2, c: 2 } },
      { s: { r: 3, c: 0 }, e: { r: 3, c: 2 } },
      { s: { r: 1, c: 8 }, e: { r: 1, c: 10 } },
      { s: { r: 2, c: 8 }, e: { r: 2, c: 10 } },
      { s: { r: 3, c: 8 }, e: { r: 3, c: 10 } },
      { s: { r: 4, c: 1 }, e: { r: 4, c: 2 } },
      { s: { r: 5, c: 1 }, e: { r: 5, c: 2 } },
      { s: { r: 6, c: 1 }, e: { r: 6 + data.rows.length - 1, c: 1 } },
      { s: { r: 6 + data.rows.length, c: 1 }, e: { r: 6 + data.rows.length, c: 2 } },
      { s: { r: 6 + data.rows.length + 2, c: 0 }, e: { r: 6 + data.rows.length + 2, c: 10 } },
    ];
    ws['!cols'] = [
      { wch: 6 }, { wch: 10 }, { wch: 27 },
      ...BUSINESS_UNITS.map(() => ({ wch: 14 })),
      { wch: 16 },
    ];
    ws['!rows'] = [
      { hpt: 30 }, { hpt: 17 }, { hpt: 17 }, { hpt: 17 }, { hpt: 25 },
      ...Array(data.rows.length + 2).fill({ hpt: 18 }),
      { hpt: 10 }, { hpt: 24 },
    ];

    const border = {
      top: { style: 'thin', color: { rgb: 'FF7F7F7F' } },
      bottom: { style: 'thin', color: { rgb: 'FF7F7F7F' } },
      left: { style: 'thin', color: { rgb: 'FF7F7F7F' } },
      right: { style: 'thin', color: { rgb: 'FF7F7F7F' } },
    };
    const cellAt = (r, c) => {
      const addr = XLSX.utils.encode_cell({ r, c });
      if (!ws[addr]) ws[addr] = { t: 's', v: '' };
      return ws[addr];
    };
    for (let r = 4; r <= 6 + data.rows.length; r++) {
      for (let c = 0; c <= 10; c++) {
        const cell = cellAt(r, c);
        cell.s = {
          font: { name: '宋体', sz: 10, color: { rgb: 'FF1F1F1F' } },
          alignment: { horizontal: 'center', vertical: 'center', wrapText: true },
          border,
        };
        if (c >= 3) {
          cell.s.alignment = { horizontal: 'right', vertical: 'center' };
          cell.s.numFmt = '#,##0.00';
        }
      }
    }
    // 标题
    cellAt(0, 0).s = {
      font: { name: '宋体', sz: 16, bold: true, color: { rgb: 'FF111111' } },
      alignment: { horizontal: 'center', vertical: 'center' },
    };
    // 表头上底色
    for (let c = 0; c <= 10; c++) {
      const cell = cellAt(4, c);
      cell.s.fill = { fgColor: { rgb: 'FFE7E6E6' } };
      cell.s.font = { name: '宋体', sz: 10, bold: true };
      cell.s.alignment = { horizontal: 'center', vertical: 'center', wrapText: true };
    }
    // 实际收入 / 小计 / 分组列
    for (let c = 0; c <= 10; c++) {
      cellAt(5, c).s.fill = { fgColor: { rgb: 'FFE7E6E6' } };
      cellAt(6 + data.rows.length, c).s.fill = { fgColor: { rgb: 'FFE7E6E6' } };
      cellAt(6 + data.rows.length, c).s.font = { name: '宋体', sz: 10, bold: true };
    }
    cellAt(6, 1).s.alignment = { horizontal: 'center', vertical: 'center', textRotation: 0 };
    // 项目列左对齐
    for (let r = 6; r < 6 + data.rows.length; r++) {
      cellAt(r, 2).s.alignment = { horizontal: 'left', vertical: 'center', indent: 1 };
    }
    cellAt(6 + data.rows.length, 2).s.alignment = { horizontal: 'center', vertical: 'center' };
    // 说明
    cellAt(6 + data.rows.length + 2, 0).s = {
      font: { name: '宋体', sz: 9, italic: true, color: { rgb: 'FF666666' } },
      alignment: { horizontal: 'left', vertical: 'center' },
    };

    XLSX.utils.book_append_sheet(wb, ws, '月度现金流量表');
    return wb;
  }

  async exportStatement() {
    if (this.exporting) return;
    const data = this._statementData || this.buildStatement(this.statementMonth);
    this.exporting = true;
    const btn = $('[data-rb="statement-export"]', this.root);
    if (btn) btn.disabled = true;
    try {
      const XLSX = await this.loadXLSX();
      const wb = this.buildStatementWorkbook(XLSX, data);
      const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array', cellStyles: true });
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileName = `GOODWORK_月度现金流量表_${data.month}.xlsx`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      if (this.folderStatus === 'connected' && await this.ensureFolderPermission(false)) {
        try {
          const fh = await this.folderHandle.getFileHandle(fileName, { create: true });
          const w = await fh.createWritable();
          await w.write(blob);
          await w.close();
        } catch (err) {
          console.warn('月度财务报表写入 D 盘失败', err);
        }
      }
      this.toast('月度财务报表已导出', `${data.label} · ${data.count} 笔已报销成本 · 与图片表格同版式。`, 'ok');
    } catch (err) {
      console.error(err);
      this.toast('导出失败', err?.message || '请稍后重试。');
    } finally {
      this.exporting = false;
      if (btn) btn.disabled = false;
    }
  }

  /* ---------------- 当日已处理待报销 ---------------- */

  async exportProcessed() {
    if (this.exporting) return;
    const month = currentMonthValue();
    const { start, end, last } = monthRange(month);
    const events = this.processedEvents
      .filter((e) => e.eventDate >= start && e.eventDate <= end)
      .sort((a, b) => String(a.timestamp).localeCompare(String(b.timestamp)));
    if (!events.length) {
      this.toast('本月还没有已处理记录', '当「待报销」被流转为「已报销」时，会自动累计到本报表。');
      return;
    }
    this.exporting = true;
    if (this.el.processedExport) this.el.processedExport.disabled = true;
    try {
      const XLSX = await this.loadXLSX();
      const wb = XLSX.utils.book_new();
      const today = toDateKey();
      const dayLimit = month === currentMonthValue() ? Number(today.slice(8, 10)) : last;
      const dailyMap = new Map();
      for (const e of events) {
        const item = dailyMap.get(e.eventDate) || { count: 0, amount: 0 };
        item.count += 1;
        item.amount += Number(e.amount) || 0;
        dailyMap.set(e.eventDate, item);
      }
      const daily = [['日期', '处理笔数', '待报销处理金额']];
      for (let d = 1; d <= dayLimit; d++) {
        const key = `${month}-${pad(d)}`;
        const item = dailyMap.get(key) || { count: 0, amount: 0 };
        daily.push([key, item.count, item.amount]);
      }
      const totalCount = events.length;
      const totalAmount = events.reduce((s, e) => s + (Number(e.amount) || 0), 0);
      daily.push(['合计', totalCount, totalAmount]);
      const wsDaily = XLSX.utils.aoa_to_sheet(daily);
      wsDaily['!cols'] = [{ wch: 14 }, { wch: 12 }, { wch: 20 }];
      for (let r = 2; r <= daily.length; r++) {
        const c = wsDaily[`C${r}`];
        if (c) c.z = '#,##0.00';
      }
      XLSX.utils.book_append_sheet(wb, wsDaily, '每日汇总');

      const detail = [['日期', '时间', '申请人', '部门', '报销分类', '报销金额', '是否有发票', '报销内容']];
      for (const e of events) {
        detail.push([
          e.eventDate, localTimeFromIso(e.timestamp), e.applicant, e.department,
          e.category, Number(e.amount) || 0, e.hasInvoice ? '是' : '否', e.content || '',
        ]);
      }
      const wsDetail = XLSX.utils.aoa_to_sheet(detail);
      wsDetail['!cols'] = [
        { wch: 12 }, { wch: 9 }, { wch: 11 }, { wch: 12 }, { wch: 15 },
        { wch: 14 }, { wch: 11 }, { wch: 40 },
      ];
      for (let r = 2; r <= detail.length; r++) {
        const c = wsDetail[`F${r}`];
        if (c) c.z = '#,##0.00';
      }
      XLSX.utils.book_append_sheet(wb, wsDetail, '处理明细');

      const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array', cellStyles: true });
      const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      const fileName = `GOODWORK_已处理报销日报_${month}.xlsx`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      if (this.folderStatus === 'connected' && await this.ensureFolderPermission(false)) {
        try {
          const fh = await this.folderHandle.getFileHandle(fileName, { create: true });
          const w = await fh.createWritable();
          await w.write(blob);
          await w.close();
        } catch (err) {
          console.warn('已处理日报写入 D 盘失败', err);
        }
      }
      this.toast('本月已处理日报已导出', `${month} · ${totalCount} 笔 · ¥${money(totalAmount)} · 每日汇总 + 明细时间。`, 'ok');
    } catch (err) {
      console.error(err);
      this.toast('导出失败', err?.message || '请稍后重试。');
    } finally {
      this.exporting = false;
      if (this.el.processedExport) this.el.processedExport.disabled = false;
    }
  }

  /* ---------------- Excel ---------------- */

  async loadXLSX() {
    if (window.XLSX) return window.XLSX;
    const url = new URL('vendor/xlsx.full.min.js', document.baseURI).href;
    await new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-goodwork-xlsx]');
      if (existing) {
        if (window.XLSX) resolve();
        else existing.addEventListener('load', resolve, { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = url;
      script.dataset.goodworkXlsx = '1';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('Excel 组件加载失败'));
      document.head.appendChild(script);
    });
    if (!window.XLSX) throw new Error('Excel 组件未就绪');
    return window.XLSX;
  }

  async loadExcelJS() {
    if (window.ExcelJS) return window.ExcelJS;
    const url = new URL('vendor/exceljs.min.js', document.baseURI).href;
    await new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-goodwork-exceljs]');
      if (existing) {
        if (window.ExcelJS) resolve();
        else existing.addEventListener('load', resolve, { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = url;
      script.dataset.goodworkExceljs = '1';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('ExcelJS 组件加载失败'));
      document.head.appendChild(script);
    });
    if (!window.ExcelJS) throw new Error('ExcelJS 组件未就绪');
    return window.ExcelJS;
  }

  async loadFFlate() {
    if (window.fflate) return window.fflate;
    const url = new URL('vendor/fflate.min.js', document.baseURI).href;
    await new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-goodwork-fflate]');
      if (existing) {
        if (window.fflate) resolve();
        else existing.addEventListener('load', resolve, { once: true });
        return;
      }
      const script = document.createElement('script');
      script.src = url;
      script.dataset.goodworkFflate = '1';
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('fflate 组件加载失败'));
      document.head.appendChild(script);
    });
    if (!window.fflate) throw new Error('fflate 组件未就绪');
    return window.fflate;
  }

  injectInternalHyperlinks(fflate, buffer, links) {
    const escAttr = (value) => String(value)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;');
    let bytes;
    if (buffer instanceof Uint8Array) bytes = buffer;
    else if (buffer instanceof ArrayBuffer) bytes = new Uint8Array(buffer);
    else bytes = new Uint8Array(buffer.buffer, buffer.byteOffset || 0, buffer.byteLength);
    const zip = fflate.unzipSync(bytes);
    const read = (path) => (zip[path] ? fflate.strFromU8(zip[path]) : null);
    const workbookXml = read('xl/workbook.xml');
    const relsXml = read('xl/_rels/workbook.xml.rels');
    if (!workbookXml || !relsXml) return null;
    const sheetPath = (name) => {
      const sheetTag = [...workbookXml.matchAll(/<sheet\b[^>]*\/?>/g)]
        .map((m) => m[0])
        .find((tag) => tag.includes(`name="${name}"`));
      if (!sheetTag) return null;
      const rid = sheetTag.match(/r:id="([^"]+)"/)?.[1];
      if (!rid) return null;
      const relTag = [...relsXml.matchAll(/<Relationship\b[^>]*\/?>/g)]
        .map((m) => m[0])
        .find((tag) => tag.includes(`Id="${rid}"`));
      const target = relTag?.match(/Target="([^"]+)"/)?.[1];
      if (!target) return null;
      return target.startsWith('/') ? target.slice(1) : `xl/${target}`;
    };
    const inject = (name, items) => {
      if (!items.length) return;
      const path = sheetPath(name);
      if (!path || !zip[path]) return;
      let xml = read(path);
      if (!xml || xml.includes('<hyperlinks')) return;
      const block = `<hyperlinks>${items.map((item) => `<hyperlink ref="${escAttr(item.ref)}" location="${escAttr(item.location)}" display="${escAttr(item.display)}"/>`).join('')}</hyperlinks>`;
      if (xml.includes('<pageMargins')) xml = xml.replace('<pageMargins', `${block}<pageMargins`);
      else xml = xml.replace('</worksheet>', `${block}</worksheet>`);
      zip[path] = fflate.strToU8(xml);
    };
    inject('报销明细', links.detail);
    inject('附件清单', links.files);
    return fflate.zipSync(zip, { level: 6 });
  }

  loadImageFromUrl(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('图片无法解码'));
      img.src = url;
    });
  }

  async blobToPreviewPng(blob) {
    const url = URL.createObjectURL(blob);
    try {
      const img = await this.loadImageFromUrl(url);
      const nw = img.naturalWidth || img.width || 640;
      const nh = img.naturalHeight || img.height || 480;
      const scale = Math.min(1, 820 / Math.max(nw, nh));
      const width = Math.max(1, Math.round(nw * scale));
      const height = Math.max(1, Math.round(nh * scale));
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, width, height);
      ctx.drawImage(img, 0, 0, width, height);
      return {
        base64: canvas.toDataURL('image/png').split(',')[1],
        width,
        height,
      };
    } finally {
      URL.revokeObjectURL(url);
    }
  }

  async makeAttachmentStrip(items) {
    const W = 186;
    const H = 62;
    const canvas = document.createElement('canvas');
    canvas.width = W;
    canvas.height = H;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#f6f3ec';
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = '#d7d0c1';
    ctx.strokeRect(0.5, 0.5, W - 1, H - 1);
    let x = 4;
    let shown = 0;
    for (const item of items) {
      if (shown >= 3 || x + 56 > W - 4) break;
      if (item.image) {
        try {
          const img = await this.loadImageFromUrl(`data:image/png;base64,${item.image.base64}`);
          const iw = img.naturalWidth || img.width || 1;
          const ih = img.naturalHeight || img.height || 1;
          const ratio = Math.max(56 / iw, 52 / ih);
          const sw = 56 / ratio;
          const sh = 52 / ratio;
          const sx = (iw - sw) / 2;
          const sy = (ih - sh) / 2;
          ctx.drawImage(img, sx, sy, sw, sh, x, 5, 56, 52);
        } catch {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(x, 5, 56, 52);
        }
      } else {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(x, 5, 56, 52);
        const ext = (String(item.name).match(/\.([A-Za-z0-9]{1,5})$/) || [])[1] || 'DOC';
        ctx.fillStyle = '#b08d57';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(ext.toUpperCase(), x + 28, 35);
        ctx.fillStyle = '#8a8a8a';
        ctx.font = '8px sans-serif';
        ctx.fillText('文档', x + 28, 48);
      }
      ctx.strokeStyle = '#cfc7b6';
      ctx.strokeRect(x + 0.5, 5.5, 55, 51);
      shown++;
      x += 60;
    }
    if (items.length > shown) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.78)';
      ctx.fillRect(W - 40, 4, 36, 18);
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 10px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(`+${items.length - shown}`, W - 22, 17);
    }
    return canvas.toDataURL('image/png').split(',')[1];
  }

  async prepareExcelAttachments(stats) {
    const byTask = new Map();
    const previewTasks = [];
    let imageCount = 0;
    let docCount = 0;
    let missingCount = 0;
    for (const task of stats.tasks) {
      const items = [];
      for (const meta of task.attachments || []) {
        let blob = null;
        try { blob = await this.ensureAttachmentBlob(meta); } catch { blob = null; }
        const isImage = isImageFile({ name: meta.name, type: meta.type });
        let image = null;
        if (blob && isImage) {
          try {
            image = await this.blobToPreviewPng(blob);
          } catch (err) {
            console.warn('附件图片预览生成失败', meta.name, err);
          }
        }
        if (image) imageCount++;
        else if (isImage) missingCount++;
        else docCount++;
        items.push({
          id: meta.id,
          name: meta.name || '附件',
          size: Number(meta.size) || 0,
          type: meta.type || '',
          isImage,
          image,
          missing: !blob,
          previewRow: 0,
          previewWidth: 0,
          previewHeight: 0,
        });
      }
      if (items.length) {
        const entry = { task, items, strip: '', sectionRow: 0 };
        try {
          entry.strip = await this.makeAttachmentStrip(items);
        } catch (err) {
          console.warn('附件缩略图生成失败', err);
        }
        byTask.set(task.id, entry);
        previewTasks.push(entry);
      }
    }
    let row = 4;
    for (const entry of previewTasks) {
      entry.sectionRow = row;
      row += 1;
      for (const item of entry.items) {
        item.previewRow = row;
        if (item.image) {
          const scale = Math.min(1, 420 / item.image.width, 300 / item.image.height);
          item.previewWidth = Math.max(1, Math.round(item.image.width * scale));
          item.previewHeight = Math.max(1, Math.round(item.image.height * scale));
        }
        row += 1;
      }
      row += 1;
    }
    return {
      byTask,
      previewTasks,
      imageCount,
      docCount,
      missingCount,
      total: imageCount + docCount + missingCount,
    };
  }

  buildStatsWorkbookExcelJS(ExcelJS, stats, start, end, attachmentData) {
    const wb = new ExcelJS.Workbook();
    wb.creator = 'GOODWORK FINANCE OS';
    wb.created = new Date();
    const statusLabel = (s) => STATUS_LABEL[s] || s;
    const thin = { style: 'thin', color: { argb: 'FFD9DEE7' } };
    const border = { top: thin, bottom: thin, left: thin, right: thin };
    const headerFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FF111C2B' } };
    const headerFont = { name: 'Microsoft YaHei', size: 10, bold: true, color: { argb: 'FFE9DFC9' } };
    const bodyFont = { name: 'Microsoft YaHei', size: 9, color: { argb: 'FF2A3442' } };
    const subFill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF4EDE0' } };
    const moneyFmt = '#,##0.00';
    const setWidths = (ws, widths) => widths.forEach((w, i) => { ws.getColumn(i + 1).width = w; });
    const headerRow = (ws, count) => {
      const row = ws.getRow(1);
      row.height = 28;
      for (let c = 1; c <= count; c++) {
        const cell = row.getCell(c);
        cell.font = headerFont;
        cell.fill = headerFill;
        cell.alignment = { vertical: 'middle', horizontal: 'center', wrapText: true };
        cell.border = border;
      }
    };
    const bodyStyle = (row, count, options = {}) => {
      for (let c = 1; c <= count; c++) {
        const cell = row.getCell(c);
        cell.font = bodyFont;
        cell.border = border;
        cell.alignment = {
          vertical: 'middle',
          wrapText: true,
          horizontal: options.center?.includes(c) ? 'center' : 'left',
        };
      }
      for (const c of options.money || []) {
        const cell = row.getCell(c);
        cell.numFmt = moneyFmt;
        cell.alignment = { vertical: 'middle', horizontal: 'right' };
      }
    };
    const links = { detail: [], files: [] };

    const detail = wb.addWorksheet('报销明细', { views: [{ state: 'frozen', ySplit: 1 }] });
    setWidths(detail, [12, 16, 18, 12, 42, 14, 14, 11, 34, 32]);
    detail.addRow(['部门', '报销分类', '时间', '申请人员', '内容', '报销状态', '报销金额', '是否有发票', '高额配件成本属性', '附件']);
    headerRow(detail, 10);
    stats.tasks.forEach((t) => {
      const section = attachmentData.byTask.get(t.id);
      const row = detail.addRow([
        t.department,
        t.category,
        formatDateTime(t.appliedAt),
        t.applicant,
        t.content,
        statusLabel(t.status),
        t.amount,
        t.hasInvoice ? '是' : '否',
        highValueText(t),
        '',
      ]);
      row.height = section ? 88 : 26;
      bodyStyle(row, 10, { center: [6, 8] });
      row.getCell(7).numFmt = moneyFmt;
      row.getCell(7).alignment = { vertical: 'middle', horizontal: 'right' };
      row.getCell(5).alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
      row.getCell(9).alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
      row.getCell(10).alignment = { vertical: 'bottom', horizontal: 'center', wrapText: true };
      if (section) {
        const label = `点击查看 ${section.items.length} 个附件`;
        row.getCell(10).value = label;
        row.getCell(10).font = { name: 'Microsoft YaHei', size: 9, color: { argb: 'FF1D4ED8' }, underline: true };
        links.detail.push({
          ref: `J${row.number}`,
          location: `'附件预览'!A${section.sectionRow}`,
          display: label,
        });
        if (section.strip) {
          try {
            const imageId = wb.addImage({ base64: section.strip, extension: 'png' });
            detail.addImage(imageId, {
              tl: { col: 9.03, row: row.number - 1 + 0.05 },
              ext: { width: 186, height: 62 },
              editAs: 'oneCell',
            });
          } catch (err) {
            console.warn('附件缩略图写入失败', err);
          }
        }
      } else {
        row.getCell(10).value = '—';
        row.getCell(10).alignment = { vertical: 'middle', horizontal: 'center' };
      }
    });
    detail.autoFilter = 'A1:J1';

    const dept = wb.addWorksheet('部门分类统计');
    setWidths(dept, [14, 18, 8, 14, 14, 14, 16, 12, 14]);
    dept.addRow(['部门', '报销分类', '笔数', '合计金额', '待报销金额', '已报销金额', '已补充附件金额', '有发票笔数', '高额配件笔数']);
    headerRow(dept, 9);
    for (const d of stats.departments) {
      for (const c of d.categories) {
        const row = dept.addRow([d.department, c.category, c.count, c.amount, c.pending, c.reimbursed, c.supplemented, c.invoice, c.highValue]);
        bodyStyle(row, 9, { center: [3, 8, 9], money: [4, 5, 6, 7] });
      }
      const row = dept.addRow([d.department, '小计', d.count, d.amount, d.pending, d.reimbursed, d.supplemented, d.invoice, d.highValue]);
      bodyStyle(row, 9, { center: [3, 8, 9], money: [4, 5, 6, 7] });
      row.height = 24;
      for (let c = 1; c <= 9; c++) {
        const cell = row.getCell(c);
        cell.fill = subFill;
        cell.font = { name: 'Microsoft YaHei', size: 9, bold: true, color: { argb: 'FF6B5330' } };
      }
    }

    const emp = wb.addWorksheet('员工报销统计');
    setWidths(emp, [14, 8, 14, 14, 14, 18, 12, 14, 10]);
    emp.addRow(['报销人员', '笔数', '合计金额', '待报销金额', '已报销金额', '已补充附件金额', '无发票笔数', '高额配件笔数', '附件数量']);
    headerRow(emp, 9);
    for (const e of stats.employees) {
      const row = emp.addRow([e.name, e.count, e.amount, e.pending, e.reimbursed, e.supplemented, e.noInvoice, e.highValue, e.files]);
      bodyStyle(row, 9, { center: [2, 7, 8, 9], money: [3, 4, 5, 6] });
    }

    const overview = wb.addWorksheet('总览报告');
    setWidths(overview, [24, 44]);
    overview.mergeCells('A1:B1');
    overview.getCell('A1').value = 'GOODWORK 古德車房 · 报销统计报告';
    overview.getCell('A1').font = { name: 'Microsoft YaHei', size: 16, bold: true, color: { argb: 'FF1F2937' } };
    overview.getCell('A1').alignment = { horizontal: 'left', vertical: 'middle' };
    overview.getRow(1).height = 34;
    const topCategoryAll = stats.departments.flatMap((d) => d.categories.map((c) => ({ d: d.department, c }))).sort((a, b) => b.c.amount - a.c.amount)[0];
    const overviewRows = [
      ['统计范围', `${start} 至 ${end}`],
      ['生成时间', localTimestamp()],
      [],
      ['总览指标', '数值'],
      ['申请总笔数', stats.count],
      ['报销总金额', stats.amount],
      ['待报销金额', stats.statusAmounts.pending],
      ['待报销笔数', stats.statusCounts.pending],
      ['已报销金额', stats.statusAmounts.reimbursed],
      ['已报销笔数', stats.statusCounts.reimbursed],
      ['已补充附件金额', stats.statusAmounts.supplemented],
      ['已补充附件笔数', stats.statusCounts.supplemented],
      ['有发票笔数', stats.invoiceCount],
      ['无发票笔数', stats.count - stats.invoiceCount],
      ['有发票比例', `${(stats.invoiceRate * 100).toFixed(1)}%`],
      ['高额配件笔数', stats.highValueCount],
      ['高额配件金额', stats.highValueAmount],
      ['附件总数', stats.fileCount],
      [],
      ['金额最高部门', stats.departments.slice().sort((a, b) => b.amount - a.amount)[0]?.department || '—'],
      ['金额最高员工', stats.employees[0]?.name || '—'],
      ['金额最高分类', topCategoryAll ? `${topCategoryAll.d} / ${topCategoryAll.c.category}` : '—'],
    ];
    overviewRows.forEach((data) => {
      const row = overview.addRow(data);
      row.height = 22;
      for (let c = 1; c <= 2; c++) {
        const cell = row.getCell(c);
        cell.font = bodyFont;
        cell.border = border;
        cell.alignment = { vertical: 'middle', wrapText: true };
      }
      row.getCell(1).font = { name: 'Microsoft YaHei', size: 9, bold: true, color: { argb: 'FF6B5330' } };
    });
    for (const c of [1, 2]) {
      overview.getRow(4).getCell(c).fill = headerFill;
      overview.getRow(4).getCell(c).font = headerFont;
      overview.getRow(4).getCell(c).alignment = { vertical: 'middle', horizontal: 'center' };
    }
    overview.getRow(4).height = 24;

    const files = wb.addWorksheet('附件清单');
    setWidths(files, [12, 12, 12, 12, 36, 12, 14, 10]);
    files.addRow(['日期', '报销人员', '部门', '金额', '附件名称', '文件大小', '写入状态', '预览']);
    headerRow(files, 8);
    let fileRows = 0;
    for (const t of stats.tasks) {
      for (const a of t.attachments || []) {
        const section = attachmentData.byTask.get(t.id);
        const item = section?.items.find((x) => x.id === a.id);
        const row = files.addRow([
          dateKeyOf(t.appliedAt), t.applicant, t.department, t.amount, a.name,
          a.size, a.written ? '已写入 D 盘' : '本地暂存', '',
        ]);
        bodyStyle(row, 8, { center: [1, 8], money: [4] });
        if (item) {
          row.getCell(8).value = '查看';
          row.getCell(8).font = { name: 'Microsoft YaHei', size: 9, color: { argb: 'FF1D4ED8' }, underline: true };
          row.getCell(8).alignment = { vertical: 'middle', horizontal: 'center' };
          links.files.push({
            ref: `H${row.number}`,
            location: `'附件预览'!A${item.previewRow}`,
            display: '查看',
          });
        } else {
          row.getCell(8).value = '—';
        }
        fileRows++;
      }
    }
    if (!fileRows) {
      files.mergeCells('A2:H2');
      files.getCell('A2').value = '该范围内没有附件';
      files.getCell('A2').alignment = { horizontal: 'center', vertical: 'middle' };
      files.getCell('A2').font = { name: 'Microsoft YaHei', size: 9, color: { argb: 'FF8A8A8A' } };
    }

    if (attachmentData.previewTasks.length) {
      const preview = wb.addWorksheet('附件预览', { views: [{ state: 'frozen', ySplit: 3, showGridLines: false }] });
      setWidths(preview, [64, 30, 18]);
      preview.mergeCells('A1:C1');
      preview.getCell('A1').value = 'GOODWORK 报销附件预览';
      preview.getCell('A1').font = { name: 'Microsoft YaHei', size: 16, bold: true, color: { argb: 'FF1F2937' } };
      preview.getCell('A1').alignment = { horizontal: 'left', vertical: 'middle' };
      preview.getRow(1).height = 34;
      preview.mergeCells('A2:C2');
      preview.getCell('A2').value = `${stats.count} 笔报销 · ${attachmentData.total} 个附件 · 图片凭证可直接预览`;
      preview.getCell('A2').font = { name: 'Microsoft YaHei', size: 9, color: { argb: 'FF6B7280' } };
      preview.getRow(2).height = 22;
      preview.mergeCells('A3:C3');
      preview.getCell('A3').value = '点击报销明细附件列的「点击查看 N 个附件」可跳转到本页。图片凭证已嵌入；PDF / Word / Excel 等文档请在报销工作台中下载原文件查看。';
      preview.getCell('A3').font = { name: 'Microsoft YaHei', size: 8, color: { argb: 'FF8A8A8A' } };
      preview.getCell('A3').alignment = { vertical: 'middle', wrapText: true };
      preview.getRow(3).height = 30;

      for (const entry of attachmentData.previewTasks) {
        const t = entry.task;
        const sectionRow = preview.getRow(entry.sectionRow);
        sectionRow.height = 26;
        preview.mergeCells(`A${entry.sectionRow}:C${entry.sectionRow}`);
        const sectionCell = preview.getCell(`A${entry.sectionRow}`);
        sectionCell.value = `【${t.applicant}】${formatDateTime(t.appliedAt)} · ${t.department} / ${t.category} · ¥${money(t.amount)} · ${entry.items.length} 个附件`;
        sectionCell.fill = subFill;
        sectionCell.font = { name: 'Microsoft YaHei', size: 10, bold: true, color: { argb: 'FF4B3A20' } };
        sectionCell.alignment = { vertical: 'middle', horizontal: 'left' };

        for (const item of entry.items) {
          if (item.image) {
            preview.getRow(item.previewRow).height = Math.max(60, Math.ceil(item.previewHeight / 1.333) + 8);
            try {
              const imageId = wb.addImage({ base64: item.image.base64, extension: 'png' });
              preview.addImage(imageId, {
                tl: { col: 0.03, row: item.previewRow - 1 + 0.04 },
                ext: { width: item.previewWidth, height: item.previewHeight },
                editAs: 'oneCell',
              });
            } catch (err) {
              console.warn('附件预览图写入失败', err);
            }
            preview.mergeCells(`B${item.previewRow}:C${item.previewRow}`);
            const metaCell = preview.getCell(`B${item.previewRow}`);
            metaCell.value = `${item.name}\n${formatBytes(item.size)} · 图片凭证`;
            metaCell.font = { name: 'Microsoft YaHei', size: 9, color: { argb: 'FF374151' } };
            metaCell.alignment = { vertical: 'top', horizontal: 'left', wrapText: true };
          } else {
            preview.getRow(item.previewRow).height = 40;
            preview.mergeCells(`A${item.previewRow}:C${item.previewRow}`);
            const docCell = preview.getCell(`A${item.previewRow}`);
            docCell.value = item.missing
              ? `附件缓存缺失：${item.name}（${formatBytes(item.size)}）`
              : `文档附件：${item.name}（${formatBytes(item.size)}）· 请在报销工作台中下载原文件查看`;
            docCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF9F6EF' } };
            docCell.font = { name: 'Microsoft YaHei', size: 9, color: { argb: 'FF6B5330' } };
            docCell.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
            docCell.border = border;
          }
        }
        preview.getRow(entry.sectionRow + entry.items.length + 1).height = 10;
      }
    }

    wb.__goodworkLinks = links;
    return wb;
  }

  buildWorkbook(XLSX, stats, start, end) {
    const wb = XLSX.utils.book_new();
    const statusLabel = (s) => STATUS_LABEL[s] || s;
    const attachmentsText = (t) => t.attachments?.map((a) => a.name).join('；') || '—';
    const detail = [
      ['部门', '报销分类', '时间', '申请人员', '内容', '报销状态', '报销金额', '是否有发票', '高额配件成本属性', '附件'],
      ...stats.tasks.map((t) => [
        t.department, t.category, formatDateTime(t.appliedAt), t.applicant, t.content,
        statusLabel(t.status), t.amount, t.hasInvoice ? '是' : '否', highValueText(t), attachmentsText(t),
      ]),
    ];
    const wsDetail = XLSX.utils.aoa_to_sheet(detail);
    wsDetail['!cols'] = [
      { wch: 12 }, { wch: 16 }, { wch: 18 }, { wch: 12 }, { wch: 42 },
      { wch: 14 }, { wch: 14 }, { wch: 11 }, { wch: 36 }, { wch: 32 },
    ];
    wsDetail['!autofilter'] = { ref: `A1:J${detail.length}` };
    for (let r = 2; r <= detail.length; r++) {
      const cell = wsDetail[`G${r}`];
      if (cell) cell.z = '#,##0.00';
    }
    XLSX.utils.book_append_sheet(wb, wsDetail, '报销明细');

    const deptRows = [[
      '部门', '报销分类', '笔数', '合计金额', '待报销金额', '已报销金额', '已补充附件金额', '有发票笔数', '高额配件笔数',
    ]];
    for (const d of stats.departments) {
      for (const c of d.categories) {
        deptRows.push([d.department, c.category, c.count, c.amount, c.pending, c.reimbursed, c.supplemented, c.invoice, c.highValue]);
      }
      deptRows.push([d.department, '小计', d.count, d.amount, d.pending, d.reimbursed, d.supplemented, d.invoice, d.highValue]);
    }
    const wsDept = XLSX.utils.aoa_to_sheet(deptRows);
    wsDept['!cols'] = [{ wch: 14 }, { wch: 18 }, { wch: 8 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 16 }, { wch: 12 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, wsDept, '部门分类统计');

    const empRows = [['报销人员', '笔数', '合计金额', '待报销金额', '已报销金额', '已补充附件金额', '无发票笔数', '高额配件笔数', '附件数量']];
    for (const e of stats.employees) {
      empRows.push([e.name, e.count, e.amount, e.pending, e.reimbursed, e.supplemented, e.noInvoice, e.highValue, e.files]);
    }
    const wsEmp = XLSX.utils.aoa_to_sheet(empRows);
    wsEmp['!cols'] = [{ wch: 14 }, { wch: 8 }, { wch: 14 }, { wch: 14 }, { wch: 14 }, { wch: 18 }, { wch: 12 }, { wch: 14 }, { wch: 10 }];
    XLSX.utils.book_append_sheet(wb, wsEmp, '员工报销统计');

    const overview = [
      ['GOODWORK 古德車房 · 报销统计报告'],
      ['统计范围', `${start} 至 ${end}`],
      ['生成时间', localTimestamp()],
      [],
      ['总览指标', '数值'],
      ['申请总笔数', stats.count],
      ['报销总金额', stats.amount],
      ['待报销金额', stats.statusAmounts.pending],
      ['待报销笔数', stats.statusCounts.pending],
      ['已报销金额', stats.statusAmounts.reimbursed],
      ['已报销笔数', stats.statusCounts.reimbursed],
      ['已补充附件金额', stats.statusAmounts.supplemented],
      ['已补充附件笔数', stats.statusCounts.supplemented],
      ['有发票笔数', stats.invoiceCount],
      ['无发票笔数', stats.count - stats.invoiceCount],
      ['有发票比例', `${(stats.invoiceRate * 100).toFixed(1)}%`],
      ['高额配件笔数', stats.highValueCount],
      ['高额配件金额', stats.highValueAmount],
      ['附件总数', stats.fileCount],
      [],
      ['金额最高部门', stats.departments.slice().sort((a, b) => b.amount - a.amount)[0]?.department || '—'],
      ['金额最高员工', stats.employees[0]?.name || '—'],
      ['金额最高分类', (() => {
        const all = stats.departments.flatMap((d) => d.categories.map((c) => ({ d: d.department, c })));
        const top = all.sort((a, b) => b.c.amount - a.c.amount)[0];
        return top ? `${top.d} / ${top.c.category}` : '—';
      })()],
    ];
    const wsOverview = XLSX.utils.aoa_to_sheet(overview);
    wsOverview['!cols'] = [{ wch: 22 }, { wch: 30 }];
    XLSX.utils.book_append_sheet(wb, wsOverview, '总览报告');

    const files = [['日期', '报销人员', '部门', '金额', '附件名称', '文件大小', '写入状态']];
    for (const t of stats.tasks) {
      for (const a of t.attachments || []) {
        files.push([dateKeyOf(t.appliedAt), t.applicant, t.department, t.amount, a.name, a.size, a.written ? '已写入 D 盘' : '本地暂存']);
      }
    }
    if (files.length === 1) files.push(['该范围内没有附件', '', '', '', '', '', '']);
    const wsFiles = XLSX.utils.aoa_to_sheet(files);
    wsFiles['!cols'] = [{ wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 12 }, { wch: 35 }, { wch: 12 }, { wch: 14 }];
    XLSX.utils.book_append_sheet(wb, wsFiles, '附件清单');

    return wb;
  }

  async exportExcel(fromReport = false) {
    if (this.exporting) return;
    if (!this.ensureValidRange()) return;
    const stats = this.computeStats(this.rangeTasks());
    if (!stats.count) {
      this.toast('没有可导出的数据', '请调整导出时间范围后再试。');
      return;
    }
    this.exporting = true;
    const btns = $$('[data-rb="export"], [data-rb="report-export"]', this.root);
    btns.forEach((b) => { b.disabled = true; });
    try {
      let blob;
      let sheetCount = 5;
      let attachmentData = null;
      let embedded = false;
      try {
        const ExcelJS = await this.loadExcelJS();
        attachmentData = await this.prepareExcelAttachments(stats);
        const wb = this.buildStatsWorkbookExcelJS(ExcelJS, stats, this.exportStart, this.exportEnd, attachmentData);
        const links = wb.__goodworkLinks || { detail: [], files: [] };
        const buffer = await wb.xlsx.writeBuffer();
        let finalBuffer = buffer;
        if (links.detail.length || links.files.length) {
          try {
            const fflate = await this.loadFFlate();
            const patched = this.injectInternalHyperlinks(fflate, buffer, links);
            if (patched) finalBuffer = patched;
          } catch (linkErr) {
            console.warn('附件预览内部链接写入失败', linkErr);
          }
        }
        blob = new Blob([finalBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        sheetCount = 5 + (attachmentData.previewTasks.length ? 1 : 0);
        embedded = true;
      } catch (excelJsErr) {
        console.warn('带附件 Excel 生成失败，回退到普通 Excel', excelJsErr);
        const XLSX = await this.loadXLSX();
        const wb = this.buildWorkbook(XLSX, stats, this.exportStart, this.exportEnd);
        const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
        blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        sheetCount = 5;
      }
      const fileName = `GOODWORK报销统计_${this.exportStart}_至_${this.exportEnd}.xlsx`;
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 5000);
      if (this.folderStatus === 'connected' && await this.ensureFolderPermission(false)) {
        try {
          const fh = await this.folderHandle.getFileHandle(`报销统计_${this.exportStart}_至_${this.exportEnd}.xlsx`, { create: true });
          const w = await fh.createWritable();
          await w.write(blob);
          await w.close();
        } catch (err) {
          console.warn('统计表写入 D 盘失败', err);
        }
      }
      const extra = embedded && attachmentData
        ? ` · ${attachmentData.imageCount} 张图片凭证已嵌入附件列，点击可查看预览`
        : '';
      this.toast('Excel 已导出', `${stats.count} 笔 · ${sheetCount} 个工作表${extra}。`, 'ok');
      if (fromReport) this.closeReport();
    } catch (err) {
      console.error(err);
      this.toast('Excel 导出失败', err?.message || '请稍后重试。');
    } finally {
      this.exporting = false;
      btns.forEach((b) => { b.disabled = false; });
    }
  }

  /* ---------------- 预览 / 收尾 ---------------- */

  closePreview() {
    this.el.preview.classList.remove('is-open');
    this.el.preview.setAttribute('aria-hidden', 'true');
    this.el.previewContent.innerHTML = '';
    if (this.previewUrl) { URL.revokeObjectURL(this.previewUrl); this.previewUrl = null; }
  }
}
