/**
 * 业务流程与 NPC 任务链：取票 → 提交 → 审批
 */
import { EMPLOYEES, RECEIPTS, QUESTS } from '../core/config.js';

const STANDS = {
  ticket: { x: 2.45, z: 4.72 },
  terminal: { x: -3.0, z: 4.75 },
  garage: { x: 0.55, z: 4.55 },
  finance: { x: 6.2, z: -0.8 },
  warehouse: { x: -4.95, z: 0.8 },
  dorm: { x: -6.55, z: 5.85 },
};

export class QuestSystem {
  constructor({ ui, npcs, props, audio, onOpenGarage }) {
    this.ui = ui;
    this.npcs = npcs;
    this.props = props;
    this.audio = audio;
    this.onOpenGarage = onOpenGarage;
    this.quests = QUESTS.map((q) => ({ ...q }));
    this.pendingRecord = null;
    this.collecting = false;
    this.collected = false;
    this.approving = false;
    this.approveTimer = null;
    this.ui.setQuests(this.quests);
    this.npcMap = npcs.byId;
  }

  setQuestStatus(id, status) {
    const q = this.quests.find((x) => x.id === id);
    if (q) q.status = status;
    this.ui.setQuests(this.quests);
  }

  /* ---------------- 票据归集 ---------------- */

  collectReceipts({ fromForm = false } = {}) {
    if (this.collecting) {
      this.ui.toast('票据正在归集', '林晓正在前往票据箱，请稍候。');
      return;
    }
    if (this.collected) {
      this.ui.toast('票据已在票据夹中', '可直接填写报销事由并提交审批。', 'ok');
      return;
    }
    this.collecting = true;
    const lin = this.npcMap.lin;
    const finalize = () => {
      if (this.collected) return;
      this.collected = true;
      this.collecting = false;
      this.ui.addReceipts(RECEIPTS);
      this.props.setTicketCollected(true);
      this.setQuestStatus('collect', 'done');
      if (this.quests.find((q) => q.id === 'submit')?.status === 'locked') {
        this.setQuestStatus('submit', 'active');
      }
      this.audio.collect();
      this.ui.toast('票据归集完成', '3 张票据已同步至报销单附件，可继续填写并提交。', 'ok');
      if (lin) {
        lin.walkTo(STANDS.garage.x, STANDS.garage.z);
      }
    };

    if (fromForm) {
      finalize();
      if (lin) {
        lin.walkTo(STANDS.ticket.x, STANDS.ticket.z, () => {
          lin.walkTo(STANDS.garage.x, STANDS.garage.z);
        });
      }
      return;
    }

    this.ui.toast('票据任务已派发', '林晓正在前往票据箱，收集 3 张电子票据。');
    if (!lin) {
      finalize();
      return;
    }
    const ok = lin.walkTo(STANDS.ticket.x, STANDS.ticket.z, finalize);
    if (!ok) finalize();
  }

  /* ---------------- 提交 ---------------- */

  onFormSubmit(record) {
    if (!this.collected) {
      this.collected = true;
      this.ui.addReceipts(RECEIPTS);
      this.props.setTicketCollected(true);
    }
    this.pendingRecord = record;
    this.setQuestStatus('collect', 'done');
    this.setQuestStatus('submit', 'done');
    this.setQuestStatus('approve', 'active');
    this.props.setTerminalStatus('pending');
    this.ui.toast('报销单已提交', `单号 ${record.id} · 等待审批终端完成额度校验。`);
    this.audio.submit();

    // 林晓前往审批终端，再回到财务室
    const lin = this.npcMap.lin;
    if (lin) {
      lin.walkTo(STANDS.terminal.x, STANDS.terminal.z, () => {
        setTimeout(() => {
          lin.walkTo(STANDS.finance.x, STANDS.finance.z);
        }, 1400);
      });
    }

    if (this.approveTimer) clearTimeout(this.approveTimer);
    this.approveTimer = setTimeout(() => {
      this.approveNow({ auto: true });
    }, 6800);
  }

  /* ---------------- 审批 ---------------- */

  approveNow({ auto = false } = {}) {
    if (this.approving) return;
    const pending = this.pendingRecord;
    if (!pending) {
      this.ui.toast('审批队列为空', '请先在车房提交一张报销单。');
      return;
    }
    this.approving = true;
    if (this.approveTimer) { clearTimeout(this.approveTimer); this.approveTimer = null; }
    const record = this.ui.approveRecord(pending.id);
    this.pendingRecord = null;
    this.props.setTerminalStatus('approved');
    this.setQuestStatus('approve', 'done');
    this.audio.approve();
    this.ui.toast(
      auto ? '审批已自动通过' : '审批通过 · 已归档',
      `${pending.id} · ¥${pending.amount.toFixed(2)} 已写入财务档案库。`,
      'ok'
    );
    const lin = this.npcMap.lin;
    if (lin) lin.walkTo(STANDS.garage.x, STANDS.garage.z);

    if (this.ui.panelMode === 'detail') {
      this.ui.openArchive();
    }
    setTimeout(() => { this.props.setTerminalStatus('ready'); }, 4200);
    setTimeout(() => { this.approving = false; }, 600);
  }

  /* ---------------- 派发 NPC ---------------- */

  sendNpc(npcId) {
    const npc = this.npcMap[npcId];
    if (!npc) return;
    if (this.collecting && npcId === 'lin') {
      this.ui.toast('林晓正在执行票据任务', '完成票据归集后可再次派发任务。');
      return;
    }
    const destinations = [
      { key: 'garage', label: 'GOODWORK 车房', x: STANDS.garage.x, z: STANDS.garage.z },
      { key: 'terminal', label: '审批终端', x: STANDS.terminal.x, z: STANDS.terminal.z },
      { key: 'warehouse', label: '仓库', x: STANDS.warehouse.x, z: STANDS.warehouse.z },
      { key: 'dorm', label: '员工宿舍', x: STANDS.dorm.x, z: STANDS.dorm.z },
    ];
    const dest = destinations[Math.floor(Math.random() * destinations.length)];
    this.ui.closePanel(false);
    const ok = npc.walkTo(dest.x, dest.z, () => {
      this.ui.toast(`${npc.employee.name} 已抵达`, `当前任务：${dest.label} · 巡检完成。`, 'ok');
    });
    if (ok) {
      this.ui.toast('任务已派发', `${npc.employee.name} 正沿 A* 路径前往${dest.label}。`);
      this.audio.click();
    } else {
      this.ui.toast('目标不可达', 'NPC 将重新规划路径。');
    }
  }

  /* ---------------- 任务追踪 ---------------- */

  track(id) {
    if (id === 'collect') {
      if (this.collected) {
        this.ui.toast('票据已归集', '可以进入车房填写报销单。', 'ok');
      } else {
        this.ui.openDetail('ticketBox', {});
      }
    } else if (id === 'submit') {
      this.onOpenGarage?.();
    } else if (id === 'approve') {
      if (this.pendingRecord) {
        this.ui.openDetail('approvalTerminal', {});
      } else {
        this.ui.toast('暂无待审批单据', '提交报销单后，审批终端将自动接入。');
      }
    }
  }

  get pending() { return this.pendingRecord; }
}
