import { useEffect, useMemo, useState } from 'react'
import {
  AudioLines,
  CalendarDays,
  Check,
  Clock,
  Flag,
  MapPin,
  Pencil,
  Plus,
  Search,
  Sparkles,
  Trash2,
  Users,
} from 'lucide-react'
import { useStore } from '../store'
import type { Meeting, MeetingType } from '../types'
import {
  diffMinutes,
  durationLabel,
  formatDate,
  meetingState,
  timeRange,
  todayKey,
  weekday,
} from '../lib/date'
import { Avatar, AvatarGroup, Badge, ConfirmDialog, EmptyState, Modal, PageHeader, Tabs } from '../components/ui'
import { cn } from '../lib/utils'

const TYPES: MeetingType[] = ['评审会', '周会', '专题会', '客户会', '复盘会', '战略会']

const TYPE_STYLE: Record<MeetingType, { tone: 'brand' | 'teal' | 'amber' | 'violet' | 'rose' | 'blue'; tile: string }> = {
  评审会: { tone: 'brand', tile: 'bg-brand-soft text-brand' },
  周会: { tone: 'teal', tile: 'bg-teal-soft text-teal' },
  专题会: { tone: 'violet', tile: 'bg-[#f1ecff] text-[#6b46d0]' },
  客户会: { tone: 'amber', tile: 'bg-amber-soft text-[#9a6a0e]' },
  复盘会: { tone: 'rose', tile: 'bg-[#fdecee] text-[#c0434f]' },
  战略会: { tone: 'blue', tile: 'bg-[#e7f0fe] text-[#2f66c9]' },
}

const STATUS_LABEL = { upcoming: '待开始', ongoing: '进行中', ended: '已结束' } as const
const STATUS_WEIGHT = { ongoing: 0, upcoming: 1, ended: 2 } as const

const LOCATION_SUGGEST = ['云杉厅 · 7F', '松涛厅 · 8F', '竹影会议室 · 6F', '线上会议 · 飞书', '客户现场']

interface FormState {
  title: string
  type: MeetingType
  date: string
  start: string
  end: string
  location: string
  participantIds: string[]
  content: string
  priority: 'high' | 'normal'
}

function initialForm(initial?: Meeting | null): FormState {
  return {
    title: initial?.title ?? '',
    type: initial?.type ?? '评审会',
    date: initial?.date ?? todayKey(),
    start: initial?.start ?? '10:00',
    end: initial?.end ?? '11:00',
    location: initial?.location ?? '云杉厅 · 7F',
    participantIds: initial?.participantIds ?? ['p1'],
    content: initial?.content ?? '',
    priority: initial?.priority ?? 'normal',
  }
}

