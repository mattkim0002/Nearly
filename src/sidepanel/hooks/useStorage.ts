/**
 * useStorage — React hook for chrome.storage.local, typed with AppState.
 */

import { useState, useEffect, useCallback } from 'react'
import { loadState, saveState } from '../../shared/storage'
import type { AppState } from '../../shared/types'

export function useAppState() {
  const [state, setState] = useState<AppState | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadState().then((s) => {
      setState(s)
      setLoading(false)
    })
  }, [])

  const update = useCallback(async (patch: Partial<AppState>) => {
    await saveState(patch)
    setState((prev) => (prev ? { ...prev, ...patch } : prev))
  }, [])

  return { state, loading, update }
}
