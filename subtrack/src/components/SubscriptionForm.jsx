import { useState } from 'react'
import { Check } from 'lucide-react'
import { CATEGORIES, CYCLES, daysFromToday, formatMoney, monthlyCost } from '../lib/subscriptions'
import { ScreenHeader } from './ui'

const inputClass =
  'w-full rounded-2xl border-0 bg-white px-4 py-3.5 text-base text-slate-900 shadow-sm ring-1 ring-inset ring-slate-200 placeholder:text-slate-400 transition focus:outline-none focus:ring-2 focus:ring-emerald-500'

function Field({ label, error, children, hint }) {
  return (
    <label className="block">
      <span className="mb-1.5 block px-1 text-sm font-semibold text-slate-700">{label}</span>
      {children}
      {error ? (
        <span className="mt-1.5 block px-1 text-xs font-medium text-red-600">{error}</span>
      ) : (
        hint && <span className="mt-1.5 block px-1 text-xs text-slate-500">{hint}</span>
      )}
    </label>
  )
}

export default function SubscriptionForm({ initial, onSave, onCancel }) {
  const editing = Boolean(initial)
  const [form, setForm] = useState(() => ({
    name: initial?.name ?? '',
    cost: initial ? String(initial.cost) : '',
    cycle: initial?.cycle ?? 'monthly',
    nextRenewal: initial?.nextRenewal ?? daysFromToday(30),
    category: initial?.category ?? 'entertainment',
  }))
  const [submitted, setSubmitted] = useState(false)

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target?.value ?? e }))

  const cost = parseFloat(form.cost)
  const errors = {
    name: !form.name.trim() ? 'Give your subscription a name' : null,
    cost: !(cost > 0) ? 'Enter a cost greater than ₹0' : null,
    nextRenewal: !form.nextRenewal ? 'Pick the next renewal date' : null,
  }
  const valid = !Object.values(errors).some(Boolean)
  const shown = submitted ? errors : {}

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    if (!valid) return
    onSave({
      name: form.name.trim(),
      cost: Math.round(cost * 100) / 100,
      cycle: form.cycle,
      nextRenewal: form.nextRenewal,
      category: form.category,
    })
  }

  const perMonth = cost > 0 && form.cycle !== 'monthly' ? monthlyCost({ cost, cycle: form.cycle }) : null

  return (
    <form onSubmit={handleSubmit} noValidate className="flex min-h-dvh flex-col">
      <ScreenHeader title={editing ? 'Edit subscription' : 'Add subscription'} onBack={onCancel} />

      <div className="flex-1 space-y-5 px-4 pb-32 pt-2">
        <Field label="Service name" error={shown.name}>
          <input
            className={inputClass}
            placeholder="e.g. Netflix"
            value={form.name}
            onChange={set('name')}
            autoFocus={!editing}
            maxLength={40}
            autoComplete="off"
          />
        </Field>

        <Field
          label="Cost"
          error={shown.cost}
          hint={perMonth ? `≈ ${formatMoney(perMonth)} per month` : 'Amount charged each billing cycle'}
        >
          <div className="relative">
            <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-base font-semibold text-slate-400">
              ₹
            </span>
            <input
              className={`${inputClass} tabular pl-8 font-semibold`}
              placeholder="0"
              inputMode="decimal"
              type="number"
              step="0.01"
              min="0"
              value={form.cost}
              onChange={set('cost')}
            />
          </div>
        </Field>

        <div>
          <span className="mb-1.5 block px-1 text-sm font-semibold text-slate-700">Billing cycle</span>
          <div className="grid grid-cols-3 gap-1 rounded-2xl bg-slate-200/70 p-1" role="radiogroup">
            {Object.entries(CYCLES).map(([key, c]) => {
              const on = form.cycle === key
              return (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => set('cycle')(key)}
                  className={`rounded-xl py-2.5 text-sm font-semibold transition ${
                    on ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                  }`}
                >
                  {c.label}
                </button>
              )
            })}
          </div>
        </div>

        <Field label="Next renewal date" error={shown.nextRenewal}>
          <input type="date" className={inputClass} value={form.nextRenewal} onChange={set('nextRenewal')} />
        </Field>

        <div>
          <span className="mb-1.5 block px-1 text-sm font-semibold text-slate-700">Category</span>
          <div className="grid grid-cols-2 gap-2.5" role="radiogroup">
            {Object.entries(CATEGORIES).map(([key, cat]) => {
              const on = form.category === key
              const Icon = cat.icon
              return (
                <button
                  key={key}
                  type="button"
                  role="radio"
                  aria-checked={on}
                  onClick={() => set('category')(key)}
                  className={`relative flex items-center gap-3 rounded-2xl bg-white p-3 text-left text-sm font-semibold shadow-sm transition active:scale-[0.97] ${
                    on ? 'ring-2 ring-emerald-500' : 'ring-1 ring-slate-200 hover:ring-slate-300'
                  }`}
                >
                  <span className={`grid size-9 place-items-center rounded-xl ${cat.tile}`}>
                    <Icon className="size-[18px]" strokeWidth={2.25} />
                  </span>
                  <span className="text-slate-800">{cat.label}</span>
                  {on && (
                    <span className="absolute right-2 top-2 grid size-4 place-items-center rounded-full bg-emerald-500 text-white">
                      <Check className="size-3" strokeWidth={3} />
                    </span>
                  )}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-20 mx-auto max-w-md bg-gradient-to-t from-slate-50 via-slate-50 to-slate-50/0 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-6">
        <button
          type="submit"
          className="w-full rounded-2xl bg-emerald-500 py-4 text-base font-semibold text-white shadow-lg shadow-emerald-600/25 transition hover:bg-emerald-600 active:scale-[0.98]"
        >
          {editing ? 'Save changes' : 'Add subscription'}
        </button>
      </div>
    </form>
  )
}
