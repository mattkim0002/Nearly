/**
 * Fieldwork — Manifest V3 service worker
 *
 * Responsibilities:
 *  - Open the side panel when the action icon is clicked
 *  - Relay messages between the side panel and content scripts
 *  - Store ATS detection state so the side panel can read it
 */

// Open side panel on toolbar icon click
chrome.sidePanel.setPanelBehavior({ openPanelOnActionClick: true }).catch(() => {
  // Fallback: open manually on click if setPanelBehavior is unavailable
  chrome.action.onClicked.addListener((tab) => {
    if (tab.id) chrome.sidePanel.open({ tabId: tab.id })
  })
})

// Track the current ATS on each tab
const tabATS: Record<number, string> = {}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  // ATS detected by content script — store it
  if (message.type === 'ATS_DETECTED') {
    if (sender.tab?.id) {
      tabATS[sender.tab.id] = message.ats as string
    }
    return false
  }

  // Messages targeted at the content script — relay to active tab
  if (message.target === 'content') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id
      if (!tabId) {
        sendResponse({ success: false, error: 'No active tab' })
        return
      }
      chrome.tabs.sendMessage(tabId, message, (response) => {
        if (chrome.runtime.lastError) {
          sendResponse({ success: false, error: chrome.runtime.lastError.message })
        } else {
          sendResponse(response)
        }
      })
    })
    return true // keep channel open for async sendResponse
  }

  // Side panel queries profile directly
  if (message.type === 'GET_PROFILE') {
    chrome.storage.local.get('fieldwork_state', (result) => {
      const state = result['fieldwork_state'] as { profile?: unknown } | undefined
      sendResponse(state?.profile ?? null)
    })
    return true
  }

  return false
})

// Clean up ATS map when tab is closed
chrome.tabs.onRemoved.addListener((tabId) => {
  delete tabATS[tabId]
})
