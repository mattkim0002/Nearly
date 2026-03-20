/**
 * Greenhouse ATS — field scanner
 *
 * Returns DetectedField[] describing the form fields on a Greenhouse job page.
 */

import type { DetectedField } from '../shared/types'
import { buildSelector, getFieldType, mapLabelToProfileKey } from '../lib/fields'

export function scanGreenhouseFields(): DetectedField[] {
  const fields: DetectedField[] = []
  const seen = new Set<string>()

  // Greenhouse uses .field containers with a label + input inside
  const containers = document.querySelectorAll<HTMLElement>(
    '.field, [data-field], .application-field'
  )

  containers.forEach((container) => {
    const labelEl = container.querySelector('label')
    const label = labelEl?.textContent?.trim() ?? ''
    const input = container.querySelector<HTMLElement>('input, textarea, select')
    if (!input) return

    const selector = buildSelector(input)
    if (seen.has(selector)) return
    seen.add(selector)

    const fieldName = input.getAttribute('name') ?? input.getAttribute('id') ?? ''
    const fieldType = getFieldType(input)

    // Skip file uploads — we don't autofill those
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

  // Also scan top-level inputs not wrapped in .field containers (e.g. #first_name, #email)
  const standaloneInputs = document.querySelectorAll<HTMLElement>(
    '#first_name, #last_name, #email, #phone, #website, #job_application_location'
  )
  standaloneInputs.forEach((input) => {
    const selector = buildSelector(input)
    if (seen.has(selector)) return
    seen.add(selector)

    const id = input.getAttribute('id') ?? ''
    const name = input.getAttribute('name') ?? id
    const fieldType = getFieldType(input)
    if (fieldType === 'file') return

    const label = document.querySelector<HTMLElement>(`label[for="${id}"]`)?.textContent?.trim() ?? id
    const mappedProfileKey = mapLabelToProfileKey(label, name)

    fields.push({
      selector,
      fieldType,
      label,
      fieldName: name,
      mappedProfileKey,
      currentValue:
        input instanceof HTMLInputElement ? input.value : undefined,
      confidence: mappedProfileKey ? 'high' : 'medium',
      isOpenEnded: false,
    })
  })

  return fields
}
