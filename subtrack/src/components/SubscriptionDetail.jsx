import { useState } from 'react'
import { Ban, CalendarClock, CalendarDays, Pencil, Repeat, RotateCcw, Trash2, TrendingUp } from 'lucide-react'
import {
  CYCLES,
  STATUS_STYLES,
  formatDate,
  formatMoney,
  isHighSpend,
  monthlyCost,
  relativeRenewal,
  renewalStatus,
} from '../lib/subscriptions'
import { CategoryChip, ScreenHeader, ServiceTile } from './ui'

function InfoRow({ icon: Icon, label, value, sub }) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-slate-100 text-slate-500">
        <Icon className="size-[18px]" />
      </div>
      <p className="flex-1 text-sm text-slate-500">{label}</p>
      <div className="text-right">
        <p className="tabular text-sm font-semibold text-slate-900">{value}</p>
        {sub && <p className="text-xs text-slate-500">{sub}</p>}
      </div>
    </div>
  )
}

function ConfirmSheet({ title, body, confirmLabel, tone, onConfirm, onClose }) {
  const btn = tone === 'danger' ? 'bg-red-500 hover:bg-red-600 shadow-red-600/25' : 'bg-amber-500 hover:bg-amber-600 shadow-amber-600/25'
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center" role="dialog" aria-modal="true" aria-label={title}>
      <div className="absolute inset-0 animate-fade-in bg-slate-900/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-md animate-sheet-up rounded-t-[2rem] bg-white px-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] pt-3 shadow-2xl">
        <div className="mx-auto mb-5 h-1.5 w-10 rounded-full bg-slate-200" />
        <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{body}</p>
        <div className="mt-6 space-y-2">
          <button
            type="button"
            onClick={onConfirm}
            className={`w-full rounded-2xl py-3.5 font-semibold text-white shadow-lg transition active:scale-[0.98] ${btn}`}
          >
            {confirmLabel}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full rounded-2xl py-3.5 font-semibold text-slate-600 transition hover:bg-slate-100 active:scale-[0.98]"
          >
            Keep it
          </button>
        </div>
      </div>
    </div>
  )
}

