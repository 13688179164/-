import cloudbase from '../../vendor/cloudbase-v3.esm.js';

const ENV = 'ready-puma-d4gmuy5yeca0a8f3c';
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
  `;
  document.head.appendChild(style);
  const gate = document.createElement('div');
  gate.id = 'gw-auth-gate';
  gate.innerHTML = `
    <div class="gw-card">
      <div class="gw-brand">GOODWORK FINANCE OS</div>
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
    await import('../main.js?v=20261126v1');
    const who = window.__AUTH_USER__ || {};
    const bar = document.createElement('div');
    bar.style.cssText = 'position:fixed;right:14px;top:12px;z-index:99998;display:flex;gap:8px;align-items:center;padding:7px 10px;border-radius:999px;background:rgba(10,12,24,.72);border:1px solid rgba(120,130,220,.28);color:#dfe2ff;font:12px/1.2 "Microsoft YaHei",sans-serif;backdrop-filter:blur(8px)';
    bar.innerHTML = `<span>${who.name || ''} · ${who.role === 'admin' ? '管理员' : '成员'}</span>`;
    const out = document.createElement('button');
    out.textContent = '退出';
    out.style.cssText = 'border:0;border-radius:999px;padding:4px 9px;background:rgba(255,255,255,.12);color:#fff;cursor:pointer;font-size:12px';
    out.onclick = async () => { try { await auth.signOut(); } catch (_) {} location.reload(); };
    bar.appendChild(out);
    document.body.appendChild(bar);
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
