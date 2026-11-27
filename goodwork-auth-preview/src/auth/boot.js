import cloudbase from '../../vendor/cloudbase-v3.esm.js';
import { resolveEnv } from '../core/env.js?v=20261127v1';

const ENV = resolveEnv();
const BUILD = 'v14';
window.__GW_BUILD__ = BUILD;
const app = cloudbase.init({ env: ENV });
const auth = app.auth();

function injectGate() {
  const style = document.createElement('style');
  style.textContent = `
    #gw-auth-gate{position:fixed;inset:0;z-index:99999;display:grid;place-items:center;
      background:radial-gradient(900px 600px at 50% 20%,#12183a 0%,#05070f 60%,#020308 100%);
      font-family:"Microsoft YaHei","PingFang SC",system-ui,sans-serif;color:#eef0ff;}
    #gw-auth-gate .gw-card{width:min(400px,86vw);padding:30px 30px 24px;border-radius:18px;
      background:rgba(16,19,38,.88);border:1px solid rgba(120,130,220,.28);
      box-shadow:0 30px 80px rgba(0,0,0,.55);backdrop-filter:blur(14px);}
    #gw-auth-gate h1{margin:0 0 4px;font-size:22px;letter-spacing:.5px;}
    #gw-auth-gate p{margin:0 0 18px;color:#9aa0c8;font-size:12px;line-height:1.6;}
    #gw-auth-gate label{display:block;font-size:12px;color:#aab0d8;margin:12px 0 0;}
    #gw-auth-gate input{width:100%;margin-top:6px;padding:11px 12px;border-radius:10px;
      border:1px solid rgba(120,130,220,.3);background:rgba(8,10,24,.8);color:#fff;font-size:14px;outline:none;}
    #gw-auth-gate input:focus{border-color:#6b6bff;}
    #gw-auth-gate button{width:100%;margin-top:18px;padding:11px;border:0;border-radius:10px;
      background:linear-gradient(135deg,#5b5bff,#8b5cf6);color:#fff;font-size:15px;cursor:pointer;}
    #gw-auth-gate button:disabled{opacity:.55;cursor:not-allowed;}
    #gw-auth-gate .gw-msg{min-height:18px;margin:10px 0 0;font-size:12px;color:#ff8f8f;}
    #gw-auth-gate .gw-brand{font-size:11px;letter-spacing:2px;color:#7d84ff;margin-bottom:14px;}
    /* 账号入口：嵌入工作台顶栏，不再悬浮遮挡按钮 */
    .gw-user-chip{position:relative;display:inline-flex;align-items:center;z-index:60;}
    .gw-user-btn{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:34px;padding:0 12px;
      border-radius:100px;border:1px solid rgba(120,130,220,.28);background:rgba(10,12,24,.72);color:#dfe2ff;
      font:11px/1 -apple-system,"Microsoft YaHei","PingFang SC",sans-serif;cursor:pointer;backdrop-filter:blur(8px);white-space:nowrap;}
    .gw-user-btn i{width:22px;height:22px;border-radius:50%;background:linear-gradient(135deg,#5b5bff,#8b5cf6);
      display:grid;place-items:center;font-style:normal;font-size:11px;color:#fff;}
    .gw-user-menu{position:absolute;top:calc(100% + 6px);right:0;min-width:160px;padding:10px 12px;border-radius:10px;
      background:rgba(12,15,30,.97);border:1px solid rgba(120,130,220,.3);box-shadow:0 12px 30px rgba(0,0,0,.5);
      color:#e8eaff;z-index:70;display:flex;flex-direction:column;gap:5px;}
    .gw-user-menu[hidden]{display:none;}
    .gw-user-menu b{font-size:12px;font-weight:500;}
    .gw-user-menu em{font-style:normal;font-size:10px;color:#9aa0c8;}
    .gw-user-out{margin-top:4px;border:0;border-radius:8px;padding:7px 10px;background:rgba(255,255,255,.1);
      color:#fff;font-size:11px;cursor:pointer;}
    @media (max-width:700px){
      .gw-user-btn{width:34px;padding:0;}
      .gw-user-btn span{display:none;}
      .gw-user-btn i{width:26px;height:26px;}
      /* 手机端隐藏旧的左下角云同步浮窗，避免遮挡导出区域 */
      #__csStatus{display:none !important;}
    }
  `;
  document.head.appendChild(style);
  const gate = document.createElement('div');
  gate.id = 'gw-auth-gate';
  gate.innerHTML = `
    <div class="gw-card">
      <div class="gw-brand">GOODWORK FINANCE OS · ${BUILD}</div>
      <h1>账号登录</h1>
      <p>请使用管理员开通的用户名和密码进入工作台。</p>
      <label>用户名<input id="gw-user" autocomplete="username" placeholder="请输入用户名"></label>
      <label>密码<input id="gw-pass" type="password" autocomplete="current-password" placeholder="请输入密码"></label>
      <button id="gw-login">进入工作台</button>
      <p class="gw-msg" id="gw-msg"></p>
    </div>`;
  document.body.appendChild(gate);
  return gate;
}

