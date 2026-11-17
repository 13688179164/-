import type { AppState, Meeting, Minutes, Person, Supervision } from './types'
import { addDays, todayKey } from './lib/date'

export const people: Person[] = [
  { id: 'p1', name: '林砚', role: '产品负责人', org: '产品中心', tone: 'brand' },
  { id: 'p2', name: '周牧', role: '技术负责人', org: '研发中心', tone: 'teal' },
  { id: 'p3', name: '苏晚', role: '设计负责人', org: '体验设计部', tone: 'violet' },
  { id: 'p4', name: '陈屿', role: '市场总监', org: '市场中心', tone: 'amber' },
  { id: 'p5', name: '顾知微', role: '客户成功经理', org: '客户成功部', tone: 'rose' },
  { id: 'p6', name: '沈亦', role: '数据分析师', org: '数据平台部', tone: 'blue' },
  { id: 'p7', name: '程野', role: '项目经理', org: 'PMO', tone: 'slate' },
  { id: 'p8', name: '江迟', role: '财务经理', org: '财务部', tone: 'green' },
  { id: 'p9', name: '陆遥', role: '内容运营', org: '市场中心', tone: 'orange' },
  { id: 'p10', name: '何遇', role: '前端工程师', org: '研发中心', tone: 'cyan' },
]

const d = (offset: number) => addDays(todayKey(), offset)

const meetings: Meeting[] = [
  {
    id: 'm1',
    title: '3.2 版本体验升级评审',
    type: '评审会',
    date: d(0),
    start: '10:00',
    end: '11:30',
    location: '云杉厅 · 7F',
    participantIds: ['p1', 'p3', 'p2', 'p6', 'p10'],
    organizerId: 'p1',
    priority: 'high',
    content: `3.2 版本核心链路体验走查
首页信息架构调整方案
智能日程助手的交互边界
灰度发布节奏与验收标准`,
    createdAt: Date.now() - 86400000 * 6,
  },
  {
    id: 'm2',
    title: '第四季度增长策略研讨会',
    type: '战略会',
    date: d(0),
    start: '14:00',
    end: '16:00',
    location: '松涛厅 · 8F',
    participantIds: ['p4', 'p1', 'p5', 'p6', 'p9', 'p7'],
    organizerId: 'p4',
    priority: 'high',
    content: `Q4 核心增长指标与拆解
内容营销与渠道预算分配
客户成功驱动的续约策略
双十一节点活动排期`,
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 'm3',
    title: '设计系统组件库对齐会',
    type: '专题会',
    date: d(1),
    start: '09:30',
    end: '10:30',
    location: '线上会议 · 飞书',
    participantIds: ['p3', 'p10', 'p1', 'p2'],
    organizerId: 'p3',
    priority: 'normal',
    content: `组件命名与 Token 规范统一
表单类组件的一致性问题
3.2 版本新增组件的评审流程`,
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 'm4',
    title: '研发效能双周会',
    type: '周会',
    date: d(-1),
    start: '16:00',
    end: '17:00',
    location: '竹影会议室 · 6F',
    participantIds: ['p2', 'p10', 'p7', 'p6'],
    organizerId: 'p2',
    priority: 'normal',
    content: `双周交付数据复盘
构建时长与线上问题分析
自动化测试覆盖率提升计划`,
    createdAt: Date.now() - 86400000 * 12,
  },
  {
    id: 'm5',
    title: '星河集团客户成功复盘',
    type: '复盘会',
    date: d(-2),
    start: '15:00',
    end: '16:30',
    location: '客户现场 · 星河大厦',
    participantIds: ['p5', 'p1', 'p4', 'p7'],
    organizerId: 'p5',
    priority: 'high',
    content: `星河集团 Q3 产品使用深度回顾
关键人变动与续约风险
Q4 联合运营与标杆案例计划`,
    createdAt: Date.now() - 86400000 * 9,
  },
  {
    id: 'm6',
    title: '年度预算沟通会',
    type: '专题会',
    date: d(3),
    start: '10:00',
    end: '12:00',
    location: '财务会议室 · 5F',
    participantIds: ['p8', 'p1', 'p4', 'p5'],
    organizerId: 'p8',
    priority: 'normal',
    content: `各中心年度预算初稿说明
重点项目的资源优先级
预算审批口径与时间节点`,
    createdAt: Date.now() - 86400000 * 2,
  },
  {
    id: 'm7',
    title: '品牌视觉焕新提案评审',
    type: '评审会',
    date: d(5),
    start: '14:30',
    end: '16:00',
    location: '松涛厅 · 8F',
    participantIds: ['p3', 'p4', 'p9', 'p1'],
    organizerId: 'p3',
    priority: 'normal',
    content: `品牌标识升级方向提案
官网与物料视觉延展
发布节奏与传播主题`,
    createdAt: Date.now() - 86400000,
  },
  {
    id: 'm8',
    title: '产品与市场周同步',
    type: '周会',
    date: d(7),
    start: '11:00',
    end: '11:45',
    location: '线上会议 · 飞书',
    participantIds: ['p1', 'p4', 'p9', 'p5'],
    organizerId: 'p1',
    priority: 'normal',
    content: `本周发布内容与节奏
市场活动线索回传
客户案例素材需求`,
    createdAt: Date.now() - 86400000,
  },
]

