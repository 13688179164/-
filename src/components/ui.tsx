import React, { useEffect } from 'react'
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react'
import { cn } from '../lib/utils'
import type { Person } from '../types'
import { useStore } from '../store'

const TONE_MAP: Record<string, string> = {
  brand: 'bg-[#e9eeff] text-[#2447c9]',
  teal: 'bg-[#e4f5f1] text-[#0b7a6b]',
  violet: 'bg-[#f0eafe] text-[#6b46d0]',
  amber: 'bg-[#fdf2dd] text-[#a06c0d]',
  rose: 'bg-[#fdecee] text-[#c0434f]',
  blue: 'bg-[#e7f0fe] text-[#2f66c9]',
  slate: 'bg-[#eef1f5] text-[#5b6b80]',
  green: 'bg-[#e6f6eb] text-[#2c8153]',
  orange: 'bg-[#fdf0e4] text-[#b96520]',
  cyan: 'bg-[#e3f6f8] text-[#0c7f8b]',
}

export function Avatar({
  person,
  size = 32,
  className,
  title,
}: {
  person?: Person
  size?: number
  className?: string
  title?: string
}) {
  if (!person) return null
  return (
    <span
      title={title ?? `${person.name} · ${person.role}`}
      className={cn(
        'inline-flex flex-none items-center justify-center rounded-full font-semibold select-none',
        TONE_MAP[person.tone] ?? TONE_MAP.slate,
        className,
      )}
      style={{ width: size, height: size, fontSize: Math.max(9, size * 0.33) }}
    >
      {person.name.slice(-2)}
    </span>
  )
}

export function AvatarGroup({
  people,
  max = 4,
  size = 26,
}: {
  people: Person[]
  max?: number
  size?: number
}) {
  const shown = people.slice(0, max)
  const rest = people.length - shown.length
  return (
    <div className="flex items-center">
      {shown.map((p, i) => (
        <span key={p.id} className={cn('rounded-full ring-2 ring-white', i > 0 && '-ml-2')}>
          <Avatar person={p} size={size} />
        </span>
      ))}
      {rest > 0 && (
        <span
          className="-ml-2 inline-flex items-center justify-center rounded-full bg-[#eef1f6] font-medium text-muted ring-2 ring-white"
          style={{ width: size, height: size, fontSize: 10 }}
        >
          +{rest}
        </span>
      )}
    </div>
  )
}

type BadgeTone = 'brand' | 'teal' | 'amber' | 'danger' | 'neutral' | 'dark' | 'violet' | 'rose' | 'blue'

const BADGE_MAP: Record<BadgeTone, string> = {
  brand: 'bg-brand-soft text-brand',
  teal: 'bg-teal-soft text-teal',
  amber: 'bg-amber-soft text-[#9a6a0e]',
  danger: 'bg-danger-soft text-danger',
  neutral: 'bg-[#eef1f6] text-[#5c6b81]',
  dark: 'bg-ink text-white',
  violet: 'bg-[#f1ecff] text-[#6b46d0]',
  rose: 'bg-[#fdecee] text-[#c0434f]',
  blue: 'bg-[#e7f0fe] text-[#2f66c9]',
}

export function Badge({
  tone = 'neutral',
  children,
  className,
}: {
  tone?: BadgeTone
  children: React.ReactNode
  className?: string
}) {
  return <span className={cn('chip', BADGE_MAP[tone], className)}>{children}</span>
}

export function Dot({ className }: { className?: string }) {
  return <span className={cn('h-1.5 w-1.5 flex-none rounded-full bg-current', className)} />
}

export function ProgressBar({
  value,
  segments,
  tone = 'brand',
  height = 9,
  className,
}: {
  value: number
  segments?: number
  tone?: 'brand' | 'teal' | 'amber'
  height?: number
  className?: string
}) {
  const fill = tone === 'teal' ? 'bg-teal' : tone === 'amber' ? 'bg-amber' : 'bg-brand'
  const v = Math.max(0, Math.min(100, value))
  return (
    <div
      className={cn('relative w-full overflow-hidden rounded-full bg-[#e9edf3]', className)}
      style={{ height }}
      role="progressbar"
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <div
        className={cn('h-full rounded-full transition-all duration-500 ease-out', fill)}
        style={{ width: `${v}%` }}
      />
      {segments && segments > 1
        ? Array.from({ length: segments - 1 }).map((_, i) => (
            <span
              key={i}
              className="absolute top-0 bottom-0 w-[3px] bg-white/90"
              style={{ left: `${((i + 1) / segments) * 100}%` }}
            />
          ))
        : null}
    </div>
  )
}