async function boot() {
  const gate = injectGate();
  const msg = gate.querySelector('#gw-msg');
  const btn = gate.querySelector('#gw-login');
  const pass = gate.querySelector('#gw-pass');

  const enter = async () => {
    gate.remove();
    await import('../main.js?v=20261127v12');
    const who = window.__AUTH_USER__ || {};
    const chip = document.createElement('div');
    chip.className = 'gw-user-chip';
    chip.innerHTML = `
      <button type="button" class="gw-user-btn" aria-haspopup="true" aria-label="账号信息">
        <i>${(who.name || '?').slice(0, 1)}</i><span>${who.name || ''} · ${who.role === 'admin' ? '管理员' : '成员'}</span>
      </button>
      <div class="gw-user-menu" hidden>
        <b>${who.name || ''}</b>
        <em>${who.role === 'admin' ? '管理员' : '成员'} · ${BUILD}</em>
        <button type="button" class="gw-user-out">退出登录</button>
      </div>`;
    const chipBtn = chip.querySelector('.gw-user-btn');
    const menu = chip.querySelector('.gw-user-menu');
    chipBtn.onclick = (e) => { e.stopPropagation(); menu.hidden = !menu.hidden; };
    chip.querySelector('.gw-user-out').onclick = async () => { try { await auth.signOut(); } catch (_) {} location.reload(); };
    document.addEventListener('click', () => { menu.hidden = true; });
    // 账号入口挂到工作台顶栏，随布局排布，不再悬浮遮挡“新增报销”
    const mountChip = () => {
      const actions = document.querySelector('.rb-top-actions');
      if (actions) { actions.appendChild(chip); return; }
      setTimeout(mountChip, 400);
    };
    mountChip();
  };

  const profile = async () => {
    const res = await app.callFunction({ name: 'api', data: { action: 'profile' } });
    const out = res && res.result;
    if (!out || !out.ok) throw new Error(out?.message || '账号未开通');
    window.__AUTH_USER__ = out.user;
    return out.user;
  };

  const doLogin = async () => {
    const username = gate.querySelector('#gw-user').value.trim();
    const password = pass.value;
    if (!username || !password) { msg.textContent = '请输入用户名和密码'; return; }
    btn.disabled = true;
    btn.textContent = '登录中…';
    msg.textContent = '';
    try {
      await auth.signInWithUsernameAndPassword(username, password);
      await profile();
      await enter();
    } catch (e) {
      try { await auth.signOut(); } catch (_) {}
      msg.textContent = e.message || '登录失败，请检查用户名和密码';
      btn.disabled = false;
      btn.textContent = '进入工作台';
    }
  };

  btn.addEventListener('click', doLogin);
  pass.addEventListener('keydown', (e) => { if (e.key === 'Enter') doLogin(); });

  try {
    const state = await auth.getLoginState();
    if (!state) { btn.disabled = false; btn.textContent = '进入工作台'; return; }
    await profile();
    await enter();
  } catch (e) {
    try { await auth.signOut(); } catch (_) {}
    btn.disabled = false;
    btn.textContent = '进入工作台';
    msg.textContent = e.message || '';
  }
}

boot();
