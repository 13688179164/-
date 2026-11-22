/**
 * UI 控制器：季节切换、档案面板、报销表单、任务链、提示与统计
 */
import { SEASONS, EMPLOYEES, RECEIPTS, EXPENSE_TYPES, QUESTS, SEASON_MAP } from '../core/config.js';
import { INTERACTIONS } from '../core/archive.js';
import { formatDate, formatMoney, uid } from '../core/utils.js';

const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

export class UI {
  constructor() {
    this.el = {
      body: document.body,
      canvas: $('#scene'),
      loading: $('#loading'),
      loadingBar: $('#loadingBar'),
      loadingPct: $('#loadingPct'),
      loadingStatus: $('#loadingStatus'),
      seasonSwitch: $('#seasonSwitch'),
      soundBtn: $('#soundBtn'),
      archiveBtn: $('#archiveBtn'),
      ctaBtn: $('#ctaBtn'),
      panel: $('#panel'),
      panelClose: $('#panelClose'),
      panelBreadcrumb: $('#panelBreadcrumb'),
      panelTitle: $('#panelTitle'),
      panelSubtitle: $('#panelSubtitle'),
      panelBody: $('#panelBody'),
      panelFoot: $('#panelFoot'),
      labels: $('#labels'),
      tooltip: $('#tooltip'),
      tooltipKicker: $('#tooltipKicker'),
      tooltipName: $('#tooltipName'),
      tooltipHint: $('#tooltipHint'),
      toastWrap: $('#toastWrap'),
      questList: $('#questList'),
      questPill: $('#questPill'),
      statFps: $('#statFps'),
      statParticles: $('#statParticles'),
      statCalls: $('#statCalls'),
      cursorGlow: $('#cursorGlow'),
    };

    this.callbacks = {};
    this.quests = QUESTS.map((q) => ({ ...q }));
    this.bag = [];
    this.records = [{
      id: 'GW-RB-20261031-006',
      applicantId: 'chen',
      applicantName: '陈默',
      dept: '仓储管理',
      type: '采购费',
      amount: 2860.0,
      purpose: '仓储货架与周转箱补充采购',
      date: '2026-10-31',
      receipts: [RECEIPTS[2]],
      status: 'approved',
      createdAt: '2026-10-31T09:12:00',
      approvedAt: '2026-10-31T11:40:00',
    }];
    this.pendingRecord = null;
    this.panelMode = null;
    this.activeEntry = null;
    this.formDraft = {
      applicant: 'lin',
      dept: '财务中心',
      type: '采购费',
      date: formatDate(),
      purpose: '',
      amount: '',
      agree: false,
    };
    this.selectedReceipts = new Set();
    this.currentSeason = 'spring';
    this.showingPending = false;

    this.buildSeasonButtons();
    this.renderQuests();
    this.bind();
    this.bindDelegates();
    this.updateReceiptHint();
  }

  on(name, fn) { this.callbacks[name] = fn; return this; }
  emit(name, ...args) { this.callbacks[name]?.(...args); }

  /* ---------------- 全局绑定 ---------------- */

