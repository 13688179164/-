import type { ActionItem, Meeting, Minutes, Person } from '../types'
import { addDays, todayKey } from './date'
import { uid } from './utils'

const DECISION_WORDS = ['决定', '确认由', '确认将', '确认采用', '通过了', '拍板', '一致同意', '统一按', '统一为', '明确要求', '明确由', '定为', '达成一致', '确定为', '确定']
const ACTION_WORDS = ['负责', '跟进', '完成', '输出', '提交', '落地', '推进', '上线', '补齐', '定位', '配置', '同步', '梳理', '形成', '要求']
const RISK_WORDS = ['风险', '顾虑', '延期', '不确定', '紧张', '卡在', '不足', '挑战', '担心', '延迟', '阻塞', '缺口']

function isActionSentence(sentence: string) {
  if (!ACTION_WORDS.some((w) => sentence.includes(w))) return false
  if (RISK_WORDS.some((w) => sentence.includes(w))) return false
  if (/完成(约|了|度|率)/.test(sentence)) return false
  if (DECISION_WORDS.some((w) => sentence.includes(w)) && !/(负责|跟进|提交|输出)/.test(sentence)) return false
  return true
}

function splitSentences(text: string) {
  return text
    .replace(/\r/g, '')
    .split(/[。！？!?；;\n]/)
    .map((s) => s.trim().replace(/^[，,、\s]+/, ''))
    .filter((s) => s.length >= 4)
}

function truncate(s: string, max: number) {
  return s.length > max ? `${s.slice(0, max)}…` : s
}

function unique(list: string[]) {
  return Array.from(new Set(list.map((s) => s.trim()))).filter(Boolean)
}

function extractDue(text: string): number {
  if (text.includes('今天') || text.includes('今日')) return 0
  if (text.includes('明天')) return 1
  if (text.includes('本周') || text.includes('这周')) return 3
  if (text.includes('下周')) return 7
  if (text.includes('月底')) return 18
  if (text.includes('下月')) return 30
  return 4
}

function cleanActionSentence(sentence: string) {
  let s = sentence.replace(/^(我们|另外|同时|最后|然后|因此)[，,]?/, '').trim()
  s = s.replace(/^(决定|确认|明确)/, '').trim()
  return truncate(s, 46)
}

export function demoSentences(meeting: Meeting, people: Person[]) {
  const names = people.filter((p) => meeting.participantIds.includes(p.id))
  const organizer = people.find((p) => p.id === meeting.organizerId) ?? names[0]
  const others = names.filter((p) => p.id !== organizer?.id)
  const pick = (i: number) => others[i % Math.max(1, others.length)]?.name ?? '相关同学'
  const topics = meeting.content
    .split('\n')
    .map((t) => t.trim())
    .filter(Boolean)
  const t1 = topics[0] || meeting.title
  const t2 = topics[1] || '下一步协作节奏'
  const t3 = topics[2] || '执行中的风险'
  const decisionMap: Record<string, string> = {
    评审会: `「${t2}」按调整后的方案推进，并在本周内完成问题闭环`,
    战略会: `Q4 资源优先向「${t1}」倾斜，按双周节奏复盘关键指标`,
    专题会: `「${t2}」统一按新规范执行，存量问题分批整改`,
    客户会: `与客户就「${t2}」达成一致，本周内完成书面确认`,
    复盘会: `将「${t1}」列为下一阶段重点，沉淀为可复用的标准动作`,
    周会: `「${t1}」保持当前节奏推进，风险项纳入周度跟踪`,
  }
  const actionText = `输出「${t3}」的实施方案并组织一次内部评审`
  return [
    `${meeting.title}现在开始。今天的会议主要围绕${topics.length ? topics.join('、') : meeting.title}展开。`,
    `${pick(0)} 先同步了整体进展，目前各项准备工作完成约六成，主要卡在跨团队协同和资源确认上。`,
    `围绕「${t2}」，${pick(1)} 提出需要尽快统一口径，避免后续返工，大家一致同意先统一口径再推进。`,
    `经讨论，我们决定${decisionMap[meeting.type] ?? decisionMap['专题会']}。`,
    `关于「${t3}」，${pick(2)} 负责在本周内形成初版方案，下次会议前完成评审。`,
    `另外，${pick(0)} 补充，${meeting.type === '客户会' ? '客户的预算审批流程比往年更慢' : '测试环境和排期仍然紧张'}，需要提前准备预案。`,
    `最后，${organizer?.name ?? '主持人'} 明确了各方协作边界和下一步节奏，要求所有待办在截止时间前同步到督办清单，${actionText}。`,
  ].join('')
}

