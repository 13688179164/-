import { useMemo, useState } from 'react'
import { CalendarDays, ChevronLeft, ChevronRight, Clock, MapPin, Plus, Users } from 'lucide-react'
import { useStore } from '../store'
import type { Meeting, MeetingType } from '../types'
import {
  addDays,
  diffMinutes,
  durationLabel,
  formatDate,
  meetingState,
  monthLabel,
  monthMatrix,
  timeRange,
  todayKey,
  weekday,
} from '../lib/date'
import { AvatarGroup, Badge, EmptyState, PageHeader } from '../components/ui'
import { cn } from '../lib/utils'

const TYPE_TONE: Record<MeetingType, { pill: string; dot: string; tone: 'brand' | 'teal' | 'violet' | 'amber' | 'rose' | 'blue' }> = {
  俱乐部月会: { pill: 'bg-brand-soft text-brand', dot: 'bg-brand', tone: 'brand' },
  商务部月会: { pill: 'bg-teal-soft text-teal', dot: 'bg-teal', tone: 'teal' },
  门店月会: { pill: 'bg-[#f1ecff] text-[#6b46d0]', dot: 'bg-[#7c5ce0]', tone: 'violet' },
  '2027年战略地图': { pill: 'bg-[#e7f0fe] text-[#2f66c9]', dot: 'bg-[#3d78d8]', tone: 'blue' },
}

const WEEK_LABELS = ['一', '二', '三', '四', '五', '六', '日']

