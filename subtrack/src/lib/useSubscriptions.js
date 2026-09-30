import { useCallback, useEffect, useState } from 'react'
import { newId, seedSubscriptions } from './subscriptions'

const STORAGE_KEY = 'subtrack:v2'

function load() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) return parsed
    }
  } catch {
    // Corrupt or unavailable storage: fall back to the seed data below.
  }
  return seedSubscriptions()
}

export function useSubscriptions() {
  const [subs, setSubs] = useState(load)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(subs))
    } catch {
      // Private mode or quota exceeded: the app keeps working in memory.
    }
  }, [subs])

  const add = useCallback((data) => {
    const sub = { ...data, id: newId(), status: 'active', createdAt: Date.now() }
    setSubs((prev) => [...prev, sub])
    return sub
  }, [])

  const update = useCallback((id, patch) => {
    setSubs((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }, [])

  const remove = useCallback((id) => {
    setSubs((prev) => prev.filter((s) => s.id !== id))
  }, [])

  return { subs, add, update, remove }
}
