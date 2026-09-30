import { ChartPie, Flame, Sparkles } from 'lucide-react'
import { CATEGORIES, formatMoney, isHighSpend, monthlyCost } from '../lib/subscriptions'

export default function Insights({ subs }) {
  const total = subs.reduce((sum, s) => sum + monthlyCost(s), 0)
  if (!subs.length || total <= 0) return null

  const rows = Object.entries(CATEGORIES)
    .map(([key, cat]) => {
      const items = subs.filter((s) => s.category === key)
      const amount = items.reduce((sum, s) => sum + monthlyCost(s), 0)
      return { key, cat, amount, count: items.length, share: amount / total }
    })
    .filter((r) => r.amount > 0)
    .sort((a, b) => b.amount - a.amount)

  const top = subs.reduce((max, s) => (monthlyCost(s) > monthlyCost(max) ? s : max), subs[0])
  const topShare = Math.round((monthlyCost(top) / total) * 100)
  const topHigh = isHighSpend(top)

  return (
    <section className="rounded-3xl bg-white p-5 shadow-[0_1px_2px_rgba(15,23,42,0.04),0_4px_16px_-6px_rgba(15,23,42,0.08)] ring-1 ring-slate-200/60">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ChartPie className="size-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-900">Spending by category</h2>
        </div>
        <span className="tabular text-xs font-medium text-slate-400">{formatMoney(total)}/mo</span>
      </div>

      <div className="mt-4 flex h-3 w-full gap-0.5 overflow-hidden rounded-full bg-slate-100">
        {rows.map((r) => (
          <div
            key={r.key}
            className={`h-full ${r.cat.bar} first:rounded-l-full last:rounded-r-full transition-[width] duration-500`}
            style={{ width: `${r.share * 100}%` }}
            title={`${r.cat.label}: ${formatMoney(r.amount)}`}
          />
        ))}
      </div>

      <ul className="mt-5 space-y-4">
        {rows.map((r) => {
          const Icon = r.cat.icon
          return (
            <li key={r.key}>
              <div className="flex items-center gap-3">
                <div className={`grid size-8 shrink-0 place-items-center rounded-xl ${r.cat.tile}`}>
                  <Icon className="size-4" strokeWidth={2.25} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <p className="text-sm font-medium text-slate-800">
                      {r.cat.label}
                      <span className="ml-1.5 text-xs font-normal text-slate-400">
                        {r.count} sub{r.count > 1 ? 's' : ''}
                      </span>
                    </p>
                    <p className="tabular text-sm font-semibold text-slate-900">
                      {formatMoney(r.amount)}
                      <span className="ml-1.5 text-xs font-medium text-slate-400">{Math.round(r.share * 100)}%</span>
                    </p>
                  </div>
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
                    <div
                      className={`h-full rounded-full ${r.cat.bar} transition-[width] duration-500`}
                      style={{ width: `${r.share * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </ul>

      <div
        className={`mt-5 flex items-start gap-2.5 rounded-2xl p-3 text-xs leading-relaxed ${
          topHigh ? 'bg-red-50 text-red-800' : 'bg-emerald-50 text-emerald-800'
        }`}
      >
        {topHigh ? (
          <Flame className="mt-px size-4 shrink-0 text-red-500" />
        ) : (
          <Sparkles className="mt-px size-4 shrink-0 text-emerald-500" />
        )}
        <p>
          <span className="font-semibold">{top.name}</span> is your biggest expense at {topShare}% of monthly
          spend{topHigh ? ' — worth checking you still use it.' : '. Your spending looks well balanced.'}
        </p>
      </div>
    </section>
  )
}
