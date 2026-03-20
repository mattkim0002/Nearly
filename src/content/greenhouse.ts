/**
 * Greenhouse ATS — field mapper
 *
 * Maps standard profile keys to Greenhouse form field selectors.
 * Returns a list of { selector, value } pairs ready to be filled.
 */

import type { FieldMap, UserProfile } from '../shared/types'

/** Known Greenhouse input selectors keyed by profile field */
const GREENHOUSE_SELECTORS: Record<keyof UserProfile, string> = {
  firstName: '#first_name',
  lastName: '#last_name',
  email: '#email',
  phone: '#phone',
  linkedIn: 'input[name="job_application[answers_attributes][0][text_value]"]', // varies by job
  website: '#website',
  location: '#job_application_location',
  coverLetter: 'textarea[name*="cover_letter"]',
  resumeText: '', // handled via file upload — not autofilled
}

export function mapGreenhouseFields(profile: UserProfile): FieldMap[] {
  return (Object.keys(GREENHOUSE_SELECTORS) as Array<keyof UserProfile>)
    .filter((key) => GREENHOUSE_SELECTORS[key] && profile[key])
    .map((key) => ({
      selector: GREENHOUSE_SELECTORS[key],
      value: String(profile[key]),
      fieldKey: key,
    }))
}
