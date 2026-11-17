import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { AppState, Meeting, Minutes, PageKey, Supervision, ToastItem } from './types'
import { seedState } from './data'
import { uid } from './lib/utils'

interface RouteState {
  page: PageKey
  meetingId?: string
  supervisionId?: string
  newMeeting?: boolean
}

interface StoreValue {
  state: AppState
  ready: boolean
  route: RouteState
  navigate: (page: PageKey, opts?: { meetingId?: string; supervisionId?: string; newMeeting?: boolean }) => void
  toasts: ToastItem[]
  notify: (message: string, tone?: ToastItem['tone']) => void
  dismissToast: (id: string) => void
  addMeeting: (input: Omit<Meeting, 'id' | 'createdAt'>) => Meeting
  updateMeeting: (id: string, patch: Partial<Meeting>) => void
  deleteMeeting: (id: string) => void
  saveMinutes: (m: Minutes) => void
  updateMinutes: (id: string, patch: Partial<Minutes>) => void
  toggleAction: (minutesId: string, actionId: string) => void
  markCloud: (minutesId: string) => number
  deleteMinutes: (id: string) => void
  addSupervision: (input: Omit<Supervision, 'id' | 'createdAt' | 'status' | 'completedAt'>) => Supervision
  toggleGoal: (id: string, goalId: string) => void
  markReminded: (id: string) => void
  updateSupervision: (id: string, patch: Partial<Supervision>) => void
  deleteSupervision: (id: string) => void
}

const StoreContext = createContext<StoreValue | null>(null)

