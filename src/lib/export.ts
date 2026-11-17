import type { Meeting, Minutes } from '../types'
import { formatDate, timeRange, weekday } from './date'
import { escapeHtml } from './utils'
import { renderMindMapSvg } from './mindmap'

export function safeFileName(name: string) {
  return name.replace(/[\\/:*?"<>|\s]+/g, '-')
}

export function downloadFile(fileName: string, content: string, mime: string) {
  const blob = new Blob([content], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = fileName
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => URL.revokeObjectURL(url), 1500)
}

export function minutesToMarkdown(minutes: Minutes, meeting?: Meeting) {
  const meta: string[] = []
  if (meeting) {
    meta.push(`会议时间：${formatDate(meeting.date, true)} ${weekday(meeting.date)} ${timeRange(meeting.start, meeting.end)}`)
    meta.push(`会议地点：${meeting.location}`)
  }
  meta.push(`参会人员：${minutes.attendees.join('、')}`)
  meta.push(`纪要版本：v${minutes.version} · 生成于 ${new Date(minutes.createdAt).toLocaleString('zh-CN')}`)

  const actions = minutes.actions
    .map((a) => `- [${a.done ? 'x' : ' '}] ${a.text} —— ${a.owner} · 截止 ${formatDate(a.due)}`)
    .join('\n')

  return `# ${minutes.title}

${meta.map((m) => `> ${m}`).join('\n')}

## 会议摘要

${minutes.summary}

## 核心议题

${minutes.topics.map((t, i) => `${i + 1}. ${t}`).join('\n')}

## 关键决议

${minutes.decisions.map((d) => `- ${d}`).join('\n')}

## 行动待办

${actions || '- 暂无待办事项'}

## 风险与待确认

${minutes.risks.length ? minutes.risks.map((r) => `- ${r}`).join('\n') : '- 暂无明确风险'}

---

*由 合议 · 智能会议纪要生成*
`
}

export function exportMinutesMarkdown(minutes: Minutes, meeting?: Meeting) {
  downloadFile(`${safeFileName(minutes.title)}-会议纪要.md`, minutesToMarkdown(minutes, meeting), 'text/markdown')
}

export function exportMindMapSvg(minutes: Minutes) {
  downloadFile(`${safeFileName(minutes.title)}-思维导图.svg`, renderMindMapSvg(minutes), 'image/svg+xml')
}

export function buildMinutesBundle(minutes: Minutes, meeting?: Meeting) {
  const svg = renderMindMapSvg(minutes).replace('<svg ', '<svg style="width:100%;height:auto;display:block" ')
  const meta = meeting
    ? `<span>${escapeHtml(formatDate(meeting.date, true))} · ${escapeHtml(timeRange(meeting.start, meeting.end))}</span><span>${escapeHtml(meeting.location)}</span>`
    : ''
  const section = (title: string, body: string, cls = '') =>
    `<section class="${cls}"><h2>${title}</h2>${body}</section>`

  const actions = minutes.actions
    .map(
      (a) => `<li class="action ${a.done ? 'done' : ''}">
        <span class="box">${a.done ? '✓' : ''}</span>
        <div><p>${escapeHtml(a.text)}</p><small>${escapeHtml(a.owner)} · 截止 ${escapeHtml(formatDate(a.due))}</small></div>
      </li>`,
    )
    .join('')

  return `<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8"/>
<meta name="viewport" content="width=device-width, initial-scale=1"/>
<title>${escapeHtml(minutes.title)} · 会议纪要</title>
<style>
  :root { --ink:#0d1728; --muted:#6a778c; --line:#e5e9f0; --brand:#2b57e0; }
  * { box-sizing:border-box; }
  body { margin:0; background:#eef1f6; color:var(--ink); font-family:"Inter","Noto Sans SC","PingFang SC","Microsoft YaHei",sans-serif; line-height:1.75; }
  .sheet { max-width:960px; margin:40px auto; background:#fff; border-radius:20px; overflow:hidden; box-shadow:0 24px 60px -30px rgba(13,23,40,.35); }
  header { background:linear-gradient(135deg,#0b1424,#1b2c4d); color:#fff; padding:44px 52px 38px; }
  .kicker { font-size:11px; letter-spacing:.2em; color:#93a7cc; text-transform:uppercase; margin:0 0 14px; }
  h1 { font-size:30px; margin:0 0 16px; letter-spacing:-.02em; line-height:1.3; }
  .meta { display:flex; flex-wrap:wrap; gap:8px 18px; font-size:12.5px; color:#c4d1e8; }
  .wrap { padding:40px 52px 20px; }
  section { margin-bottom:32px; }
  h2 { font-size:15px; margin:0 0 14px; padding-left:12px; border-left:3px solid var(--brand); letter-spacing:.02em; }
  p { margin:0; font-size:13.5px; color:#34415a; }
  ul, ol { margin:0; padding-left:20px; font-size:13.5px; color:#34415a; }
  li { margin-bottom:8px; }
  .doc-actions { margin-bottom:36px; }
  .mindmap { border:1px solid var(--line); border-radius:16px; padding:8px; background:#fff; }
  .summary { background:#f6f8fb; border:1px solid var(--line); border-radius:14px; padding:20px 22px; font-size:14px; }
  footer { padding:18px 52px 36px; font-size:11.5px; color:#96a1b3; border-top:1px solid var(--line); display:flex; justify-content:space-between; }
  @media print { body { background:#fff; } .sheet { box-shadow:none; margin:0; max-width:none; border-radius:0; } }
</style>
</head>
<body>
<div class="sheet">
  <header>
    <p class="kicker">MEETING MINUTES · v${minutes.version}</p>
    <h1>${escapeHtml(minutes.title)}</h1>
    <div class="meta"><span>${escapeHtml(minutes.attendees.join('、'))}</span>${meta}</div>
  </header>
  <div class="wrap">
    ${section('会议摘要', `<div class="summary">${escapeHtml(minutes.summary)}</div>`)}
    ${section('核心议题', `<ol>${minutes.topics.map((t) => `<li>${escapeHtml(t)}</li>`).join('')}</ol>`)}
    ${section('关键决议', `<ul>${minutes.decisions.map((d) => `<li>${escapeHtml(d)}</li>`).join('')}</ul>`)}
    ${section('行动待办', `<ul class="actions" style="list-style:none;padding:0">${actions || '<li>暂无待办事项</li>'}</ul>`)}
    ${minutes.risks.length ? section('风险与待确认', `<ul>${minutes.risks.map((r) => `<li>${escapeHtml(r)}</li>`).join('')}</ul>`) : ''}
    ${section('会议思维导图', `<div class="mindmap">${svg}</div>`)}
  </div>
  <footer><span>合议 · 会议管理平台</span><span>生成于 ${escapeHtml(new Date(minutes.createdAt).toLocaleString('zh-CN'))}</span></footer>
</div>
<style>
  .action { display:flex; gap:12px; align-items:flex-start; padding:12px 14px; border:1px solid var(--line); border-radius:12px; margin-bottom:10px; background:#fff; }
  .action .box { width:18px;height:18px;border-radius:5px;border:1.5px solid #c9d2e0;display:flex;align-items:center;justify-content:center;font-size:11px;color:#fff;flex:none;margin-top:3px; }
  .action.done .box { background:#0b8f7e; border-color:#0b8f7e; }
  .action.done p { text-decoration:line-through; color:#96a1b3; }
  .action p { margin:0 0 2px; font-size:13px; }
  .action small { color:#6a778c; font-size:11.5px; }
</style>
</body>
</html>`
}

export function exportMinutesBundle(minutes: Minutes, meeting?: Meeting) {
  downloadFile(`${safeFileName(minutes.title)}-纪要归档.html`, buildMinutesBundle(minutes, meeting), 'text/html')
}