const minutes: Minutes[] = [
  {
    id: 'mi1',
    meetingId: 'm5',
    title: '星河集团客户成功复盘',
    createdAt: Date.now() - 86400000 * 2 + 3600000 * 16,
    durationSec: 3218,
    transcript:
      '今天我们复盘星河集团这个季度的整体情况。从使用数据看，日活席位从 320 提升到 410，但深度功能渗透率仍然偏低。顾知微提到，客户新上任的 IT 负责人对现有集成方案还有顾虑，这可能会影响续约节奏。我们讨论后决定，把星河集团列为 Q4 战略客户，配置专属成功经理和季度业务回顾机制。陈屿建议在十二月联合推出制造业数字化标杆案例，市场部可以配套内容资源。关于续约材料，需要在十一月十日前完成，包含使用数据复盘、商务方案和高层汇报材料，由客户成功部牵头，产品与市场配合。风险方面，客户的预算审批流程比往年延长了大约两周，我们要提前准备预案。',
    summary:
      '本次复盘围绕星河集团 Q3 的使用深度、续约风险与联合运营计划展开。客户席位规模稳步增长，但深度功能渗透不足，关键人变动带来不确定性。会议明确将星河集团升级为 Q4 战略客户，以季度业务回顾与标杆案例共建拉动续约。',
    topics: ['星河集团 Q3 使用深度复盘', '关键人变动带来的续约风险', 'Q4 联合运营与标杆案例包装'],
    decisions: [
      '将星河集团列为 Q4 战略客户，配置专属成功经理与季度业务回顾机制',
      '续约材料于 11 月 10 日前完成，覆盖数据复盘、商务方案与高层汇报',
      '12 月联合市场部发布制造业数字化标杆案例',
    ],
    actions: [
      { id: 'a1', text: '输出星河集团 Q3 使用数据复盘报告', owner: '顾知微', due: d(1), done: false },
      { id: 'a2', text: '完成续约商务方案与高层汇报材料', owner: '林砚', due: d(4), done: false },
      { id: 'a3', text: '提交标杆案例内容大纲与传播排期', owner: '陈屿', due: d(8), done: false },
    ],
    risks: ['新任 IT 负责人对集成方案仍有顾虑，需安排专项技术沟通', '客户预算审批周期延长约两周，续约节奏存在不确定性'],
    attendees: ['顾知微', '林砚', '陈屿', '程野'],
    savedToCloud: true,
    savedAt: Date.now() - 86400000 * 2 + 3600000 * 17,
    version: 1,
  },
  {
    id: 'mi2',
    meetingId: 'm4',
    title: '研发效能双周会',
    createdAt: Date.now() - 86400000 + 3600000 * 18,
    durationSec: 2410,
    transcript:
      '这周交付整体平稳，需求交付周期从 9.2 天下降到 8.4 天。构建时长仍然偏高，主要卡在测试环境的依赖安装。周牧提出，下周开始把构建缓存迁移到新的流水线，预计能节省百分之三十的等待时间。自动化测试覆盖率目前是 61%，目标是年底达到 75%。我们确认由何遇负责补齐核心链路的端到端用例，程野跟进各小组的覆盖率周报。另外线上有一个偶发的通知延迟问题，需要在本周内定位。',
    summary:
      '本次双周会复盘了交付周期、构建效率与质量指标。需求交付周期缩短至 8.4 天，但构建时长和自动化测试覆盖率仍是主要短板。会议确定迁移构建缓存、补齐核心链路用例，并跟进线上通知延迟问题。',
    topics: ['双周交付数据复盘', '构建时长与流水线优化', '自动化测试覆盖率提升'],
    decisions: ['构建缓存迁移至新流水线，目标缩短 30% 构建等待时间', '年底自动化测试覆盖率提升至 75%'],
    actions: [
      { id: 'b1', text: '完成构建缓存迁移并输出对比数据', owner: '周牧', due: d(5), done: false },
      { id: 'b2', text: '补齐核心链路端到端测试用例', owner: '何遇', due: d(9), done: true },
      { id: 'b3', text: '定位并修复线上通知延迟问题', owner: '程野', due: d(2), done: false },
    ],
    risks: ['测试环境资源紧张，覆盖率提升可能受排期影响'],
    attendees: ['周牧', '何遇', '程野', '沈亦'],
    savedToCloud: false,
    version: 1,
  },
]

