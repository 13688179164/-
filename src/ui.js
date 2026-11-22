/* ============================================================
   HUD controller — dossiers, quest chain, reimbursement drawer
   ============================================================ */

const money = (n) => new Intl.NumberFormat('zh-CN', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(n);

export class UI {
  constructor(world, season, npcs, audio, handlers = {}) {
    this.world = world;
    this.season = season;
    this.npcs = npcs;
    this.audio = audio;
    this.handlers = handlers;
    this.selectedEntry = null;
    this.hoveredEntry = null;
    this.formOpen = false;
    this.auto = true;
    this.formEntry = null;
    this.claimSeq = 82;
    this.kpiValue = 286400;
    this.attachments = 2;

    this.$ = (id) => document.getElementById(id);
    this.seasonButtons = [...document.querySelectorAll('.season-btn')];
    this.steps = [...document.querySelectorAll('.qstep')];
    this.qlineFill = this.$('qline-fill');
    this.tooltip = this.$('tooltip');
    this.toastStack = this.$('toast-stack');
    this.dossier = this.$('dossier');
    this.dossierInner = this.$('dossier-inner');
    this.formDrawer = this.$('form-drawer');

    this.bind();
    this.clock();
    setInterval(() => this.clock(), 20000);
    this.updateKinetic();
  }

  updateKinetic() {
    // keep the ambient clock alive every second
    clearInterval(this._clockTimer);
    this._clockTimer = setInterval(() => this.clock(), 1000);
  }

  clock() {
    try {
      const now = new Date();
      const fmt = new Intl.DateTimeFormat('zh-CN', {
        timeZone: 'Asia/Shanghai', hour: '2-digit', minute: '2-digit', hour12: false,
      }).format(now);
      const el = this.$('clock');
      if (el) el.textContent = fmt;
    } catch (e) { /* noop */ }
  }

  bind() {
    this.seasonButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const key = btn.dataset.season;
        this.season.setSeason(key, true);
        this.audio.click();
        this.audio.whoosh();
        this.setActiveSeason(key);
      });
    });

    this.$('auto-season').addEventListener('click', () => {
      this.auto = !this.auto;
      this.season.setAuto(this.auto);
      this.$('auto-season').classList.toggle('is-on', this.auto);
      this.$('auto-season').classList.toggle('off', !this.auto);
      this.audio.click();
      this.toast(this.auto ? '季节已恢复自动轮转' : '季节切换已锁定为手动');
      this.updateSeason(this.season.getInfo());
    });

    this.$('cinema-btn').addEventListener('click', () => {
      const on = !this.handlers.getCinema();
      this.handlers.setCinema(on);
      this.$('cinema-btn').classList.toggle('is-on', on);
      this.audio.click();
    });

    this.$('sound-btn').addEventListener('click', () => {
      const on = !this.handlers.getSound();
      this.handlers.setSound(on);
      this.$('sound-btn').classList.toggle('is-on', on);
      if (on) this.audio.click();
    });

    this.$('label-btn').addEventListener('click', () => {
      const on = !this.handlers.getLabels();
      this.handlers.setLabels(on);
      this.$('label-btn').classList.toggle('is-on', on);
      this.audio.click();
    });

    this.$('reset-btn').addEventListener('click', () => {
      this.audio.click();
      this.handlers.onResetCamera();
    });

    this.$('new-claim-btn').addEventListener('click', () => {
      if (this.formOpen) return;
      this.audio.click();
      this.handlers.onOpenClaim(this.world.entryById.get('garage'));
    });

    this.$('form-close').addEventListener('click', () => this.closeForm());
    this.$('form-cancel').addEventListener('click', () => this.closeForm());
    this.$('success-back').addEventListener('click', () => this.closeForm());

    document.addEventListener('keydown', (e) => {
      if (e.key !== 'Escape') return;
      if (this.formOpen) this.closeForm();
      else if (this.selectedEntry) this.closeDossier(true);
    });

    this.$('form-scrim').addEventListener('click', () => this.closeForm());

    // amount live total
    this.$('f-amount').addEventListener('input', () => {
      const v = parseFloat(this.$('f-amount').value) || 0;
      this.$('form-total').textContent = `¥${money(v)}`;
      this.markFormStep(1);
    });

    document.querySelectorAll('.pay-opt').forEach((btn) => {
      btn.addEventListener('click', () => {
        document.querySelectorAll('.pay-opt').forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        this.audio.hover();
      });
    });

    this.$('attach-btn').addEventListener('click', () => {
      this.audio.click();
      this.attachments += 1;
      const chip = document.createElement('span');
      chip.className = 'attach-chip';
      chip.innerHTML = `INV-${4417 + this.attachments * 3}.pdf <i>已验真</i>`;
      this.$('attach-list').appendChild(chip);
      this.toast('发票附件已验真并加入单据');
    });

    this.$('claim-form').addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitForm();
    });
    this.$('form-submit').addEventListener('click', (e) => {
      e.preventDefault();
      this.submitForm();
    });
  }

  setActiveSeason(key) {
    this.seasonButtons.forEach((b) => b.classList.toggle('is-active', b.dataset.season === key));
  }

  updateSeason(info) {
    this.auto = info.auto;
    const names = { spring: '春', summer: '夏', autumn: '秋', winter: '冬' };
    this.$('season-glyph').textContent = names[info.key] || '冬';
    this.$('season-name').textContent = info.label;
    this.$('season-en').textContent = info.en;
    this.$('wx-temp').textContent = info.temp;
    this.$('wx-wind').textContent = info.wind;
    this.$('wx-vis').textContent = info.vis;
    this.$('stat-particles').textContent = info.particles.toLocaleString('en-US');
    this.$('auto-season').classList.toggle('is-on', info.auto);
    this.$('auto-season').classList.toggle('off', !info.auto);
    this.$('auto-count').textContent = info.auto ? `${Math.ceil(info.countdown)}s` : '手动';
    this.$('auto-season').classList.toggle('off', !info.auto);
    const deg = Math.max(0, Math.min(360, (1 - info.countdown / 28) * 360));
    this.$('season-ring').style.background = `conic-gradient(#d8b878 ${deg}deg, rgba(216,184,120,0.12) ${deg}deg)`;
    const progress = Math.max(0, Math.min(1, 1 - info.countdown / 28));
    this.$('season-progress').style.width = `${progress * 100}%`;
    this.setActiveSeason(info.key);
  }

  updateQuest(state) {
    this.$('quest-no').textContent = state.questNo;
    this.steps.forEach((el, i) => {
      const status = state.statuses[i];
      el.classList.toggle('is-active', status === 'active');
      el.classList.toggle('is-done', status === 'done');
      const stateEl = el.querySelector('.qstate');
      stateEl.textContent = status === 'done' ? '已完成' : status === 'active' ? '进行中' : '等待';
    });
    const done = state.done.filter(Boolean).length;
    this.qlineFill.style.width = `${(done / 3) * 100}%`;
  }

  updatePerf(fps, calls) {
    this.$('stat-fps').textContent = fps;
    this.$('stat-calls').textContent = calls;
    this.$('stat-entries').textContent = this.world.entries.length;
  }

  updateKPI(extra = 0) {
    this.kpiValue += extra;
    this.$('kpi-total').textContent = `¥${Math.round(this.kpiValue).toLocaleString('en-US')}`;
  }

  showTooltip(entry, x, y) {
    this.tooltip.querySelector('.tt-code').textContent = entry.code;
    this.tooltip.querySelector('.tt-name').textContent = entry.name;
    this.tooltip.style.left = `${x}px`;
    this.tooltip.style.top = `${y}px`;
    this.tooltip.classList.add('show');
  }

  hideTooltip() {
    this.tooltip.classList.remove('show');
  }

  showDossier(entry) {
    this.selectedEntry = entry;
    const idx = this.world.entries.indexOf(entry) + 1;
    const amount = entry.amount > 0
      ? `<span>建议报销额度</span><b>¥${money(entry.amount)}</b>`
      : `<span>场景实时读数</span><b style="font-size:13px;letter-spacing:.06em">${entry.amountNote || '—'}</b>`;

    const specs = (entry.specs || []).map(([k, v]) => `<div class="spec-row"><span>${k}</span><b>${v}</b></div>`).join('');
    const docs = (entry.docs || []).map(([no, name, code, status]) => `
      <div class="doc-row">
        <i>${no}</i>
        <div><b>${name}</b><span>${code}</span></div>
        <em style="${status.includes('验真') || status.includes('归档') || status === '实时' ? 'color:var(--mint)' : 'color:var(--gold)'}">${status}</em>
      </div>`).join('');

    const npcBlock = entry.npc ? `
      <div class="npc-mini">
        <div class="npc-avatar">${entry.name.slice(0, 1)}</div>
        <div><b>${entry.name.split(' · ')[0]}</b><span>32 × 22 网格 A* · 同伴分离</span></div>
        <em>LIVE</em>
      </div>` : '';

    this.dossierInner.innerHTML = `
      <div class="dossier-top">
        <div class="dossier-kicker">FACILITY DOSSIER / <b>${String(idx).padStart(2, '0')}</b></div>
        <button class="close-btn" data-close aria-label="关闭档案">
          <svg viewBox="0 0 20 20"><path d="M5 5l10 10M15 5 5 15"/></svg>
        </button>
      </div>
      <div class="dossier-idx">${String(idx).padStart(2, '0')}</div>
      <h3 class="dossier-title">${entry.name}</h3>
      <div class="dossier-en">${entry.en}</div>
      <div class="dossier-tags">${(entry.tags || []).map((t) => `<i>${t}</i>`).join('')}</div>
      <p class="dossier-desc">${entry.desc}</p>
      ${npcBlock}
      <div class="dossier-sec">
        <div class="dossier-sec-head"><span>档案参数</span><em>SCENE READOUT</em></div>
        ${specs}
      </div>
      <div class="dossier-sec">
        <div class="dossier-sec-head"><span>关联单据</span><em>LINKED DOCUMENTS</em></div>
        ${docs}
      </div>
      <div class="dossier-total">${amount}</div>
      <button class="dossier-cta" id="dossier-cta">${entry.npc ? '查看任务链' : '发起报销'}</button>
      <button class="dossier-secondary" id="dossier-secondary">${entry.npc ? '定位到员工' : '在场景中重新定位'}</button>
    `;
    this.dossier.classList.add('is-open');
    this.audio.open();

    this.dossierInner.querySelector('[data-close]').addEventListener('click', () => this.closeDossier(true));
    this.dossierInner.querySelector('#dossier-cta').addEventListener('click', () => {
      if (entry.npc) {
        this.closeDossier(false);
        this.handlers.onFocusQuest(entry);
      } else {
        this.handlers.onOpenClaim(entry);
      }
    });
    this.dossierInner.querySelector('#dossier-secondary').addEventListener('click', () => {
      this.closeDossier(false);
      this.handlers.onLocate(entry);
    });
  }

  closeDossier(notify = true) {
    this.dossier.classList.remove('is-open');
    const had = this.selectedEntry;
    this.selectedEntry = null;
    if (notify && had) this.handlers.onDossierClose(had);
  }

  openForm(entry) {
    const fallback = this.world.entryById.get('garage');
    const target = entry || fallback;
    const preset = target.preset || fallback.preset;
    this.formEntry = target;
    this.formOpen = true;
    this.claimSeq += 1;
    const formNo = `GW-2026-1122-${String(this.claimSeq).padStart(3, '0')}`;
    this.currentFormNo = formNo;

    this.$('form-no').textContent = formNo;
    this.$('form-source-label').textContent = target.name;
    this.$('form-source-code').textContent = target.code;
    this.$('cap-title').textContent = target.name;
    this.$('cap-sub').textContent = `${target.category || '场景资产'} · ${preset.category}科目`;
    this.$('cap-amount').textContent = target.amount > 0 ? `¥ ${money(target.amount)}` : '待填写';
    this.$('f-category').value = preset.category;
    this.$('f-entity').value = preset.entity;
    this.$('f-amount').value = target.amount > 0 ? String(target.amount) : '';
    this.$('f-date').value = '2026-11-22';
    this.$('f-invoice').value = `INV-2026-1122-${4100 + this.claimSeq * 7}`;
    this.$('f-vendor').value = preset.vendor;
    this.$('f-cost').value = preset.cost;
    this.$('f-note').value = preset.note;
    this.$('form-total').textContent = `¥${money(target.amount || 0)}`;
    this.$('form-success').classList.remove('show');
    this.$('success-code').textContent = formNo;
    this.attachments = 2;
    this.$('attach-list').innerHTML = '<span class="attach-chip">INV-4417.pdf <i>已验真</i></span><span class="attach-chip">保养工单.jpg <i>已验真</i></span>';
    this.markFormStep(0);

    document.body.classList.add('form-open');
    document.body.classList.remove('form-submitted');
    this.formDrawer.classList.add('is-open');
    this.$('form-body').scrollTop = 0;
    this.hideTooltip();
    this.closeDossier(false);
  }

  markFormStep(index) {
    const steps = [...document.querySelectorAll('.fstep')];
    steps.forEach((el, i) => el.classList.toggle('is-active', i === index));
  }

  submitForm() {
    if (document.body.classList.contains('form-submitted')) return;
    const amount = parseFloat(this.$('f-amount').value) || 0;
    if (amount <= 0) {
      this.audio.error();
      this.toast('请填入大于 0 的含税金额');
      this.$('f-amount').focus();
      return;
    }
    const payload = {
      formNo: this.currentFormNo,
      entryId: this.formEntry?.id,
      entryName: this.formEntry?.name,
      amount,
      category: this.$('f-category').value,
      entity: this.$('f-entity').value,
      vendor: this.$('f-vendor').value,
      note: this.$('f-note').value,
      invoice: this.$('f-invoice').value,
      pay: document.querySelector('.pay-opt.is-active')?.dataset.pay || '对公转账',
      attachments: this.attachments,
    };
    document.body.classList.add('form-submitted');
    this.$('form-success').classList.add('show');
    this.$('form-success').querySelector('span').textContent =
      `${payload.category} · ${payload.attachments} 张发票 · ¥${money(payload.amount)} 已锁定预算，NPC 林晓已接收取票任务。`;
    this.markFormStep(2);
    this.audio.success();
    this.updateKPI(amount);
    this.handlers.onSubmit(payload);
    this.toast(`单据 ${payload.formNo} 已提交，NPC 任务链重新启动`);
  }

  closeForm() {
    if (!this.formOpen) return;
    this.formOpen = false;
    document.body.classList.remove('form-open', 'form-submitted');
    this.formDrawer.classList.remove('is-open');
    this.$('form-success').classList.remove('show');
    this.markFormStep(0);
    this.handlers.onFormClose();
  }

  toast(message, duration = 3600) {
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = message;
    this.toastStack.appendChild(el);
    setTimeout(() => {
      el.classList.add('out');
      setTimeout(() => el.remove(), 400);
    }, duration);
  }
}
