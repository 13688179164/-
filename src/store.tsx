import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import type { AppState, Meeting, Minutes, PageKey, Supervision, ToastItem } from './types'
import { seedState } from './data'
import { uid } from './lib/utils'

const STORAGE_KEY = 'heyi.platform.v2'

interface RouteState {
  page: PageKey
  meetingId?: string
  supervisionId?: string
  newMeeting?: boolean
}

interface StoreValue {
  state: AppState
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

function loadState(): AppState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AppState
      if (parsed && Array.isArray(parsed.meetings) && Array.isArray(parsed.people)) return parsed
    }
  } catch {
    /* ignore corrupt storage */
  }
  return seedState()
}

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

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppState>(loadState)
  const [route, setRoute] = useState<RouteState>(readRoute)
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const timers = useRef<number[]>([])

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    } catch {
      /* storage may be full */
    }
  }, [state])

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

  const addMeeting = useCallback((input: Omit<Meeting, 'id' | 'createdAt'>) => {
    const meeting: Meeting = { ...input, id: uid('m'), createdAt: Date.now() }
    setState((s) => ({ ...s, meetings: [meeting, ...s.meetings] }))
    return meeting
  }, [])

  const updateMeeting = useCallback((id: string, patch: Partial<Meeting>) => {
    setState((s) => ({ ...s, meetings: s.meetings.map((m) => (m.id === id ? { ...m, ...patch } : m)) }))
  }, [])

  const deleteMeeting = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      meetings: s.meetings.filter((m) => m.id !== id),
      minutes: s.minutes.filter((mi) => mi.meetingId !== id),
    }))
  }, [])

  const saveMinutes = useCallback((m: Minutes) => {
    setState((s) => {
      const exists = s.minutes.some((mi) => mi.id === m.id)
      return {
        ...s,
        minutes: exists ? s.minutes.map((mi) => (mi.id === m.id ? m : mi)) : [m, ...s.minutes],
      }
    })
  }, [])

  const updateMinutes = useCallback((id: string, patch: Partial<Minutes>) => {
    setState((s) => ({ ...s, minutes: s.minutes.map((mi) => (mi.id === id ? { ...mi, ...patch } : mi)) }))
  }, [])

  const toggleAction = useCallback((minutesId: string, actionId: string) => {
    setState((s) => ({
      ...s,
      minutes: s.minutes.map((mi) =>
        mi.id === minutesId
          ? { ...mi, actions: mi.actions.map((a) => (a.id === actionId ? { ...a, done: !a.done } : a)) }
          : mi,
      ),
    }))
  }, [])

  const markCloud = useCallback(
    (minutesId: string) => {
      const at = Date.now()
      setState((s) => ({
        ...s,
        minutes: s.minutes.map((mi) =>
          mi.id === minutesId ? { ...mi, savedToCloud: true, savedAt: at } : mi,
        ),
      }))
      return at
    },
    [],
  )

  const deleteMinutes = useCallback((id: string) => {
    setState((s) => ({ ...s, minutes: s.minutes.filter((mi) => mi.id !== id) }))
  }, [])

  const addSupervision = useCallback(
    (input: Omit<Supervision, 'id' | 'createdAt' | 'status' | 'completedAt'>) => {
      const supervision: Supervision = {
        ...input,
        id: uid('s'),
        createdAt: Date.now(),
        status: 'active',
      }
      setState((s) => ({ ...s, supervisions: [supervision, ...s.supervisions] }))
      return supervision
    },
    [],
  )

  const toggleGoal = useCallback((id: string, goalId: string) => {
    setState((s) => ({
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
  }, [])

  const markReminded = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      supervisions: s.supervisions.map((sv) =>
        sv.id === id ? { ...sv, reminder: true, reminded: true, remindedAt: Date.now() } : sv,
      ),
    }))
  }, [])

  const updateSupervision = useCallback((id: string, patch: Partial<Supervision>) => {
    setState((s) => ({ ...s, supervisions: s.supervisions.map((sv) => (sv.id === id ? { ...sv, ...patch } : sv)) }))
  }, [])

  const deleteSupervision = useCallback((id: string) => {
    setState((s) => ({ ...s, supervisions: s.supervisions.filter((sv) => sv.id !== id) }))
  }, [])

  const value = useMemo<StoreValue>(
    () => ({
      state,
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