  bind() {
    this.el.ctaBtn?.addEventListener('click', () => this.emit('cta'));
    this.el.panelClose?.addEventListener('click', () => this.closePanel(true));
    this.el.archiveBtn?.addEventListener('click', () => this.emit('archive'));
    this.el.soundBtn?.addEventListener('click', () => {
      const muted = !this.el.body.classList.contains('is-muted');
      this.setMuted(muted);
      this.emit('soundToggle', muted);
    });
    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.panelMode) this.closePanel(true);
    });
    window.addEventListener('pointermove', (e) => {
      if (window.innerWidth <= 680) return;
      if (this._rafGlow) return;
      this._rafGlow = requestAnimationFrame(() => {
        this._rafGlow = null;
        this.el.body.classList.add('has-pointer');
        this.el.cursorGlow.style.left = `${e.clientX}px`;
        this.el.cursorGlow.style.top = `${e.clientY}px`;
      });
    }, { passive: true });
  }

  bindDelegates() {
    this.el.panelFoot.addEventListener('click', (e) => {
      const btn = e.target.closest('[data-action]');
      if (!btn) return;
      const action = btn.getAttribute('data-action');
      if (action === 'close') {
        this.closePanel(true);
        return;
      }
      if (action === 'archive') {
        this.openArchive();
        return;
      }
      if (action === 'open-form') {
        this.closePanel(false);
        this.emit('cta');
        return;
      }
      this.emit('action', action, this.activeEntry, this._context || {});
    });

    this.el.panelBody.addEventListener('click', (e) => {
      const actionEl = e.target.closest('[data-action]');
      if (actionEl) {
        const action = actionEl.getAttribute('data-action');
        if (action === 'close') {
          this.closePanel(true);
          return;
        }
        if (action === 'archive') {
          this.openArchive();
          return;
        }
        if (action === 'collect') {
          this.emit('collectReceipts');
          return;
        }
        if (action === 'submit-approve') {
          this.emit('action', 'approveNow', this.activeEntry, this._context || {});
          return;
        }
        this.emit('action', action, this.activeEntry, this._context || {});
        return;
      }

      const receipt = e.target.closest('.receipt-item');
      if (receipt) {
        const id = receipt.getAttribute('data-receipt');
        if (!id) return;
        if (receipt.classList.contains('is-picked')) {
          receipt.classList.remove('is-picked');
          this.selectedReceipts.delete(id);
        } else {
          receipt.classList.add('is-picked');
          this.selectedReceipts.add(id);
        }
        this.syncAmountFromReceipts();
        const box = receipt.querySelector('.receipt-check');
        void box;
      }
    });

    this.el.panelBody.addEventListener('input', (e) => {
      const t = e.target;
      if (t.id === 'applicant') {
        const emp = EMPLOYEES.find((x) => x.id === t.value);
        if (emp) {
          const dept = $('#dept', this.el.panelBody);
          if (dept) dept.value = emp.dept;
          this.formDraft.applicant = emp.id;
          this.formDraft.dept = emp.dept;
        }
      } else if (t.id === 'dept') {
        this.formDraft.dept = t.value;
      } else if (t.id === 'expenseType') {
        this.formDraft.type = t.value;
      } else if (t.id === 'expenseDate') {
        this.formDraft.date = t.value;
      } else if (t.id === 'purpose') {
        this.formDraft.purpose = t.value;
      } else if (t.id === 'amount') {
        this.formDraft.amount = t.value;
      } else if (t.id === 'agree') {
        this.formDraft.agree = t.checked;
      }
    });

    this.el.panelBody.addEventListener('submit', (e) => {
      if (e.target.id === 'reimburseForm') {
        e.preventDefault();
        this.submitForm();
      }
    });
  }

  /* ---------------- 加载 / 状态 ---------------- */

  setLoading(pct, status) {
    const p = Math.max(0, Math.min(100, Math.round(pct)));
    if (this.el.loadingBar) this.el.loadingBar.style.width = `${p}%`;
    if (this.el.loadingPct) this.el.loadingPct.textContent = `${p}%`;
    if (status && this.el.loadingStatus) this.el.loadingStatus.textContent = status;
  }

  setReady() {
    this.el.loading?.classList.add('is-done');
    this.el.body.classList.add('is-ready');
    setTimeout(() => { if (this.el.loading) this.el.loading.style.display = 'none'; }, 1400);
  }

  setMuted(muted) {
    this.el.body.classList.toggle('is-muted', muted);
    this.el.soundBtn?.setAttribute('aria-label', muted ? '开启声音' : '关闭声音');
  }

  setStats(fps, particles, calls) {
    if (this.el.statFps) this.el.statFps.textContent = String(fps);
    if (this.el.statParticles) this.el.statParticles.textContent = particles.toLocaleString('zh-CN');
    if (this.el.statCalls) this.el.statCalls.textContent = String(calls);
  }

  toast(title, desc = '', type = '') {
    if (!this.el.toastWrap) return;
    const el = document.createElement('div');
    el.className = `toast ${type === 'ok' ? 'is-ok' : ''}`;
    el.innerHTML = `
      <span class="toast-icon"></span>
      <div class="toast-copy"><strong>${title}</strong><span>${desc}</span></div>
    `;
    this.el.toastWrap.appendChild(el);
    while (this.el.toastWrap.children.length > 3) this.el.toastWrap.firstChild.remove();
    requestAnimationFrame(() => el.classList.add('is-on'));
    setTimeout(() => {
      el.classList.add('is-out');
      setTimeout(() => el.remove(), 500);
    }, 4200);
  }

  /* ---------------- 季节 ---------------- */

  buildSeasonButtons() {
    if (!this.el.seasonSwitch) return;
    this.el.seasonSwitch.innerHTML = SEASONS.map((s) => `
      <button class="season-btn" data-season="${s.id}" title="${s.cn} · ${s.copy}（每 18–28 秒自动切换）">
        <span class="season-cn">${s.cn}</span>
        <span class="season-en">${s.en}</span>
      </button>
    `).join('');
    $$('.season-btn', this.el.seasonSwitch).forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-season');
        this.emit('seasonSelect', id);
      });
    });
    this.el.seasonSwitch.title = '四季每 18–28 秒自动切换，也可手动选择';
  }

  updateSeason(id) {
    this.currentSeason = id;
    $$('.season-btn', this.el.seasonSwitch).forEach((btn) => {
      btn.classList.toggle('is-active', btn.getAttribute('data-season') === id);
    });
    this.el.body.dataset.season = id;
    const season = SEASON_MAP[id];
    if (season) document.documentElement.style.setProperty('--season-accent', season.accent);
  }

  /* ---------------- 任务链 ---------------- */

  setQuests(quests) {
    this.quests = quests.map((q) => ({ ...q }));
    this.renderQuests();
  }

  setQuestStatus(id, status) {
    const q = this.quests.find((x) => x.id === id);
    if (!q) return;
    q.status = status;
    this.renderQuests();
  }

  renderQuests() {
    if (!this.el.questList) return;
    this.el.questList.innerHTML = this.quests.map((q, i) => {
      const stateText = q.status === 'done' ? '已完成' : q.status === 'active' ? '进行中' : '待解锁';
      const nodeContent = q.status === 'done'
        ? '<svg viewBox="0 0 12 12" width="10" height="10" fill="none"><path d="M2 6.2L4.6 8.8 10 3.4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>'
        : `<span>${String(i + 1).padStart(2, '0')}</span>`;
      return `
        <div class="quest-item is-${q.status}" data-quest="${q.id}">
          <div class="quest-node">${nodeContent}</div>
          <div class="quest-copy">
            <strong>${q.title}</strong>
            <span>${q.desc}</span>
          </div>
          <span class="quest-state">${stateText}</span>
        </div>
      `;
    }).join('');
    $$('.quest-item', this.el.questList).forEach((item) => {
      item.addEventListener('click', () => {
        const id = item.getAttribute('data-quest');
        const q = this.quests.find((x) => x.id === id);
        if (q && q.status !== 'locked') this.emit('questTrack', id);
      });
    });
    const allDone = this.quests.every((q) => q.status === 'done');
    this.el.questPill.textContent = allDone ? '已闭环' : '进行中';
    this.el.questPill.classList.toggle('is-done', allDone);
  }

  /* ---------------- 提示浮层 ---------------- */

  showTooltip({ name, kicker, hint = '点击查看', x, y }) {
    if (!this.el.tooltip) return;
    this.el.tooltipKicker.textContent = kicker || '探索';
    this.el.tooltipName.textContent = name || '';
    this.el.tooltipHint.textContent = hint;
    this.el.tooltip.classList.add('is-on');
    this.moveTooltip(x, y);
  }

  moveTooltip(x, y) {
    if (!this.el.tooltip) return;
    const pad = 18;
    const w = this.el.tooltip.offsetWidth || 180;
    const h = this.el.tooltip.offsetHeight || 70;
    let left = x + pad;
    let top = y + pad;
    if (left + w > window.innerWidth - 12) left = x - w - pad;
    if (top + h > window.innerHeight - 12) top = y - h - pad;
    this.el.tooltip.style.left = `${left}px`;
    this.el.tooltip.style.top = `${top}px`;
  }

  hideTooltip() {
    this.el.tooltip?.classList.remove('is-on');
  }

  /* ---------------- 面板通用 ---------------- */

  showPanel({ mode, breadcrumb, title, subtitle, body, footer = '' }) {
    this.panelMode = mode;
    this.showingPending = false;
    this.el.panelBreadcrumb.textContent = breadcrumb;
    this.el.panelTitle.textContent = title;
    this.el.panelSubtitle.textContent = subtitle;
    this.el.panelBody.innerHTML = body;
    this.el.panelFoot.innerHTML = footer;
    this.el.panelBody.scrollTop = 0;
    this.el.panel.classList.add('is-open');
    this.el.panel.setAttribute('aria-hidden', 'false');
    this.el.body.classList.add('is-panel-open');
    this.hideTooltip();
  }

  closePanel(notify = true) {
    if (!this.panelMode) return;
    const mode = this.panelMode;
    this.panelMode = null;
    this.showingPending = false;
    this.activeEntry = null;
    this.el.panel.classList.remove('is-open');
    this.el.panel.setAttribute('aria-hidden', 'true');
    this.el.body.classList.remove('is-panel-open');
    if (notify) this.emit('panelClose', mode);
  }

  isPanelOpen() { return !!this.panelMode; }

  /* ---------------- 档案详情 ---------------- */

  openDetail(key, context = {}) {
    let meta = INTERACTIONS[key];
    if (key === 'npc') meta = this.buildNpcMeta(context);
    if (!meta) return;

    this.activeEntry = meta;
    this._context = context;

    let actionHtml = '';
    let actionLabel = meta.action?.label;
    if (key === 'ticketBox') {
      actionLabel = this.bag.length ? '查看票据夹' : '收取票据';
    }
    if (key === 'approvalTerminal') {
      actionLabel = this.pendingRecord ? `审批当前单据 · ¥${formatMoney(this.pendingRecord.amount)}` : '打开审批队列';
    }
    if (key === 'npc') {
      actionLabel = `派发任务 · ${context.name || ''}`;
    }
    if (actionLabel) {
      const type = meta.action?.type || 'detail';
      actionHtml += `<button class="btn btn-primary" data-action="${type}">${actionLabel}<svg viewBox="0 0 24 24" fill="none"><path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></button>`;
    }
    actionHtml += `<button class="btn btn-ghost" data-action="close">关闭档案</button>`;

    const facts = meta.facts || [];
    const factHtml = facts.map(([k, v]) => `
      <div class="detail-cell"><span>${k}</span><b class="${String(v).includes('OPEN') || String(v).includes('营业') || String(v).includes('RUNNING') ? 'ok' : ''}">${v}</b></div>
    `).join('');

    const logs = this.buildLogs(key, meta, context);
    const logHtml = logs.map((l) => `<li><b>${l.text}</b><span>${l.time}</span></li>`).join('');

    const body = `
      <div class="detail-hero">
        <div class="detail-num">${meta.num || '—'}</div>
        <div class="detail-hero-copy">
          <span class="detail-tag">${meta.category}</span>
          <h3>${meta.name}</h3>
          <p>${meta.summary}</p>
        </div>
      </div>
      <div class="detail-grid">${factHtml}</div>
      <div class="detail-section">
        <h4>档案描述 / DOSSIER</h4>
        <p>${meta.description}</p>
      </div>
      ${logHtml ? `<div class="detail-section"><h4>实时档案 / LOG</h4><ul class="log-list">${logHtml}</ul></div>` : ''}
      <div class="detail-section">
        <h4>标签 / TAGS</h4>
        <div class="tag-row">${(meta.tags || []).map((t) => `<span class="tag">${t}</span>`).join('')}</div>
      </div>
    `;

    this.showPanel({
      mode: 'detail',
      breadcrumb: `ARCHIVE / ${meta.category}`,
      title: meta.name,
      subtitle: meta.en || '',
      body,
      footer: actionHtml,
    });
  }

  buildNpcMeta(context = {}) {
    const emp = EMPLOYEES.find((e) => e.id === context.npcId) || EMPLOYEES[0];
    return {
      num: '20',
      name: `${emp.name} · ${emp.role}`,
      en: `GOODWORK TEAM / ${emp.code}`,
      category: 'NPC · 团队成员',
      summary: `${emp.dept} · ${emp.role}。点击派发任务后，TA 将使用 A* 寻路自动前往目标建筑。`,
      facts: [
        ['所属部门', emp.dept],
        ['员工编号', emp.code],
        ['当前状态', '在场景中自主行走'],
        ['寻路网格', '32 × 22 / A*'],
      ],
      description: `「${emp.line}」<br><br>员工具备自动寻路、同伴分离与障碍重规划能力。接近目标时会平滑减速并转身，步行时腿部与手臂反相摆动。`,
      tags: ['A* 寻路', '肢体动画', '任务链', emp.dept],
      action: { type: 'sendNpc', label: '派发任务' },
    };
  }

  buildLogs(key, meta, context) {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    const base = [{ text: `${meta.category} · 档案已同步至工作台`, time }];
    if (key === 'garage') {
      base.unshift({ text: '举升机车辆底盘检修完成', time: '14:26' });
      base.unshift({ text: '财务 OS 已连接 · 3 张票据待归集', time: '13:58' });
    } else if (key === 'npc') {
      base.unshift({ text: '完成一次 A* 路径重规划', time: '刚刚' });
      base.unshift({ text: context.line || '正在执行场景巡逻', time: '最近' });
    } else if (key === 'ticketBox') {
      base.unshift({ text: this.bag.length ? `票据夹已同步 ${this.bag.length} 张票据` : '3 张电子票据待归集', time: '刚刚' });
    } else if (key === 'approvalTerminal') {
      base.unshift({ text: this.pendingRecord ? '存在 1 张待审批单据' : '审批队列为空', time: '刚刚' });
    } else if (key === 'traffic') {
      base.unshift({ text: '环道车流 · 8 台车辆运行中', time: 'LIVE' });
    } else if (['lake', 'waterfall', 'mountain', 'deer', 'clouds', 'mist', 'cherryGrove'].includes(key)) {
      base.unshift({ text: '环境粒子与季相系统运行正常', time: 'LIVE' });
    } else if (key === 'finance') {
      base.unshift({ text: '今日预算使用率 62%', time: 'LIVE' });
    }
    return base;
  }

  /* ---------------- 报销表单 ---------------- */

  openGarageForm() {
    this.panelMode = 'form';
    this.activeEntry = INTERACTIONS.garage;
    this._context = {};
    this.captureDraft();
    const bag = this.bag;
    if (bag.length) {
      bag.forEach((r) => { if (!this.selectedReceipts.has(r.id)) this.selectedReceipts.add(r.id); });
    }
    const selectedTotal = this.selectedReceiptTotal();
    if (!this.formDraft.amount && selectedTotal > 0) this.formDraft.amount = selectedTotal.toFixed(2);

    const applicantOptions = EMPLOYEES.map((e) => `
      <option value="${e.id}" ${this.formDraft.applicant === e.id ? 'selected' : ''}>${e.name} · ${e.role}</option>
    `).join('');
    const deptOptions = ['财务中心', '仓储管理', '客户体验', '售后服务'].map((d) => `
      <option value="${d}" ${this.formDraft.dept === d ? 'selected' : ''}>${d}</option>
    `).join('');
    const typeOptions = EXPENSE_TYPES.map((t) => `
      <option value="${t}" ${this.formDraft.type === t ? 'selected' : ''}>${t}</option>
    `).join('');

    const receiptHtml = bag.length
      ? bag.map((r) => `
        <div class="receipt-item ${this.selectedReceipts.has(r.id) ? 'is-picked' : ''}" data-receipt="${r.id}">
          <span class="receipt-check"><svg viewBox="0 0 10 10" fill="none"><path d="M1.5 5.2L3.8 7.5 8.5 2.6" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
          <div class="receipt-info"><b>${r.vendor}</b><span>${r.code} · ${r.date} · ${r.type}</span></div>
          <span class="receipt-amount">¥${formatMoney(r.amount)}</span>
        </div>
      `).join('')
      : `<div class="receipt-empty">票据夹为空。请先前往广场票据箱收取票据，或点击下方「一键同步票据」。</div>`;

    const body = `
      <div class="form-notice">
        <span class="toast-icon" style="margin-top:4px"></span>
        <div>当前工作台：<b>GOODWORK 古德車房</b> · 财务 OS 已连接。提交后将由审批终端完成额度与票据完整性校验。</div>
      </div>
      <form id="reimburseForm" class="form" novalidate>
        <div class="form-section">
          <div class="form-section-head"><span>01</span><h4>申请人信息 / APPLICANT</h4></div>
          <div class="field-row">
            <label class="field"><span>申请人</span><select id="applicant">${applicantOptions}</select></label>
            <label class="field"><span>所属部门</span><select id="dept">${deptOptions}</select></label>
          </div>
          <div class="field-row">
            <label class="field"><span>费用类型</span><select id="expenseType">${typeOptions}</select></label>
            <label class="field"><span>发生日期</span><input id="expenseDate" type="date" value="${this.formDraft.date}" /></label>
          </div>
        </div>

        <div class="form-section">
          <div class="form-section-head"><span>02</span><h4>费用明细 / EXPENSE</h4></div>
          <label class="field">
            <span>报销事由</span>
            <textarea id="purpose" placeholder="例如：客户试驾接送、配件采购运输、举升机维护耗材……">${this.formDraft.purpose}</textarea>
          </label>
          <div class="amount-field">
            <span>报销金额 / AMOUNT</span>
            <div class="amount-input">
              <i>¥</i>
              <input id="amount" type="number" min="0" step="0.01" value="${this.formDraft.amount}" placeholder="0.00" />
              <em>CNY</em>
            </div>
          </div>
        </div>

        <div class="form-section">
          <div class="form-section-head"><span>03</span><h4>票据附件 / RECEIPTS</h4></div>
          <div class="receipt-head">
            <span>${bag.length} 张票据 · 已选 ${this.selectedReceipts.size} 张</span>
            <button type="button" data-action="collect" id="syncReceipts">一键同步票据</button>
          </div>
          <div class="receipt-list" id="receiptList">${receiptHtml}</div>
          <div class="summary-line"><span>票据合计 / RECEIPT TOTAL</span><b id="receiptTotal">¥${formatMoney(this.selectedReceiptTotal())}</b></div>
          <label class="form-agree">
            <input type="checkbox" id="agree" ${this.formDraft.agree ? 'checked' : ''} />
            <span>本人确认以上票据与费用真实有效，并已阅读 GOODWORK 财务报销规范。</span>
          </label>
          <div class="form-error" id="formError"></div>
        </div>
      </form>
    `;

    const footer = `
      <button class="btn btn-ghost" data-action="close">取消</button>
      <button class="btn btn-primary" type="submit" form="reimburseForm">提交审批
        <svg viewBox="0 0 24 24" fill="none"><path d="M5 12h13M13 6.5l5.5 5.5-5.5 5.5" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>
      </button>
    `;

    this.showPanel({
      mode: 'form',
      breadcrumb: 'FINANCE OS / 报销申请',
      title: '费用报销单',
      subtitle: 'REIMBURSEMENT / FORM 07 · GOODWORK 古德車房',
      body,
      footer,
    });
  }

  captureDraft() {
    if (!this.panelMode || this.panelMode !== 'form') return;
    const applicant = $('#applicant', this.el.panelBody);
    if (!applicant) return;
    this.formDraft.applicant = applicant.value;
    this.formDraft.dept = $('#dept', this.el.panelBody)?.value || this.formDraft.dept;
    this.formDraft.type = $('#expenseType', this.el.panelBody)?.value || this.formDraft.type;
    this.formDraft.date = $('#expenseDate', this.el.panelBody)?.value || this.formDraft.date;
    this.formDraft.purpose = $('#purpose', this.el.panelBody)?.value ?? this.formDraft.purpose;
    this.formDraft.amount = $('#amount', this.el.panelBody)?.value ?? this.formDraft.amount;
    this.formDraft.agree = $('#agree', this.el.panelBody)?.checked ?? this.formDraft.agree;
  }

  selectedReceiptTotal() {
    return this.bag
      .filter((r) => this.selectedReceipts.has(r.id))
      .reduce((sum, r) => sum + r.amount, 0);
  }

  syncAmountFromReceipts() {
    const total = this.selectedReceiptTotal();
    const totalEl = $('#receiptTotal', this.el.panelBody);
    if (totalEl) totalEl.textContent = `¥${formatMoney(total)}`;
    const amountEl = $('#amount', this.el.panelBody);
    if (amountEl) {
      amountEl.value = total.toFixed(2);
      this.formDraft.amount = amountEl.value;
    }
    const head = $('.receipt-head span', this.el.panelBody);
    if (head) head.textContent = `${this.bag.length} 张票据 · 已选 ${this.selectedReceipts.size} 张`;
  }

  updateReceiptHint() {
    const syncBtn = $('#syncReceipts', this.el.panelBody);
    if (syncBtn) syncBtn.textContent = this.bag.length ? '重新同步票据' : '一键同步票据';
  }

  addReceipts(receipts) {
    const existing = new Set(this.bag.map((r) => r.id));
    let changed = false;
    for (const r of receipts) {
      if (!existing.has(r.id)) {
        this.bag.push(r);
        this.selectedReceipts.add(r.id);
        existing.add(r.id);
        changed = true;
      } else {
        this.selectedReceipts.add(r.id);
      }
    }
    if (!changed) return false;
    if (this.panelMode === 'form') {
      this.captureDraft();
      const selectedTotal = this.selectedReceiptTotal();
      this.formDraft.amount = selectedTotal.toFixed(2);
      this.openGarageForm();
    }
    return true;
  }

  submitForm() {
    const applicant = $('#applicant', this.el.panelBody)?.value;
    const dept = $('#dept', this.el.panelBody)?.value;
    const type = $('#expenseType', this.el.panelBody)?.value;
    const date = $('#expenseDate', this.el.panelBody)?.value;
    const purpose = ($('#purpose', this.el.panelBody)?.value || '').trim();
    const amount = parseFloat($('#amount', this.el.panelBody)?.value || '0');
    const agree = $('#agree', this.el.panelBody)?.checked;
    const err = $('#formError', this.el.panelBody);
    const fail = (msg) => {
      if (err) {
        err.textContent = msg;
        err.classList.add('is-on');
      }
      this.el.panelBody.scrollTo({ top: this.el.panelBody.scrollHeight, behavior: 'smooth' });
    };

    if (!this.selectedReceipts.size) return fail('请至少选择一张票据。可点击「一键同步票据」从票据箱归集。');
    if (!purpose || purpose.length < 4) return fail('请填写至少 4 个字符的报销事由。');
    if (!Number.isFinite(amount) || amount <= 0) return fail('请输入有效的报销金额。');
    if (!agree) return fail('请确认票据与费用真实性后再提交。');

    const emp = EMPLOYEES.find((e) => e.id === applicant) || EMPLOYEES[0];
    const receipts = this.bag.filter((r) => this.selectedReceipts.has(r.id));
    const record = {
      id: `GW-RB-${formatDate().replaceAll('-', '')}-${String(this.records.length + 1).padStart(3, '0')}`,
      applicantId: emp.id,
      applicantName: emp.name,
      dept: dept || emp.dept,
      type: type || '采购费',
      amount,
      purpose,
      date: date || formatDate(),
      receipts,
      status: 'pending',
      createdAt: new Date().toISOString(),
      approvedAt: null,
    };
    this.records.unshift(record);
    this.pendingRecord = record;
    this.formDraft = {
      applicant: emp.id,
      dept: dept || emp.dept,
      type: type || '采购费',
      date: formatDate(),
      purpose: '',
      amount: '',
      agree: false,
    };
    this.showPending(record);
    this.emit('formSubmit', record);
  }

  showPending(record) {
    this.panelMode = 'form';
    this.showingPending = true;
    const body = `
      <div class="success-card">
        <div class="success-kicker">SUBMITTED / 已提交</div>
        <div class="success-title">报销单进入审批流</div>
        <div class="success-sub">${record.applicantName} · ${record.dept} · ${record.type}<br>审批终端正在校验额度与票据完整性。</div>
        <div class="success-meta">
          <div>单号<b>${record.id}</b></div>
          <div style="text-align:right">金额<b>¥${formatMoney(record.amount)}</b></div>
        </div>
      </div>
      <div class="detail-section">
        <h4>审批进度 / APPROVAL TRACE</h4>
        <ul class="progress-timeline">
          <li class="is-done">票据归集与附件校验<span>完成</span></li>
          <li class="is-current">部门预算 / 金额匹配<span>审批中</span></li>
          <li>财务中心终审与归档<span>等待</span></li>
        </ul>
      </div>
      <div class="form-notice">
        <span class="toast-icon" style="margin-top:4px"></span>
        <div>审批通常需要数秒。你也可以关闭面板后点击广场上的<b>审批终端</b>立即完成审批。</div>
      </div>
    `;
    const footer = `
      <button class="btn btn-ghost" data-action="close">关闭面板</button>
      <button class="btn btn-primary" data-action="submit-approve">立即模拟审批</button>
    `;
    this.el.panelBreadcrumb.textContent = 'FINANCE OS / 审批中';
    this.el.panelTitle.textContent = '审批流转中';
    this.el.panelSubtitle.textContent = `APPROVAL / ${record.id}`;
    this.el.panelBody.innerHTML = body;
    this.el.panelFoot.innerHTML = footer;
    this.el.panelBody.scrollTop = 0;
  }

  approveRecord(recordId) {
    const record = this.records.find((r) => r.id === recordId);
    if (!record) return null;
    record.status = 'approved';
    record.approvedAt = new Date().toISOString();
    if (this.pendingRecord?.id === recordId) this.pendingRecord = null;
    if (this.panelMode === 'form' && this.showingPending) {
      this.showApproved(record);
    }
    this.showingPending = false;
    return record;
  }

  showApproved(record) {
    this.panelMode = 'form';
    this.showingPending = false;
    const body = `
      <div class="success-card is-stamped">
        <div class="stamp">已 通 过</div>
        <div class="success-kicker">APPROVED / 审批通过</div>
        <div class="success-title">报销单已归档</div>
        <div class="success-sub">审批终端完成额度校验，记录已写入 GOODWORK 财务档案库。</div>
        <div class="success-meta">
          <div>单号<b>${record.id}</b></div>
          <div style="text-align:right">金额<b>¥${formatMoney(record.amount)}</b></div>
        </div>
      </div>
      <div class="detail-section">
        <h4>归档信息 / ARCHIVE</h4>
        <ul class="progress-timeline">
          <li class="is-done">票据归集与附件校验<span>完成</span></li>
          <li class="is-done">部门预算 / 金额匹配<span>通过</span></li>
          <li class="is-done">财务中心终审与归档<span>完成</span></li>
        </ul>
      </div>
      <div class="detail-grid">
        <div class="detail-cell"><span>申请人</span><b>${record.applicantName}</b></div>
        <div class="detail-cell"><span>所属部门</span><b>${record.dept}</b></div>
        <div class="detail-cell"><span>费用类型</span><b>${record.type}</b></div>
        <div class="detail-cell"><span>归档状态</span><b class="ok">APPROVED</b></div>
      </div>
      <div class="detail-section">
        <h4>报销事由 / PURPOSE</h4>
        <p>${record.purpose}</p>
      </div>
    `;
    const footer = `
      <button class="btn" data-action="archive">查看档案库</button>
      <button class="btn btn-primary" data-action="close">完成 · 返回场景</button>
    `;
    this.el.panelBreadcrumb.textContent = 'FINANCE OS / 审批完成';
    this.el.panelTitle.textContent = '报销已归档';
    this.el.panelSubtitle.textContent = `ARCHIVED / ${record.id}`;
    this.el.panelBody.innerHTML = body;
    this.el.panelFoot.innerHTML = footer;
    this.el.panelBody.scrollTop = 0;
  }

  /* ---------------- 档案库 ---------------- */

  openArchive() {
    this.captureDraft();
    this._context = {};
    this.activeEntry = null;
    this.panelMode = 'archive';
    const list = this.records.map((r) => `
      <div class="archive-item">
        <div class="archive-top">
          <b>${r.id}</b>
          <span class="${r.status === 'approved' ? 'is-ok' : ''}">${r.status === 'approved' ? '已归档' : '审批中'}</span>
        </div>
        <div class="archive-sub">
          <span>${r.applicantName} · ${r.dept} · ${r.type}</span>
          <span>¥${formatMoney(r.amount)}</span>
        </div>
      </div>
    `).join('');

    const body = `
      <div class="detail-section">
        <h4>报销档案库 / REIMBURSEMENT ARCHIVE</h4>
        <p>共 ${this.records.length} 条报销记录。审批完成后自动写入，并与任务链同步。</p>
      </div>
      <div class="archive-list">
        ${list || '<div class="archive-empty">暂无报销档案。<br>点击车房或右下角按钮发起第一笔报销。</div>'}
      </div>
    `;
    const footer = `
      <button class="btn btn-ghost" data-action="close">返回工作台</button>
      <button class="btn btn-primary" data-action="open-form">发起新报销</button>
    `;
    this.showPanel({
      mode: 'archive',
      breadcrumb: 'FINANCE OS / ARCHIVE',
      title: '报销档案库',
      subtitle: 'APPROVED RECORDS · GOODWORK',
      body,
      footer,
    });
  }

  /* ---------------- 通知外部数据 ---------------- */

  getLatestPending() {
    if (this.pendingRecord) return this.pendingRecord;
    return null;
  }
}