export default function CalendarPage() {
  const { state, navigate } = useStore()
  const today = todayKey()
  const now = new Date()
  const [cursor, setCursor] = useState({ y: now.getFullYear(), m: now.getMonth() })
  const [selected, setSelected] = useState(today)

  const cells = useMemo(() => monthMatrix(cursor.y, cursor.m), [cursor])
  const byDate = useMemo(() => {
    const map = new Map<string, Meeting[]>()
    state.meetings.forEach((m) => {
      const arr = map.get(m.date) ?? []
      arr.push(m)
      map.set(m.date, arr)
    })
    map.forEach((arr) => arr.sort((a, b) => a.start.localeCompare(b.start)))
    return map
  }, [state.meetings])

  const monthMeetings = useMemo(
    () =>
      state.meetings.filter((m) => {
        const [y, mth] = m.date.split('-').map(Number)
        return y === cursor.y && mth - 1 === cursor.m
      }),
    [state.meetings, cursor],
  )
  const totalMinutes = monthMeetings.reduce((acc, m) => acc + diffMinutes(m.start, m.end), 0)
  const dayMeetings = byDate.get(selected) ?? []
  const todayCount = byDate.get(today)?.length ?? 0

  const shift = (delta: number) => {
    const d = new Date(cursor.y, cursor.m + delta, 1)
    setCursor({ y: d.getFullYear(), m: d.getMonth() })
  }

  const goToday = () => {
    setCursor({ y: now.getFullYear(), m: now.getMonth() })
    setSelected(today)
  }

  return (
    <div>
      <PageHeader
        kicker="Meeting Calendar"
        title="会议日历"
        description="从日历视角查看会议密度与时间冲突，点击日期查看当日完整议程。"
        actions={
          <>
            <button className="btn btn-outline" onClick={goToday}>
              回到今天
            </button>
            <button
              className="btn btn-brand"
              onClick={() => navigate('meetings', { newMeeting: true })}
            >
              <Plus size={15} /> 新建会议
            </button>
          </>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_368px]">
        <section className="card overflow-hidden">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => shift(-1)}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-line text-ink-2 transition hover:bg-[#f5f7fb]"
                  aria-label="上个月"
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => shift(1)}
                  className="grid h-8 w-8 place-items-center rounded-lg border border-line text-ink-2 transition hover:bg-[#f5f7fb]"
                  aria-label="下个月"
                >
                  <ChevronRight size={16} />
                </button>
              </div>
              <div>
                <h2 className="num text-[16px] font-semibold text-ink">{monthLabel(cursor.y, cursor.m)}</h2>
                <p className="text-[11px] text-faint">
                  本月 {monthMeetings.length} 场会议 · 共 {Math.round((totalMinutes / 60) * 10) / 10} 小时
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 text-[11px] text-muted">
              <span className="inline-flex items-center gap-1.5">
                <CalendarDays size={12} /> 今天 {todayCount} 场
              </span>
              <span className="h-3 w-px bg-line" />
              <span>点击日期查看详情</span>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[620px]">
              <div className="grid grid-cols-7 border-b border-line bg-[#fafbfd]">
                {WEEK_LABELS.map((w) => (
                  <div key={w} className="py-2.5 text-center text-[11px] font-medium text-muted">
                    周{w}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7">
                {cells.map((cell) => {
                  const events = byDate.get(cell.key) ?? []
                  const isToday = cell.key === today
                  const isSelected = cell.key === selected
                  return (
                    <button
                      key={cell.key}
                      onClick={() => setSelected(cell.key)}
                      className={cn(
                        'relative flex min-h-[106px] flex-col items-stretch gap-1 border-r border-b border-line/80 p-1.5 text-left transition',
                        !cell.inMonth && 'bg-[#fafbfc]',
                        isSelected && 'bg-[#f4f7ff]',
                        'hover:bg-[#f7f9fc]',
                        cell.day % 7 === 0 && 'border-r-0',
                      )}
                    >
                      <div className="flex items-center justify-between px-0.5">
                        <span
                          className={cn(
                            'num grid h-[23px] w-[23px] place-items-center rounded-full text-[11.5px]',
                            isToday
                              ? 'bg-ink font-semibold text-white'
                              : isSelected
                                ? 'bg-brand font-semibold text-white'
                                : cell.inMonth
                                  ? 'text-ink-2'
                                  : 'text-[#b3bccb]',
                          )}
                        >
                          {cell.day}
                        </span>
                        {events.length > 0 && (
                          <span className="num text-[9.5px] text-faint">{events.length}</span>
                        )}
                      </div>
                      <div className="space-y-[3px]">
                        {events.slice(0, 2).map((m) => {
                          const conf = TYPE_TONE[m.type]
                          const done = meetingState(m) === 'ended'
                          return (
                            <span
                              key={m.id}
                              title={`${m.start}-${m.end} ${m.title}`}
                              className={cn(
                                'flex items-center gap-1 truncate rounded px-1.5 py-[3px] text-[10px] leading-tight',
                                conf.pill,
                                done && 'opacity-55',
                              )}
                            >
                              <span className={cn('h-1 w-1 flex-none rounded-full', conf.dot)} />
                              <span className="num flex-none opacity-70">{m.start}</span>
                              <span className="truncate">{m.title}</span>
                            </span>
                          )
                        })}
                        {events.length > 2 && (
                          <span className="block px-1.5 text-[9.5px] text-faint">+{events.length - 2} 场</span>
                        )}
                      </div>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 px-5 py-3.5">
            {Object.entries(TYPE_TONE).map(([type, conf]) => (
              <span key={type} className="inline-flex items-center gap-1.5 text-[10.5px] text-muted">
                <span className={cn('h-1.5 w-1.5 rounded-full', conf.dot)} />
                {type}
              </span>
            ))}
          </div>
        </section>

        <section className="card flex h-fit flex-col overflow-hidden">
          <div className="border-b border-line px-5 py-4">
            <p className="num text-[11px] tracking-[0.12em] text-faint">{selected.slice(0, 4)} / {selected.slice(5, 7)}</p>
            <div className="mt-1 flex items-end justify-between">
              <div>
                <h2 className="text-[19px] font-semibold text-ink">
                  {formatDate(selected)} <span className="text-[12px] font-normal text-muted">{weekday(selected)}</span>
                </h2>
                <p className="mt-1 text-[11.5px] text-muted">
                  {dayMeetings.length ? `共 ${dayMeetings.length} 场会议` : '暂无会议安排'}
                  {selected === today && <span className="ml-2 rounded bg-ink px-1.5 py-px text-[9.5px] text-white">今天</span>}
                </p>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setSelected(addDays(selected, -1))}
                  className="grid h-7 w-7 place-items-center rounded-md text-faint transition hover:bg-[#f2f5f9] hover:text-ink"
                  aria-label="前一天"
                >
                  <ChevronLeft size={15} />
                </button>
                <button
                  onClick={() => setSelected(addDays(selected, 1))}
                  className="grid h-7 w-7 place-items-center rounded-md text-faint transition hover:bg-[#f2f5f9] hover:text-ink"
                  aria-label="后一天"
                >
                  <ChevronRight size={15} />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-[560px] flex-1 overflow-y-auto">
            {dayMeetings.length ? (
              <div className="divide-y divide-line/70">
                {dayMeetings.map((m) => {
                  const attendees = state.people.filter((p) => m.participantIds.includes(p.id))
                  const st = meetingState(m)
                  return (
                    <div key={m.id} className="px-5 py-4 transition hover:bg-[#fafbfd]">
                      <div className="flex items-center justify-between gap-2">
                        <span className={cn('num text-[12px] font-semibold text-ink', st === 'ended' && 'text-faint')}>
                          {timeRange(m.start, m.end)}
                        </span>
                        <Badge tone={TYPE_TONE[m.type].tone}>{m.type}</Badge>
                      </div>
                      <button
                        onClick={() => navigate('meetings', { meetingId: m.id })}
                        className="mt-1.5 block text-left text-[13.5px] font-medium text-ink transition hover:text-brand"
                      >
                        {m.title}
                      </button>
                      <div className="mt-2 space-y-1 text-[11px] text-muted">
                        <p className="flex items-center gap-1.5">
                          <MapPin size={11.5} className="text-faint" /> <span className="truncate">{m.location}</span>
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Clock size={11.5} className="text-faint" /> {durationLabel(diffMinutes(m.start, m.end))}
                        </p>
                        <p className="flex items-center gap-1.5">
                          <Users size={11.5} className="text-faint" /> {attendees.length} 人参与
                        </p>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <AvatarGroup people={attendees} max={3} size={22} />
                        <button
                          onClick={() => navigate('minutes', { meetingId: m.id })}
                          className="inline-flex h-7 items-center gap-1 rounded-md border border-line px-2 text-[10.5px] text-ink-2 transition hover:border-brand/40 hover:text-brand"
                        >
                          查看纪要
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="p-5">
                <EmptyState
                  icon={<CalendarDays size={20} />}
                  title="这一天没有会议"
                  description="可以切换到其他日期，或创建一场新的会议。"
                  action={
                    <button className="btn btn-outline btn-sm" onClick={() => navigate('meetings', { newMeeting: true })}>
                      <Plus size={13} /> 新建会议
                    </button>
                  }
                />
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