const supervisions: Supervision[] = [
  {
    id: 's1',
    title: '3.2 版本灰度发布准备',
    note: '确保灰度发布前质量、监控与服务侧准备全部就绪，按目标逐项验收。',
    ownerIds: ['p2', 'p1', 'p10'],
    startDate: d(-3),
    dueDate: d(6),
    goals: [
      { id: 's1g1', title: '完成核心链路回归测试', done: true, doneAt: Date.now() - 86400000 * 2 },
      { id: 's1g2', title: '确认灰度名单与放量策略', done: true, doneAt: Date.now() - 86400000 },
      { id: 's1g3', title: '配置监控看板与告警阈值', done: false },
      { id: 's1g4', title: '同步客服话术与 FAQ', done: false },
    ],
    reminder: true,
    reminded: false,
    status: 'active',
    priority: 'high',
    createdAt: Date.now() - 86400000 * 3,
  },
  {
    id: 's2',
    title: '星河集团续约材料交付',
    note: '按约定时间完成续约材料包，并完成客户高层汇报预演。',
    ownerIds: ['p5', 'p1'],
    startDate: d(-5),
    dueDate: d(2),
    goals: [
      { id: 's2g1', title: '客户使用数据复盘', done: true, doneAt: Date.now() - 86400000 * 2 },
      { id: 's2g2', title: '续约商务方案定稿', done: false },
      { id: 's2g3', title: '高层汇报材料与预演', done: false },
    ],
    reminder: true,
    reminded: true,
    remindedAt: Date.now() - 86400000,
    status: 'active',
    priority: 'high',
    createdAt: Date.now() - 86400000 * 5,
  },
  {
    id: 's3',
    title: 'Q4 内容营销排期确认',
    note: '拉齐各渠道内容节奏，锁定双十一与年终节点的资源投入。',
    ownerIds: ['p4', 'p9', 'p6'],
    startDate: d(-8),
    dueDate: d(9),
    goals: [
      { id: 's3g1', title: '梳理 Q4 内容主题矩阵', done: true },
      { id: 's3g2', title: '完成渠道资源盘点', done: true },
      { id: 's3g3', title: '确认双十一活动排期', done: true },
      { id: 's3g4', title: '锁定年终复盘选题', done: true },
      { id: 's3g5', title: '输出排期终稿并同步执行', done: false },
    ],
    reminder: false,
    reminded: false,
    status: 'active',
    priority: 'normal',
    createdAt: Date.now() - 86400000 * 8,
  },
  {
    id: 's4',
    title: '设计系统组件覆盖率达到 80%',
    note: '以业务高频页面为基准，补齐表单、导航与反馈类组件的统一实现。',
    ownerIds: ['p3', 'p10'],
    startDate: d(-10),
    dueDate: d(14),
    goals: [
      { id: 's4g1', title: '完成组件使用率盘点', done: false },
      { id: 's4g2', title: '补齐表单类组件', done: false },
      { id: 's4g3', title: '替换导航类组件', done: false },
      { id: 's4g4', title: '覆盖率复测并发布报告', done: false },
    ],
    reminder: true,
    reminded: false,
    status: 'active',
    priority: 'normal',
    createdAt: Date.now() - 86400000 * 10,
  },
  {
    id: 's5',
    title: '客户成功手册 V2 上线',
    note: '沉淀标准服务动作与话术，完成内部培训与发布。',
    ownerIds: ['p5', 'p9'],
    startDate: d(-20),
    dueDate: d(-5),
    goals: [
      { id: 's5g1', title: '完成手册内容修订', done: true, doneAt: Date.now() - 86400000 * 9 },
      { id: 's5g2', title: '完成内部评审与培训', done: true, doneAt: Date.now() - 86400000 * 6 },
      { id: 's5g3', title: '发布并同步知识库', done: true, doneAt: Date.now() - 86400000 * 4 },
    ],
    reminder: true,
    reminded: true,
    remindedAt: Date.now() - 86400000 * 8,
    status: 'done',
    priority: 'normal',
    createdAt: Date.now() - 86400000 * 20,
    completedAt: Date.now() - 86400000 * 4,
  },
  {
    id: 's6',
    title: '办公区网络改造验收',
    note: '完成七层与八层无线覆盖验收，处理死角区域。',
    ownerIds: ['p2', 'p7'],
    startDate: d(-30),
    dueDate: d(-12),
    goals: [
      { id: 's6g1', title: '完成现场信号实测', done: true, doneAt: Date.now() - 86400000 * 15 },
      { id: 's6g2', title: '补齐死角 AP 并复测', done: true, doneAt: Date.now() - 86400000 * 12 },
    ],
    reminder: false,
    reminded: false,
    status: 'done',
    priority: 'normal',
    createdAt: Date.now() - 86400000 * 30,
    completedAt: Date.now() - 86400000 * 12,
  },
]

export function seedState(): AppState {
  return {
    people,
    meetings,
    minutes,
    supervisions,
  }
}
