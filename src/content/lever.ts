/**
 * Lever ATS — field mapper
 *
 * Maps standard profile keys to Lever form field selectors.
 * Returns a list of { selector, value } pairs ready to be filled.
 */

import type { FieldMap, UserProfile } from '../shared/types'

/** Known Lever input selectors keyed by profile field */
const LEVER_SELECTORS: Record<keyof UserProfile, string> = {
  firstName: 'input[name="name"]',       // Lever uses a single "Full Name" field
  lastName: '',                           // merged into firstName mapping at fill time
  email: 'input[name="email"]',
  phone: 'input[name="phone"]',
  linkedIn: 'input[name="urls[LinkedIn]"]',
  website: 'input[name="urls[Other]"]',
  location: 'input[name="location"]',
  coverLetter: 'textarea[name="comments"]',
  resumeText: '', // handled via file upload — not autofilled
}

export function mapLeverFields(profile: UserProfile): FieldMap[] {
  const fields: FieldMap[] = []

  for (const key of Object.keys(LEVER_SELECTORS) as Array<keyof UserProfile>) {
    const selector = LEVER_SELECTORS[key]
    if (!selector || !profile[key]) continue

    // Lever uses a single name field — combine first + last
    if (key === 'firstName') {
      fields.push({
        selector,
        value: `${profile.firstName} ${profile.lastName}`.trim(),
        fieldKey: 'firstName',
      })
      continue
    }
    if (key === 'lastName') continue // already merged above

    fields.push({ selector, value: String(profile[key]), fieldKey: key })
  }

  return fields
}
