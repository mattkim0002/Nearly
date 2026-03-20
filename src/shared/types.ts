/**
 * Shared type definitions used by both the side panel and content scripts.
 */

// ── User Profile ─────────────────────────────────────────────────────────────

export interface WorkExperience {
  company: string
  title: string
  startDate: string   // "2022-01" format
  endDate: string     // "2024-06" or "present"
  description: string
}

export interface Education {
  school: string
  degree: string
  field: string
  graduationDate: string
  gpa?: string
}

export interface UserProfile {
  // Basic info
  firstName: string
  lastName: string
  email: string
  phone: string
  address: {
    street: string
    city: string
    state: string
    zip: string
    country: string
  }

  // Professional
  linkedinUrl?: string
  portfolioUrl?: string
  resumeText: string
  workExperience: WorkExperience[]
  education: Education[]
  skills: string[]

  // Job search preferences
  visaSponsorship: boolean
  authorizedToWork: boolean
  willingToRelocate: boolean
  expectedSalary?: string

  // Demographic (optional, for EEO questions)
  gender?: string
  ethnicity?: string
  veteranStatus?: string
  disabilityStatus?: string
}

export interface AppState {
  profile: UserProfile | null
  isSetupComplete: boolean
  userId: string        // Random UUID for rate limiting
  dailyAICount: number
  dailyAICountDate: string  // "2026-03-19" format, resets daily
}

// ── Field Mapping (serializable — no DOM refs) ────────────────────────────────

export interface DetectedField {
  /** Unique CSS selector for the form element */
  selector: string
  fieldType: 'text' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'file'
  label: string
  fieldName: string
  /** Which profile key this maps to, if any */
  mappedProfileKey?: string
  currentValue?: string
  confidence: 'high' | 'medium' | 'low'
  /** True for open-ended text questions that need AI answers */
  isOpenEnded: boolean
  /** Value injected during autofill (set after filling) */
  filledValue?: string
}

// ── Content Script Messages ───────────────────────────────────────────────────

export interface FillFieldsPayload {
  profile: UserProfile
  aiAnswers?: Record<string, string>
}

export type ContentMessageType =
  | 'FILL_FIELDS'
  | 'GET_FIELDS'
  | 'ATS_DETECTED'
  | 'SCAN_FIELDS'
  | 'INJECT_VALUES'

export interface ContentMessage {
  target?: 'content'
  type: ContentMessageType
  payload?: FillFieldsPayload | Record<string, string>
}

// ── API ───────────────────────────────────────────────────────────────────────

export interface GenerateRequest {
  question: string
  jobDescription?: string
  resumeText: string
  companyName?: string
  jobTitle?: string
  userId?: string
}

export interface GenerateResponse {
  answer: string
}
