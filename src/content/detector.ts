/**
 * ATS Detector
 *
 * Inspects the current page URL and DOM to determine which
 * Applicant Tracking System (ATS) is in use.
 */

export type ATSType = 'greenhouse' | 'lever' | null

export function detectATS(): ATSType {
  const { hostname, pathname } = window.location

  if (
    hostname.includes('greenhouse.io') ||
    document.querySelector('form[action*="greenhouse"]') !== null
  ) {
    return 'greenhouse'
  }

  if (
    hostname.includes('lever.co') ||
    pathname.startsWith('/jobs/lever')
  ) {
    return 'lever'
  }

  return null
}
