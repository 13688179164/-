import { ArrowUpRight, AudioLines, CalendarDays, CalendarPlus, ChevronRight, Cloud, Clock, MapPin, Sparkles, Target, Users } from 'lucide-react'
import { useStore } from '../store'
import { CURRENT_USER_ID } from '../data'
import { addDays, formatDate, meetingState, timeRange, todayKey, weekday, durationLabel, diffMinutes } from '../lib/date'
import { Avatar, AvatarGroup, Badge, ProgressBar } from '../components/ui'

function greeting() {
  const h = new Date().getHours()
  if (h < 6) return '夜深了'
  if (h < 9) return '早上好'
  if (h < 12) return '上午好'
  if (h < 14) return '中午好'
  if (h < 18) return '下午好'
  return '晚上好'
}

const STATE_LABEL = {
  upcoming: '待开始',
  ongoing: '进行中',
  ended: '已结束',
}

export default function Dashboard() {
  const { state, navigate } = useStore()
  const today = todayKey()
  const now = new Date()
  const me = state.people.find((p) => p.id === CURRENT_USER_ID)

  const monthPrefix = today.slice(0, 7)
  const monthMeetings = state.meetings.filter((m) => m.date.startsWith(monthPrefix))
  const weekEnd = addDays(today, 6)
  const weekMeetings = state.meetings.filter((m) => m.date >= today && m.date <= weekEnd)
  const todays = state.meetings.filter((m) => m.date === today).sort((a, b) => a.start.localeCompare(b.start))
  const todaysEnded = todays.filter((m) => meetingState(m) === 'ended').length
  const cloudMinutes = state.minutes.filter((m) => m.savedToCloud)
  const activeSups = state.supervisions.filter((s) => s.status === 'active')
  const totalGoals = activeSups.reduce((acc, s) => acc + s.goals.length, 0)
  const doneGoals = activeSups.reduce((acc, s) => acc + s.goals.filter((g) => g.done).length, 0)
  const avgProgress = totalGoals ? Math.round((doneGoals / totalGoals) * 100) : 0

  const candidates = state.meetings
    .filter((m) => m.date > today || (m.date === today && meetingState(m) !== 'ended'))
    .sort((a, b) => `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`))
  const nextMeeting = candidates[0]
  const nextState = nextMeeting ? meetingState(nextMeeting) : null
  const recentMinutes = [...state.minutes].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3)

  const countdown = (() => {
    if (!nextMeeting) return ''
    if (nextState === 'ongoing') {
      const [h, m] = nextMeeting.end.split(':').map(Number)
      const mins = h * 60 + m - (now.getHours() * 60 + now.getMinutes())
      return `正在进行 · 剩余 ${Math.max(1, mins)} 分钟`
    }
    if (nextMeeting.date === today) {
      const [h, m] = nextMeeting.start.split(':').map(Number)
      const mins = h * 60 + m - (now.getHours() * 60 + now.getMinutes())
      return mins <= 60 ? `即将开始 · ${Math.max(1, mins)} 分钟后` : `${Math.floor(mins / 60)} 小时后开始`
    }
    return `${formatDate(nextMeeting.date)} ${weekday(nextMeeting.date)} · ${nextMeeting.start}`
  })()

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-[22px] bg-navy px-6 py-7 text-white shadow-[0_24px_60px_-30px_rgba(11,20,36,.6)] lg:px-8 lg:py-8">
        <div className="pointer-events-none absolute -top-24 -right-16 h-[320px] w-[320px] rounded-full bg-[radial-gradient(circle,rgba(77,120,255,.28),transparent_65%)]" />
        <div className="pointer-events-none absolute -bottom-28 left-1/3 h-[260px] w-[260px] rounded-full bg-[radial-gradient(circle,rgba(62,207,154,.12),transparent_65%)]" />
        <div className="pointer-events-none absolute inset-0 bg-grain opacity-60" />
        <div className="relative grid gap-7 lg:grid-cols-[1fr_380px] lg:items-center">
          <div>
            <p className="mb-3 flex items-center gap-2 text-[11.5px] tracking-[0.14em] text-[#8ea6cf] uppercase">
              <span className="h-1 w-1 rounded-full bg-[#3ecf9a]" />
              {formatDate(today, true)} · {weekday(today)}
            </p>
            <h1 className="font-display text-[30px] leading-tight font-semibold tracking-tight lg:text-[34px]">
              {greeting()}，{me?.name ?? '李嘉航'}
            </h1>
            <p className="mt-3 max-w-[440px] text-[13px] leading-relaxed text-[#a7b8d4]">
              今天安排了 <span className="font-medium text-white">{todays.length}</span> 场会议
              {todays.length ? `，${todays[0].start} 开始首场「${todays[0].title}」` : '，日程还很干净'}
              。{activeSups.length ? `另有 ${activeSups.length} 项督办正在推进。` : ''}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => navigate('meetings', { newMeeting: true })}
                className="inline-flex h-[38px] items-center gap-2 rounded-xl bg-white px-4 text-[13px] font-medium text-ink transition hover:bg-[#eef2fa]"
              >
                <CalendarPlus size={15.5} /> 新建会议
              </button>
              <button
                onClick={() => navigate('calendar')}
                className="inline-flex h-[38px] items-center gap-2 rounded-xl border border-white/[0.14] bg-white/[0.05] px-4 text-[13px] text-[#dbe4f3] transition hover:bg-white/[0.1]"
              >
                <CalendarDays size={15} /> 查看日历
              </button>
              <button
                onClick={() => navigate('minutes')}
                className="inline-flex h-[38px] items-center gap-2 rounded-xl px-3 text-[13px] text-[#9fb2d0] transition hover:text-white"
              >
                <AudioLines size={15} /> 开始录音 <ArrowUpRight size={14} />
              </button>
            </div>
          </div>

          {nextMeeting ? (
            <div className="rounded-2xl border border-white/[0.1] bg-white/[0.055] p-5 backdrop-blur-sm">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-[10.5px] font-medium tracking-[0.16em] text-[#8ea6cf]">下一场会议</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/[0.08] px-2 py-1 text-[10.5px] text-[#c9d8f0]">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      nextState === 'ongoing' ? 'bg-[#3ecf9a]' : 'bg-[#6d8dff]'
                    }`}
                  />
                  {countdown}
                </span>
              </div>
              <p className="font-display text-[19px] leading-snug font-semibold text-white">{nextMeeting.title}</p>
              <div className="mt-3.5 space-y-2 text-[11.5px] text-[#a7b8d4]">
                <p className="flex items-center gap-2">
                  <Clock size={13} className="text-[#6f87ad]" />
                  {timeRange(nextMeeting.start, nextMeeting.end)} · {durationLabel(diffMinutes(nextMeeting.start, nextMeeting.end))}
                </p>
                <p className="flex items-center gap-2">
                  <MapPin size={13} className="text-[#6f87ad]" />
                  {nextMeeting.location}
                </p>
                <p className="flex items-center gap-2">
                  <Users size={13} className="text-[#6f87ad]" />
                  {nextMeeting.participantIds.length} 位参会人
                </p>
              </div>
              <div className="mt-4 flex items-center justify-between border-t border-white/[0.08] pt-4">
                <AvatarGroup
                  people={state.people.filter((p) => nextMeeting.participantIds.includes(p.id))}
                  max={4}
                  size={24}
                />
                <button
                  onClick={() => navigate('minutes', { meetingId: nextMeeting.id })}
                  className="inline-flex items-center gap-1 text-[11.5px] font-medium text-[#9fbaff] transition hover:text-white"
                >
                  进入纪要 <ChevronRight size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-white/[0.14] p-6 text-center">
              <Sparkles size={20} className="mx-auto text-[#7fa4e8]" />
              <p className="mt-3 text-[13px] text-white">近期日程已清空</p>
              <p className="mt-1 text-[11.5px] text-[#8ea6cf]">安排一场复盘或规划会，让节奏继续</p>
            </div>
          )}
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {[
          {
            label: '本月会议',
            value: monthMeetings.length,
            unit: '场',
            sub: `未来 7 天 ${weekMeetings.length} 场`,
            icon: CalendarDays,
            tint: 'bg-brand-soft text-brand',
          },
          {
            label: '今日议程',
            value: todays.length,
            unit: '场',
            sub: `${todaysEnded} 场已结束 · ${todays.length - todaysEnded} 场待进行`,
            icon: Clock,
            tint: 'bg-[#e6f6eb] text-[#2c8153]',
          },
          {
            label: '云端纪要',
            value: cloudMinutes.length,
            unit: '份',
            sub: `累计生成 ${state.minutes.length} 份`,
            icon: Cloud,
            tint: 'bg-[#e7f0fe] text-[#2f66c9]',
          },
          {
            label: '进行中督办',
            value: activeSups.length,
            unit: '项',
            sub: `目标平均达成 ${avgProgress}%`,
            icon: Target,
            tint: 'bg-amber-soft text-[#9a6a0e]',
          },
        ].map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="card card-hover p-4 lg:p-5">
              <div className="flex items-start justify-between">
                <p className="text-[12px] text-muted">{s.label}</p>
                <span className={`grid h-8 w-8 place-items-center rounded-[10px] ${s.tint}`}>
                  <Icon size={15} strokeWidth={1.9} />
                </span>
              </div>
              <p className="mt-2 flex items-baseline gap-1">
                <span className="num font-display text-[28px] leading-none font-semibold tracking-tight">{s.value}</span>
                <span className="text-[11.5px] text-faint">{s.unit}</span>
              </p>
              <p className="mt-2 text-[11px] text-faint">{s.sub}</p>
            </div>
          )
        })}
      </section>

      <div className="grid gap-5 xl:grid-cols-[1fr_368px]">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div className="flex items-center gap-2">
              <h2 className="text-[15px] font-semibold">今日议程</h2>
              <Badge tone="neutral">{todays.length} 场</Badge>
            </div>
            <button
              onClick={() => navigate('calendar')}
              className="inline-flex items-center gap-1 text-[12px] text-muted transition hover:text-brand"
            >
              查看日历 <ChevronRight size={14} />
            </button>
          </div>

          {todays.length ? (
            <div className="divide-y divide-line/70">
              {todays.map((m) => {
                const st = meetingState(m)
                const attendees = state.people.filter((p) => m.participantIds.includes(p.id))
                return (
                  <div key={m.id} className="group flex gap-4 px-5 py-4 transition hover:bg-[#fafbfd]">
                    <div className="w-[52px] flex-none pt-0.5 text-right">
                      <p className="num text-[13.5px] font-semibold text-ink">{m.start}</p>
                      <p className="num mt-0.5 text-[11px] text-faint">{m.end}</p>
                    </div>
                    <div className="relative w-[9px] flex-none">
                      <span className={`absolute top-[6px] left-0 h-2 w-2 rounded-full ring-4 ring-white ${
                        st === 'ongoing' ? 'bg-teal' : st === 'ended' ? 'bg-[#c3ccda]' : 'bg-brand'
                      }`} />
                      <span className="absolute top-[18px] bottom-0 left-[3.5px] w-px bg-line" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="text-[13.5px] font-medium text-ink">{m.title}</p>
                        <Badge tone={st === 'ongoing' ? 'teal' : st === 'ended' ? 'neutral' : 'brand'}>
                          {STATE_LABEL[st]}
                        </Badge>
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-muted">
                        <span className="inline-flex items-center gap-1">
                          <MapPin size={12} /> {m.location}
                        </span>
                        <span className="inline-flex items-center gap-1">
                          <Users size={12} /> {attendees.length} 人
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-none items-center gap-3">
                      <div className="hidden sm:block">
                        <AvatarGroup people={attendees} max={3} size={24} />
                      </div>
                      <button
                        onClick={() => navigate('minutes', { meetingId: m.id })}
                        className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-line bg-white px-2.5 text-[11.5px] text-ink-2 transition hover:border-brand/40 hover:text-brand"
                      >
                        <AudioLines size={13} /> 纪要
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="px-5 py-14 text-center">
              <CalendarDays size={22} className="mx-auto text-faint" />
              <p className="mt-3 text-[13px] text-ink-2">今天没有会议安排</p>
              <button onClick={() => navigate('meetings', { newMeeting: true })} className="mt-3 text-[12px] font-medium text-brand hover:underline">
                创建一场会议
              </button>
            </div>
          )}
        </section>

        <div className="space-y-5">
          <section className="card p-5">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-[14.5px] font-semibold">督办进展</h2>
              <button
                onClick={() => navigate('supervision')}
                className="inline-flex items-center gap-0.5 text-[11.5px] text-muted transition hover:text-brand"
              >
                全部 <ChevronRight size={13} />
              </button>
            </div>
            <div className="space-y-4">
              {activeSups.slice(0, 3).map((s) => {
                const done = s.goals.filter((g) => g.done).length
                const pct = s.goals.length ? Math.round((done / s.goals.length) * 100) : 0
                return (
                  <button key={s.id} onClick={() => navigate('supervision')} className="block w-full text-left">
                    <div className="mb-1.5 flex items-center justify-between gap-2">
                      <p className="truncate text-[12.5px] font-medium text-ink">{s.title}</p>
                      <span className="num flex-none text-[11px] text-muted">{pct}%</span>
                    </div>
                    <ProgressBar value={pct} segments={s.goals.length} tone={pct === 100 ? 'teal' : 'brand'} height={6} />
                    <p className="mt-1.5 text-[10.5px] text-faint">
                      {done} / {s.goals.length} 个目标达成
                    </p>
                  </button>
                )
              })}
              {!activeSups.length && <p className="py-3 text-center text-[12px] text-faint">暂无进行中的督办</p>}
            </div>
          </section>

          <section className="card p-5">
            <div className="mb-3 flex items-center justify-between">
              <h2 className="text-[14.5px] font-semibold">最近纪要</h2>
              <button
                onClick={() => navigate('minutes')}
                className="inline-flex items-center gap-0.5 text-[11.5px] text-muted transition hover:text-brand"
              >
                全部 <ChevronRight size={13} />
              </button>
            </div>
            <div className="space-y-1">
              {recentMinutes.map((mi) => (
                <button
                  key={mi.id}
                  onClick={() => navigate('minutes', { meetingId: mi.meetingId })}
                  className="flex w-full items-start gap-3 rounded-lg px-2 py-2.5 text-left transition hover:bg-[#f6f8fb]"
                >
                  <span className="mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-lg bg-brand-soft text-brand">
                    <AudioLines size={13} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12.5px] font-medium text-ink">{mi.title}</span>
                    <span className="mt-0.5 flex items-center gap-1.5 text-[10.5px] text-faint">
                      {new Date(mi.createdAt).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric' })} · {mi.attendees.length} 人参会
                      {mi.savedToCloud && <Cloud size={11} className="text-teal" />}
                    </span>
                  </span>
                </button>
              ))}
              {!recentMinutes.length && <p className="py-3 text-center text-[12px] text-faint">暂无会议纪要</p>}
            </div>
          </section>
        </div>
      </div>
    </div>
  )
}
