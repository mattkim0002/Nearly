/**
 * ProfileForm — user enters their background once; stored in chrome.storage.local
 *
 * Fields: name, email, phone, LinkedIn, website, location, work history (resume text)
 */

import React, { useEffect, useState } from 'react'
import { loadProfile, saveProfile } from '../../shared/storage'
import type { UserProfile } from '../../shared/types'

const EMPTY_PROFILE: UserProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  linkedIn: '',
  website: '',
  location: '',
  coverLetter: '',
  resumeText: '',
}

export default function ProfileForm() {
  const [profile, setProfile] = useState<UserProfile>(EMPTY_PROFILE)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    loadProfile().then((p) => { if (p) setProfile(p) })
  }, [])

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setProfile((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setSaved(false)
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    await saveProfile(profile)
    setSaved(true)
  }

  return (
    <form onSubmit={handleSave} className="flex flex-col gap-3">
      <h2 className="font-semibold text-base">Your Profile</h2>

      <div className="flex gap-2">
        <Field label="First Name" name="firstName" value={profile.firstName} onChange={handleChange} />
        <Field label="Last Name" name="lastName" value={profile.lastName} onChange={handleChange} />
      </div>

      <Field label="Email" name="email" type="email" value={profile.email} onChange={handleChange} />
      <Field label="Phone" name="phone" type="tel" value={profile.phone} onChange={handleChange} />
      <Field label="LinkedIn URL" name="linkedIn" value={profile.linkedIn} onChange={handleChange} />
      <Field label="Personal Website" name="website" value={profile.website} onChange={handleChange} />
      <Field label="Location (City, State)" name="location" value={profile.location} onChange={handleChange} />

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">Resume / Work History</label>
        <textarea
          name="resumeText"
          value={profile.resumeText}
          onChange={handleChange}
          rows={6}
          placeholder="Paste your resume or work history here. This is sent to the AI when generating answers."
          className="border border-gray-300 rounded px-2 py-1.5 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-gray-600">Default Cover Letter (optional)</label>
        <textarea
          name="coverLetter"
          value={profile.coverLetter}
          onChange={handleChange}
          rows={4}
          placeholder="A generic cover letter template the AI can tailor per application."
          className="border border-gray-300 rounded px-2 py-1.5 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-indigo-400"
        />
      </div>

      <button
        type="submit"
        className="mt-2 bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700 transition-colors"
      >
        Save Profile
      </button>

      {saved && <p className="text-green-600 text-sm text-center">Saved!</p>}
    </form>
  )
}

// ── Small reusable field component ──────────────────────────────────────────

interface FieldProps {
  label: string
  name: keyof UserProfile
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  type?: string
}

function Field({ label, name, value, onChange, type = 'text' }: FieldProps) {
  return (
    <div className="flex flex-col gap-1 flex-1">
      <label className="text-xs font-medium text-gray-600">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
      />
    </div>
  )
}
