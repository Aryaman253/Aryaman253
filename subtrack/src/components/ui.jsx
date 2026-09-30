import { ChevronLeft } from 'lucide-react'
import { CATEGORIES } from '../lib/subscriptions'

export function ServiceTile({ sub, size = 'md', muted = false }) {
  const cat = CATEGORIES[sub.category] ?? CATEGORIES.other
  const sizes = {
    sm: 'size-9 rounded-xl text-sm',
    md: 'size-12 rounded-2xl text-lg',
    lg: 'size-20 rounded-[1.75rem] text-3xl',
  }
  return (
    <div
      className={`grid shrink-0 place-items-center font-bold ${sizes[size]} ${
        muted ? 'bg-slate-200 text-slate-500' : cat.tile
      }`}
    >
      {sub.name.trim().charAt(0).toUpperCase() || '?'}
    </div>
  )
}

export function CategoryChip({ category, className = '' }) {
  const cat = CATEGORIES[category] ?? CATEGORIES.other
  const Icon = cat.icon
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-semibold ring-1 ring-inset ${cat.chip} ${className}`}
    >
      <Icon className="size-3" strokeWidth={2.5} />
      {cat.label}
    </span>
  )
}

export function ScreenHeader({ title, onBack, right }) {
  return (
    <header className="sticky top-0 z-20 flex items-center gap-2 bg-slate-50/85 px-4 pb-3 pt-[max(1rem,env(safe-area-inset-top))] backdrop-blur-md">
      <button
        type="button"
        onClick={onBack}
        aria-label="Back"
        className="grid size-10 place-items-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-200/70 transition active:scale-90 hover:bg-slate-100"
      >
        <ChevronLeft className="size-5" />
      </button>
      <h1 className="flex-1 truncate text-center text-base font-semibold text-slate-900">{title}</h1>
      <div className="flex size-10 items-center justify-center">{right}</div>
    </header>
  )
}

export function Logo({ className = '' }) {
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id="subtrack-logo" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#10b981" />
          <stop offset="1" stopColor="#047857" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="url(#subtrack-logo)" />
      <path d="M20 34l8 8 16-18" fill="none" stroke="#fff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