export function Switch({
  checked,
  onChange,
  disabled,
}: {
  checked: boolean
  onChange: (v: boolean) => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onChange(!checked)}
      className={cn(
        'relative inline-flex h-[22px] w-[38px] flex-none items-center rounded-full transition-colors duration-200',
        checked ? 'bg-brand' : 'bg-[#d7dee8]',
        disabled && 'opacity-50',
      )}
    >
      <span
        className={cn(
          'inline-block h-[16px] w-[16px] rounded-full bg-white shadow-sm transition-transform duration-200',
          checked ? 'translate-x-[19px]' : 'translate-x-[3px]',
        )}
      />
    </button>
  )
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  width = 'max-w-[620px]',
}: {
  open: boolean
  onClose: () => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  width?: string
}) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = prev
    }
  }, [open, onClose])

  if (!open) return null
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-[#0b1424]/45 backdrop-blur-[3px] animate-fade-in"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'relative flex max-h-[90vh] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-[0_32px_80px_-24px_rgba(13,23,40,.4)] animate-pop',
          width,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-line px-6 py-5">
          <div>
            <h3 className="text-[17px] font-semibold text-ink">{title}</h3>
            {description && <p className="mt-1 text-[12.5px] text-muted">{description}</p>}
          </div>
          <button
            onClick={onClose}
            className="grid h-8 w-8 flex-none place-items-center rounded-lg text-faint transition hover:bg-[#f1f4f8] hover:text-ink"
            aria-label="关闭"
          >
            <X size={17} />
          </button>
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto px-6 py-5">{children}</div>
        {footer && <div className="border-t border-line bg-[#fbfcfe] px-6 py-4">{footer}</div>}
      </div>
    </div>
  )
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmText = '确认删除',
  onConfirm,
  onClose,
}: {
  open: boolean
  title: string
  description: string
  confirmText?: string
  onConfirm: () => void
  onClose: () => void
}) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      width="max-w-[440px]"
      footer={
        <div className="flex justify-end gap-2">
          <button className="btn btn-outline" onClick={onClose}>
            取消
          </button>
          <button
            className="btn btn-danger"
            onClick={() => {
              onConfirm()
              onClose()
            }}
          >
            {confirmText}
          </button>
        </div>
      }
    >
      <p className="text-[13.5px] leading-relaxed text-ink-2">{description}</p>
    </Modal>
  )
}

export function Tabs({
  items,
  value,
  onChange,
  className,
}: {
  items: { key: string; label: string; count?: number }[]
  value: string
  onChange: (key: string) => void
  className?: string
}) {
  return (
    <div className={cn('inline-flex rounded-xl bg-[#eaeef4] p-1', className)}>
      {items.map((item) => (
        <button
          key={item.key}
          onClick={() => onChange(item.key)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-[12.5px] font-medium transition-all',
            value === item.key
              ? 'bg-white text-ink shadow-[0_1px_3px_rgba(13,23,40,.08)]'
              : 'text-muted hover:text-ink',
          )}
        >
          {item.label}
          {typeof item.count === 'number' && (
            <span
              className={cn(
                'rounded-full px-1.5 py-px text-[10.5px] num',
                value === item.key ? 'bg-brand-soft text-brand' : 'bg-[#dfe5ee] text-muted',
              )}
            >
              {item.count}
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode
  title: string
  description?: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#d9e0ea] bg-white/60 px-6 py-14 text-center">
      <div className="mb-4 grid h-12 w-12 place-items-center rounded-2xl bg-[#f2f5f9] text-faint">{icon}</div>
      <p className="text-[14.5px] font-medium text-ink">{title}</p>
      {description && <p className="mt-1.5 max-w-[320px] text-[12.5px] leading-relaxed text-muted">{description}</p>}
      {action && <div className="mt-5">{action}</div>}
    </div>
  )
}

export function PageHeader({
  kicker,
  title,
  description,
  actions,
}: {
  kicker: string
  title: string
  description?: string
  actions?: React.ReactNode
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4 animate-fade-up">
      <div>
        <p className="kicker mb-2">{kicker}</p>
        <h1 className="text-[28px] leading-none font-semibold text-ink">{title}</h1>
        {description && <p className="mt-2.5 text-[13px] text-muted">{description}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  )
}

export function ToastHost() {
  const { toasts, dismissToast } = useStore()
  const icon = {
    success: <CheckCircle2 size={16} className="text-teal" />,
    info: <Info size={16} className="text-brand" />,
    warn: <AlertTriangle size={16} className="text-amber" />,
  }
  return (
    <div className="pointer-events-none fixed right-5 bottom-5 z-[70] flex w-[330px] flex-col gap-2.5">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="pointer-events-auto flex items-start gap-2.5 rounded-xl border border-line bg-white/95 px-4 py-3 shadow-[0_12px_32px_-10px_rgba(13,23,40,.25)] backdrop-blur animate-slide-in"
        >
          <span className="mt-0.5">{icon[t.tone]}</span>
          <p className="flex-1 text-[12.5px] leading-relaxed text-ink-2">{t.message}</p>
          <button onClick={() => dismissToast(t.id)} className="text-faint transition hover:text-ink" aria-label="关闭提示">
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}

export function IconButton({
  label,
  onClick,
  children,
  danger,
}: {
  label: string
  onClick: () => void
  children: React.ReactNode
  danger?: boolean
}) {
  return (
    <button
      onClick={onClick}
      title={label}
      aria-label={label}
      className={cn(
        'grid h-8 w-8 place-items-center rounded-lg text-faint transition hover:bg-[#f2f5f9]',
        danger ? 'hover:text-danger' : 'hover:text-ink',
      )}
    >
      {children}
    </button>
  )
}
