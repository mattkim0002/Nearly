/**
 * ApplyPilot — Manifest V3 service worker
 *
 * Responsibilities:
 *  - Open the side panel when the action icon is clicked
 *  - Relay messages between the side panel and content scripts
 *  - (Future) Handle OAuth token refresh, alarm-based tasks, etc.
 */

// Open side panel on toolbar icon click
chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) return
  chrome.sidePanel.open({ tabId: tab.id })
})

// Message relay: side panel → content script
// Messages from the side panel arrive here; forward to the active tab's content script.
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.target === 'content') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id
      if (!tabId) {
        sendResponse({ error: 'No active tab' })
        return
      }
      chrome.tabs.sendMessage(tabId, message, (response) => {
        sendResponse(response)
      })
    })
    // Return true to keep the message channel open for the async sendResponse
    return true
  }
})
