import React, { useState } from 'react'
import type { DetectedField } from '../../shared/types'
import StatusBadge from './StatusBadge'

interface Props {
  field: DetectedField
  onValueChange?: (selector: string, value: string) => void
}

export default function FieldCard({ field, onValueChange }: Props) {
  const [value, setValue] = useState(field.filledValue ?? field.currentValue ?? '')

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    setValue(e.target.value)
    onValueChange?.(field.selector, e.target.value)
  }

  return (
    <div className="flex flex-col gap-1 p-3 bg-white rounded-lg border border-border">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-medium text-text-main truncate">{field.label || field.fieldName}</span>
        <StatusBadge confidence={field.confidence} />
      </div>
      {field.fieldType === 'textarea' ? (
        <textarea
          value={value}
          onChange={handleChange}
          rows={3}
          className="border border-border rounded px-2 py-1.5 text-xs resize-y focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={handleChange}
          className="border border-border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background"
        />
      )}
    </div>
  )
}
