/**
 * Dashboard — main view after profile setup.
 * Shows ATS detection status, autofill controls, and per-question AI generation.
 */

import React, { useEffect, useState, useCallback } from 'react'
import type { DetectedField, UserProfile } from '../../shared/types'
import { getDetectedFields, fillStandardFields } from '../../lib/messaging'
import GenerateButton from '../components/GenerateButton'
import { getDailyAICount, DAILY_AI_LIMIT } from '../../shared/storage'

interface Props {
  profile: UserProfile
  onReview: () => void
  onEditProfile: () => void
}

export default function Dashboard({ profile, onReview, onEditProfile }: Props) {
  const [ats, setAts] = useState<string | null>(null)
  const [fields, setFields] = useState<DetectedField[]>([])
  const [filling, setFilling] = useState(false)
  const [fillResult, setFillResult] = useState<string | null>(null)
  const [jobDesc, setJobDesc] = useState('')
  const [companyName, setCompanyName] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [aiCount, setAiCount] = useState(0)
  const [scanError, setScanError] = useState<string | null>(null)

  const scanPage = useCallback(async () => {
    setScanError(null)
    const res = await getDetectedFields()
    if (res.success) {
      setAts(res.ats ?? null)
      setFields(res.fields ?? [])
    } else {
      setScanError('Could not scan page. Make sure you are on a supported job application.')
    }
  }, [])

  useEffect(() => {
    scanPage()
    getDailyAICount().then(({ count }) => setAiCount(count))
  }, [scanPage])

  async function handleAutofill() {
    setFilling(true)
    setFillResult(null)
    const res = await fillStandardFields(profile)
    setFilling(false)
    if (res.success && res.result) {
      setFillResult(`Filled ${res.result.filled} field(s). ${res.result.skipped} skipped.`)
      // Re-scan to update field values in state
      await scanPage()
    } else {
      setFillResult(res.error ?? 'Autofill failed.')
    }
  }

  const openEnded = fields.filter((f) => f.isOpenEnded)
  const standardFillable = fields.filter((f) => f.mappedProfileKey && !f.isOpenEnded)
  const aiUsedUp = aiCount >= DAILY_AI_LIMIT

  return (
    <div className="flex flex-col gap-4 pb-4">
      {/* ATS status */}
      <div className="flex items-center justify-between p-3 bg-background rounded-lg border border-border">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full ${ats ? 'bg-success' : 'bg-text-muted'}`} />
          <span className="text-sm text-text-main">
            {ats ? `${capitalize(ats)} detected` : 'No supported ATS on this page'}
          </span>
        </div>
        <button onClick={scanPage} className="text-xs text-primary hover:underline">
          Rescan
        </button>
      </div>

      {scanError && <p className="text-xs text-error px-1">{scanError}</p>}

      {/* Job context (optional — helps AI generate better answers) */}
      {ats && (
        <details className="group">
          <summary className="text-xs font-medium text-text-muted cursor-pointer list-none flex items-center gap-1">
            <span className="text-primary">▸</span>
            <span className="group-open:hidden">Add job context (improves AI answers)</span>
            <span className="hidden group-open:inline">Job context</span>
          </summary>
          <div className="flex flex-col gap-2 mt-2">
            <div className="flex gap-2">
              <SmallInput placeholder="Company name" value={companyName} onChange={setCompanyName} />
              <SmallInput placeholder="Job title" value={jobTitle} onChange={setJobTitle} />
            </div>
            <textarea
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
              rows={4}
              placeholder="Paste job description here…"
              className="border border-border rounded px-2 py-1.5 text-xs resize-y focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background"
            />
          </div>
        </details>
      )}

      {/* Standard autofill */}
      {ats && (
        <section className="flex flex-col gap-2 p-3 bg-background rounded-lg border border-border">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-main">Standard Fields</h3>
            <span className="text-xs text-text-muted">{standardFillable.length} found</span>
          </div>
          <p className="text-xs text-text-muted">
            Name, email, phone, LinkedIn, and other profile fields.
          </p>
          <button
            onClick={handleAutofill}
            disabled={filling || standardFillable.length === 0}
            className="py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark disabled:opacity-50 transition-colors"
          >
            {filling ? 'Filling…' : 'Autofill Standard Fields'}
          </button>
          {fillResult && <p className="text-xs text-text-muted text-center">{fillResult}</p>}
        </section>
      )}

      {/* Open-ended questions */}
      {openEnded.length > 0 && (
        <section className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-text-main">Open-Ended Questions</h3>
            <span className="text-xs text-text-muted">
              {aiCount}/{DAILY_AI_LIMIT} AI uses today
            </span>
          </div>
          {aiUsedUp && (
            <p className="text-xs text-warning p-2 bg-warning/10 rounded-lg border border-warning/20">
              Daily AI limit reached. Resets tomorrow.
            </p>
          )}
          {openEnded.map((field) => (
            <div key={field.selector} className="p-3 bg-background rounded-lg border border-border flex flex-col gap-2">
              <p className="text-xs font-medium text-text-main">{field.label}</p>
              {!aiUsedUp && (
                <GenerateButton
                  field={field}
                  jobDescription={jobDesc}
                  resumeText={profile.resumeText}
                  companyName={companyName || undefined}
                  jobTitle={jobTitle || undefined}
                  onAnswerGenerated={() => {
                    setAiCount((c) => c + 1)
                  }}
                />
              )}
            </div>
          ))}
        </section>
      )}

      {/* Review button */}
      {ats && (
        <button
          onClick={onReview}
          className="mt-auto py-2 rounded-lg border border-primary text-primary text-sm font-medium hover:bg-primary-light transition-colors"
        >
          Review All Fields →
        </button>
      )}

      {/* Edit profile link */}
      <button
        onClick={onEditProfile}
        className="text-xs text-text-muted hover:text-primary text-center"
      >
        Edit Profile
      </button>
    </div>
  )
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function SmallInput({ placeholder, value, onChange }: { placeholder: string; value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex-1 border border-border rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background"
    />
  )
}
