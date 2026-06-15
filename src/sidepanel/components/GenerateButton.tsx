import React, { useState } from 'react'
import type { DetectedField } from '../../shared/types'
import { generateAnswer, DailyLimitError } from '../../lib/ai'
import { injectAIAnswer } from '../../lib/messaging'

interface Props {
  field: DetectedField
  jobDescription: string
  resumeText: string
  companyName?: string
  jobTitle?: string
  onAnswerGenerated?: (selector: string, answer: string) => void
}

export default function GenerateButton({
  field,
  jobDescription,
  resumeText,
  companyName,
  jobTitle,
  onAnswerGenerated,
}: Props) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  async function handleGenerate() {
    setLoading(true)
    setError(null)
    try {
      const answer = await generateAnswer({
        question: field.label,
        jobDescription,
        resumeText,
        companyName,
        jobTitle,
      })
      await injectAIAnswer(field.selector, answer)
      onAnswerGenerated?.(field.selector, answer)
      setDone(true)
    } catch (e) {
      setError(e instanceof DailyLimitError ? e.message : 'Failed to generate. Try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleGenerate}
        disabled={loading || done}
        className="text-xs px-2 py-1 rounded bg-primary text-white hover:bg-primary-dark disabled:opacity-50 transition-colors"
      >
        {loading ? 'Generating…' : done ? 'Injected' : 'Generate Answer'}
      </button>
      {error && <p className="text-xs text-error">{error}</p>}
    </div>
  )
}
