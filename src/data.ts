import type { AppState, Meeting, Minutes, Person, Supervision } from './types'
import { addDays, diffMinutes, todayKey } from './lib/date'
import { analyzeMeeting, demoSentences } from './lib/analysis'

/** 平台负责人：李嘉航（财务及后台综合管理员） */
export const CURRENT_USER_ID = 'p7'

export const people: Person[] = [
  { id: 'p1', name: '弓戈', role: '公司总领导', org: '总办', tone: 'brand' },
  { id: 'p2', name: '简爱', role: '公司总领导', org: '总办', tone: 'teal' },
  { id: 'p3', name: '李古月', role: '古德車房业务领导', org: '古德車房', tone: 'violet' },
  { id: 'p4', name: '甘文康', role: '古德車房店长', org: '古德車房', tone: 'amber' },
  { id: 'p5', name: '刘阳', role: '古德車房机修部门负责人', org: '古德車房', tone: 'rose' },
  { id: 'p6', name: '贺粤新', role: 'HR', org: '总办', tone: 'blue' },
  { id: 'p7', name: '李嘉航', role: '财务及后台综合管理员', org: '财务后台', tone: 'slate' },
  { id: 'p8', name: '张鸿波', role: '财务及后台综合管理员', org: '财务后台', tone: 'green' },
  { id: 'p9', name: '李传', role: '第五人格经理', org: '游戏业务', tone: 'orange' },
  { id: 'p10', name: '徐玮', role: '永劫无间负责人', org: '游戏业务', tone: 'cyan' },
  { id: 'p11', name: '孙敏', role: '总办秘书', org: '总办', tone: 'brand' },
  { id: 'p12', name: '陈虓', role: '满吉八福门店店长', org: '满吉八福', tone: 'teal' },
  { id: 'p13', name: '李宜谦', role: '门店采购及后台人员', org: '门店', tone: 'violet' },
  { id: 'p14', name: '冯博欣', role: '商务部', org: '商务部', tone: 'amber' },
  { id: 'p15', name: '刘思远', role: '商务部', org: '商务部', tone: 'rose' },
  { id: 'p16', name: '李小刚', role: '主管会计', org: '财务后台', tone: 'blue' },
]

const d = (offset: number) => addDays(todayKey(), offset)

const meetings: Meeting[] = [
  {
    id: 'm1',
    title: '3.2 版本体验升级评审',
    type: '俱乐部月会',
    date: d(0),
    start: '10:00',
    end: '11:30',
    location: '古德車房休息室',
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
    type: '2027年战略地图',
    date: d(0),
    start: '14:00',
    end: '16:00',
    location: '古德車房休息室',
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
    type: '商务部月会',
    date: d(1),
    start: '09:30',
    end: '10:30',
    location: '古德車房休息室',
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
    type: '门店月会',
    date: d(-1),
    start: '16:00',
    end: '17:00',
    location: '2911会议室',
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
    type: '门店月会',
    date: d(-2),
    start: '15:00',
    end: '16:30',
    location: '古德車房休息室',
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
    type: '商务部月会',
    date: d(3),
    start: '10:00',
    end: '12:00',
    location: '古德車房休息室',
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
    type: '俱乐部月会',
    date: d(5),
    start: '14:30',
    end: '16:00',
    location: '古德車房休息室',
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
    type: '门店月会',
    date: d(7),
    start: '11:00',
    end: '11:45',
    location: '古德車房休息室',
    participantIds: ['p1', 'p4', 'p9', 'p5'],
    organizerId: 'p1',
    priority: 'normal',
    content: `本周发布内容与节奏
市场活动线索回传
客户案例素材需求`,
    createdAt: Date.now() - 86400000,
  },
]

const SEED_MINUTES: Array<{ id: string; meetingId: string; offsetMs: number; cloud: boolean }> = [
  { id: 'mi1', meetingId: 'm5', offsetMs: 86400000 * 2, cloud: true },
  { id: 'mi2', meetingId: 'm4', offsetMs: 86400000, cloud: false },
]

function seedMinutes(): Minutes[] {
  return SEED_MINUTES.flatMap(({ id, meetingId, offsetMs, cloud }) => {
    const meeting = meetings.find((m) => m.id === meetingId)
    if (!meeting) return []
    const transcript = demoSentences(meeting, people)
    const generated = analyzeMeeting(
      meeting,
      transcript,
      diffMinutes(meeting.start, meeting.end) * 60,
      people,
    )
    return [
      {
        ...generated,
        id,
        createdAt: Date.now() - offsetMs,
        savedToCloud: cloud,
        savedAt: cloud ? Date.now() - offsetMs + 3600000 : undefined,
        version: 1,
      },
    ]
  })
}

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
    priority: 'focus',
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
    priority: 'focus',
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
    minutes: seedMinutes(),
    supervisions,
  }
}
