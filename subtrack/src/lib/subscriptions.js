import { Briefcase, Clapperboard, Dumbbell, Shapes } from 'lucide-react'

export const CATEGORIES = {
  entertainment: {
    label: 'Entertainment',
    icon: Clapperboard,
    tile: 'bg-violet-100 text-violet-700',
    chip: 'bg-violet-50 text-violet-700 ring-violet-200',
    bar: 'bg-violet-500',
  },
  productivity: {
    label: 'Productivity',
    icon: Briefcase,
    tile: 'bg-sky-100 text-sky-700',
    chip: 'bg-sky-50 text-sky-700 ring-sky-200',
    bar: 'bg-sky-500',
  },
  fitness: {
    label: 'Fitness',
    icon: Dumbbell,
    tile: 'bg-pink-100 text-pink-700',
    chip: 'bg-pink-50 text-pink-700 ring-pink-200',
    bar: 'bg-pink-500',
  },
  other: {
    label: 'Other',
    icon: Shapes,
    tile: 'bg-slate-200 text-slate-700',
    chip: 'bg-slate-100 text-slate-700 ring-slate-200',
    bar: 'bg-slate-500',
  },
}

export const CYCLES = {
  weekly: { label: 'Weekly', short: 'wk', perMonth: 52 / 12 },
  monthly: { label: 'Monthly', short: 'mo', perMonth: 1 },
  yearly: { label: 'Yearly', short: 'yr', perMonth: 1 / 12 },
}

// A single subscription at or above this monthly cost is flagged as high spend.
export const HIGH_SPEND_MONTHLY = 40
// Renewals within this many days surface in the alerts banner.
export const ALERT_WINDOW_DAYS = 3

const currency = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })

export function formatMoney(value) {
  return currency.format(value)
}

export function monthlyCost(sub) {
  return sub.cost * (CYCLES[sub.cycle]?.perMonth ?? 1)
}

export function isHighSpend(sub) {
  return monthlyCost(sub) >= HIGH_SPEND_MONTHLY
}

// Dates are stored as local 'YYYY-MM-DD' strings so they never drift across time zones.
export function toISODate(date) {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function parseISODate(value) {
  const [y, m, d] = value.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function daysFromToday(offset) {
  const date = new Date()
  date.setDate(date.getDate() + offset)
  return toISODate(date)
}

export function daysUntil(value) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((parseISODate(value) - today) / 86_400_000)
}

export function formatDate(value, opts = { month: 'short', day: 'numeric' }) {
  return parseISODate(value).toLocaleDateString('en-US', opts)
}

export function relativeRenewal(value) {
  const days = daysUntil(value)
  if (days < -1) return `${Math.abs(days)} days overdue`
  if (days === -1) return '1 day overdue'
  if (days === 0) return 'Renews today'
  if (days === 1) return 'Renews tomorrow'
  return `Renews in ${days} days`
}

// green = healthy, amber = renewing soon, red = overdue.
export function renewalStatus(sub) {
  const days = daysUntil(sub.nextRenewal)
  if (days < 0) return 'overdue'
  if (days <= ALERT_WINDOW_DAYS) return 'soon'
  return 'ok'
}

export const STATUS_STYLES = {
  ok: { pill: 'bg-emerald-50 text-emerald-700', dot: 'bg-emerald-500' },
  soon: { pill: 'bg-amber-50 text-amber-700', dot: 'bg-amber-500' },
  overdue: { pill: 'bg-red-50 text-red-700', dot: 'bg-red-500' },
}

export function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
}

// Renewal dates are relative to today so the demo always has upcoming alerts.
export function seedSubscriptions() {
  return [
    { name: 'Netflix', cost: 15.49, cycle: 'monthly', offset: 2, category: 'entertainment' },
    { name: 'Spotify Premium', cost: 11.99, cycle: 'monthly', offset: 1, category: 'entertainment' },
    { name: 'Adobe Creative Cloud', cost: 59.99, cycle: 'monthly', offset: 11, category: 'productivity' },
    { name: 'Notion Plus', cost: 10, cycle: 'monthly', offset: 18, category: 'productivity' },
    { name: 'Strava', cost: 79.99, cycle: 'yearly', offset: 47, category: 'fitness' },
  ].map(({ offset, ...sub }, i) => ({
    ...sub,
    id: `seed-${i + 1}`,
    nextRenewal: daysFromToday(offset),
    status: 'active',
    createdAt: Date.now() - (i + 1) * 86_400_000,
  }))
}