function readRoute(): RouteState {
  const hash = window.location.hash.replace(/^#\/?/, '')
  if (!hash) return { page: 'dashboard' }
  const [path, query] = hash.split('?')
  const page = (path || 'dashboard') as PageKey
  const valid: PageKey[] = ['dashboard', 'meetings', 'calendar', 'minutes', 'supervision']
  const params = new URLSearchParams(query || '')
  return {
    page: valid.includes(page) ? page : 'dashboard',
    meetingId: params.get('m') || undefined,
    newMeeting: params.get('new') === '1',
  }
}

async function apiRequest(url: string, method: string, body?: unknown) {
  const res = await fetch(url, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`HTTP ${res.status}`)
  return res
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(seedState)
  const [ready, setReady] = useState(false)
  const [route, setRoute] = useState<RouteState>(readRoute)
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const stateRef = useRef<AppState>(state)
  const timers = useRef<number[]>([])

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const notify = useCallback(
    (message: string, tone: ToastItem['tone'] = 'success') => {
      const id = uid('toast')
      setToasts((prev) => [...prev.slice(-2), { id, message, tone }])
      const timer = window.setTimeout(() => dismissToast(id), 3800)
      timers.current.push(timer)
    },
    [dismissToast],
  )

  const apply = useCallback((updater: (s: AppState) => AppState) => {
    const next = updater(stateRef.current)
    stateRef.current = next
    setState(next)
    return next
  }, [])

  const send = useCallback(
    async (url: string, method: string, body?: unknown) => {
      try {
        await apiRequest(url, method, body)
      } catch {
        notify('数据同步失败，请检查网络后重试', 'warn')
      }
    },
    [notify],
  )

  useEffect(() => {
    let cancelled = false
    async function init() {
      try {
        const res = await apiRequest('/api/state', 'GET')
        let data = (await res.json()) as AppState
        if (!data.people?.length) {
          const seed = seedState()
          await apiRequest('/api/bootstrap', 'POST', seed)
          data = seed
        }
        if (cancelled) return
        stateRef.current = data
        setState(data)
        setReady(true)
      } catch {
        if (cancelled) return
        setReady(true)
        notify('无法连接数据库，当前展示本地演示数据', 'warn')
      }
    }
    init()
    return () => {
      cancelled = true
    }
  }, [notify])

  useEffect(() => {
    const sync = () => setRoute(readRoute())
    window.addEventListener('hashchange', sync)
    if (!window.location.hash) window.history.replaceState(null, '', '#/dashboard')
    return () => window.removeEventListener('hashchange', sync)
  }, [])

  useEffect(() => () => timers.current.forEach((t) => window.clearTimeout(t)), [])

  const navigate = useCallback((page: PageKey, opts?: { meetingId?: string; supervisionId?: string; newMeeting?: boolean }) => {
    const params = new URLSearchParams()
    if (opts?.meetingId) params.set('m', opts.meetingId)
    if (opts?.supervisionId) params.set('s', opts.supervisionId)
    if (opts?.newMeeting) params.set('new', '1')
    const hash = `#/${page}${params.toString() ? `?${params}` : ''}`
    if (window.location.hash === hash) {
      setRoute({
        page,
        meetingId: opts?.meetingId,
        supervisionId: opts?.supervisionId,
        newMeeting: opts?.newMeeting,
      })
    } else {
      window.location.hash = hash
    }
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  const addMeeting = useCallback(
    (input: Omit<Meeting, 'id' | 'createdAt'>) => {
      const meeting: Meeting = { ...input, id: uid('m'), createdAt: Date.now() }
      apply((s) => ({ ...s, meetings: [meeting, ...s.meetings] }))
      void send('/api/meetings', 'POST', meeting)
      return meeting
    },
    [apply, send],
  )

  const updateMeeting = useCallback(
    (id: string, patch: Partial<Meeting>) => {
      apply((s) => ({ ...s, meetings: s.meetings.map((m) => (m.id === id ? { ...m, ...patch } : m)) }))
      void send(`/api/meetings/${id}`, 'PATCH', patch)
    },
    [apply, send],
  )

  const deleteMeeting = useCallback(
    (id: string) => {
      apply((s) => ({
        ...s,
        meetings: s.meetings.filter((m) => m.id !== id),
        minutes: s.minutes.filter((mi) => mi.meetingId !== id),
      }))
      void send(`/api/meetings/${id}`, 'DELETE')
    },
    [apply, send],
  )

  const saveMinutes = useCallback(
    (m: Minutes) => {
      const exists = stateRef.current.minutes.some((mi) => mi.id === m.id)
      apply((s) => ({
        ...s,
        minutes: exists ? s.minutes.map((mi) => (mi.id === m.id ? m : mi)) : [m, ...s.minutes],
      }))
      void send(`/api/minutes/${m.id}`, 'PUT', m)
    },
    [apply, send],
  )

  const updateMinutes = useCallback(
    (id: string, patch: Partial<Minutes>) => {
      apply((s) => ({ ...s, minutes: s.minutes.map((mi) => (mi.id === id ? { ...mi, ...patch } : mi)) }))
      void send(`/api/minutes/${id}`, 'PATCH', patch)
    },
    [apply, send],
  )

  const toggleAction = useCallback(
    (minutesId: string, actionId: string) => {
      const next = apply((s) => ({
        ...s,
        minutes: s.minutes.map((mi) =>
          mi.id === minutesId
            ? { ...mi, actions: mi.actions.map((a) => (a.id === actionId ? { ...a, done: !a.done } : a)) }
            : mi,
        ),
      }))
      const target = next.minutes.find((mi) => mi.id === minutesId)
      if (target) void send(`/api/minutes/${minutesId}`, 'PATCH', { actions: target.actions })
    },
    [apply, send],
  )

  const markCloud = useCallback(
    (minutesId: string) => {
      const at = Date.now()
      apply((s) => ({
        ...s,
        minutes: s.minutes.map((mi) =>
          mi.id === minutesId ? { ...mi, savedToCloud: true, savedAt: at } : mi,
        ),
      }))
      void send(`/api/minutes/${minutesId}`, 'PATCH', { savedToCloud: true, savedAt: at })
      return at
    },
    [apply, send],
  )

  const deleteMinutes = useCallback(
    (id: string) => {
      apply((s) => ({ ...s, minutes: s.minutes.filter((mi) => mi.id !== id) }))
      void send(`/api/minutes/${id}`, 'DELETE')
    },
    [apply, send],
  )

  const addSupervision = useCallback(
    (input: Omit<Supervision, 'id' | 'createdAt' | 'status' | 'completedAt'>) => {
      const supervision: Supervision = {
        ...input,
        id: uid('s'),
        createdAt: Date.now(),
        status: 'active',
      }
      apply((s) => ({ ...s, supervisions: [supervision, ...s.supervisions] }))
      void send('/api/supervisions', 'POST', supervision)
      return supervision
    },
    [apply, send],
  )

  const toggleGoal = useCallback(
    (id: string, goalId: string) => {
      const next = apply((s) => ({
        ...s,
        supervisions: s.supervisions.map((sv) => {
          if (sv.id !== id) return sv
          const goals = sv.goals.map((g) =>
            g.id === goalId ? { ...g, done: !g.done, doneAt: !g.done ? Date.now() : undefined } : g,
          )
          const allDone = goals.length > 0 && goals.every((g) => g.done)
          return {
            ...sv,
            goals,
            status: allDone ? 'done' : 'active',
            completedAt: allDone ? Date.now() : undefined,
          }
        }),
      }))
      const target = next.supervisions.find((sv) => sv.id === id)
      if (target) {
        void send(`/api/supervisions/${id}`, 'PATCH', {
          goals: target.goals,
          status: target.status,
          completedAt: target.completedAt ?? null,
        })
      }
    },
    [apply, send],
  )

  const markReminded = useCallback(
    (id: string) => {
      const at = Date.now()
      apply((s) => ({
        ...s,
        supervisions: s.supervisions.map((sv) =>
          sv.id === id ? { ...sv, reminder: true, reminded: true, remindedAt: at } : sv,
        ),
      }))
      void send(`/api/supervisions/${id}`, 'PATCH', { reminder: true, reminded: true, remindedAt: at })
    },
    [apply, send],
  )

  const updateSupervision = useCallback(
    (id: string, patch: Partial<Supervision>) => {
      apply((s) => ({
        ...s,
        supervisions: s.supervisions.map((sv) => (sv.id === id ? { ...sv, ...patch } : sv)),
      }))
      void send(`/api/supervisions/${id}`, 'PATCH', patch)
    },
    [apply, send],
  )

  const deleteSupervision = useCallback(
    (id: string) => {
      apply((s) => ({ ...s, supervisions: s.supervisions.filter((sv) => sv.id !== id) }))
      void send(`/api/supervisions/${id}`, 'DELETE')
    },
    [apply, send],
  )

  const value = useMemo<StoreValue>(
    () => ({
      state,
      ready,
      route,
      navigate,
      toasts,
      notify,
      dismissToast,
      addMeeting,
      updateMeeting,
      deleteMeeting,
      saveMinutes,
      updateMinutes,
      toggleAction,
      markCloud,
      deleteMinutes,
      addSupervision,
      toggleGoal,
      markReminded,
      updateSupervision,
      deleteSupervision,
    }),
    [
      state,
      ready,
      route,
      navigate,
      toasts,
      notify,
      dismissToast,
      addMeeting,
      updateMeeting,
      deleteMeeting,
      saveMinutes,
      updateMinutes,
      toggleAction,
      markCloud,
      deleteMinutes,
      addSupervision,
      toggleGoal,
      markReminded,
      updateSupervision,
      deleteSupervision,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
