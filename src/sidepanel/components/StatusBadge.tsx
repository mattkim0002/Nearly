import React from 'react'
import type { Confidence } from '../../lib/fields'

interface Props {
  confidence: Confidence
  label?: string
}

const CONFIG: Record<Confidence, { dot: string; text: string }> = {
  high:   { dot: 'bg-success',  text: 'text-success' },
  medium: { dot: 'bg-warning',  text: 'text-warning' },
  low:    { dot: 'bg-error',    text: 'text-error' },
}

export default function StatusBadge({ confidence, label }: Props) {
  const { dot, text } = CONFIG[confidence]
  return (
    <span className={`inline-flex items-center gap-1 text-xs font-medium ${text}`}>
      <span className={`w-2 h-2 rounded-full ${dot}`} />
      {label ?? confidence}
    </span>
  )
}
