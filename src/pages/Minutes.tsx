import { useEffect, useMemo, useRef, useState } from 'react'
import {
  AlertTriangle,
  AudioLines,
  Check,
  CheckCircle2,
  Clock,
  Cloud,
  CloudUpload,
  Download,
  FileText,
  ListChecks,
  Loader2,
  MapPin,
  Mic,
  Network,
  Play,
  RefreshCw,
  Sparkles,
  Square,
  Trash2,
  Users,
} from 'lucide-react'
import { useStore } from '../store'
import type { Minutes } from '../types'
import { analyzeMeeting, demoSentences } from '../lib/analysis'
import {
  clock,
  diffMinutes,
  durationLabel,
  formatDate,
  meetingState,
  shortTime,
  timeRange,
  todayKey,
  weekday,
} from '../lib/date'
import { exportMindMapSvg, exportMinutesBundle, exportMinutesMarkdown } from '../lib/export'
import { renderMindMapSvg } from '../lib/mindmap'
import { Avatar, AvatarGroup, Badge, EmptyState, PageHeader, Tabs } from '../components/ui'
import { cn } from '../lib/utils'

const STEPS = ['整理语音转写', '提取议题与关键决议', '生成行动待办', '绘制会议思维导图']
const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))

const STATUS_LABEL = { upcoming: '待开始', ongoing: '进行中', ended: '已结束' } as const

function Waveform({ active }: { active: boolean }) {
  const bars = useMemo(
    () => Array.from({ length: 34 }, (_, i) => 18 + Math.abs(Math.sin(i * 0.7)) * 26 + (i % 4) * 2),
    [],
  )
  return (
    <div className="flex h-12 items-center gap-[3px]">
      {bars.map((h, i) => (
        <span
          key={i}
          className={cn('w-[3px] flex-none rounded-full transition-colors', active ? 'bg-brand/70' : 'bg-[#dfe5ee]')}
          style={{
            height: `${h}px`,
            animation: active ? `wave ${0.7 + (i % 5) * 0.12}s ease-in-out ${i * 0.03}s infinite` : 'none',
            transform: active ? undefined : 'scaleY(0.35)',
          }}
        />
      ))}
    </div>
  )
}

function SectionTitle({ icon, title, count, tone = 'text-brand' }: { icon: React.ReactNode; title: string; count?: number; tone?: string }) {
  return (
    <div className="mb-3 flex items-center gap-2">
      <span className={tone}>{icon}</span>
      <h3 className="text-[13.5px] font-semibold text-ink">{title}</h3>
      {typeof count === 'number' && <span className="num rounded-full bg-[#eef1f6] px-1.5 py-px text-[10px] text-muted">{count}</span>}
    </div>
  )
}

