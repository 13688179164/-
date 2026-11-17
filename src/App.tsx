import { useMemo, useState } from 'react'
import {
  AudioLines,
  CalendarDays,
  CalendarRange,
  Cloud,
  LayoutDashboard,
  Menu,
  Target,
  X,
} from 'lucide-react'
import { StoreProvider, useStore } from './store'
import type { PageKey } from './types'
import { cn } from './lib/utils'
import { todayKey } from './lib/date'
import { Avatar, ToastHost } from './components/ui'
import Dashboard from './pages/Dashboard'
import Meetings from './pages/Meetings'
import CalendarPage from './pages/CalendarPage'
import MinutesPage from './pages/Minutes'
import SupervisionPage from './pages/Supervision'

const NAV: { group: string; items: { key: PageKey; label: string; icon: typeof LayoutDashboard }[] }[] = [
  {
    group: '工作空间',
    items: [
      { key: 'dashboard', label: '工作台', icon: LayoutDashboard },
      { key: 'meetings', label: '会议统筹', icon: CalendarRange },
      { key: 'calendar', label: '会议日历', icon: CalendarDays },
    ],
  },
  {
    group: '智能协作',
    items: [
      { key: 'minutes', label: '会议纪要', icon: AudioLines },
      { key: 'supervision', label: '目标督办', icon: Target },
    ],
  },
]

