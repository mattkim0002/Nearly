/**
 * Lever ATS — field scanner
 *
 * Returns DetectedField[] for a Lever job application page.
 */

import type { DetectedField } from '../shared/types'
import { buildSelector, getFieldType, mapLabelToProfileKey } from '../lib/fields'

export function scanLeverFields(): DetectedField[] {
  const fields: DetectedField[] = []
  const seen = new Set<string>()

  // Lever uses .application-field and .custom-question containers
  const containers = document.querySelectorAll<HTMLElement>(
    '.application-field, .custom-question, [data-qa]'
  )

  containers.forEach((container) => {
    const labelEl = container.querySelector('label, .application-label')
    const label = labelEl?.textContent?.trim() ?? ''
    const input = container.querySelector<HTMLElement>('input, textarea, select')
    if (!input) return

    const selector = buildSelector(input)
    if (seen.has(selector)) return
    seen.add(selector)

    const fieldName = input.getAttribute('name') ?? input.getAttribute('id') ?? ''
    const fieldType = getFieldType(input)
    if (fieldType === 'file') return

    const mappedProfileKey = mapLabelToProfileKey(label, fieldName)
    const confidence = mappedProfileKey ? 'high' : 'low'
    const isOpenEnded = fieldType === 'textarea' && !mappedProfileKey

    fields.push({
      selector,
      fieldType,
      label,
      fieldName,
      mappedProfileKey,
      currentValue:
        input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement
          ? input.value
          : undefined,
      confidence,
      isOpenEnded,
    })
  })

  // Also catch the standard Lever named inputs directly
  const knownSelectors: [string, string][] = [
    ['input[name="name"]', 'Full Name'],
    ['input[name="email"]', 'Email'],
    ['input[name="phone"]', 'Phone'],
    ['input[name="org"]', 'Current Company'],
    ['input[name="urls[LinkedIn]"]', 'LinkedIn'],
    ['input[name="urls[Portfolio]"]', 'Portfolio'],
    ['input[name="location"]', 'Location'],
    ['textarea[name="comments"]', 'Additional Information'],
  ]

  knownSelectors.forEach(([qs, fallbackLabel]) => {
    const input = document.querySelector<HTMLElement>(qs)
    if (!input) return
    const selector = buildSelector(input)
    if (seen.has(selector)) return
    seen.add(selector)

    const fieldName = input.getAttribute('name') ?? ''
    const fieldType = getFieldType(input)
    const label =
      document.querySelector<HTMLElement>(`label[for="${input.getAttribute('id')}"]`)?.textContent?.trim() ??
      fallbackLabel
    const mappedProfileKey = mapLabelToProfileKey(label, fieldName)

    fields.push({
      selector,
      fieldType,
      label,
      fieldName,
      mappedProfileKey,
      currentValue:
        input instanceof HTMLInputElement || input instanceof HTMLTextAreaElement
          ? input.value
          : undefined,
      confidence: mappedProfileKey ? 'high' : 'medium',
      isOpenEnded: fieldType === 'textarea' && !mappedProfileKey,
    })
  })

  return fields
}
