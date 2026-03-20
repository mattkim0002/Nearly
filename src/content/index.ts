/**
 * Fieldwork — Content script entry point
 *
 * Injected into Greenhouse and Lever job application pages.
 * Detects the ATS, responds to scan/fill requests from the side panel.
 */

import { detectATS } from './detector'
import { scanGreenhouseFields } from './greenhouse'
import { scanLeverFields } from './lever'
import { fillFields, injectAnswer } from './filler'
import type { UserProfile, DetectedField } from '../shared/types'

const ats = detectATS()

if (ats) {
  console.log(`[Fieldwork] Detected ATS: ${ats}`)
  chrome.runtime.sendMessage({ type: 'ATS_DETECTED', ats })
}

function getFields(): DetectedField[] {
  if (ats === 'greenhouse') return scanGreenhouseFields()
  if (ats === 'lever') return scanLeverFields()
  return []
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  switch (message.type as string) {
    case 'GET_FIELDS': {
      const fields = getFields()
      sendResponse({ success: true, ats, fields })
      break
    }

    case 'SCAN_FIELDS': {
      const fields = getFields()
      sendResponse({ success: true, ats, fields })
      break
    }

    case 'FILL_FIELDS': {
      const profile = message.payload?.profile as UserProfile | undefined
      const aiAnswers = (message.payload?.aiAnswers ?? {}) as Record<string, string>
      if (!profile) {
        sendResponse({ success: false, error: 'No profile provided' })
        break
      }
      const result = fillFields(profile, aiAnswers)
      // Persist filled fields for the review screen
      chrome.storage.local.set({ fieldwork_filled_fields: result.fields })
      sendResponse({ success: true, result: { filled: result.filled, skipped: result.skipped } })
      break
    }

    case 'INJECT_VALUES':
    case 'INJECT_AI_ANSWER': {
      const selector = message.payload?.selector as string | undefined
      const answer = message.payload?.answer as string | undefined
      if (!selector || !answer) {
        sendResponse({ success: false, error: 'Missing selector or answer' })
        break
      }
      const ok = injectAnswer(selector, answer)
      if (ok) {
        // Update the stored filled fields
        chrome.storage.local.get('fieldwork_filled_fields', (res) => {
          const fields = (res['fieldwork_filled_fields'] as DetectedField[]) ?? []
          const updated = fields.map((f) =>
            f.selector === selector ? { ...f, filledValue: answer } : f
          )
          chrome.storage.local.set({ fieldwork_filled_fields: updated })
        })
      }
      sendResponse({ success: ok })
      break
    }

    default:
      sendResponse({ success: false, error: 'Unknown message type' })
  }
})
