import { useEffect, useMemo, useState } from 'react'
import {
  Archive,
  Bell,
  BellRing,
  CalendarClock,
  Check,
  Clock,
  Flag,
  History,
  Minus,
  Plus,
  Search,
  Star,
  Target,
  Trash2,
  TrendingUp,
  Users,
} from 'lucide-react'
import { useStore } from '../store'
import { CURRENT_USER_ID } from '../data'
import type { Supervision } from '../types'
import { addDays, daysBetween, formatDate, overdueLabel, shortTime, todayKey } from '../lib/date'
import {
  Avatar,
  AvatarGroup,
  Badge,
  ConfirmDialog,
  EmptyState,
  Modal,
  PageHeader,
  ProgressBar,
  Switch,
  Tabs,
} from '../components/ui'
import { cn } from '../lib/utils'

interface SupForm {
  title: string
  note: string
  ownerIds: string[]
  startDate: string
  dueDate: string
  goals: string[]
  reminder: boolean
  priority: 'high' | 'normal' | 'focus'
}

const blankForm = (): SupForm => ({
  title: '',
  note: '',
  ownerIds: [CURRENT_USER_ID],
  startDate: todayKey(),
  dueDate: addDays(todayKey(), 7),
  goals: ['目标 1', '目标 2', '目标 3'],
  reminder: true,
  priority: 'normal',
})

function ReminderBadge({ supervision, onClick }: { supervision: Supervision; onClick?: () => void }) {
  const label = !supervision.reminder ? '无需提醒' : supervision.reminded ? '已提醒' : '未提醒'
  const icon = !supervision.reminder ? <Bell size={11} /> : supervision.reminded ? <Check size={11} strokeWidth={3} /> : <BellRing size={11} />
  return (
    <button
      onClick={onClick}
      disabled={!onClick}
      title={
        !supervision.reminder
          ? '该督办未开启提醒'
          : supervision.reminded
            ? `已于 ${supervision.remindedAt ? shortTime(supervision.remindedAt) : '近期'} 提醒关联人`
            : '点击向关联人发送督办提醒'
      }
      className={cn(
        'chip border transition',
        !supervision.reminder
          ? 'border-line bg-[#f2f5f9] text-muted'
          : supervision.reminded
            ? 'border-teal/25 bg-teal-soft text-teal'
            : 'border-danger/25 bg-danger-soft text-danger hover:bg-[#fbe0e2]',
        onClick && 'cursor-pointer',
      )}
    >
      {icon}
      {label}
    </button>
  )
}

