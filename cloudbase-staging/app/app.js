import cloudbase from './vendor/cloudbase-v3.esm.js';

const ENV = 'ready-puma-d4gmuy5yeca0a8f3c';
const app = cloudbase.init({ env: ENV });
const auth = app.auth();

const STATUS = {
  draft: '草稿',
  submitted: '待审批',
  approved: '待报销',
  reimbursed: '已报销',
  rejected: '已驳回',
  cancelled: '已撤销',
};

const $ = (id) => document.getElementById(id);
const state = { me: null, tasks: [], attachments: [], users: [], filter: 'all' };

function esc(v) {
  return String(v == null ? '' : v).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function money(v) {
  const n = Number(v || 0);
  return n.toLocaleString('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function fmtDate(v) {
  if (!v) return '';
  const d = new Date(v);
  if (Number.isNaN(d.getTime())) return String(v).slice(0, 10);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function toast(text, isError = false) {
  const el = $('toast');
  el.textContent = text;
  el.style.background = isError ? '#c0392b' : '#17171c';
  el.classList.remove('hidden');
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.add('hidden'), 2600);
}

async function api(action, data = {}) {
  const res = await app.callFunction({ name: 'api', data: { action, ...data } });
  const out = res && res.result;
  if (!out) throw new Error('云函数没有返回结果');
  if (!out.ok) throw new Error(out.message || '操作失败');
  return out;
}

function setLoginMsg(text, cls = '') {
  const el = $('loginMsg');
  el.textContent = text || '';
  el.className = 'msg ' + cls;
}

function setFormMsg(text, cls = '') {
  const el = $('formMsg');
  el.textContent = text || '';
  el.className = 'msg ' + cls;
}

let busy = false;
async function withBusy(btn, fn) {
  if (busy) return;
  busy = true;
  const old = btn ? btn.textContent : '';
  if (btn) { btn.disabled = true; btn.textContent = '处理中…'; }
  try { await fn(); } finally {
    busy = false;
    if (btn) { btn.disabled = false; btn.textContent = old; }
  }
}

function showApp(me) {
  state.me = me;
  $('loginView').classList.add('hidden');
  $('appView').classList.remove('hidden');
  $('userBox').classList.remove('hidden');
  $('userName').textContent = `${me.name}（${me.username}）`;
  $('userRole').textContent = me.role === 'admin' ? '管理员' : '成员';
  $('listTitle').textContent = me.role === 'admin' ? '全部报销' : '我的报销';
  $('exportBtn').classList.toggle('hidden', me.role !== 'admin');
  $('formHint').textContent = me.role === 'admin'
    ? '管理员也可以新建报销；提交后同样进入待审批。'
    : '提交后进入待审批，管理员审批通过后进入待报销。';
  const d = new Date();
  $('appliedAt').value = d.toISOString().slice(0, 10);
}

function showLogin() {
  state.me = null;
  $('appView').classList.add('hidden');
  $('loginView').classList.remove('hidden');
  $('userBox').classList.add('hidden');
}

async function load() {
  const status = state.filter;
  const out = await api('list', { status });
  state.tasks = out.tasks || [];
  state.attachments = out.attachments || [];
  state.users = out.users || [];
  render();
}

function render() {
  const list = $('list');
  const tasks = state.tasks;
  if (!tasks.length) {
    list.innerHTML = '<div class="card empty">还没有记录。先在左侧新建一笔吧。</div>';
    return;
  }
  const byTask = new Map();
  for (const a of state.attachments) {
    if (!byTask.has(a.task_id)) byTask.set(a.task_id, []);
    byTask.get(a.task_id).push(a);
  }
  list.innerHTML = tasks.map((t) => {
    const st = STATUS[t.status] || t.status;
    const mine = state.me.role !== 'admin' && t.applicant_uid === state.me.username;
    const atts = byTask.get(t.id) || [];
    const actions = [];
    if (state.me.role !== 'admin') {
      if (t.status === 'draft') actions.push(`<button data-act="submit" data-id="${esc(t.id)}">提交审批</button>`);
      if (t.status === 'submitted') actions.push(`<button data-act="cancel" data-id="${esc(t.id)}">撤销</button>`);
    } else {
      if (t.status === 'submitted') {
        actions.push(`<button data-act="approve" data-id="${esc(t.id)}">通过</button>`);
        actions.push(`<button data-act="reject" data-id="${esc(t.id)}">驳回</button>`);
      }
      if (t.status === 'approved') actions.push(`<button data-act="reimburse" data-id="${esc(t.id)}">标记已报销</button>`);
      if (t.legacy_unclaimed) actions.push(`<button data-act="reassign" data-id="${esc(t.id)}">认领归属</button>`);
    }
    return `<article class="item">
      <div class="item-head">
        <div>
          <div class="who">${esc(t.applicant || (mine ? state.me.name : ''))}
            ${t.legacy_unclaimed ? '<span class="legacy">历史待认领</span>' : ''}
          </div>
          <div class="meta">${esc(t.department)} · ${esc(t.category)} · ${fmtDate(t.applied_at)} · ${esc(t.id)}</div>
        </div>
        <div style="text-align:right">
          <div class="amount">¥${money(t.amount)}</div>
          <span class="badge ${esc(t.status)}">${esc(st)}</span>
        </div>
      </div>
      ${t.content ? `<div class="desc">${esc(t.content)}</div>` : ''}
      <div class="meta">${atts.length ? `附件 ${atts.length} 个：${atts.map((a) => esc(a.name)).join('、')}` : '无附件'}${t.review_note ? ` · 审批意见：${esc(t.review_note)}` : ''}</div>
      ${actions.length ? `<div class="item-actions">${actions.join('')}</div>` : ''}
    </article>`;
  }).join('');

  list.querySelectorAll('button[data-act]').forEach((btn) => {
    btn.addEventListener('click', () => handleRowAction(btn.dataset.act, btn.dataset.id, btn));
  });
}

async function handleRowAction(act, id, btn) {
  try {
    if (act === 'submit' || act === 'cancel') {
      await withBusy(btn, async () => { await api(act, { taskId: id }); await load(); });
      toast(act === 'submit' ? '已提交，等待审批' : '已撤销');
      return;
    }
    if (act === 'approve' || act === 'reject') {
      const note = act === 'reject' ? (prompt('驳回原因（可留空）：') || '') : '';
      await withBusy(btn, async () => {
        await api('review', { taskId: id, decision: act, note });
        await load();
      });
      toast(act === 'approve' ? '已通过，进入待报销' : '已驳回');
      return;
    }
    if (act === 'reimburse') {
      if (!confirm('确认这笔已经完成报销？')) return;
      await withBusy(btn, async () => { await api('reimburse', { taskId: id }); await load(); });
      toast('已标记为已报销');
      return;
    }
    if (act === 'reassign') {
      const username = prompt('输入要归属的用户名（例如 test_member）：');
      if (!username) return;
      await withBusy(btn, async () => { await api('reassign', { taskId: id, username }); await load(); });
      toast('归属已更新');
    }
  } catch (e) {
    toast(e.message || '操作失败', true);
  }
}

async function doLogin() {
  const username = $('loginUser').value.trim();
  const password = $('loginPass').value;
  if (!username || !password) { setLoginMsg('请输入用户名和密码', 'err'); return; }
  const btn = $('loginBtn');
  await withBusy(btn, async () => {
    try {
      setLoginMsg('登录中…');
      await auth.signInWithUsernameAndPassword(username, password);
      const out = await api('profile');
      showApp(out.user);
      await load();
      setLoginMsg('');
    } catch (e) {
      try { await auth.signOut(); } catch (_) {}
      setLoginMsg(e.message || '登录失败，请检查用户名和密码', 'err');
    }
  });
}


function fileSafe(name) {
  return String(name || 'file').replace(/[^\w.\-\u4e00-\u9fa5]/g, '_').slice(-80);
}

function compressImage(file) {
  return new Promise((resolve) => {
    if (!file.type.startsWith('image/')) return resolve(file);
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const max = 1600;
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.max(1, Math.round(img.width * scale));
      canvas.height = Math.max(1, Math.round(img.height * scale));
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      canvas.toBlob((blob) => resolve(blob || file), 'image/jpeg', 0.82);
    };
    img.onerror = () => { URL.revokeObjectURL(url); resolve(file); };
    img.src = url;
  });
}

async function createTask(submitNow) {
  const amount = Number($('amount').value);
  if (!(amount > 0)) { setFormMsg('请输入正确的金额', 'err'); return; }
  const department = $('department').value;
  const category = $('category').value;
  const appliedAt = $('appliedAt').value;
  const content = $('content').value.trim();
  const hasInvoice = $('hasInvoice').checked;
  await withBusy(submitNow ? $('createBtn') : $('draftBtn'), async () => {
    try {
      setFormMsg('正在保存…');
      const out = await api('create', { amount, department, category, appliedAt, content, hasInvoice });
      const files = Array.from($('files').files || []);
      for (const file of files) {
        const blob = await compressImage(file);
        const cloudPath = `attachments/${state.me.username}/${out.task.id}/${Date.now()}-${fileSafe(file.name)}`;
        await app.storage.from('tasks').upload(cloudPath, blob);
        const fileID = `cos:tasks/${cloudPath}`;
        await api('attach', {
          taskId: out.task.id, name: file.name, size: blob.size,
          mime: blob.type || file.type || 'application/octet-stream', fileID,
        });
      }
      if (submitNow) await api('submit', { taskId: out.task.id });
      $('amount').value = '';
      $('files').value = '';
      $('content').value = '';
      $('hasInvoice').checked = false;
      setFormMsg(submitNow ? '已提交，等待管理员审批' : '已保存草稿', 'ok');
      await load();
      toast(submitNow ? '提交成功' : '草稿已保存');
    } catch (e) {
      setFormMsg(e.message || '保存失败', 'err');
      toast(e.message || '保存失败', true);
    }
  });
}

async function exportExcel() {
  const rows = state.tasks;
  if (!rows.length) { toast('没有可导出的记录', true); return; }
  const data = rows.map((t) => ({
    单号: t.id,
    申请人: t.applicant,
    金额: Number(t.amount || 0),
    部门: t.department,
    分类: t.category,
    发生日期: fmtDate(t.applied_at),
    状态: STATUS[t.status] || t.status,
    说明: t.content || '',
    有发票: t.has_invoice ? '是' : '否',
    审批人: t.reviewed_by || '',
    审批时间: t.reviewed_at ? fmtDate(t.reviewed_at) : '',
    报销时间: t.reimbursed_at ? fmtDate(t.reimbursed_at) : '',
  }));
  if (!window.ExcelJS) { toast('Excel 组件未加载', true); return; }
  const wb = new ExcelJS.Workbook();
  const ws = wb.addWorksheet('报销统计');
  ws.columns = Object.keys(data[0]).map((k) => ({ header: k, key: k, width: k === '说明' ? 32 : 14 }));
  data.forEach((r) => ws.addRow(r));
  ws.getRow(1).font = { bold: true };
  const buf = await wb.xlsx.writeBuffer();
  const blob = new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `GOODWORK-报销统计-${new Date().toISOString().slice(0, 10)}.xlsx`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 3000);
}

async function boot() {
  $('loginBtn').addEventListener('click', doLogin);
  $('loginPass').addEventListener('keydown', (e) => { if (e.key === 'Enter') doLogin(); });
  $('logoutBtn').addEventListener('click', async () => {
    try { await auth.signOut(); } catch (_) {}
    showLogin();
  });
  $('createBtn').addEventListener('click', () => createTask(true));
  $('draftBtn').addEventListener('click', () => createTask(false));
  $('refreshBtn').addEventListener('click', () => load().catch((e) => toast(e.message, true)));
  $('exportBtn').addEventListener('click', () => exportExcel().catch((e) => toast(e.message, true)));
  $('statusFilter').addEventListener('change', (e) => {
    state.filter = e.target.value;
    load().catch((err) => toast(err.message, true));
  });

  try {
    const loginState = await auth.getLoginState();
    if (!loginState) { showLogin(); return; }
    const out = await api('profile');
    showApp(out.user);
    await load();
  } catch (e) {
    showLogin();
  }
}

boot();
