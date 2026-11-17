import type { Minutes } from '../types'
import { escapeHtml } from './utils'

interface Branch {
  label: string
  tone: 'brand' | 'teal' | 'amber' | 'rose'
  items: string[]
}

const TONES = {
  brand: { hex: '#2b57e0', fill: '#eef2ff', text: '#1d3fb0' },
  teal: { hex: '#0b8f7e', fill: '#e6f6f3', text: '#086b5e' },
  amber: { hex: '#c98a14', fill: '#fdf4e3', text: '#946508' },
  rose: { hex: '#cf4d5a', fill: '#fdeeee', text: '#b03a46' },
}

function buildBranches(minutes: Minutes): Branch[] {
  return [
    { label: '核心议题', tone: 'brand', items: minutes.topics },
    { label: '关键决议', tone: 'teal', items: minutes.decisions.slice(0, 4) },
    {
      label: '行动待办',
      tone: 'amber',
      items: minutes.actions.slice(0, 5).map((a) => `${a.text} · ${a.owner}`),
    },
    { label: '风险关注', tone: 'rose', items: minutes.risks },
  ].filter((b) => b.items.length > 0) as Branch[]
}

function textWidth(ch: string, size: number) {
  return /[\x00-\xff]/.test(ch) ? size * 0.56 : size
}

function wrapText(text: string, maxWidth: number, size: number, maxLines = 3) {
  const lines: string[] = []
  const chars = Array.from(text)
  let cur = ''
  let width = 0
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i]
    const w = textWidth(ch, size)
    if (width + w > maxWidth && cur) {
      if (lines.length === maxLines - 1) {
        let last = ''
        let lastW = 0
        for (let j = i; j < chars.length; j++) {
          const cw = textWidth(chars[j], size)
          if (lastW + cw > maxWidth - size) break
          last += chars[j]
          lastW += cw
        }
        lines.push(`${last}…`)
        return lines
      }
      lines.push(cur)
      cur = ch
      width = w
    } else {
      cur += ch
      width += w
    }
  }
  if (cur) lines.push(cur)
  return lines
}

