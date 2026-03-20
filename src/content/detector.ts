/**
 * ATS Detector — inspects URL and DOM to identify the Applicant Tracking System.
 */

export type ATSType = 'greenhouse' | 'lever' | null

export function detectATS(): ATSType {
  const { hostname } = window.location

  if (
    hostname.includes('greenhouse.io') ||
    document.querySelector('form[action*="greenhouse"]') !== null
  ) {
    return 'greenhouse'
  }

  if (hostname.includes('lever.co')) {
    return 'lever'
  }

  return null
}
