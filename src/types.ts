export type PageKey = 'dashboard' | 'meetings' | 'calendar' | 'minutes' | 'supervision'

export interface Person {
  id: string
  name: string
  role: string
  org: string
  tone: string
}

export type MeetingType = '俱乐部月会' | '商务部月会' | '门店月会' | '2027年战略地图'

export interface Meeting {
  id: string
  title: string
  type: MeetingType
  date: string
  start: string
  end: string
  location: string
  participantIds: string[]
  content: string
  organizerId: string
  priority: 'high' | 'normal'
  createdAt: number
}

export interface ActionItem {
  id: string
  text: string
  owner: string
  due: string
  done: boolean
}

export interface Minutes {
  id: string
  meetingId: string
  title: string
  createdAt: number
  durationSec: number
  transcript: string
  summary: string
  topics: string[]
  decisions: string[]
  actions: ActionItem[]
  risks: string[]
  attendees: string[]
  savedToCloud: boolean
  savedAt?: number
  version: number
}

export interface SupervisionGoal {
  id: string
  title: string
  done: boolean
  doneAt?: number
}

export interface Supervision {
  id: string
  title: string
  note: string
  ownerIds: string[]
  startDate: string
  dueDate: string
  goals: SupervisionGoal[]
  reminder: boolean
  reminded: boolean
  remindedAt?: number
  status: 'active' | 'done'
  priority: 'high' | 'normal' | 'focus'
  createdAt: number
  completedAt?: number
}

export interface AppState {
  people: Person[]
  meetings: Meeting[]
  minutes: Minutes[]
  supervisions: Supervision[]
}

export interface ToastItem {
  id: string
  message: string
  tone: 'success' | 'info' | 'warn'
}