export default function SubscriptionDetail({ sub, onBack, onEdit, onCancelSub, onReactivate, onDelete }) {
  const [confirm, setConfirm] = useState(null)
  const cancelled = sub.status === 'cancelled'
  const status = renewalStatus(sub)
  const high = isHighSpend(sub)
  const perMonth = monthlyCost(sub)
  const cycle = CYCLES[sub.cycle] ?? CYCLES.monthly

  const badge = cancelled
    ? { text: 'Cancelled', cls: 'bg-slate-100 text-slate-500', dot: 'bg-slate-400' }
    : { text: relativeRenewal(sub.nextRenewal), cls: STATUS_STYLES[status].pill, dot: STATUS_STYLES[status].dot }

  return (
    <div className="pb-10">
      <ScreenHeader
        title="Subscription"
        onBack={onBack}
        right={
          <button
            type="button"
            onClick={onEdit}
            aria-label="Edit subscription"
            className="grid size-10 place-items-center rounded-full bg-white text-slate-700 shadow-sm ring-1 ring-slate-200/70 transition hover:bg-slate-100 active:scale-90"
          >
            <Pencil className="size-4" />
          </button>
        }
      />

      <div className="px-4">
        <section className="flex flex-col items-center pb-2 pt-4 text-center">
          <ServiceTile sub={sub} size="lg" muted={cancelled} />
          <h2 className="mt-4 text-2xl font-bold tracking-tight text-slate-900">{sub.name}</h2>
          <div className="mt-2 flex items-center gap-2">
            <CategoryChip category={sub.category} />
            <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[11px] font-semibold ${badge.cls}`}>
              <span className={`size-1.5 rounded-full ${badge.dot}`} />
              {badge.text}
            </span>
          </div>
        </section>

        <section
          className={`mt-5 rounded-3xl p-5 text-center ring-1 ring-inset ${
            cancelled
              ? 'bg-slate-100 ring-slate-200'
              : high
                ? 'bg-red-50 ring-red-200/80'
                : 'bg-emerald-50 ring-emerald-200/80'
          }`}
        >
          <p className={`text-xs font-semibold uppercase tracking-wider ${cancelled ? 'text-slate-500' : high ? 'text-red-700' : 'text-emerald-700'}`}>
            {cancelled ? 'You’re saving' : high ? 'High monthly spend' : 'Monthly cost'}
          </p>
          <p className={`tabular mt-1 text-4xl font-bold tracking-tight ${cancelled ? 'text-slate-700' : high ? 'text-red-700' : 'text-slate-900'}`}>
            {formatMoney(perMonth)}
            <span className="ml-1 text-base font-semibold text-slate-400">/mo</span>
          </p>
          {sub.cycle !== 'monthly' && (
            <p className="tabular mt-1 text-sm text-slate-500">
              Billed {formatMoney(sub.cost)} {cycle.label.toLowerCase()}
            </p>
          )}
        </section>

        <section className="mt-4 divide-y divide-slate-100 rounded-3xl bg-white shadow-sm ring-1 ring-slate-200/60">
          <InfoRow icon={Repeat} label="Billing cycle" value={cycle.label} sub={`${formatMoney(sub.cost)} / ${cycle.short}`} />
          <InfoRow
            icon={CalendarClock}
            label="Next renewal"
            value={formatDate(sub.nextRenewal, { month: 'short', day: 'numeric', year: 'numeric' })}
            sub={cancelled ? 'Won’t renew' : relativeRenewal(sub.nextRenewal)}
          />
          <InfoRow icon={TrendingUp} label="Yearly cost" value={formatMoney(perMonth * 12)} />
          <InfoRow
            icon={CalendarDays}
            label="Tracking since"
            value={new Date(sub.createdAt ?? Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          />
        </section>

        <section className="mt-6 space-y-2.5">
          <button
            type="button"
            onClick={onEdit}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-slate-900 py-3.5 font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800 active:scale-[0.98]"
          >
            <Pencil className="size-4" />
            Edit subscription
          </button>
          {cancelled ? (
            <button
              type="button"
              onClick={onReactivate}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-50 py-3.5 font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-200 transition hover:bg-emerald-100 active:scale-[0.98]"
            >
              <RotateCcw className="size-4" />
              Reactivate
            </button>
          ) : (
            <button
              type="button"
              onClick={() => setConfirm('cancel')}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-amber-50 py-3.5 font-semibold text-amber-700 ring-1 ring-inset ring-amber-200 transition hover:bg-amber-100 active:scale-[0.98]"
            >
              <Ban className="size-4" />
              Mark as cancelled
            </button>
          )}
          <button
            type="button"
            onClick={() => setConfirm('delete')}
            className="flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 font-semibold text-red-600 transition hover:bg-red-50 active:scale-[0.98]"
          >
            <Trash2 className="size-4" />
            Delete
          </button>
        </section>
      </div>

      {confirm === 'cancel' && (
        <ConfirmSheet
          title={`Cancel ${sub.name}?`}
          body={`It will move to your inactive list and stop counting toward your ${formatMoney(perMonth)}/mo spend. You can reactivate it any time.`}
          confirmLabel="Mark as cancelled"
          tone="warning"
          onConfirm={onCancelSub}
          onClose={() => setConfirm(null)}
        />
      )}
      {confirm === 'delete' && (
        <ConfirmSheet
          title={`Delete ${sub.name}?`}
          body="This permanently removes it from SubTrack. If you just stopped paying for it, mark it as cancelled instead to keep a record."
          confirmLabel="Delete permanently"
          tone="danger"
          onConfirm={onDelete}
          onClose={() => setConfirm(null)}
        />
      )}
    </div>
  )
}
