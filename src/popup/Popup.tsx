/**
 * Fieldwork Popup — minimal status + side panel link.
 */

import React, { useEffect, useState } from 'react'
import { loadState } from '../shared/storage'

export default function Popup() {
  const [ready, setReady] = useState(false)
  const [setupDone, setSetupDone] = useState(false)

  useEffect(() => {
    loadState().then((s) => {
      setSetupDone(s.isSetupComplete)
      setReady(true)
    })
  }, [])

  function openSidePanel() {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const tabId = tabs[0]?.id
      if (tabId) chrome.sidePanel.open({ tabId })
    })
    window.close()
  }

  return (
    <div className="w-56 p-4 bg-background flex flex-col gap-3 font-[system-ui]">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
          <span className="text-white text-xs font-bold">F</span>
        </div>
        <span className="font-bold text-text-main">Fieldwork</span>
      </div>

      {ready ? (
        <>
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${setupDone ? 'bg-success' : 'bg-warning'}`} />
            <span className="text-xs text-text-muted">
              {setupDone ? 'Profile saved' : 'Profile not set up'}
            </span>
          </div>
          <button
            onClick={openSidePanel}
            className="w-full py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark transition-colors"
          >
            Open Side Panel
          </button>
        </>
      ) : (
        <div className="text-xs text-text-muted">Loading…</div>
      )}
    </div>
  )
}
