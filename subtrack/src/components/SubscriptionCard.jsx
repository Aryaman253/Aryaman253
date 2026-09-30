import { Flame } from 'lucide-react'
import {
  STATUS_STYLES,
  daysUntil,
  formatDate,
  formatMoney,
  isHighSpend,
  monthlyCost,
  renewalStatus,
} from '../lib/subscriptions'
import { CategoryChip, ServiceTile } from './ui'

function renewalLabel(sub) {
  const days = daysUntil(sub.nextRenewal)
  if (days < 0) return 'Overdue'
  if (days === 0) return 'Today'
  if (days === 1) return 'Tomorrow'
  if (days <= 3) return `In ${days} days`
  return formatDate(sub.nextRenewal)
}

export default function SubscriptionCard({ sub, onOpen }) {
  const cancelled = sub.status === 'cancelled'
  const status = renewalStatus(sub)
  const high = !cancelled && isHighSpend(sub)
  const style = STATUS_STYLES[status]

  return (
    <button
      type="button"
      onClick={() => onOpen(sub.id)}
      className={`flex w-full items-center gap-3 rounded-3xl bg-white p-4 text-left shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_16px_-6px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/60 transition duration-150 hover:shadow-md hover:ring-slate-300/70 active:scale-[0.98] ${
        cancelled ? 'opacity-70' : ''
      }`}
    >
      <ServiceTile sub={sub} muted={cancelled} />

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className={`truncate font-semibold ${cancelled ? 'text-slate-500' : 'text-slate-900'}`}>{sub.name}</p>
          <p
            className={`tabular shrink-0 font-semibold ${
              cancelled ? 'text-slate-400 line-through' : high ? 'text-red-600' : 'text-slate-900'
            }`}
          >
            {formatMoney(monthlyCost(sub))}
            <span className="ml-0.5 text-xs font-medium text-slate-400">/mo</span>
          </p>
        </div>

        <div className="mt-1.5 flex items-center justify-between gap-2">
          <CategoryChip category={sub.category} />
          {cancelled ? (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-500">
              Cancelled
            </span>
          ) : (
            <span className="flex items-center gap-1.5">
              {high && (
                <span
                  className="grid size-5 place-items-center rounded-full bg-red-50 text-red-600"
                  title="High spend"
                  aria-label="High spend"
                >
                  <Flame className="size-3" strokeWidth={2.5} />
                </span>
              )}
              <span
                className={`tabular inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${style.pill}`}
              >
                <span className={`size-1.5 rounded-full ${style.dot}`} />
                {renewalLabel(sub)}
              </span>
            </span>
          )}
        </div>
      </div>
    </button>
  )
}
