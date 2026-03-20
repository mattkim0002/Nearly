/**
 * Field Filler — resolves detected fields against a profile and injects values.
 */

import { detectATS } from './detector'
import { scanGreenhouseFields } from './greenhouse'
import { scanLeverFields } from './lever'
import { injectValue } from './injector'
import type { DetectedField } from '../shared/types'
import type { UserProfile } from '../shared/types'

/** Resolve a profile key path like "address.city" to the value in the profile. */
function resolveProfileValue(profile: UserProfile, key: string): string | undefined {
  if (key === 'fullName') return `${profile.firstName} ${profile.lastName}`.trim()

  const parts = key.split('.')
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let val: unknown = profile as Record<string, unknown>
  for (const part of parts) {
    if (val === null || typeof val !== 'object') return undefined
    val = (val as Record<string, unknown>)[part]
  }
  if (val === undefined || val === null) return undefined
  if (typeof val === 'boolean') return val ? 'Yes' : 'No'
  return String(val)
}

export function fillFields(
  profile: UserProfile,
  aiAnswers: Record<string, string> = {}
): { filled: number; skipped: number; fields: DetectedField[] } {
  const ats = detectATS()
  if (!ats) return { filled: 0, skipped: 0, fields: [] }

  const detected = ats === 'greenhouse' ? scanGreenhouseFields() : scanLeverFields()
  let filled = 0
  let skipped = 0

  const result: DetectedField[] = detected.map((field) => {
    const el = document.querySelector<HTMLElement>(field.selector)
    if (!el) {
      skipped++
      return { ...field, confidence: 'low' }
    }

    // Check for AI answer override first
    if (aiAnswers[field.selector]) {
      injectValue(el, aiAnswers[field.selector])
      filled++
      return { ...field, filledValue: aiAnswers[field.selector] }
    }

    if (!field.mappedProfileKey) {
      skipped++
      return field
    }

    const value = resolveProfileValue(profile, field.mappedProfileKey)
    if (!value) {
      skipped++
      return field
    }

    injectValue(el, value)
    filled++
    return { ...field, filledValue: value }
  })

  return { filled, skipped, fields: result }
}

/** Inject a single AI-generated answer into a specific field. */
export function injectAnswer(selector: string, answer: string): boolean {
  const el = document.querySelector<HTMLElement>(selector)
  if (!el) return false
  injectValue(el, answer)
  return true
}
