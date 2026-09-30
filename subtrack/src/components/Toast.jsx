import { Ban, CircleCheck, Trash2 } from 'lucide-react'

const TONES = {
  success: { Icon: CircleCheck, icon: 'text-emerald-400' },
  neutral: { Icon: Ban, icon: 'text-amber-400' },
  danger: { Icon: Trash2, icon: 'text-red-400' },
}

export default function Toast({ message, tone = 'success' }) {
  const { Icon, icon } = TONES[tone] ?? TONES.success
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-24 left-1/2 z-50 flex max-w-[calc(100%-2rem)] -translate-x-1/2 animate-toast-in items-center gap-2 rounded-full bg-slate-900 px-4 py-2.5 text-sm font-medium text-white shadow-xl shadow-slate-900/25"
    >
      <Icon className={`size-4 shrink-0 ${icon}`} />
      <span className="truncate">{message}</span>
    </div>
  )
}
