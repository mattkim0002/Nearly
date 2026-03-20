/**
 * Chrome message passing helpers.
 * All messages between side panel ↔ service worker ↔ content script go through here.
 */

import type { DetectedField } from '../shared/types'
import type { UserProfile } from '../shared/types'

export type MessageType =
  | 'GET_FIELDS'
  | 'FILL_FIELDS'
  | 'INJECT_AI_ANSWER'
  | 'ATS_DETECTED'
  | 'SCAN_FIELDS'

export interface FieldsResponse {
  success: boolean
  ats?: string | null
  fields?: DetectedField[]
  error?: string
}

export interface FillResponse {
  success: boolean
  result?: { filled: number; skipped: number }
  error?: string
}

/** Send a message to the content script in the active tab (via background). */
export function sendToContent(
  type: MessageType,
  payload?: Record<string, unknown>
): Promise<unknown> {
  return new Promise((resolve) => {
    chrome.runtime.sendMessage(
      { target: 'content', type, payload },
      (response) => {
        if (chrome.runtime.lastError) {
          resolve({ success: false, error: chrome.runtime.lastError.message })
        } else {
          resolve(response)
        }
      }
    )
  })
}

export async function getDetectedFields(): Promise<FieldsResponse> {
  return sendToContent('GET_FIELDS') as Promise<FieldsResponse>
}

export async function fillStandardFields(profile: UserProfile): Promise<FillResponse> {
  return sendToContent('FILL_FIELDS', { profile: profile as unknown as Record<string, unknown> }) as Promise<FillResponse>
}

export async function injectAIAnswer(selector: string, answer: string): Promise<FillResponse> {
  return sendToContent('INJECT_AI_ANSWER', { selector, answer }) as Promise<FillResponse>
}