export default function MinutesPage() {
  const { state, route, notify, saveMinutes, markCloud, toggleAction } = useStore()
  const meetings = state.meetings
  const fallbackId =
    meetings.find((m) => m.date === todayKey() && meetingState(m) === 'ongoing')?.id ??
    meetings.find((m) => m.date === todayKey())?.id ??
    state.minutes[0]?.meetingId ??
    meetings[0]?.id

  const [selectedId, setSelectedId] = useState(route.meetingId ?? fallbackId ?? '')
  const [tab, setTab] = useState<'record' | 'minutes' | 'mindmap'>(
    state.minutes.some((mi) => mi.meetingId === (route.meetingId ?? fallbackId)) ? 'minutes' : 'record',
  )
  const [transcript, setTranscript] = useState('')
  const [seconds, setSeconds] = useState(0)
  const [recording, setRecording] = useState(false)
  const [interim, setInterim] = useState('')
  const [speechHint, setSpeechHint] = useState('')
  const [analyzing, setAnalyzing] = useState(false)
  const [analyzeStep, setAnalyzeStep] = useState(0)

  const streamRef = useRef<MediaStream | null>(null)
  const recorderRef = useRef<MediaRecorder | null>(null)
  const speechRef = useRef<any>(null)
  const mountedRef = useRef(true)
  const lastRouteRef = useRef<string | undefined>(undefined)

  const meeting = meetings.find((m) => m.id === selectedId)
  const minutes = state.minutes.find((mi) => mi.meetingId === selectedId)
  const attendees = state.people.filter((p) => meeting?.participantIds.includes(p.id))

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    if (route.meetingId && route.meetingId !== lastRouteRef.current && meetings.some((m) => m.id === route.meetingId)) {
      lastRouteRef.current = route.meetingId
      setSelectedId(route.meetingId)
      if (state.minutes.some((mi) => mi.meetingId === route.meetingId)) setTab('minutes')
    }
  }, [route.meetingId, meetings, state.minutes])

  useEffect(() => {
    if (!recording) return
    const t = window.setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => window.clearInterval(t)
  }, [recording])

  const stopMedia = () => {
    try {
      speechRef.current?.stop?.()
    } catch {
      /* noop */
    }
    speechRef.current = null
    try {
      recorderRef.current?.stop?.()
    } catch {
      /* noop */
    }
    recorderRef.current = null
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    setRecording(false)
    setInterim('')
  }

  useEffect(() => {
    return () => {
      stopMedia()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    stopMedia()
    const mi = state.minutes.find((x) => x.meetingId === selectedId)
    setTranscript(mi?.transcript ?? '')
    setSeconds(mi?.durationSec ?? 0)
    setSpeechHint('')
    setTab(mi ? 'minutes' : 'record')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  const startRecording = async () => {
    if (!meeting) return
    setSeconds(0)
    setTranscript('')
    setInterim('')
    setRecording(true)
    setTab('record')
    setSpeechHint('正在请求麦克风权限…')

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream
      if (typeof MediaRecorder !== 'undefined') {
        recorderRef.current = new MediaRecorder(stream)
        recorderRef.current.start()
      }
      setSpeechHint('录音中，语音将实时转写为文字')
    } catch {
      setSpeechHint('未获得麦克风权限，已切换为手动转写模式，可直接输入或载入示例')
    }

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (SR) {
      try {
        const rec = new SR()
        rec.lang = 'zh-CN'
        rec.continuous = true
        rec.interimResults = true
        rec.onresult = (event: any) => {
          let finalText = ''
          let temp = ''
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const res = event.results[i]
            if (res.isFinal) finalText += res[0].transcript
            else temp += res[0].transcript
          }
          if (finalText) setTranscript((prev) => (prev + finalText).trim())
          setInterim(temp)
        }
        rec.onerror = () => setSpeechHint('语音识别暂时不可用，可继续录音并手动补充文字')
        rec.start()
        speechRef.current = rec
      } catch {
        setSpeechHint('语音识别启动失败，已保留录音计时，可手动记录')
      }
    } else {
      setSpeechHint('当前浏览器不支持实时语音识别，建议使用 Chrome 或手动记录')
    }
  }

  const stopRecording = () => {
    stopMedia()
    setSpeechHint('录音已结束，转写内容可继续编辑，确认后生成纪要')
  }

  const loadDemo = () => {
    if (!meeting) return
    stopRecording()
    setTranscript(demoSentences(meeting, state.people))
    setSeconds(diffMinutes(meeting.start, meeting.end) * 60)
    setSpeechHint('已载入示例转写，可直接生成智能纪要')
    notify('已载入示例转写，可生成会议纪要', 'info')
  }

  const runAnalysis = async () => {
    if (!meeting) return
    if (transcript.trim().length < 30) {
      notify('转写内容过少，请先录音或载入示例转写', 'warn')
      return
    }
    if (recording) stopRecording()
    setAnalyzing(true)
    setAnalyzeStep(0)
    for (let i = 0; i < STEPS.length; i++) {
      await sleep(620)
      if (!mountedRef.current) return
      setAnalyzeStep(i + 1)
    }
    const result = analyzeMeeting(
      meeting,
      transcript.trim(),
      seconds || diffMinutes(meeting.start, meeting.end) * 60,
      state.people,
      state.minutes.find((mi) => mi.meetingId === meeting.id),
    )
    saveMinutes(result)
    if (!mountedRef.current) return
    setAnalyzing(false)
    setTab('minutes')
    notify(`「${meeting.title}」纪要已生成，含 ${result.decisions.length} 项决议与 ${result.actions.length} 项待办`)
  }

  const saveCloud = (mi: Minutes) => {
    markCloud(mi.id)
    notify('纪要已保存至云端纪要库')
  }

  const exportAll = (mi: Minutes) => {
    exportMinutesBundle(mi, meeting)
    markCloud(mi.id)
    notify('纪要归档包已导出，并已保存至云端')
  }

  if (!meeting) {
    return (
      <div>
        <PageHeader kicker="Smart Minutes" title="会议纪要" />
        <EmptyState
          icon={<AudioLines size={22} />}
          title="还没有可关联的会议"
          description="请先到「会议统筹」创建一场会议，再开始录音与纪要生成。"
        />
      </div>
    )
  }

  const speechSupported = typeof window !== 'undefined' && !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition)

  return (
    <div>
      <PageHeader
        kicker="Smart Minutes"
        title="会议纪要"
        description="实时录音转写，自动提炼决议与待办，一键生成纪要与思维导图。"
        actions={
          minutes && (
            <button className="btn btn-brand" onClick={() => exportAll(minutes)}>
              <CloudUpload size={15} /> 一键导出并保存云端
            </button>
          )
        }
      />

      <div className="grid gap-5 xl:grid-cols-[288px_minmax(0,1fr)]">
        <aside className="card flex h-fit flex-col overflow-hidden xl:sticky xl:top-6">
          <div className="flex items-center justify-between border-b border-line px-4 py-3.5">
            <h2 className="text-[13px] font-semibold">选择会议</h2>
            <span className="num text-[10.5px] text-faint">{meetings.length} 场</span>
          </div>
          <div className="max-h-[300px] overflow-y-auto p-2 xl:max-h-[calc(100vh-200px)]">
            {[...meetings]
              .sort((a, b) => {
                const wa = meetingState(a) === 'ongoing' ? 0 : meetingState(a) === 'upcoming' ? 1 : 2
                const wb = meetingState(b) === 'ongoing' ? 0 : meetingState(b) === 'upcoming' ? 1 : 2
                if (wa !== wb) return wa - wb
                return wa === 2
                  ? `${b.date}${b.start}`.localeCompare(`${a.date}${a.start}`)
                  : `${a.date}${a.start}`.localeCompare(`${b.date}${b.start}`)
              })
              .map((m) => {
                const mi = state.minutes.find((x) => x.meetingId === m.id)
                const active = m.id === selectedId
                return (
                  <button
                    key={m.id}
                    onClick={() => setSelectedId(m.id)}
                    className={cn(
                      'mb-0.5 w-full rounded-lg px-2.5 py-2.5 text-left transition',
                      active ? 'bg-brand-soft' : 'hover:bg-[#f6f8fb]',
                    )}
                  >
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          'h-1.5 w-1.5 flex-none rounded-full',
                          meetingState(m) === 'ongoing' ? 'bg-teal' : meetingState(m) === 'upcoming' ? 'bg-brand' : 'bg-[#c3ccda]',
                        )}
                      />
                      <p className={cn('min-w-0 flex-1 truncate text-[12px] font-medium', active ? 'text-brand' : 'text-ink')}>
                        {m.title}
                      </p>
                      {mi && <Cloud size={11} className={mi.savedToCloud ? 'text-teal' : 'text-faint'} />}
                    </div>
                    <div className="mt-1 flex items-center gap-1.5 pl-3">
                      <span className="num text-[10px] text-faint">
                        {formatDate(m.date)} {m.start}
                      </span>
                      {mi && <span className="rounded bg-[#eef7f4] px-1 py-px text-[9px] text-teal">纪要</span>}
                    </div>
                  </button>
                )
              })}
          </div>
          <div className="border-t border-line p-3">
            <div className="flex items-start gap-2 rounded-lg bg-[#f7f9fc] px-2.5 py-2 text-[10.5px] leading-relaxed text-muted">
              <Sparkles size={13} className="mt-px flex-none text-brand" />
              录音数据仅用于本次纪要生成，保存云端后可长期回溯。
            </div>
          </div>
        </aside>

        <div className="min-w-0 space-y-5">
          <section className="card overflow-hidden">
            <div className="flex flex-wrap items-start justify-between gap-4 px-5 pt-5">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge tone="brand">{meeting.type}</Badge>
                  <Badge tone={meetingState(meeting) === 'ongoing' ? 'teal' : meetingState(meeting) === 'ended' ? 'neutral' : 'brand'}>
                    {STATUS_LABEL[meetingState(meeting)]}
                  </Badge>
                  {minutes && (
                    <span className={cn('chip', minutes.savedToCloud ? 'bg-teal-soft text-teal' : 'bg-[#eef1f6] text-muted')}>
                      <Cloud size={11} /> {minutes.savedToCloud ? '已同步云端' : '未同步云端'}
                    </span>
                  )}
                </div>
                <h2 className="mt-2 truncate text-[20px] font-semibold text-ink">{meeting.title}</h2>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-[11.5px] text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={12} className="text-faint" />
                    {formatDate(meeting.date)} {weekday(meeting.date)} · {timeRange(meeting.start, meeting.end)}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={12} className="text-faint" /> {meeting.location}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Users size={12} className="text-faint" /> {attendees.length} 人
                  </span>
                </div>
              </div>
              <AvatarGroup people={attendees} max={5} size={28} />
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-3">
              <Tabs
                value={tab}
                onChange={(k) => setTab(k as typeof tab)}
                items={[
                  { key: 'record', label: '录音转写' },
                  { key: 'minutes', label: '会议纪要' },
                  { key: 'mindmap', label: '思维导图' },
                ]}
              />
              {minutes && (
                <div className="flex flex-wrap items-center gap-2">
                  <button className="btn btn-outline btn-sm" onClick={() => exportMinutesMarkdown(minutes, meeting)}>
                    <FileText size={13} /> 导出纪要
                  </button>
                  <button className="btn btn-outline btn-sm" onClick={() => exportMindMapSvg(minutes)}>
                    <Download size={13} /> 导出导图
                  </button>
                  <button className="btn btn-soft btn-sm" onClick={() => saveCloud(minutes)}>
                    <Cloud size={13} /> 保存云端
                  </button>
                </div>
              )}
            </div>
          </section>

          {tab === 'record' && (
            <section className="card relative overflow-hidden">
              <div className="border-b border-line px-5 py-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-danger-soft text-danger">
                      <Mic size={14} />
                    </span>
                    <h3 className="text-[14px] font-semibold">实时录音与转写</h3>
                    {recording && (
                      <span className="chip bg-danger-soft text-danger">
                        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-danger" /> REC
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-faint">
                    {speechSupported ? '支持中文实时语音识别' : '建议使用 Chrome 获得实时识别'}
                  </span>
                </div>
              </div>

              <div className="px-5 py-5">
                <div className="grid gap-5 lg:grid-cols-[240px_minmax(0,1fr)] lg:items-center">
                  <div>
                    <p className="num font-display text-[38px] leading-none font-semibold tracking-tight text-ink">
                      {clock(seconds)}
                    </p>
                    <p className="mt-2 text-[11.5px] text-muted">
                      {recording ? '正在录音，请保持麦克风通畅' : seconds ? '录音已结束，可编辑转写内容' : '点击开始录音，或载入示例转写'}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {recording ? (
                        <button className="btn btn-danger" onClick={stopRecording}>
                          <Square size={14} /> 结束录音
                        </button>
                      ) : (
                        <button className="btn btn-brand" onClick={startRecording}>
                          <Mic size={14} /> 开始录音
                        </button>
                      )}
                      <button className="btn btn-outline" onClick={loadDemo} disabled={recording}>
                        <Play size={13} /> 载入示例
                      </button>
                      {transcript && !recording && (
                        <button
                          className="btn btn-ghost"
                          onClick={() => {
                            setTranscript('')
                            setSeconds(0)
                          }}
                        >
                          <Trash2 size={13} /> 清空
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="rounded-xl border border-line bg-[#fafbfd] px-4 py-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10.5px] font-medium tracking-[0.1em] text-faint uppercase">Audio signal</span>
                      <span className="num text-[10.5px] text-faint">{transcript.length} 字</span>
                    </div>
                    <Waveform active={recording} />
                    {speechHint && <p className="mt-1 text-[10.5px] leading-relaxed text-muted">{speechHint}</p>}
                  </div>
                </div>

                <div className="mt-5">
                  <div className="mb-1.5 flex items-center justify-between">
                    <label className="text-[12px] font-medium text-ink-2" htmlFor="transcript">
                      实时转写
                    </label>
                    <span className="text-[10.5px] text-faint">可直接编辑或粘贴会议记录</span>
                  </div>
                  <textarea
                    id="transcript"
                    value={transcript}
                    onChange={(e) => setTranscript(e.target.value)}
                    placeholder="点击「开始录音」后，识别到的内容会实时出现在这里；也可以粘贴已有会议记录，或载入示例转写体验完整流程。"
                    className="field min-h-[170px] resize-y bg-[#fcfdfe] leading-relaxed"
                  />
                  {recording && interim && (
                    <p className="mt-1.5 text-[11.5px] text-muted">
                      <span className="text-brand">识别中：</span>
                      {interim}
                    </p>
                  )}
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-line pt-4">
                  <div className="flex items-center gap-2 text-[11px] text-muted">
                    {minutes ? (
                      <>
                        <RefreshCw size={12} className="text-faint" />
                        已有 v{minutes.version} 纪要，重新分析将生成新版本
                      </>
                    ) : (
                      <>
                        <Sparkles size={12} className="text-brand" />
                        生成后可自动产出会议纪要与思维导图
                      </>
                    )}
                  </div>
                  <button className="btn btn-brand" onClick={runAnalysis} disabled={analyzing}>
                    <Sparkles size={15} /> 生成智能纪要
                  </button>
                </div>
              </div>

              {analyzing && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-6 bg-white/94 backdrop-blur-sm">
                  <div className="relative grid h-16 w-16 place-items-center">
                    <span className="absolute inset-0 rounded-full border-2 border-brand/15" />
                    <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-brand" style={{ animationDuration: '1.1s' }} />
                    <Sparkles size={22} className="text-brand" />
                  </div>
                  <div className="w-[300px] space-y-3">
                    {STEPS.map((s, i) => {
                      const done = analyzeStep > i
                      const active = analyzeStep === i
                      return (
                        <div key={s} className="flex items-center gap-3">
                          <span
                            className={cn(
                              'grid h-5 w-5 place-items-center rounded-full border transition',
                              done ? 'border-teal bg-teal text-white' : active ? 'border-brand text-brand' : 'border-[#dbe2ec] text-transparent',
                            )}
                          >
                            {done ? <Check size={11} strokeWidth={3} /> : active ? <Loader2 size={11} className="animate-spin" /> : null}
                          </span>
                          <span className={cn('text-[12.5px]', done ? 'text-ink-2' : active ? 'font-medium text-ink' : 'text-faint')}>{s}</span>
                        </div>
                      )
                    })}
                  </div>
                  <p className="text-[11px] text-faint">正在理解会议语境，请稍候…</p>
                </div>
              )}
            </section>
          )}

          {tab === 'minutes' && (
            !minutes ? (
              <EmptyState
                icon={<FileText size={22} />}
                title="这场会议还没有纪要"
                description="先完成录音或载入示例转写，系统会自动生成结构化纪要。"
                action={
                  <button className="btn btn-brand btn-sm" onClick={() => setTab('record')}>
                    <Mic size={13} /> 去录音
                  </button>
                }
              />
            ) : (
              <>
                <article className="card overflow-hidden">
                  <div className="border-b border-line bg-gradient-to-br from-[#f8faff] to-white px-6 py-6">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="kicker mb-2">Meeting Minutes · v{minutes.version}</p>
                        <h2 className="text-[23px] leading-tight font-semibold tracking-tight text-ink">{minutes.title}</h2>
                        <p className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[11.5px] text-muted">
                          <span>
                            {formatDate(meeting.date, true)} · {timeRange(meeting.start, meeting.end)}
                          </span>
                          <span>{meeting.location}</span>
                          <span>{minutes.attendees.length} 人参会</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10.5px] text-faint">生成时间</p>
                        <p className="num text-[11.5px] text-ink-2">{shortTime(minutes.createdAt)}</p>
                        <p className="mt-1 text-[10.5px] text-faint">录音时长 {durationLabel(Math.round(minutes.durationSec / 60))}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-7 px-6 py-6">
                    <section>
                      <SectionTitle icon={<Sparkles size={14} />} title="会议摘要" />
                      <p className="rounded-xl border border-brand/10 bg-[#f7f9ff] px-4 py-3.5 text-[13px] leading-[1.9] text-ink-2">
                        {minutes.summary}
                      </p>
                    </section>

                    <section>
                      <SectionTitle icon={<ListChecks size={14} />} title="核心议题" count={minutes.topics.length} />
                      <div className="space-y-2">
                        {minutes.topics.map((t, i) => (
                          <div key={i} className="flex items-start gap-3 rounded-lg border border-line px-3.5 py-2.5">
                            <span className="num mt-px grid h-5 w-5 flex-none place-items-center rounded-md bg-brand-soft text-[10.5px] font-semibold text-brand">
                              {String(i + 1).padStart(2, '0')}
                            </span>
                            <p className="text-[12.5px] leading-relaxed text-ink-2">{t}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <SectionTitle icon={<CheckCircle2 size={14} />} title="关键决议" count={minutes.decisions.length} tone="text-teal" />
                      <div className="space-y-2">
                        {minutes.decisions.map((d, i) => (
                          <div key={i} className="flex items-start gap-2.5 rounded-lg bg-teal-soft/60 px-3.5 py-2.5">
                            <CheckCircle2 size={14} className="mt-0.5 flex-none text-teal" />
                            <p className="text-[12.5px] leading-relaxed text-[#12564d]">{d}</p>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <SectionTitle icon={<CheckCircle2 size={14} />} title="行动待办" count={minutes.actions.length} tone="text-amber" />
                      <div className="space-y-2">
                        {minutes.actions.map((a) => (
                          <div
                            key={a.id}
                            className={cn(
                              'flex items-start gap-3 rounded-lg border px-3.5 py-3 transition',
                              a.done ? 'border-teal/20 bg-[#f4fbf9]' : 'border-line bg-white',
                            )}
                          >
                            <button
                              onClick={() => toggleAction(minutes.id, a.id)}
                              className={cn(
                                'mt-0.5 grid h-[18px] w-[18px] flex-none place-items-center rounded-[5px] border transition',
                                a.done ? 'border-teal bg-teal text-white' : 'border-[#cfd8e6] bg-white hover:border-brand',
                              )}
                              aria-label={a.done ? '标记为未完成' : '标记为已完成'}
                            >
                              {a.done && <Check size={11} strokeWidth={3} />}
                            </button>
                            <div className="min-w-0 flex-1">
                              <p className={cn('text-[12.5px] leading-relaxed', a.done ? 'text-faint line-through' : 'text-ink-2')}>
                                {a.text}
                              </p>
                              <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[10.5px] text-muted">
                                <span className="inline-flex items-center gap-1">
                                  <Avatar person={state.people.find((p) => p.name === a.owner)} size={16} />
                                  {a.owner}
                                </span>
                                <span className="text-[#d5dbe4]">|</span>
                                <span className="inline-flex items-center gap-1">
                                  <Clock size={10.5} /> 截止 {formatDate(a.due)}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section>
                      <SectionTitle icon={<AlertTriangle size={14} />} title="风险与待确认" count={minutes.risks.length} tone="text-danger" />
                      {minutes.risks.length ? (
                        <div className="space-y-2">
                          {minutes.risks.map((r, i) => (
                            <div key={i} className="flex items-start gap-2.5 rounded-lg bg-danger-soft/60 px-3.5 py-2.5">
                              <AlertTriangle size={13.5} className="mt-0.5 flex-none text-danger" />
                              <p className="text-[12.5px] leading-relaxed text-[#8c3338]">{r}</p>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="rounded-lg border border-dashed border-line px-3.5 py-3 text-[12px] text-faint">
                          本次会议未识别到明确风险项。
                        </p>
                      )}
                    </section>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line bg-[#fbfcfe] px-6 py-4">
                    <div className="flex items-center gap-3">
                      <AvatarGroup people={attendees} max={5} size={26} />
                      <span className="text-[11px] text-muted">{minutes.attendees.join('、')}</span>
                    </div>
                    <span className="inline-flex items-center gap-1.5 text-[10.5px] text-faint">
                      <Sparkles size={11} /> 由合议智能纪要生成
                    </span>
                  </div>
                </article>

                <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white px-5 py-4">
                  <div className="flex items-center gap-2 text-[11.5px] text-muted">
                    <Cloud size={14} className={minutes.savedToCloud ? 'text-teal' : 'text-faint'} />
                    {minutes.savedToCloud
                      ? `已保存至云端纪要库 · ${minutes.savedAt ? shortTime(minutes.savedAt) : ''}`
                      : '尚未保存云端，建议归档以便长期回溯'}
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-outline btn-sm" onClick={() => saveCloud(minutes)}>
                      <Cloud size={13} /> 保存到云端
                    </button>
                    <button className="btn btn-brand btn-sm" onClick={() => exportAll(minutes)}>
                      <Download size={13} /> 一键导出并保存云端
                    </button>
                  </div>
                </div>
              </>
            )
          )}

          {tab === 'mindmap' && (
            !minutes ? (
              <EmptyState
                icon={<Network size={22} />}
                title="思维导图尚未生成"
                description="完成会议纪要生成后，系统会自动绘制以会议主题为中心的思维导图。"
                action={
                  <button className="btn btn-brand btn-sm" onClick={() => setTab('record')}>
                    <Mic size={13} /> 去录音
                  </button>
                }
              />
            ) : (
              <section className="card overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-line px-5 py-4">
                  <div>
                    <h3 className="text-[14px] font-semibold">会议思维导图</h3>
                    <p className="mt-0.5 text-[11px] text-faint">从主题到议题、决议、待办与风险的完整结构</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="chip bg-[#eef1f6] text-muted">SVG 矢量图</span>
                    <button className="btn btn-outline btn-sm" onClick={() => exportMindMapSvg(minutes)}>
                      <Download size={13} /> 导出导图
                    </button>
                  </div>
                </div>
                <div className="bg-dots overflow-x-auto bg-[#fcfdff] p-3 sm:p-5">
                  <div
                    className="min-w-[760px] [&>svg]:h-auto [&>svg]:w-full"
                    dangerouslySetInnerHTML={{ __html: renderMindMapSvg(minutes) }}
                  />
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3 border-t border-line px-5 py-4">
                  <p className="text-[11px] text-muted">
                    导图结构随纪要同步更新 · 当前 v{minutes.version} · {minutes.topics.length + minutes.decisions.length + minutes.actions.length + minutes.risks.length} 个节点
                  </p>
                  <button className="btn btn-brand btn-sm" onClick={() => exportAll(minutes)}>
                    <CloudUpload size={13} /> 导出并保存云端
                  </button>
                </div>
              </section>
            )
          )}
        </div>
      </div>
    </div>
  )
}
