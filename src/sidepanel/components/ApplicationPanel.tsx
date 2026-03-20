/**
 * ApplicationPanel — per-application controls
 *
 * - Shows detected ATS (if any)
 * - "Autofill Standard Fields" button — sends FILL_FIELDS to content script
 * - Open-ended question generator — calls /api/generate and injects the answer
 */

import React, { useEffect, useState } from 'react'
import { loadProfile } from '../../shared/storage'
import type { UserProfile } from '../../shared/types'

interface ATSStatus {
  detected: boolean
  ats: string | null
}

export default function ApplicationPanel() {
  const [atsStatus, setAtsStatus] = useState<ATSStatus>({ detected: false, ats: null })
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [question, setQuestion] = useState('')
  const [jobDescription, setJobDescription] = useState('')
  const [generatedAnswer, setGeneratedAnswer] = useState('')
  const [filling, setFilling] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [statusMsg, setStatusMsg] = useState('')

  useEffect(() => {
    loadProfile().then(setProfile)

    // Check whether the content script detected an ATS on the active tab
    chrome.runtime.sendMessage(
      { target: 'content', type: 'GET_FIELDS' },
      (response) => {
        if (chrome.runtime.lastError) return
        if (response?.success) {
          setAtsStatus({ detected: true, ats: response.ats ?? 'Unknown' })
        }
      }
    )
  }, [])

  async function handleAutofill() {
    if (!profile) {
      setStatusMsg('Please fill in your profile first.')
      return
    }
    setFilling(true)
    setStatusMsg('')
    chrome.runtime.sendMessage(
      { target: 'content', type: 'FILL_FIELDS', payload: { profile } },
      (response) => {
        setFilling(false)
        if (response?.success) {
          const { filled, skipped } = response.result
          setStatusMsg(`Filled ${filled} field(s). ${skipped} skipped.`)
        } else {
          setStatusMsg('Autofill failed. Make sure you are on a supported job page.')
        }
      }
    )
  }

  async function handleGenerate() {
    if (!question.trim()) {
      setStatusMsg('Enter the question you want answered.')
      return
    }
    if (!profile?.resumeText) {
      setStatusMsg('Add your resume text in the Profile tab first.')
      return
    }
    setGenerating(true)
    setStatusMsg('')
    setGeneratedAnswer('')

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question,
          jobDescription,
          resumeText: profile.resumeText,
        }),
      })
      if (!res.ok) throw new Error(`API error ${res.status}`)
      const data = await res.json()
      setGeneratedAnswer(data.answer)
    } catch (err) {
      setStatusMsg('Failed to generate answer. Check your API configuration.')
    } finally {
      setGenerating(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {/* ATS detection badge */}
      <div className="flex items-center gap-2">
        <span
          className={[
            'w-2.5 h-2.5 rounded-full',
            atsStatus.detected ? 'bg-green-500' : 'bg-gray-300',
          ].join(' ')}
        />
        <span className="text-sm text-gray-700">
          {atsStatus.detected
            ? `Detected: ${atsStatus.ats}`
            : 'No supported ATS detected on this page.'}
        </span>
      </div>

      {/* Standard autofill */}
      <section className="flex flex-col gap-2 p-3 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-sm">Standard Fields</h3>
        <p className="text-xs text-gray-500">
          Fills name, email, phone, LinkedIn, etc. from your profile.
        </p>
        <button
          onClick={handleAutofill}
          disabled={filling}
          className="bg-indigo-600 text-white py-1.5 rounded text-sm font-medium hover:bg-indigo-700 disabled:opacity-50 transition-colors"
        >
          {filling ? 'Filling…' : 'Autofill Standard Fields'}
        </button>
      </section>

      {/* AI answer generator */}
      <section className="flex flex-col gap-2 p-3 border border-gray-200 rounded-lg">
        <h3 className="font-semibold text-sm">Generate Answer</h3>

        <label className="text-xs font-medium text-gray-600">Job Description (optional but recommended)</label>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          rows={3}
          placeholder="Paste the job description here…"
          className="border border-gray-300 rounded px-2 py-1.5 text-xs resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <label className="text-xs font-medium text-gray-600">Question</label>
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          rows={2}
          placeholder="Why do you want to work here?"
          className="border border-gray-300 rounded px-2 py-1.5 text-xs resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />

        <button
          onClick={handleGenerate}
          disabled={generating}
          className="bg-emerald-600 text-white py-1.5 rounded text-sm font-medium hover:bg-emerald-700 disabled:opacity-50 transition-colors"
        >
          {generating ? 'Generating…' : 'Generate Answer'}
        </button>

        {generatedAnswer && (
          <div className="flex flex-col gap-1 mt-1">
            <label className="text-xs font-medium text-gray-600">Generated Answer</label>
            <textarea
              value={generatedAnswer}
              onChange={(e) => setGeneratedAnswer(e.target.value)}
              rows={5}
              className="border border-gray-300 rounded px-2 py-1.5 text-xs resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        )}
      </section>

      {statusMsg && (
        <p className="text-xs text-center text-gray-600">{statusMsg}</p>
      )}
    </div>
  )
}