export function renderMindMapSvg(minutes: Minutes) {
  const branches = buildBranches(minutes)
  const W = 1080
  const leafW = 552
  const leafX = 486
  const branchW = 176
  const branchX = 270
  const rootW = 202
  const rootX = 28
  const fontLeaf = 12.5
  const leafMaxWidth = leafW - 52
  const gapLeaf = 13
  const gapGroup = 30

  const prepared = branches.map((b) => {
    const items = b.items
      .map((item) => {
        const lines = wrapText(item, leafMaxWidth, fontLeaf)
        return { text: item, lines, h: Math.max(42, lines.length * 18 + 22) }
      })
      .slice(0, 5)
    const height = items.reduce((acc, it) => acc + it.h, 0) + Math.max(0, items.length - 1) * gapLeaf
    return { ...b, items, height }
  })

  const total = prepared.reduce((acc, p) => acc + p.height, 0) + Math.max(0, prepared.length - 1) * gapGroup
  const H = Math.max(720, total + 110)
  const rootCY = H / 2
  let cursor = (H - total) / 2

  const parts: string[] = []

  parts.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="url(#mmDots)"/>`)
  parts.push(`<rect x="0" y="0" width="${W}" height="${H}" fill="#ffffff" fill-opacity="0.55"/>`)

  prepared.forEach((branch) => {
    const groupTop = cursor
    const branchCY = groupTop + branch.height / 2
    const tone = TONES[branch.tone]

    // root -> branch link
    const rx = rootX + rootW
    const bx = branchX
    const midX = (rx + bx) / 2
    parts.push(
      `<path d="M ${rx} ${rootCY} C ${midX} ${rootCY}, ${midX} ${branchCY}, ${bx - 8} ${branchCY}" fill="none" stroke="${tone.hex}" stroke-width="1.6" stroke-opacity="0.55"/>`,
    )

    let leafY = groupTop
    branch.items.forEach((item) => {
      const leafCY = leafY + item.h / 2
      const startX = branchX + branchW
      const endX = leafX
      const mid = (startX + endX) / 2
      parts.push(
        `<path d="M ${startX} ${branchCY} C ${mid} ${branchCY}, ${mid} ${leafCY}, ${endX - 8} ${leafCY}" fill="none" stroke="${tone.hex}" stroke-width="1.3" stroke-opacity="0.35"/>`,
      )

      parts.push(`<g class="mm-leaf">`)
      parts.push(
        `<rect x="${leafX}" y="${leafY}" width="${leafW}" height="${item.h}" rx="11" fill="#ffffff" stroke="#e5e9f0" stroke-width="1"/>`,
      )
      parts.push(`<rect x="${leafX}" y="${leafY}" width="3.5" height="${item.h}" rx="2" fill="${tone.hex}"/>`)
      item.lines.forEach((line, i) => {
        const lineCount = item.lines.length
        const startY = leafY + item.h / 2 - ((lineCount - 1) * 18) / 2 + i * 18
        parts.push(
          `<text x="${leafX + 22}" y="${startY}" dominant-baseline="middle" font-size="${fontLeaf}" fill="#34415a" font-family="Inter, 'Noto Sans SC', sans-serif">${escapeHtml(line)}</text>`,
        )
      })
      parts.push(`</g>`)
      leafY += item.h + gapLeaf
    })

    // branch node
    parts.push(
      `<g class="mm-branch"><rect x="${branchX}" y="${branchCY - 21}" width="${branchW}" height="42" rx="21" fill="${tone.fill}" stroke="${tone.hex}" stroke-opacity="0.28"/></g>`,
    )
    parts.push(
      `<text x="${branchX + branchW / 2}" y="${branchCY}" text-anchor="middle" dominant-baseline="middle" font-size="13" font-weight="600" fill="${tone.text}" font-family="Inter, 'Noto Sans SC', sans-serif">${escapeHtml(branch.label)}</text>`,
    )

    cursor += branch.height + gapGroup
  })

  // root node
  const rootLines = wrapText(minutes.title, rootW - 36, 16, 2)
  const rootH = 92
  parts.push(`<g filter="url(#mmShadow)">`)
  parts.push(
    `<rect x="${rootX}" y="${rootCY - rootH / 2}" width="${rootW}" height="${rootH}" rx="18" fill="url(#mmRoot)"/>`,
  )
  parts.push(`<circle cx="${rootX + 22}" cy="${rootCY - rootH / 2 + 22}" r="4" fill="#7fe7d3"/>`)
  parts.push(
    `<text x="${rootX + 34}" y="${rootCY - rootH / 2 + 24}" font-size="9.5" letter-spacing="1.4" fill="#9fb2d8" font-family="Inter, sans-serif">MEETING NOTES</text>`,
  )
  rootLines.forEach((line, i) => {
    const startY = rootCY + 2 - ((rootLines.length - 1) * 22) / 2 + i * 22
    parts.push(
      `<text x="${rootX + 20}" y="${startY}" font-size="16" font-weight="600" fill="#ffffff" font-family="Inter, 'Noto Sans SC', sans-serif">${escapeHtml(line)}</text>`,
    )
  })
  parts.push(`</g>`)

  const stamp = new Date(minutes.createdAt)
  parts.push(
    `<text x="${W - 34}" y="${H - 22}" text-anchor="end" font-size="10.5" fill="#aab4c5" font-family="Inter, 'Noto Sans SC', sans-serif">合议 · 智能会议纪要 · ${stamp.getFullYear()}/${String(stamp.getMonth() + 1).padStart(2, '0')}/${String(stamp.getDate()).padStart(2, '0')}</text>`,
  )

  return `<svg id="mindmap-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="100%" role="img" aria-label="${escapeHtml(minutes.title)} 思维导图">
  <defs>
    <linearGradient id="mmRoot" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1a2c4f"/>
      <stop offset="100%" stop-color="#0b1424"/>
    </linearGradient>
    <filter id="mmShadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="10" flood-color="#0d1728" flood-opacity="0.22"/>
    </filter>
    <pattern id="mmDots" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="1.2" cy="1.2" r="1.1" fill="#e1e7f0"/>
    </pattern>
    <style>
      .mm-leaf rect, .mm-branch rect { transition: all .2s ease; }
      .mm-leaf:hover rect { filter: drop-shadow(0 4px 10px rgba(13,23,40,.10)); }
    </style>
  </defs>
  ${parts.join('\n  ')}
</svg>`
}
