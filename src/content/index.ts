/**
 * ApplyPilot — Content script entry point
 *
 * Injected into Greenhouse and Lever job application pages.
 * Detects the ATS, maps form fields, and fills them on request.
 */

import { detectATS } from './detector'
import { fillFields } from './filler'
import type { FillRequest, ContentMessage } from '../shared/types'

const ats = detectATS()

if (ats) {
  console.log(`[ApplyPilot] Detected ATS: ${ats}`)
  // Notify the side panel that we're on a supported page
  chrome.runtime.sendMessage({ type: 'ATS_DETECTED', ats })
}

// Listen for messages from the background service worker (relayed from side panel)
chrome.runtime.onMessage.addListener(
  (message: ContentMessage, _sender, sendResponse) => {
    switch (message.type) {
      case 'FILL_FIELDS': {
        const result = fillFields(message.payload as FillRequest)
        sendResponse({ success: true, result })
        break
      }

      case 'GET_FIELDS': {
        // TODO: return detected fields for side-panel preview
        sendResponse({ success: true, fields: [] })
        break
      }

      default:
        sendResponse({ success: false, error: 'Unknown message type' })
    }
  }
)
