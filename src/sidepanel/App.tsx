/**
 * ApplyPilot — Side Panel Root
 *
 * Tab layout:
 *   Profile      — user fills in their background once
 *   Application  — per-application controls (autofill, generate answers)
 *   Review       — inspect every filled field before submitting
 */

import React, { useState } from 'react'
import ProfileForm from './components/ProfileForm'
import ApplicationPanel from './components/ApplicationPanel'
import FieldReview from './components/FieldReview'

type Tab = 'profile' | 'application' | 'review'

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('profile')

  return (
    <div className="flex flex-col h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="flex items-center gap-2 px-4 py-3 border-b border-gray-200 bg-indigo-600 text-white">
        <span className="font-bold text-lg">ApplyPilot</span>
      </header>

      {/* Tab bar */}
      <nav className="flex border-b border-gray-200 text-sm">
        {(['profile', 'application', 'review'] as Tab[]).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={[
              'flex-1 py-2 capitalize font-medium transition-colors',
              activeTab === tab
                ? 'border-b-2 border-indigo-600 text-indigo-600'
                : 'text-gray-500 hover:text-gray-700',
            ].join(' ')}
          >
            {tab}
          </button>
        ))}
      </nav>

      {/* Tab content */}
      <main className="flex-1 overflow-y-auto p-4">
        {activeTab === 'profile' && <ProfileForm />}
        {activeTab === 'application' && <ApplicationPanel />}
        {activeTab === 'review' && <FieldReview />}
      </main>
    </div>
  )
}