function MeetingForm({
  open,
  initial,
  onClose,
}: {
  open: boolean
  initial?: Meeting | null
  onClose: () => void
}) {
  const { state, addMeeting, updateMeeting, notify } = useStore()
  const [form, setForm] = useState<FormState>(() => initialForm(initial))
  const [error, setError] = useState('')

  useEffect(() => {
    if (open) {
      setForm(initialForm(initial))
      setError('')
    }
  }, [open, initial])

  const togglePerson = (id: string) => {
    setForm((f) => ({
      ...f,
      participantIds: f.participantIds.includes(id)
        ? f.participantIds.filter((p) => p !== id)
        : [...f.participantIds, id],
    }))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return setError('请填写会议主题')
    if (!form.date) return setError('请选择会议日期')
    if (!form.start || !form.end) return setError('请设置会议起止时间')
    if (form.end <= form.start) return setError('结束时间需晚于开始时间')
    if (!form.location.trim()) return setError('请填写会议地点')
    if (!form.participantIds.length) return setError('请至少选择一位参会人员')

    const payload = {
      title: form.title.trim(),
      type: form.type,
      date: form.date,
      start: form.start,
      end: form.end,
      location: form.location.trim(),
      participantIds: form.participantIds,
      content: form.content.trim() || '会议内容待补充',
      priority: form.priority,
      organizerId: initial?.organizerId ?? 'p1',
    }

    if (initial) {
      updateMeeting(initial.id, payload)
      notify('会议信息已更新，日历已同步')
    } else {
      addMeeting(payload)
      notify('会议已创建，已同步至会议日历')
    }
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={initial ? '编辑会议' : '新建会议'}
      description="填写会议要素，系统将自动生成议程日历并同步参会人"
      width="max-w-[700px]"
      footer={
        <div className="flex items-center justify-between gap-3">
          <p className="text-[11.5px] text-faint">会议创建后将同步至日历与纪要模块</p>
          <div className="flex gap-2">
            <button type="button" className="btn btn-outline" onClick={onClose}>
              取消
            </button>
            <button type="submit" form="meeting-form" className="btn btn-brand">
              {initial ? '保存修改' : '创建会议'}
            </button>
          </div>
        </div>
      }
    >
      <form id="meeting-form" onSubmit={submit} className="space-y-4">
        <div>
          <label className="label" htmlFor="m-title">
            会议主题 <span className="text-danger">*</span>
          </label>
          <input
            id="m-title"
            className="field"
            placeholder="例如：3.2 版本体验升级评审"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            autoFocus
          />
        </div>

        <div className="grid gap-3.5 sm:grid-cols-2">
          <div>
            <label className="label">会议类型</label>
            <div className="flex flex-wrap gap-1.5">
              {TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setForm({ ...form, type: t })}
                  className={cn(
                    'rounded-lg border px-2.5 py-1.5 text-[12px] transition',
                    form.type === t
                      ? 'border-brand/40 bg-brand-soft font-medium text-brand'
                      : 'border-line text-muted hover:border-[#cfd8e6] hover:text-ink',
                  )}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="label">优先级</label>
            <div className="flex gap-1.5">
              {[
                { key: 'normal', label: '常规会议' },
                { key: 'high', label: '重点会议' },
              ].map((p) => (
                <button
                  key={p.key}
                  type="button"
                  onClick={() => setForm({ ...form, priority: p.key as 'high' | 'normal' })}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[12px] transition',
                    form.priority === p.key
                      ? p.key === 'high'
                        ? 'border-amber/40 bg-amber-soft font-medium text-[#9a6a0e]'
                        : 'border-brand/40 bg-brand-soft font-medium text-brand'
                      : 'border-line text-muted hover:border-[#cfd8e6] hover:text-ink',
                  )}
                >
                  {p.key === 'high' && <Flag size={12} />}
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-3.5 sm:grid-cols-3">
          <div>
            <label className="label" htmlFor="m-date">
              会议日期 <span className="text-danger">*</span>
            </label>
            <input
              id="m-date"
              type="date"
              className="field"
              value={form.date}
              onChange={(e) => setForm({ ...form, date: e.target.value })}
            />
          </div>
          <div>
            <label className="label" htmlFor="m-start">
              开始时间 <span className="text-danger">*</span>
            </label>
            <input
              id="m-start"
              type="time"
              className="field"
              value={form.start}
              onChange={(e) => setForm({ ...form, start: e.target.value })}
            />
          </div>
          <div>
            <label className="label" htmlFor="m-end">
              结束时间 <span className="text-danger">*</span>
            </label>
            <input
              id="m-end"
              type="time"
              className="field"
              value={form.end}
              onChange={(e) => setForm({ ...form, end: e.target.value })}
            />
          </div>
        </div>

        <div>
          <label className="label" htmlFor="m-location">
            会议地点 <span className="text-danger">*</span>
          </label>
          <input
            id="m-location"
            className="field"
            placeholder="会议室 / 线上会议 / 客户现场"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
          />
          <div className="mt-2 flex flex-wrap gap-1.5">
            {LOCATION_SUGGEST.map((loc) => (
              <button
                key={loc}
                type="button"
                onClick={() => setForm({ ...form, location: loc })}
                className="rounded-md bg-[#f2f5f9] px-2 py-1 text-[11px] text-muted transition hover:bg-[#e9eef5] hover:text-ink"
              >
                {loc}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="label mb-0">
              参会人员 <span className="text-danger">*</span>
            </label>
            <span className="text-[11px] text-faint">已选 {form.participantIds.length} 人</span>
          </div>
          <div className="grid gap-1.5 rounded-xl border border-line bg-[#fafbfd] p-2.5 sm:grid-cols-2">
            {state.people.map((p) => {
              const selected = form.participantIds.includes(p.id)
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => togglePerson(p.id)}
                  className={cn(
                    'flex items-center gap-2.5 rounded-lg border px-2.5 py-2 text-left transition',
                    selected ? 'border-brand/30 bg-white shadow-[0_1px_2px_rgba(13,23,40,.04)]' : 'border-transparent hover:bg-white',
                  )}
                >
                  <Avatar person={p} size={28} />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] font-medium text-ink">{p.name}</span>
                    <span className="block truncate text-[10.5px] text-faint">
                      {p.role} · {p.org}
                    </span>
                  </span>
                  <span
                    className={cn(
                      'grid h-4 w-4 place-items-center rounded-full border transition',
                      selected ? 'border-brand bg-brand text-white' : 'border-[#cfd8e6] bg-white text-transparent',
                    )}
                  >
                    <Check size={10} strokeWidth={3} />
                  </span>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <label className="label" htmlFor="m-content">
            会议核心内容 / 议程
          </label>
          <textarea
            id="m-content"
            className="field resize-none leading-relaxed"
            rows={4}
            placeholder={'每行一个议题，例如：\n3.2 版本核心链路体验走查\n灰度发布节奏与验收标准'}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
          <p className="mt-1.5 text-[11px] text-faint">议题将用于生成会议日历详情与纪要框架</p>
        </div>

        {error && (
          <p className="rounded-lg bg-danger-soft px-3 py-2 text-[12px] text-danger">{error}</p>
        )}
      </form>
    </Modal>
  )
}

export default function Meetings() {
  const { state, route, navigate, deleteMeeting, notify } = useStore()
  const [filter, setFilter] = useState('all')
  const [keyword, setKeyword] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Meeting | null>(null)
  const [detailId, setDetailId] = useState<string | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    if (route.newMeeting) {
      setEditing(null)
      setFormOpen(true)
      navigate('meetings')
    }
  }, [route.newMeeting, navigate])

  useEffect(() => {
    if (route.meetingId && state.meetings.some((m) => m.id === route.meetingId)) {
      setDetailId(route.meetingId)
    }
  }, [route.meetingId, state.meetings])

  const counts = useMemo(() => {
    const c = { all: state.meetings.length, upcoming: 0, ongoing: 0, ended: 0 }
    state.meetings.forEach((m) => {
      c[meetingState(m)] += 1
    })
    return c
  }, [state.meetings])

  const list = useMemo(() => {
    const kw = keyword.trim().toLowerCase()
    return state.meetings
      .filter((m) => {
        const st = meetingState(m)
        if (filter !== 'all' && st !== filter) return false
        if (!kw) return true
        const names = state.people.filter((p) => m.participantIds.includes(p.id)).map((p) => p.name)
        return [m.title, m.location, m.content, m.type, ...names].join(' ').toLowerCase().includes(kw)
      })
      .sort((a, b) => {
        const sa = meetingState(a)
        const sb = meetingState(b)
        if (STATUS_WEIGHT[sa] !== STATUS_WEIGHT[sb]) return STATUS_WEIGHT[sa] - STATUS_WEIGHT[sb]
        const ka = `${a.date}${a.start}`
        const kb = `${b.date}${b.start}`
        return sa === 'ended' ? kb.localeCompare(ka) : ka.localeCompare(kb)
      })
  }, [state.meetings, state.people, filter, keyword])

  const detail = state.meetings.find((m) => m.id === detailId) ?? null
  const detailMinutes = detail ? state.minutes.find((mi) => mi.meetingId === detail.id) : undefined
  const deleteTarget = state.meetings.find((m) => m.id === deleteId)

  return (
    <div>
      <PageHeader
        kicker="Meeting Coordination"
        title="会议统筹"
        description="统一管理参会人、时间、地点与会议议题，确保每场会议都有明确的输入。"
        actions={
          <button
            className="btn btn-brand"
            onClick={() => {
              setEditing(null)
              setFormOpen(true)
            }}
          >
            <Plus size={16} /> 新建会议
          </button>
        }
      />

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Tabs
          value={filter}
          onChange={setFilter}
          items={[
            { key: 'all', label: '全部', count: counts.all },
            { key: 'upcoming', label: '待开始', count: counts.upcoming },
            { key: 'ongoing', label: '进行中', count: counts.ongoing },
            { key: 'ended', label: '已结束', count: counts.ended },
          ]}
        />
        <div className="relative">
          <Search size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-faint" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索会议主题、地点或参会人"
            className="field h-[38px] w-[270px] pl-9"
          />
        </div>
      </div>

      {list.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {list.map((m) => {
            const st = meetingState(m)
            const style = TYPE_STYLE[m.type] ?? TYPE_STYLE['评审会']
            const attendees = state.people.filter((p) => m.participantIds.includes(p.id))
            const hasMinutes = state.minutes.some((mi) => mi.meetingId === m.id)
            const [y, mo, da] = m.date.split('-')
            return (
              <article
                key={m.id}
                onClick={() => setDetailId(m.id)}
                className="card card-hover group flex cursor-pointer flex-col p-5"
              >
                <div className="flex items-start gap-3">
                  <div className={cn('flex h-[52px] w-[52px] flex-none flex-col items-center justify-center rounded-xl', style.tile)}>
                    <span className="text-[9.5px] font-medium opacity-80">{Number(mo)} 月</span>
                    <span className="num text-[19px] leading-tight font-semibold">{Number(da)}</span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-1.5">
                        <Badge tone={style.tone}>{m.type}</Badge>
                        {m.priority === 'high' && (
                          <span className="inline-flex items-center gap-0.5 text-[10.5px] font-medium text-amber">
                            <Flag size={10} /> 重点
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-0.5 opacity-0 transition group-hover:opacity-100">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditing(m)
                            setFormOpen(true)
                          }}
                          className="grid h-7 w-7 place-items-center rounded-md text-faint hover:bg-[#f0f3f8] hover:text-ink"
                          aria-label="编辑会议"
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setDeleteId(m.id)
                          }}
                          className="grid h-7 w-7 place-items-center rounded-md text-faint hover:bg-danger-soft hover:text-danger"
                          aria-label="删除会议"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                    <h3 className="mt-1.5 line-clamp-1 text-[15px] font-semibold text-ink">{m.title}</h3>
                    <p className="mt-1 flex items-center gap-1 text-[11px] text-faint">
                      {formatDate(m.date)} · {weekday(m.date)}
                    </p>
                  </div>
                </div>

                <p className="mt-3.5 line-clamp-2 min-h-[34px] text-[12px] leading-relaxed text-muted">
                  {m.content.split('\n').filter(Boolean).join(' · ')}
                </p>

                <div className="mt-3.5 space-y-1.5 text-[11.5px] text-ink-2">
                  <p className="flex items-center gap-2">
                    <Clock size={12.5} className="text-faint" />
                    {timeRange(m.start, m.end)}
                    <span className="text-faint">· {durationLabel(diffMinutes(m.start, m.end))}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin size={12.5} className="text-faint" />
                    <span className="truncate">{m.location}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <Users size={12.5} className="text-faint" />
                    {attendees.length} 位参会人
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-line/80 pt-3.5">
                  <div className="flex items-center gap-2">
                    <AvatarGroup people={attendees} max={3} size={23} />
                    <Badge tone={st === 'ongoing' ? 'teal' : st === 'ended' ? 'neutral' : 'brand'}>
                      {STATUS_LABEL[st]}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    {hasMinutes && (
                      <span className="inline-flex items-center gap-1 text-[10.5px] text-teal">
                        <Sparkles size={11} /> 有纪要
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        navigate('minutes', { meetingId: m.id })
                      }}
                      className="inline-flex h-7 items-center gap-1 rounded-md bg-[#f4f6fa] px-2 text-[11px] text-ink-2 transition hover:bg-brand-soft hover:text-brand"
                    >
                      <AudioLines size={12} /> 纪要
                    </button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <EmptyState
          icon={<CalendarDays size={22} />}
          title="没有符合条件的会议"
          description="调整筛选条件，或发起一场新的会议。"
          action={
            <button
              className="btn btn-brand btn-sm"
              onClick={() => {
                setEditing(null)
                setFormOpen(true)
              }}
            >
              <Plus size={14} /> 新建会议
            </button>
          }
        />
      )}

      <MeetingForm open={formOpen} initial={editing} onClose={() => setFormOpen(false)} />

      <Modal
        open={!!detail}
        onClose={() => {
          setDetailId(null)
          if (route.meetingId) navigate('meetings')
        }}
        title={detail?.title ?? ''}
        description={detail ? `${formatDate(detail.date, true)} ${weekday(detail.date)} · ${timeRange(detail.start, detail.end)}` : ''}
        width="max-w-[660px]"
        footer={
          detail && (
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11.5px] text-faint">创建于 {new Date(detail.createdAt).toLocaleDateString('zh-CN')}</span>
              <div className="flex gap-2">
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setDetailId(null)
                    setEditing(detail)
                    setFormOpen(true)
                  }}
                >
                  <Pencil size={14} /> 编辑
                </button>
                <button className="btn btn-brand" onClick={() => navigate('minutes', { meetingId: detail.id })}>
                  <AudioLines size={14} /> {detailMinutes ? '查看纪要' : '开始纪要'}
                </button>
              </div>
            </div>
          )
        }
      >
        {detail && (
          <div className="space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <Badge tone={TYPE_STYLE[detail.type].tone}>{detail.type}</Badge>
              <Badge tone={meetingState(detail) === 'ongoing' ? 'teal' : meetingState(detail) === 'ended' ? 'neutral' : 'brand'}>
                {STATUS_LABEL[meetingState(detail)]}
              </Badge>
              {detail.priority === 'high' && <Badge tone="amber">重点会议</Badge>}
              {detailMinutes && (
                <Badge tone="teal">
                  <Sparkles size={10} /> 已生成纪要
                </Badge>
              )}
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-line bg-[#fafbfd] p-3.5">
                <p className="text-[10.5px] text-faint">会议时间</p>
                <p className="mt-1 text-[13px] font-medium text-ink">
                  {formatDate(detail.date)} {weekday(detail.date)}
                </p>
                <p className="num mt-0.5 text-[12px] text-muted">
                  {timeRange(detail.start, detail.end)} · {durationLabel(diffMinutes(detail.start, detail.end))}
                </p>
              </div>
              <div className="rounded-xl border border-line bg-[#fafbfd] p-3.5">
                <p className="text-[10.5px] text-faint">会议地点</p>
                <p className="mt-1 text-[13px] font-medium text-ink">{detail.location}</p>
                <p className="mt-0.5 text-[12px] text-muted">发起人 · {state.people.find((p) => p.id === detail.organizerId)?.name}</p>
              </div>
            </div>

            <div>
              <p className="mb-2.5 text-[12.5px] font-medium text-ink">参会人员</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {state.people
                  .filter((p) => detail.participantIds.includes(p.id))
                  .map((p) => (
                    <div key={p.id} className="flex items-center gap-2.5 rounded-lg border border-line px-2.5 py-2">
                      <Avatar person={p} size={28} />
                      <div className="min-w-0">
                        <p className="text-[12px] font-medium text-ink">{p.name}</p>
                        <p className="truncate text-[10.5px] text-faint">
                          {p.role} · {p.org}
                        </p>
                      </div>
                    </div>
                  ))}
              </div>
            </div>

            <div>
              <p className="mb-2.5 text-[12.5px] font-medium text-ink">会议核心内容</p>
              <ol className="space-y-2">
                {detail.content
                  .split('\n')
                  .filter(Boolean)
                  .map((line, i) => (
                    <li key={i} className="flex gap-2.5 rounded-lg bg-[#f7f9fc] px-3 py-2.5 text-[12.5px] leading-relaxed text-ink-2">
                      <span className="num mt-px grid h-4 w-4 flex-none place-items-center rounded bg-white text-[10px] font-semibold text-brand">
                        {i + 1}
                      </span>
                      {line}
                    </li>
                  ))}
              </ol>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="删除这场会议？"
        description={`「${deleteTarget?.title ?? ''}」及其关联的会议纪要将被永久删除，该操作不可撤销。`}
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteMeeting(deleteId)
            notify('会议已删除', 'info')
          }
        }}
      />
    </div>
  )
}
