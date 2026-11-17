const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六']

export function pad(n: number) {
  return String(n).padStart(2, '0')
}

export function toKey(d: Date) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function parseKey(key: string) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function addDays(key: string, days: number) {
  const d = parseKey(key)
  d.setDate(d.getDate() + days)
  return toKey(d)
}

export function todayKey() {
  return toKey(new Date())
}

export function formatDate(key: string, withYear = false) {
  const d = parseKey(key)
  return `${withYear ? `${d.getFullYear()} 年 ` : ''}${d.getMonth() + 1} 月 ${d.getDate()} 日`
}

export function weekday(key: string) {
  return `周${WEEKDAYS[parseKey(key).getDay()]}`
}

export function monthLabel(year: number, month: number) {
  return `${year} 年 ${month + 1} 月`
}

export function daysBetween(a: string, b: string) {
  const ms = parseKey(b).getTime() - parseKey(a).getTime()
  return Math.round(ms / 86400000)
}

export function diffMinutes(start: string, end: string) {
  const [sh, sm] = start.split(':').map(Number)
  const [eh, em] = end.split(':').map(Number)
  return Math.max(0, eh * 60 + em - (sh * 60 + sm))
}

export function durationLabel(min: number) {
  if (min < 60) return `${min} 分钟`
  const h = Math.floor(min / 60)
  const m = min % 60
  return m ? `${h} 小时 ${m} 分` : `${h} 小时`
}

export function timeRange(start: string, end: string) {
  return `${start} – ${end}`
}

export function clock(sec: number) {
  const m = Math.floor(sec / 60)
  const s = sec % 60
  return `${pad(m)}:${pad(s)}`
}

export function relativeDay(key: string) {
  const n = daysBetween(todayKey(), key)
  if (n === 0) return '今天'
  if (n === 1) return '明天'
  if (n === -1) return '昨天'
  if (n > 1 && n <= 6) return `${n} 天后`
  return formatDate(key)
}

export function overdueLabel(due: string) {
  const n = daysBetween(todayKey(), due)
  if (n < 0) return `逾期 ${Math.abs(n)} 天`
  if (n === 0) return '今天到期'
  return `剩余 ${n} 天`
}

export function nowIso() {
  return new Date().toISOString()
}

export function shortTime(ts: number) {
  const d = new Date(ts)
  return `${d.getMonth() + 1}月${d.getDate()}日 ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

export function monthMatrix(year: number, month: number) {
  const first = new Date(year, month, 1)
  const offset = (first.getDay() + 6) % 7 // Monday-first
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const cells: { key: string; inMonth: boolean; day: number }[] = []
  const start = new Date(year, month, 1 - offset)
  for (let i = 0; i < 42; i++) {
    const d = new Date(start)
    d.setDate(start.getDate() + i)
    cells.push({ key: toKey(d), inMonth: d.getMonth() === month, day: d.getDate() })
  }
  return cells
}

export function meetingState(m: { date: string; start: string; end: string }): 'upcoming' | 'ongoing' | 'ended' {
  const today = todayKey()
  if (m.date > today) return 'upcoming'
  if (m.date < today) return 'ended'
  const now = new Date()
  const cur = now.getHours() * 60 + now.getMinutes()
  const [sh, sm] = m.start.split(':').map(Number)
  const [eh, em] = m.end.split(':').map(Number)
  if (cur < sh * 60 + sm) return 'upcoming'
  if (cur > eh * 60 + em) return 'ended'
  return 'ongoing'
}

