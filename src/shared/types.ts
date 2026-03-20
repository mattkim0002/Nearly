/**
 * Shared type definitions used by both the side panel and content scripts.
 */

// ── User Profile ─────────────────────────────────────────────────────────────

export interface UserProfile {
  firstName: string
  lastName: string
  email: string
  phone: string
  linkedIn: string
  website: string
  location: string
  coverLetter: string
  /** Plain-text resume / work history sent to the AI */
  resumeText: string
}

// ── Field Mapping ─────────────────────────────────────────────────────────────

export interface FieldMap {
  /** CSS selector targeting the form element */
  selector: string
  /** Value to set */
  value: string
  /** Which profile key (or 'aiAnswer') this maps from */
  fieldKey: keyof UserProfile | 'aiAnswer'
}

// ── Content Script Messages ───────────────────────────────────────────────────

export interface FillRequest {
  profile: UserProfile
  /** Selector → answer pairs for AI-generated open-ended fields */
  aiAnswers?: Record<string, string>
}

export type ContentMessageType = 'FILL_FIELDS' | 'GET_FIELDS'

export interface ContentMessage {
  /** Routes the message; 'content' means it targets the content script */
  target: 'content'
  type: ContentMessageType
  payload?: FillRequest
}

// ── API ───────────────────────────────────────────────────────────────────────

export interface GenerateRequest {
  question: string
  jobDescription?: string
  resumeText: string
}

export interface GenerateResponse {
  answer: string
}
