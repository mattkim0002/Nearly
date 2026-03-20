/**
 * Field Filler
 *
 * Receives a FillRequest (profile + optional AI-generated answers),
 * delegates field mapping to the correct ATS module, then sets values
 * on the DOM while firing the React/Vue synthetic events that modern
 * ATSes listen to (input + change).
 */

import { detectATS } from './detector'
import { mapGreenhouseFields } from './greenhouse'
import { mapLeverFields } from './lever'
import type { FillRequest, FieldMap } from '../shared/types'

export function fillFields(request: FillRequest): { filled: number; skipped: number } {
  const ats = detectATS()
  if (!ats) return { filled: 0, skipped: 0 }

  const fieldMaps: FieldMap[] =
    ats === 'greenhouse'
      ? mapGreenhouseFields(request.profile)
      : mapLeverFields(request.profile)

  // Merge AI-generated answers for open-ended questions
  if (request.aiAnswers) {
    for (const [selector, value] of Object.entries(request.aiAnswers)) {
      fieldMaps.push({ selector, value, fieldKey: 'aiAnswer' })
    }
  }

  let filled = 0
  let skipped = 0

  for (const { selector, value } of fieldMaps) {
    const el = document.querySelector<HTMLInputElement | HTMLTextAreaElement>(selector)
    if (!el) {
      skipped++
      continue
    }

    setNativeValue(el, value)
    filled++
  }

  return { filled, skipped }
}

/**
 * Sets a value on an input/textarea in a way that React's synthetic event
 * system can detect (needed for controlled components used by Greenhouse/Lever).
 */
function setNativeValue(
  el: HTMLInputElement | HTMLTextAreaElement,
  value: string
): void {
  const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
    el.tagName === 'TEXTAREA'
      ? HTMLTextAreaElement.prototype
      : HTMLInputElement.prototype,
    'value'
  )?.set

  nativeInputValueSetter?.call(el, value)

  el.dispatchEvent(new Event('input', { bubbles: true }))
  el.dispatchEvent(new Event('change', { bubbles: true }))
}
