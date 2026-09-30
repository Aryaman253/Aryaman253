import { BellRing, ChevronRight, TriangleAlert } from 'lucide-react'
import { ALERT_WINDOW_DAYS, daysUntil, formatMoney, relativeRenewal } from '../lib/subscriptions'
import { ServiceTile } from './ui'

const TONES = {
  amber: {
    box: 'bg-amber-50 ring-amber-200/80',
    icon: 'bg-amber-400 text-white',
    title: 'text-amber-900',
    sub: 'text-amber-800/80',
    row: 'bg-white/70 hover:bg-white',
    meta: 'text-amber-700',
    Icon: BellRing,
  },
  red: {
    box: 'bg-red-50 ring-red-200/80',
    icon: 'bg-red-500 text-white',
    title: 'text-red-900',
    sub: 'text-red-800/80',
    row: 'bg-white/70 hover:bg-white',
    meta: 'text-red-700',
    Icon: TriangleAlert,
  },
}

function Banner({ tone, title, subtitle, items, onOpen }) {
  const t = TONES[tone]
  return (
    <section className={`rounded-3xl p-4 ring-1 ring-inset ${t.box}`} aria-label={title}>
      <div className="flex items-center gap-3">
        <div className={`grid size-9 shrink-0 place-items-center rounded-xl ${t.icon}`}>
          <t.Icon className="size-[18px]" strokeWidth={2.25} />
        </div>
        <div className="min-w-0">
          <p className={`text-sm font-semibold ${t.title}`}>{title}</p>
          <p className={`text-xs ${t.sub}`}>{subtitle}</p>
        </div>
      </div>
      <ul className="mt-3 space-y-1.5">
        {items.map((sub) => (
          <li key={sub.id}>
            <button
              type="button"
              onClick={() => onOpen(sub.id)}
              className={`flex w-full items-center gap-3 rounded-2xl px-3 py-2 text-left transition active:scale-[0.98] ${t.row}`}
            >
              <ServiceTile sub={sub} size="sm" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-slate-900">{sub.name}</p>
                <p className={`text-xs font-medium ${t.meta}`}>{relativeRenewal(sub.nextRenewal)}</p>
              </div>
              <p className="tabular text-sm font-semibold text-slate-900">{formatMoney(sub.cost)}</p>
              <ChevronRight className="size-4 text-slate-400" />
            </button>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default function AlertsBanner({ subs, onOpen }) {
  const byDate = [...subs].sort((a, b) => a.nextRenewal.localeCompare(b.nextRenewal))
  const overdue = byDate.filter((s) => daysUntil(s.nextRenewal) < 0)
  const upcoming = byDate.filter((s) => {
    const d = daysUntil(s.nextRenewal)
    return d >= 0 && d <= ALERT_WINDOW_DAYS
  })

  if (!overdue.length && !upcoming.length) return null

  const total = upcoming.reduce((sum, s) => sum + s.cost, 0)

  return (
    <div className="space-y-3">
      {overdue.length > 0 && (
        <Banner
          tone="red"
          title={`${overdue.length} renewal${overdue.length > 1 ? 's' : ''} overdue`}
          subtitle="Update the renewal date or cancel if you no longer use it."
          items={overdue}
          onOpen={onOpen}
        />
      )}
      {upcoming.length > 0 && (
        <Banner
          tone="amber"
          title={`${upcoming.length} renewal${upcoming.length > 1 ? 's' : ''} in the next ${ALERT_WINDOW_DAYS} days`}
          subtitle={`${formatMoney(total)} will be charged soon`}
          items={upcoming}
          onOpen={onOpen}
        />
      )}
    </div>
  )
}