export function analyzeMeeting(
  meeting: Meeting,
  transcript: string,
  durationSec: number,
  people: Person[],
  existing?: Minutes,
): Minutes {
  const attendees = people.filter((p) => meeting.participantIds.includes(p.id))
  const sentences = splitSentences(transcript)
  const lines = meeting.content
    .split('\n')
    .map((t) => t.replace(/^[\d.、\s]+/, '').trim())
    .filter(Boolean)

  let topics = unique(lines).slice(0, 4)
  if (!topics.length) topics = unique(sentences.slice(0, 3)).slice(0, 2)
  if (!topics.length) topics = [meeting.title]

  let decisions = unique(
    sentences.filter((s) => DECISION_WORDS.some((w) => s.includes(w))).map((s) => truncate(s, 64)),
  ).slice(0, 4)

  if (!decisions.length) {
    decisions = [
      `「${topics[0]}」按会议共识推进，并在下次会议前完成阶段性回顾`,
      `明确各事项责任人与时间节点，统一纳入督办清单跟踪`,
    ]
  }

  const actionSentences = sentences.filter(isActionSentence)
  const source = actionSentences.length ? actionSentences : sentences
  let actions: ActionItem[] = []
  const usedOwners: string[] = []
  source.slice(0, 5).forEach((sentence, index) => {
    const mentioned = attendees.find((p) => sentence.includes(p.name))
    let owner = mentioned?.name
    if (!owner) {
      const fallback = attendees.filter((p) => p.name !== organizerName(meeting, people))
      owner = fallback[index % Math.max(1, fallback.length)]?.name ?? attendees[0]?.name ?? '待指派'
    }
    if (usedOwners.includes(owner) && usedOwners.length < attendees.length - 1) {
      const next = attendees.find((p) => !usedOwners.includes(p.name))
      if (next) owner = next.name
    }
    usedOwners.push(owner)
    const dueOffset = extractDue(sentence) + index
    actions.push({
      id: uid('act'),
      text: cleanActionSentence(sentence),
      owner,
      due: addDays(todayKey(), dueOffset),
      done: false,
    })
  })

  if (!actions.length) {
    actions = [
      {
        id: uid('act'),
        text: `整理「${topics[0]}」的会议结论并同步相关方`,
        owner: attendees[0]?.name ?? '待指派',
        due: addDays(todayKey(), 2),
        done: false,
      },
      {
        id: uid('act'),
        text: '输出下一步执行计划与时间节点',
        owner: attendees[1]?.name ?? attendees[0]?.name ?? '待指派',
        due: addDays(todayKey(), 5),
        done: false,
      },
    ]
  }

  const risks = unique(
    sentences.filter((s) => RISK_WORDS.some((w) => s.includes(w))).map((s) => truncate(s, 60)),
  ).slice(0, 3)

  const summary = [
    `本次${meeting.type}围绕${topics.slice(0, 3).map((t) => `「${t}」`).join('、')}展开，结合${attendees.length}位参会人的同步与讨论，对当前进展和关键分歧进行了收敛。`,
    `会议共形成 ${decisions.length} 项关键决议、${actions.length} 项行动待办${risks.length ? `，并识别 ${risks.length} 项需持续关注的风险` : ''}。`,
    decisions[0] ? `其中明确提出：${decisions[0]}。` : '',
  ]
    .filter(Boolean)
    .join('')

  return {
    id: existing?.id ?? uid('mi'),
    meetingId: meeting.id,
    title: meeting.title,
    createdAt: Date.now(),
    durationSec,
    transcript,
    summary,
    topics,
    decisions,
    actions,
    risks,
    attendees: attendees.map((p) => p.name),
    savedToCloud: false,
    version: existing ? existing.version + 1 : 1,
  }
}

function organizerName(meeting: Meeting, people: Person[]) {
  return people.find((p) => p.id === meeting.organizerId)?.name ?? ''
}