export default function SupervisionPage() {
  const { state, addSupervision, toggleGoal, markReminded, deleteSupervision, notify } = useStore()
  const me = state.people.find((p) => p.id === CURRENT_USER_ID)
  const [tab, setTab] = useState<'active' | 'history'>('active')
  const [keyword, setKeyword] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [form, setForm] = useState<SupForm>(blankForm)
  const [error, setError] = useState('')
  const [deleteId, setDeleteId] = useState<string | null>(null)

  useEffect(() => {
    if (formOpen) {
      setForm(blankForm())
      setError('')
    }
  }, [formOpen])

  const active = useMemo(
    () =>
      state.supervisions
        .filter((s) => s.status === 'active')
        .sort((a, b) => a.dueDate.localeCompare(b.dueDate)),
    [state.supervisions],
  )
  const history = useMemo(
    () =>
      state.supervisions
        .filter((s) => s.status === 'done')
        .sort((a, b) => (b.completedAt ?? 0) - (a.completedAt ?? 0)),
    [state.supervisions],
  )
  const pendingReminders = active.filter((s) => s.reminder && !s.reminded)
  const dueSoon = active.filter((s) => {
    const n = daysBetween(todayKey(), s.dueDate)
    return n >= 0 && n <= 3
  })

  const match = (s: Supervision) => {
    const kw = keyword.trim().toLowerCase()
    if (!kw) return true
    const names = state.people.filter((p) => s.ownerIds.includes(p.id)).map((p) => p.name)
    return [s.title, s.note, ...names, ...s.goals.map((g) => g.title)].join(' ').toLowerCase().includes(kw)
  }
  const activeList = active.filter(match)
  const historyList = history.filter(match)

  const updateForm = (patch: Partial<SupForm>) => setForm((f) => ({ ...f, ...patch }))

  const setGoalCount = (next: number) => {
    const count = Math.max(1, Math.min(8, next))
    setForm((f) => {
      const goals = [...f.goals]
      while (goals.length < count) goals.push(`目标 ${goals.length + 1}`)
      return { ...f, goals: goals.slice(0, count) }
    })
  }

  const toggleOwner = (id: string) => {
    setForm((f) => ({
      ...f,
      ownerIds: f.ownerIds.includes(id) ? f.ownerIds.filter((x) => x !== id) : [...f.ownerIds, id],
    }))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title.trim()) return setError('请填写督办目标')
    if (!form.ownerIds.length) return setError('请至少选择一位督办关联人')
    if (!form.startDate || !form.dueDate) return setError('请设置督办起止时间')
    if (form.dueDate < form.startDate) return setError('完成时间需晚于开始时间')
    if (form.goals.some((g) => !g.trim())) return setError('请填写每个目标的名称')

    addSupervision({
      title: form.title.trim(),
      note: form.note.trim(),
      ownerIds: form.ownerIds,
      startDate: form.startDate,
      dueDate: form.dueDate,
      goals: form.goals.map((g, i) => ({
        id: `g_${Date.now()}_${i}`,
        title: g.trim(),
        done: false,
      })),
      reminder: form.reminder,
      reminded: false,
      priority: form.priority,
    })
    setFormOpen(false)
    setTab('active')
    notify('督办任务已创建，已加入进行中列表')
  }

  const handleToggleGoal = (s: Supervision, goalId: string) => {
    const willComplete = s.goals.every((g) => (g.id === goalId ? !g.done : g.done))
    const wasComplete = s.goals.every((g) => g.done)
    toggleGoal(s.id, goalId)
    if (willComplete && !wasComplete) {
      notify('全部目标达成，督办已完成并归档至历史督办库')
    }
  }

  const handleRemind = (s: Supervision) => {
    if (!s.reminder || s.reminded) return
    markReminded(s.id)
    notify(`已向 ${s.ownerIds.length} 位关联人发送督办提醒`)
  }

  const average = active.length
    ? Math.round(
        (active.reduce((acc, s) => acc + s.goals.filter((g) => g.done).length, 0) /
          active.reduce((acc, s) => acc + s.goals.length, 0)) *
          100,
      )
    : 0

  return (
    <div>
      <PageHeader
        kicker="Goal Supervision"
        title="目标督办"
        description="将会议共识拆解为可量化的目标，按目标推进进度，完成后自动归档。"
        actions={
          <button className="btn btn-brand" onClick={() => setFormOpen(true)}>
            <Plus size={16} /> 新建督办
          </button>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3.5 lg:grid-cols-4">
        {[
          { label: '进行中督办', value: active.length, unit: '项', icon: Target, tint: 'bg-brand-soft text-brand', sub: `平均达成 ${average}%` },
          { label: '待提醒', value: pendingReminders.length, unit: '项', icon: BellRing, tint: 'bg-danger-soft text-danger', sub: '未发送提醒，显示红色' },
          { label: '即将到期', value: dueSoon.length, unit: '项', icon: CalendarClock, tint: 'bg-amber-soft text-[#9a6a0e]', sub: '3 天内到期' },
          { label: '历史归档', value: history.length, unit: '项', icon: Archive, tint: 'bg-teal-soft text-teal', sub: '目标全部达成' },
        ].map((s) => {
          const Icon = s.icon
          return (
            <div key={s.label} className="card p-4">
              <div className="flex items-start justify-between">
                <p className="text-[12px] text-muted">{s.label}</p>
                <span className={cn('grid h-7 w-7 place-items-center rounded-lg', s.tint)}>
                  <Icon size={14} />
                </span>
              </div>
              <p className="mt-1.5 flex items-baseline gap-1">
                <span className="num font-display text-[25px] leading-none font-semibold">{s.value}</span>
                <span className="text-[11px] text-faint">{s.unit}</span>
              </p>
              <p className="mt-1.5 text-[10.5px] text-faint">{s.sub}</p>
            </div>
          )
        })}
      </div>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Tabs
          value={tab}
          onChange={(k) => setTab(k as 'active' | 'history')}
          items={[
            { key: 'active', label: '进行中', count: active.length },
            { key: 'history', label: '历史督办库', count: history.length },
          ]}
        />
        <div className="relative">
          <Search size={15} className="absolute top-1/2 left-3 -translate-y-1/2 text-faint" />
          <input
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="搜索督办目标或关联人"
            className="field h-[38px] w-[250px] pl-9"
          />
        </div>
      </div>

      {tab === 'active' &&
        (activeList.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {activeList.map((s) => {
              const done = s.goals.filter((g) => g.done).length
              const total = s.goals.length
              const pct = total ? Math.round((done / total) * 100) : 0
              const owners = state.people.filter((p) => s.ownerIds.includes(p.id))
              const remaining = daysBetween(todayKey(), s.dueDate)
              return (
                <article
                  key={s.id}
                  className="card card-hover flex flex-col p-5"
                  style={s.priority === 'focus' ? { backgroundColor: '#fdf1f5', borderColor: '#f3cfdd' } : undefined}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="chip bg-brand-soft text-brand">
                          <span className="h-1.5 w-1.5 rounded-full bg-brand" /> 进行中
                        </span>
                        <h3 className="text-[14.5px] font-semibold text-ink">{s.title}</h3>
                        {s.priority === 'focus' && (
                          <span className="inline-flex items-center gap-0.5 rounded-full bg-[#fbe3ee] px-1.5 py-0.5 text-[10px] font-medium text-[#b6456a]">
                            <Star size={10} /> 重点关注
                          </span>
                        )}
                        {s.priority === 'high' && (
                          <span className="inline-flex items-center gap-0.5 text-[10px] font-medium text-amber">
                            <Flag size={10} /> 重点
                          </span>
                        )}
                      </div>
                      {s.note && <p className="mt-1.5 line-clamp-2 text-[11.5px] leading-relaxed text-muted">{s.note}</p>}
                    </div>
                    <div className="flex flex-none items-center gap-1">
                      <ReminderBadge supervision={s} onClick={() => handleRemind(s)} />
                      <button
                        onClick={() => setDeleteId(s.id)}
                        className="grid h-7 w-7 place-items-center rounded-md text-faint transition hover:bg-danger-soft hover:text-danger"
                        aria-label="删除督办"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] text-muted">
                    <span className="inline-flex items-center gap-1.5">
                      <Users size={12} className="text-faint" />
                      <AvatarGroup people={owners} max={3} size={20} />
                      <span className="ml-0.5">{owners.map((p) => p.name).join('、')}</span>
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <CalendarClock size={12} className="text-faint" />
                      {formatDate(s.startDate)} → {formatDate(s.dueDate)}
                    </span>
                    <span
                      className={cn(
                        'rounded px-1.5 py-0.5 text-[10px]',
                        remaining < 0
                          ? 'bg-danger-soft font-medium text-danger'
                          : remaining <= 3
                            ? 'bg-amber-soft font-medium text-[#9a6a0e]'
                            : 'bg-[#f1f4f8] text-muted',
                      )}
                    >
                      {overdueLabel(s.dueDate)}
                    </span>
                  </div>

                  <div
                    className={cn(
                      'mt-4 rounded-xl border p-3.5',
                      s.priority === 'focus' ? 'border-[#f3cfdd]/70 bg-white/70' : 'border-line/80 bg-[#fafbfd]',
                    )}
                  >
                    <div className="mb-2 flex items-end justify-between">
                      <div className="flex items-baseline gap-1.5">
                        <span className="num font-display text-[22px] leading-none font-semibold text-ink">{pct}%</span>
                        <span className="text-[10.5px] text-faint">按目标推进</span>
                      </div>
                      <span className="num text-[11px] text-muted">
                        {done} / {total} 个目标达成
                      </span>
                    </div>
                    <ProgressBar value={pct} segments={total} tone={pct === 100 ? 'teal' : 'brand'} height={9} />

                    <div className="mt-3 space-y-1">
                      {s.goals.map((g, i) => (
                        <button
                          key={g.id}
                          onClick={() => handleToggleGoal(s, g.id)}
                          className={cn(
                            'flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition',
                            g.done ? 'bg-white/70' : 'hover:bg-white',
                          )}
                        >
                          <span
                            className={cn(
                              'grid h-[17px] w-[17px] flex-none place-items-center rounded-[5px] border text-[9px] font-semibold transition',
                              g.done ? 'border-teal bg-teal text-white' : 'border-[#cfd8e6] bg-white text-transparent',
                            )}
                          >
                            <Check size={10} strokeWidth={3.5} />
                          </span>
                          <span className="num flex-none text-[10px] text-faint">目标 {i + 1}</span>
                          <span className={cn('min-w-0 flex-1 truncate text-[12px]', g.done ? 'text-faint line-through' : 'text-ink-2')}>
                            {g.title}
                          </span>
                          {g.done && <span className="flex-none text-[10px] text-teal">已达成</span>}
                        </button>
                      ))}
                    </div>
                    <p className="mt-2 flex items-center gap-1 px-2 text-[10px] text-faint">
                      <TrendingUp size={10.5} /> 勾选目标即可推进进度，全部达成后自动归档
                    </p>
                  </div>
                </article>
              )
            })}
          </div>
        ) : (
          <EmptyState
            icon={<Target size={22} />}
            title={keyword ? '没有匹配的督办任务' : '暂无进行中的督办'}
            description={keyword ? '尝试调整搜索关键词。' : '创建一条督办任务，把会议共识转化为可追踪的目标。'}
            action={
              !keyword && (
                <button className="btn btn-brand btn-sm" onClick={() => setFormOpen(true)}>
                  <Plus size={13} /> 新建督办
                </button>
              )
            }
          />
        ))}

      {tab === 'history' && (
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <div className="flex items-center gap-2">
              <History size={15} className="text-teal" />
              <h3 className="text-[14px] font-semibold">历史督办库</h3>
              <span className="num rounded-full bg-teal-soft px-1.5 py-px text-[10px] text-teal">{history.length}</span>
            </div>
            <p className="text-[11px] text-faint">目标全部达成后自动归档，可长期回溯</p>
          </div>

          {historyList.length ? (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[880px] text-left">
                <thead>
                  <tr className="border-b border-line bg-[#fafbfd] text-[10.5px] tracking-[0.08em] text-faint uppercase">
                    <th className="px-5 py-3 font-medium">督办目标</th>
                    <th className="px-4 py-3 font-medium">关联人</th>
                    <th className="px-4 py-3 font-medium">目标达成</th>
                    <th className="px-4 py-3 font-medium">完成时间</th>
                    <th className="px-4 py-3 font-medium">提醒状态</th>
                    <th className="px-4 py-3 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line/70">
                  {historyList.map((s) => {
                    const owners = state.people.filter((p) => s.ownerIds.includes(p.id))
                    return (
                      <tr key={s.id} className="transition hover:bg-[#fafbfd]">
                        <td className="max-w-[300px] px-5 py-4">
                          <p className="flex items-center gap-2 text-[12.5px] font-medium text-ink">
                            <span className="chip flex-none bg-teal-soft text-teal">
                              <Check size={10} strokeWidth={3} /> 已完成
                            </span>
                            {s.priority === 'focus' && (
                              <span className="chip flex-none bg-[#fbe3ee] text-[#b6456a]">
                                <Star size={10} /> 重点关注
                              </span>
                            )}
                            <span className="truncate">{s.title}</span>
                          </p>
                          <p className="mt-1 line-clamp-1 pl-0.5 text-[10.5px] text-faint">
                            {s.goals.length} 个目标全部达成
                          </p>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <AvatarGroup people={owners} max={3} size={22} />
                            <span className="text-[11px] text-muted">{owners.length} 人</span>
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex items-center gap-2">
                            <div className="w-[80px]">
                              <ProgressBar value={100} tone="teal" height={6} />
                            </div>
                            <span className="num text-[11px] text-teal">100%</span>
                          </div>
                        </td>
                        <td className="num px-4 py-4 text-[11px] text-muted">
                          {s.completedAt ? shortTime(s.completedAt) : formatDate(s.dueDate)}
                        </td>
                        <td className="px-4 py-4">
                          <ReminderBadge supervision={s} />
                        </td>
                        <td className="px-4 py-4">
                          <button
                            onClick={() => setDeleteId(s.id)}
                            className="grid h-7 w-7 place-items-center rounded-md text-faint transition hover:bg-danger-soft hover:text-danger"
                            aria-label="删除归档记录"
                          >
                            <Trash2 size={13} />
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-5">
              <EmptyState
                icon={<Archive size={22} />}
                title={keyword ? '没有匹配的归档记录' : '历史督办库还是空的'}
                description={keyword ? '尝试调整搜索关键词。' : '当进行中的督办全部目标达成后，会自动归档到这里。'}
              />
            </div>
          )}
        </div>
      )}

      <Modal
        open={formOpen}
        onClose={() => setFormOpen(false)}
        title="新建督办任务"
        description="设置督办目标与关联人，按目标数量生成进度条"
        width="max-w-[680px]"
        footer={
          <div className="flex items-center justify-between gap-3">
            <p className="text-[11px] text-faint">申请人：{me?.name ?? '李嘉航'} · {me?.role ?? '财务及后台综合管理员'}</p>
            <div className="flex gap-2">
              <button type="button" className="btn btn-outline" onClick={() => setFormOpen(false)}>
                取消
              </button>
              <button type="submit" form="supervision-form" className="btn btn-brand">
                创建督办
              </button>
            </div>
          </div>
        }
      >
        <form id="supervision-form" onSubmit={submit} className="space-y-4">
          <div>
            <label className="label" htmlFor="s-title">
              督办目标 <span className="text-danger">*</span>
            </label>
            <input
              id="s-title"
              className="field"
              placeholder="例如：3.2 版本灰度发布准备"
              value={form.title}
              onChange={(e) => updateForm({ title: e.target.value })}
              autoFocus
            />
          </div>

          <div>
            <label className="label" htmlFor="s-note">
              督办说明
            </label>
            <textarea
              id="s-note"
              className="field resize-none"
              rows={2}
              placeholder="补充督办背景、验收口径或协作要求"
              value={form.note}
              onChange={(e) => updateForm({ note: e.target.value })}
            />
          </div>

          <div>
            <div className="mb-2 flex items-center justify-between">
              <label className="label mb-0">
                督办关联人 <span className="text-danger">*</span>
              </label>
              <span className="text-[11px] text-faint">已选 {form.ownerIds.length} 人</span>
            </div>
            <div className="grid gap-1.5 rounded-xl border border-line bg-[#fafbfd] p-2.5 sm:grid-cols-2">
              {state.people.map((p) => {
                const selected = form.ownerIds.includes(p.id)
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => toggleOwner(p.id)}
                    className={cn(
                      'flex items-center gap-2.5 rounded-lg border px-2.5 py-1.5 text-left transition',
                      selected ? 'border-brand/30 bg-white' : 'border-transparent hover:bg-white',
                    )}
                  >
                    <Avatar person={p} size={26} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-[12px] font-medium text-ink">{p.name}</span>
                      <span className="block truncate text-[10px] text-faint">{p.role}</span>
                    </span>
                    <span
                      className={cn(
                        'grid h-4 w-4 place-items-center rounded-full border',
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

          <div className="grid gap-3.5 sm:grid-cols-2">
            <div>
              <label className="label" htmlFor="s-start">
                任务开始时间 <span className="text-danger">*</span>
              </label>
              <input
                id="s-start"
                type="date"
                className="field"
                value={form.startDate}
                onChange={(e) => updateForm({ startDate: e.target.value })}
              />
            </div>
            <div>
              <label className="label" htmlFor="s-due">
                任务完成时间 <span className="text-danger">*</span>
              </label>
              <input
                id="s-due"
                type="date"
                className="field"
                value={form.dueDate}
                onChange={(e) => updateForm({ dueDate: e.target.value })}
              />
            </div>
          </div>

          <div className="rounded-xl border border-line p-3.5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-[12.5px] font-medium text-ink">目标数量</p>
                <p className="mt-0.5 text-[10.5px] text-faint">进度条按目标分段，达成即推进</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setGoalCount(form.goals.length - 1)}
                  className="grid h-7 w-7 place-items-center rounded-lg border border-line text-ink-2 transition hover:bg-[#f5f7fb] disabled:opacity-40"
                  disabled={form.goals.length <= 1}
                  aria-label="减少目标"
                >
                  <Minus size={13} />
                </button>
                <span className="num w-[64px] text-center text-[13px] font-semibold">{form.goals.length} 个目标</span>
                <button
                  type="button"
                  onClick={() => setGoalCount(form.goals.length + 1)}
                  className="grid h-7 w-7 place-items-center rounded-lg border border-line text-ink-2 transition hover:bg-[#f5f7fb] disabled:opacity-40"
                  disabled={form.goals.length >= 8}
                  aria-label="增加目标"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>

            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {form.goals.map((g, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="num grid h-6 w-6 flex-none place-items-center rounded-md bg-brand-soft text-[10px] font-semibold text-brand">
                    {i + 1}
                  </span>
                  <input
                    className="field py-1.5 text-[12px]"
                    value={g}
                    onChange={(e) => {
                      const goals = [...form.goals]
                      goals[i] = e.target.value
                      updateForm({ goals })
                    }}
                    placeholder={`目标 ${i + 1}`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-3 flex items-center gap-1.5 border-t border-line pt-3">
              <span className="num text-[10px] text-faint">进度预览</span>
              <div className="ml-1 flex-1">
                <ProgressBar value={0} segments={form.goals.length} height={6} />
              </div>
              <span className="num text-[10px] text-faint">0 / {form.goals.length}</span>
            </div>
          </div>

          <div className="flex items-start justify-between gap-4 rounded-xl border border-line px-3.5 py-3">
            <div className="flex gap-2.5">
              <span className="mt-0.5 grid h-7 w-7 flex-none place-items-center rounded-lg bg-danger-soft text-danger">
                <BellRing size={14} />
              </span>
              <div>
                <p className="text-[12.5px] font-medium text-ink">到期提醒</p>
                <p className="mt-0.5 text-[10.5px] leading-relaxed text-muted">
                  未提醒时标记为<span className="font-medium text-danger">红色</span>，发送提醒后转为
                  <span className="font-medium text-teal">绿色</span>
                </p>
              </div>
            </div>
            <Switch checked={form.reminder} onChange={(v) => updateForm({ reminder: v })} />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {(['normal', 'high', 'focus'] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => updateForm({ priority: p })}
                  className={cn(
                    'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-[11.5px] transition',
                    form.priority === p
                      ? p === 'focus'
                        ? 'border-[#e9b8cb] bg-[#fbe3ee] font-medium text-[#b6456a]'
                        : 'border-brand/40 bg-brand-soft font-medium text-brand'
                      : 'border-line text-muted hover:text-ink',
                  )}
                >
                  {p === 'high' && <Flag size={11} />}
                  {p === 'focus' && <Star size={11} />}
                  {p === 'high' ? '重点督办' : p === 'focus' ? '重点关注' : '常规督办'}
                </button>
              ))}
            </div>
            <span className="inline-flex items-center gap-1 text-[10.5px] text-faint">
              <Clock size={11} /> 创建后可在进行中推进目标
            </span>
          </div>

          {error && <p className="rounded-lg bg-danger-soft px-3 py-2 text-[12px] text-danger">{error}</p>}
        </form>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        title="删除这条督办记录？"
        description="删除后记录将无法恢复，关联的目标进度也会一并移除。"
        onClose={() => setDeleteId(null)}
        onConfirm={() => {
          if (deleteId) {
            deleteSupervision(deleteId)
            notify('督办记录已删除', 'info')
          }
        }}
      />
    </div>
  )
}
