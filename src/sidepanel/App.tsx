/**
 * Fieldwork — Side Panel Root
 *
 * Page routing:
 *   ProfileSetup  → first-run onboarding
 *   Dashboard     → main view (ATS detect, autofill, AI answers)
 *   ReviewScreen  → review filled fields before submitting
 */

import React, { useEffect, useState } from 'react'
import { useAppState } from './hooks/useStorage'
import ProfileSetup from './pages/ProfileSetup'
import Dashboard from './pages/Dashboard'
import ReviewScreen from './pages/ReviewScreen'

type Page = 'setup' | 'dashboard' | 'review'

export default function App() {
  const { state, loading } = useAppState()
  const [page, setPage] = useState<Page>('setup')

  useEffect(() => {
    if (!loading && state) {
      setPage(state.isSetupComplete ? 'dashboard' : 'setup')
    }
  }, [loading, state])

  if (loading || !state) {
    return (
      <div className="flex items-center justify-center h-screen bg-background text-text-muted text-sm">
        Loading…
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen bg-background text-text-main font-[system-ui]">
      {/* Header */}
      <header className="flex items-center gap-2 px-4 py-3 border-b border-border bg-primary text-white shrink-0">
        <span className="font-bold text-base tracking-tight">Fieldwork</span>
        {page !== 'setup' && (
          <span className="ml-auto text-xs opacity-70 capitalize">{page}</span>
        )}
      </header>

      {/* Page content */}
      <main className="flex-1 overflow-y-auto px-4 pt-4">
        {page === 'setup' && (
          <ProfileSetup onComplete={() => setPage('dashboard')} />
        )}
        {page === 'dashboard' && state.profile && (
          <Dashboard
            profile={state.profile}
            onReview={() => setPage('review')}
            onEditProfile={() => setPage('setup')}
          />
        )}
        {page === 'review' && (
          <ReviewScreen onBack={() => setPage('dashboard')} />
        )}
      </main>
    </div>
  )
}
