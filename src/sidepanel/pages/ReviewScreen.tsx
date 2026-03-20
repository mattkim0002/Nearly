/**
 * ReviewScreen — shows all filled fields with confidence indicators.
 * User can edit inline before submitting the application.
 */

import React, { useEffect, useState } from 'react'
import type { DetectedField } from '../../shared/types'
import FieldCard from '../components/FieldCard'

interface Props {
  onBack: () => void
}

export default function ReviewScreen({ onBack }: Props) {
  const [fields, setFields] = useState<DetectedField[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    chrome.storage.local.get('fieldwork_filled_fields', (result) => {
      const stored = result['fieldwork_filled_fields'] as DetectedField[] | undefined
      setFields(stored ?? [])
      setLoading(false)
    })
  }, [])

  const filled = fields.filter((f) => f.filledValue)
  const empty = fields.filter((f) => !f.filledValue && !f.isOpenEnded)

  if (loading) {
    return <div className="flex items-center justify-center h-40 text-text-muted text-sm">Loading…</div>
  }

  if (fields.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 h-40 text-text-muted">
        <p className="text-sm">No fields filled yet.</p>
        <button onClick={onBack} className="text-primary text-sm hover:underline">← Back to Dashboard</button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3 pb-4">
      <div className="flex items-center justify-between">
        <h2 className="font-semibold text-text-main">Review Fields</h2>
        <button onClick={onBack} className="text-xs text-primary hover:underline">← Back</button>
      </div>

      <div className="flex gap-3 text-xs text-text-muted">
        <span className="flex items-center gap-1">
          <span className="w-2 h-2 rounded-full bg-success" /> {filled.length} filled
        </span>
        {empty.length > 0 && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-error" /> {empty.length} skipped
          </span>
        )}
      </div>

      {filled.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-medium text-text-muted uppercase tracking-wide">Filled</h3>
          {filled.map((field) => (
            <FieldCard key={field.selector} field={field} />
          ))}
        </div>
      )}

      {empty.length > 0 && (
        <div className="flex flex-col gap-2">
          <h3 className="text-xs font-medium text-text-muted uppercase tracking-wide">Skipped / Empty</h3>
          {empty.map((field) => (
            <FieldCard key={field.selector} field={{ ...field, confidence: 'low' }} />
          ))}
        </div>
      )}

      <p className="text-xs text-text-muted text-center px-4 pt-2">
        Review the values above, then submit the application form yourself.
      </p>
    </div>
  )
}
