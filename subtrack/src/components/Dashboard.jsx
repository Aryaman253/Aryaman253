import { useState } from 'react'
import { Archive, ChevronDown, CircleCheck, Flame, Plus, Wallet } from 'lucide-react'
import AlertsBanner from './AlertsBanner'
import Insights from './Insights'
import SubscriptionCard from './SubscriptionCard'
import { Logo } from './ui'
import { formatMoney, isHighSpend, monthlyCost, renewalStatus } from '../lib/subscriptions'

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 18) return 'Good afternoon'
  return 'Good evening'
}

function SpendHero({ active }) {
  const total = active.reduce((sum, s) => sum + monthlyCost(s), 0)
  const [dollars, cents] = formatMoney(total).split('.')
  const highCount = active.filter(isHighSpend).length
  const dueSoon = active.filter((s) => renewalStatus(s) !== 'ok').length

  return (
    <section className="relative overflow-hidden rounded-[2rem] bg-slate-900 p-6 text-white shadow-xl shadow-slate-900/20">
      <div className="pointer-events-none absolute -right-16 -top-20 size-56 rounded-full bg-emerald-500/30 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -left-10 size-48 rounded-full bg-teal-400/15 blur-3xl" />

      <div className="relative">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-300">Total monthly spend</p>
          {highCount > 0 ? (
            <span className="inline-flex items-center gap-1 rounded-full bg-red-500/15 px-2.5 py-1 text-[11px] font-semibold text-red-300 ring-1 ring-inset ring-red-400/30">
              <Flame className="size-3" strokeWidth={2.5} />
              {highCount} high-spend
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2.5 py-1 text-[11px] font-semibold text-emerald-300 ring-1 ring-inset ring-emerald-400/30">
              <CircleCheck className="size-3" strokeWidth={2.5} />
              Healthy
            </span>
          )}
        </div>

        <p className="tabular mt-2 text-5xl font-bold tracking-tight">
          {dollars}
          <span className="text-2xl font-semibold text-slate-400">.{cents}</span>
        </p>
        <p className="tabular mt-1 text-sm text-slate-400">≈ {formatMoney(total * 12)} per year</p>

        <div className="mt-6 grid grid-cols-3 divide-x divide-white/10 rounded-2xl bg-white/5 py-3 ring-1 ring-inset ring-white/10">
          <Stat label="Active" value={active.length} tone="text-emerald-300" />
          <Stat label="Due soon" value={dueSoon} tone={dueSoon ? 'text-amber-300' : 'text-white'} />
          <Stat label="High spend" value={highCount} tone={highCount ? 'text-red-300' : 'text-white'} />
        </div>
      </div>
    </section>
  )
}

function Stat({ label, value, tone }) {
  return (
    <div className="px-3 text-center">
      <p className={`tabular text-lg font-bold ${tone}`}>{value}</p>
      <p className="text-[11px] font-medium text-slate-400">{label}</p>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="rounded-3xl border-2 border-dashed border-slate-200 bg-white/60 px-6 py-10 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-2xl bg-emerald-50 text-emerald-600">
        <Wallet className="size-6" />
      </div>
      <p className="mt-3 font-semibold text-slate-900">No active subscriptions</p>
      <p className="mt-1 text-sm text-slate-500">Tap the + button to add your first one.</p>
    </div>
  )
}

export default function Dashboard({ subs, onOpen, onAdd }) {
  const [showCancelled, setShowCancelled] = useState(false)
  const active = subs
    .filter((s) => s.status !== 'cancelled')
    .sort((a, b) => a.nextRenewal.localeCompare(b.nextRenewal))
  const cancelled = subs.filter((s) => s.status === 'cancelled')

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })

  return (
    <div className="px-4 pb-32 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <header className="mb-5 flex items-center justify-between px-1">
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{today}</p>
          <h1 className="mt-0.5 text-2xl font-bold tracking-tight text-slate-900">{greeting()}</h1>
        </div>
        <div className="flex items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-3 shadow-sm ring-1 ring-slate-200/70">
          <Logo className="size-7" />
          <span className="text-sm font-bold tracking-tight">SubTrack</span>
        </div>
      </header>

      <div className="space-y-4">
        <SpendHero active={active} />
        <AlertsBanner subs={active} onOpen={onOpen} />
      </div>

      <section className="mt-7">
        <div className="mb-3 flex items-baseline justify-between px-1">
          <h2 className="text-lg font-bold tracking-tight text-slate-900">Subscriptions</h2>
          <span className="text-xs font-medium text-slate-400">Sorted by next renewal</span>
        </div>
        {active.length ? (
          <ul className="space-y-2.5">
            {active.map((sub) => (
              <li key={sub.id}>
                <SubscriptionCard sub={sub} onOpen={onOpen} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState />
        )}

        {cancelled.length > 0 && (
          <div className="mt-4">
            <button
              type="button"
              onClick={() => setShowCancelled((v) => !v)}
              aria-expanded={showCancelled}
              className="flex w-full items-center justify-between rounded-2xl px-3 py-2.5 text-sm font-semibold text-slate-500 transition hover:bg-slate-100 active:scale-[0.99]"
            >
              <span className="flex items-center gap-2">
                <Archive className="size-4" />
                Inactive · {cancelled.length}
              </span>
              <ChevronDown className={`size-4 transition-transform duration-200 ${showCancelled ? 'rotate-180' : ''}`} />
            </button>
            {showCancelled && (
              <ul className="mt-2 animate-fade-in space-y-2.5">
                {cancelled.map((sub) => (
                  <li key={sub.id}>
                    <SubscriptionCard sub={sub} onOpen={onOpen} />
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </section>

      <section className="mt-7">
        <h2 className="mb-3 px-1 text-lg font-bold tracking-tight text-slate-900">Insights</h2>
        <Insights subs={active} />
      </section>

      <div className="pointer-events-none fixed inset-x-0 bottom-0 z-30 mx-auto max-w-md">
        <button
          type="button"
          onClick={onAdd}
          aria-label="Add subscription"
          className="pointer-events-auto absolute bottom-[max(1.5rem,env(safe-area-inset-bottom))] right-5 grid size-14 place-items-center rounded-2xl bg-emerald-500 text-white shadow-lg shadow-emerald-600/30 ring-4 ring-slate-50 transition duration-150 hover:bg-emerald-600 active:scale-90"
        >
          <Plus className="size-6" strokeWidth={2.5} />
        </button>
      </div>
    </div>
  )
}
