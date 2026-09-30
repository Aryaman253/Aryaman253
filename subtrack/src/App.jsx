import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import Dashboard from './components/Dashboard'
import SubscriptionForm from './components/SubscriptionForm'
import SubscriptionDetail from './components/SubscriptionDetail'
import Toast from './components/Toast'
import { useSubscriptions } from './lib/useSubscriptions'

export default function App() {
  const { subs, add, update, remove } = useSubscriptions()
  const [view, setView] = useState({ name: 'dashboard' })
  const [toast, setToast] = useState(null)
  const dashboardScroll = useRef(0)

  const navigate = (next) => {
    if (view.name === 'dashboard') dashboardScroll.current = window.scrollY
    setView(next)
  }

  // Return to the same spot on the dashboard; start every other view at the top.
  useLayoutEffect(() => {
    window.scrollTo(0, view.name === 'dashboard' ? dashboardScroll.current : 0)
  }, [view])

  const notify = useCallback((message, tone = 'success') => {
    setToast({ message, tone, key: Date.now() })
  }, [])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 2600)
    return () => clearTimeout(timer)
  }, [toast])

  const selected = view.id ? subs.find((s) => s.id === view.id) : null

  // A deleted subscription can't be shown; fall back to the dashboard.
  useEffect(() => {
    if (view.id && !selected) setView({ name: 'dashboard' })
  }, [view.id, selected])

  const goHome = () => navigate({ name: 'dashboard' })

  let screen
  if (view.name === 'form') {
    screen = (
      <SubscriptionForm
        key={view.id ?? 'new'}
        initial={selected}
        onCancel={() => (selected ? navigate({ name: 'detail', id: selected.id }) : goHome())}
        onSave={(data) => {
          if (selected) {
            update(selected.id, data)
            notify(`${data.name} updated`)
            navigate({ name: 'detail', id: selected.id })
          } else {
            add(data)
            notify(`${data.name} added`)
            goHome()
          }
        }}
      />
    )
  } else if (view.name === 'detail' && selected) {
    screen = (
      <SubscriptionDetail
        key={selected.id}
        sub={selected}
        onBack={goHome}
        onEdit={() => navigate({ name: 'form', id: selected.id })}
        onCancelSub={() => {
          update(selected.id, { status: 'cancelled', cancelledAt: Date.now() })
          notify(`${selected.name} moved to cancelled`, 'neutral')
          goHome()
        }}
        onReactivate={() => {
          update(selected.id, { status: 'active', cancelledAt: undefined })
          notify(`${selected.name} reactivated`)
        }}
        onDelete={() => {
          remove(selected.id)
          notify(`${selected.name} deleted`, 'danger')
          goHome()
        }}
      />
    )
  } else {
    screen = (
      <Dashboard
        subs={subs}
        onOpen={(id) => navigate({ name: 'detail', id })}
        onAdd={() => navigate({ name: 'form' })}
      />
    )
  }

  return (
    <div className="min-h-dvh bg-slate-100">
      <div className="relative mx-auto min-h-dvh max-w-md bg-slate-50 shadow-[0_0_0_1px_rgba(15,23,42,0.04)]">
        <div key={view.name + (view.id ?? '')} className="animate-view-in">
          {screen}
        </div>
        {toast && <Toast key={toast.key} message={toast.message} tone={toast.tone} />}
      </div>
    </div>
  )
}