function SidebarContent({ onNavigate }: { onNavigate?: () => void }) {
  const { state, route, navigate } = useStore()
  const today = todayKey()
  const todayCount = state.meetings.filter((m) => m.date === today).length
  const activeCount = state.supervisions.filter((s) => s.status === 'active').length
  const cloudCount = state.minutes.filter((m) => m.savedToCloud).length
  const me = state.people.find((p) => p.id === 'p1')

  const counts: Partial<Record<PageKey, number>> = {
    calendar: todayCount,
    supervision: activeCount,
  }

  return (
    <div className="flex h-full flex-col bg-grain">
      <div className="flex items-center gap-2.5 px-5 pt-6 pb-5">
        <div className="grid h-9 w-9 place-items-center rounded-[11px] bg-gradient-to-br from-[#4d78ff] to-[#2246c9] text-[15px] font-semibold text-white shadow-[0_8px_18px_-8px_rgba(77,120,255,.9)]">
          合
        </div>
        <div className="leading-tight">
          <p className="text-[15px] font-semibold tracking-wide text-white">合议</p>
          <p className="text-[10.5px] tracking-[0.14em] text-[#7588a6]">MEETING OS</p>
        </div>
      </div>

      <div className="mx-4 mb-6 flex items-center gap-2.5 rounded-xl border border-white/[0.07] bg-white/[0.04] px-3 py-2.5">
        <span className="grid h-6 w-6 place-items-center rounded-md bg-[#1d2b45] text-[10px] font-semibold text-[#9fb2d8]">
          研
        </span>
        <span className="flex-1 text-[12px] text-[#c3cfe3]">研发中心 · Q4</span>
        <span className="rounded-full bg-[#1c3358] px-1.5 py-0.5 text-[9.5px] font-medium text-[#7fa4e8]">空间</span>
      </div>

      <nav className="flex-1 space-y-7 overflow-y-auto px-3">
        {NAV.map((group) => (
          <div key={group.group}>
            <p className="mb-2 px-3 text-[10px] font-semibold tracking-[0.18em] text-[#5c6f8d]">
              {group.group}
            </p>
            <div className="space-y-1">
              {group.items.map((item) => {
                const active = route.page === item.key
                const Icon = item.icon
                return (
                  <button
                    key={item.key}
                    onClick={() => {
                      navigate(item.key)
                      onNavigate?.()
                    }}
                    className={cn(
                      'group relative flex h-[38px] w-full items-center gap-3 rounded-lg px-3 text-[13px] transition-colors',
                      active
                        ? 'bg-white/[0.07] font-medium text-white'
                        : 'text-[#93a4bf] hover:bg-white/[0.04] hover:text-white',
                    )}
                  >
                    {active && (
                      <span className="absolute top-1/2 left-0 h-4 w-[2.5px] -translate-y-1/2 rounded-r-full bg-[#6d8dff]" />
                    )}
                    <Icon size={16.5} strokeWidth={active ? 2.1 : 1.8} className={active ? 'text-[#8ba6ff]' : 'text-[#7c8daa] group-hover:text-[#a9bbd6]'} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {counts[item.key] ? (
                      <span
                        className={cn(
                          'rounded-full px-1.5 py-px text-[10px] font-medium num',
                          active ? 'bg-[#2a4270] text-[#a9c0f5]' : 'bg-white/[0.06] text-[#7f92b0]',
                        )}
                      >
                        {counts[item.key]}
                      </span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-4">
        <div className="rounded-xl border border-white/[0.07] bg-gradient-to-br from-white/[0.06] to-white/[0.02] p-3.5">
          <div className="mb-2 flex items-center gap-2">
            <Cloud size={14} className="text-[#7fa4e8]" />
            <span className="text-[11.5px] font-medium text-[#d3dded]">云端同步正常</span>
            <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#3ecf9a] shadow-[0_0_0_3px_rgba(62,207,154,.15)]" />
          </div>
          <p className="text-[10.5px] leading-relaxed text-[#71839f]">
            {cloudCount} 份纪要已归档 · 自动保留 90 天
          </p>
        </div>

        <div className="mt-4 flex items-center gap-2.5 border-t border-white/[0.06] pt-4">
          {me && <Avatar person={me} size={32} />}
          <div className="min-w-0 flex-1 leading-tight">
            <p className="truncate text-[12.5px] font-medium text-[#e5ebf5]">{me?.name ?? '林砚'}</p>
            <p className="truncate text-[10.5px] text-[#71839f]">{me?.role ?? '产品负责人'}</p>
          </div>
          <span className="rounded-full border border-white/[0.08] px-1.5 py-0.5 text-[9px] text-[#8ea0bb]">在线</span>
        </div>
      </div>
    </div>
  )
}

function Shell() {
  const { route } = useStore()
  const [mobileOpen, setMobileOpen] = useState(false)

  const page = useMemo(() => {
    switch (route.page) {
      case 'meetings':
        return <Meetings />
      case 'calendar':
        return <CalendarPage />
      case 'minutes':
        return <MinutesPage />
      case 'supervision':
        return <SupervisionPage />
      default:
        return <Dashboard />
    }
  }, [route.page])

  return (
    <div className="min-h-screen bg-paper">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[232px] border-r border-white/[0.05] bg-navy lg:block">
        <SidebarContent />
      </aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 animate-fade-in bg-[#0b1424]/50 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-[250px] animate-slide-in bg-navy shadow-2xl">
            <button
              onClick={() => setMobileOpen(false)}
              className="absolute top-5 right-3 grid h-8 w-8 place-items-center rounded-lg text-[#93a4bf] hover:bg-white/5 hover:text-white"
              aria-label="关闭菜单"
            >
              <X size={17} />
            </button>
            <SidebarContent onNavigate={() => setMobileOpen(false)} />
          </aside>
        </div>
      )}

      <div className="lg:pl-[232px]">
        <div className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-line bg-white/85 px-5 backdrop-blur-md lg:hidden">
          <button
            onClick={() => setMobileOpen(true)}
            className="grid h-9 w-9 place-items-center rounded-lg border border-line text-ink-2"
            aria-label="打开菜单"
          >
            <Menu size={17} />
          </button>
          <div className="flex items-center gap-2">
            <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-[#4d78ff] to-[#2246c9] text-[11px] font-semibold text-white">
              合
            </span>
            <span className="text-[13.5px] font-semibold">合议 · 会议管理平台</span>
          </div>
        </div>

        <main className="relative min-h-screen overflow-x-hidden">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-[420px] bg-[radial-gradient(60%_100%_at_72%_0%,rgba(43,87,224,.07),transparent_70%)]" />
          <div className="relative mx-auto max-w-[1420px] px-5 py-7 lg:px-9 lg:py-9">
            <div key={route.page} className="animate-fade-in">
              {page}
            </div>
          </div>
        </main>
      </div>
      <ToastHost />
    </div>
  )
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  )
}
