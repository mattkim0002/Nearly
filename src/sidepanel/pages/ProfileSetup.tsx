/**
 * ProfileSetup — multi-step profile form shown on first use.
 * Steps: Basic Info → Work Experience → Education → Skills → Resume
 */

import React, { useState } from 'react'
import { saveProfile } from '../../shared/storage'
import type { UserProfile, WorkExperience, Education } from '../../shared/types'

const EMPTY_WORK: WorkExperience = { company: '', title: '', startDate: '', endDate: '', description: '' }
const EMPTY_EDU: Education = { school: '', degree: '', field: '', graduationDate: '', gpa: '' }

const EMPTY_PROFILE: UserProfile = {
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  address: { street: '', city: '', state: '', zip: '', country: 'United States' },
  linkedinUrl: '',
  portfolioUrl: '',
  resumeText: '',
  workExperience: [{ ...EMPTY_WORK }],
  education: [{ ...EMPTY_EDU }],
  skills: [],
  visaSponsorship: false,
  authorizedToWork: true,
  willingToRelocate: false,
  expectedSalary: '',
}

interface Props {
  onComplete: () => void
}

const STEPS = ['Basic Info', 'Work', 'Education', 'Skills', 'Resume'] as const
type Step = 0 | 1 | 2 | 3 | 4

export default function ProfileSetup({ onComplete }: Props) {
  const [step, setStep] = useState<Step>(0)
  const [profile, setProfile] = useState<UserProfile>(EMPTY_PROFILE)
  const [saving, setSaving] = useState(false)

  function setField<K extends keyof UserProfile>(key: K, value: UserProfile[K]) {
    setProfile((p) => ({ ...p, [key]: value }))
  }

  async function handleFinish() {
    setSaving(true)
    await saveProfile(profile)
    setSaving(false)
    onComplete()
  }

  return (
    <div className="flex flex-col h-full">
      {/* Progress bar */}
      <div className="flex gap-1 px-4 py-3">
        {STEPS.map((label, i) => (
          <div key={label} className="flex-1 flex flex-col items-center gap-1">
            <div
              className={`h-1.5 w-full rounded-full ${
                i <= step ? 'bg-primary' : 'bg-border'
              }`}
            />
            <span className={`text-[10px] ${i === step ? 'text-primary font-medium' : 'text-text-muted'}`}>
              {label}
            </span>
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-4 pb-4">
        {step === 0 && (
          <BasicInfo profile={profile} onChange={setField} />
        )}
        {step === 1 && (
          <WorkExperienceStep
            items={profile.workExperience}
            onChange={(v) => setField('workExperience', v)}
          />
        )}
        {step === 2 && (
          <EducationStep
            items={profile.education}
            onChange={(v) => setField('education', v)}
          />
        )}
        {step === 3 && (
          <SkillsStep
            skills={profile.skills}
            onChange={(v) => setField('skills', v)}
          />
        )}
        {step === 4 && (
          <ResumeStep
            resumeText={profile.resumeText}
            onChange={(v) => setField('resumeText', v)}
          />
        )}
      </div>

      {/* Navigation */}
      <div className="flex gap-2 px-4 py-3 border-t border-border">
        {step > 0 && (
          <button
            onClick={() => setStep((s) => (s - 1) as Step)}
            className="flex-1 py-2 rounded-lg border border-border text-text-main text-sm font-medium hover:bg-background"
          >
            Back
          </button>
        )}
        {step < 4 ? (
          <button
            onClick={() => setStep((s) => (s + 1) as Step)}
            className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark"
          >
            Next
          </button>
        ) : (
          <button
            onClick={handleFinish}
            disabled={saving}
            className="flex-1 py-2 rounded-lg bg-primary text-white text-sm font-medium hover:bg-primary-dark disabled:opacity-50"
          >
            {saving ? 'Saving…' : 'Save Profile'}
          </button>
        )}
      </div>
    </div>
  )
}

// ── Step sub-components ───────────────────────────────────────────────────────

interface BasicInfoProps {
  profile: UserProfile
  onChange: <K extends keyof UserProfile>(key: K, value: UserProfile[K]) => void
}

function BasicInfo({ profile, onChange }: BasicInfoProps) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-semibold text-text-main">Basic Information</h2>
      <div className="flex gap-2">
        <LabeledInput label="First Name" value={profile.firstName} onChange={(v) => onChange('firstName', v)} />
        <LabeledInput label="Last Name" value={profile.lastName} onChange={(v) => onChange('lastName', v)} />
      </div>
      <LabeledInput label="Email" type="email" value={profile.email} onChange={(v) => onChange('email', v)} />
      <LabeledInput label="Phone" type="tel" value={profile.phone} onChange={(v) => onChange('phone', v)} />
      <LabeledInput label="City" value={profile.address.city}
        onChange={(v) => onChange('address', { ...profile.address, city: v })} />
      <div className="flex gap-2">
        <LabeledInput label="State" value={profile.address.state}
          onChange={(v) => onChange('address', { ...profile.address, state: v })} />
        <LabeledInput label="ZIP" value={profile.address.zip}
          onChange={(v) => onChange('address', { ...profile.address, zip: v })} />
      </div>
      <LabeledInput label="LinkedIn URL" value={profile.linkedinUrl ?? ''}
        onChange={(v) => onChange('linkedinUrl', v)} />
      <LabeledInput label="Portfolio / Website" value={profile.portfolioUrl ?? ''}
        onChange={(v) => onChange('portfolioUrl', v)} />
      <div className="flex flex-col gap-2 p-3 bg-background rounded-lg border border-border">
        <span className="text-xs font-medium text-text-main">Work Authorization</span>
        <CheckRow
          label="Authorized to work in US"
          checked={profile.authorizedToWork}
          onChange={(v) => onChange('authorizedToWork', v)}
        />
        <CheckRow
          label="Need visa sponsorship"
          checked={profile.visaSponsorship}
          onChange={(v) => onChange('visaSponsorship', v)}
        />
        <CheckRow
          label="Willing to relocate"
          checked={profile.willingToRelocate}
          onChange={(v) => onChange('willingToRelocate', v)}
        />
      </div>
      <LabeledInput label="Expected Salary (optional)" value={profile.expectedSalary ?? ''}
        onChange={(v) => onChange('expectedSalary', v)} />
    </div>
  )
}

function WorkExperienceStep({
  items,
  onChange,
}: {
  items: WorkExperience[]
  onChange: (v: WorkExperience[]) => void
}) {
  function updateItem(i: number, patch: Partial<WorkExperience>) {
    const next = items.map((item, idx) => (idx === i ? { ...item, ...patch } : item))
    onChange(next)
  }
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-semibold text-text-main">Work Experience</h2>
      {items.map((item, i) => (
        <div key={i} className="flex flex-col gap-2 p-3 bg-background rounded-lg border border-border">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-text-muted">Position {i + 1}</span>
            {items.length > 1 && (
              <button
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                className="text-xs text-error hover:underline"
              >
                Remove
              </button>
            )}
          </div>
          <LabeledInput label="Job Title" value={item.title} onChange={(v) => updateItem(i, { title: v })} />
          <LabeledInput label="Company" value={item.company} onChange={(v) => updateItem(i, { company: v })} />
          <div className="flex gap-2">
            <LabeledInput label="Start (YYYY-MM)" value={item.startDate} onChange={(v) => updateItem(i, { startDate: v })} />
            <LabeledInput label="End (or 'present')" value={item.endDate} onChange={(v) => updateItem(i, { endDate: v })} />
          </div>
          <LabeledTextarea
            label="Description"
            value={item.description}
            onChange={(v) => updateItem(i, { description: v })}
            rows={3}
          />
        </div>
      ))}
      <button
        onClick={() => onChange([...items, { ...EMPTY_WORK }])}
        className="text-sm text-primary hover:underline self-start"
      >
        + Add Position
      </button>
    </div>
  )
}

function EducationStep({
  items,
  onChange,
}: {
  items: Education[]
  onChange: (v: Education[]) => void
}) {
  function updateItem(i: number, patch: Partial<Education>) {
    onChange(items.map((item, idx) => (idx === i ? { ...item, ...patch } : item)))
  }
  return (
    <div className="flex flex-col gap-4">
      <h2 className="font-semibold text-text-main">Education</h2>
      {items.map((item, i) => (
        <div key={i} className="flex flex-col gap-2 p-3 bg-background rounded-lg border border-border">
          <div className="flex justify-between items-center">
            <span className="text-xs font-medium text-text-muted">School {i + 1}</span>
            {items.length > 1 && (
              <button
                onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                className="text-xs text-error hover:underline"
              >
                Remove
              </button>
            )}
          </div>
          <LabeledInput label="School" value={item.school} onChange={(v) => updateItem(i, { school: v })} />
          <div className="flex gap-2">
            <LabeledInput label="Degree" value={item.degree} onChange={(v) => updateItem(i, { degree: v })} />
            <LabeledInput label="Field of Study" value={item.field} onChange={(v) => updateItem(i, { field: v })} />
          </div>
          <div className="flex gap-2">
            <LabeledInput label="Graduation (YYYY-MM)" value={item.graduationDate} onChange={(v) => updateItem(i, { graduationDate: v })} />
            <LabeledInput label="GPA (optional)" value={item.gpa ?? ''} onChange={(v) => updateItem(i, { gpa: v })} />
          </div>
        </div>
      ))}
      <button
        onClick={() => onChange([...items, { ...EMPTY_EDU }])}
        className="text-sm text-primary hover:underline self-start"
      >
        + Add School
      </button>
    </div>
  )
}

function SkillsStep({
  skills,
  onChange,
}: {
  skills: string[]
  onChange: (v: string[]) => void
}) {
  const [input, setInput] = useState('')

  function addSkill() {
    const trimmed = input.trim()
    if (trimmed && !skills.includes(trimmed)) {
      onChange([...skills, trimmed])
    }
    setInput('')
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-semibold text-text-main">Skills</h2>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSkill() } }}
          placeholder="e.g. TypeScript, React, Python…"
          className="flex-1 border border-border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background"
        />
        <button
          onClick={addSkill}
          className="px-3 py-1.5 bg-primary text-white rounded text-sm hover:bg-primary-dark"
        >
          Add
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        {skills.map((s) => (
          <span
            key={s}
            className="flex items-center gap-1 px-2 py-1 bg-primary-light text-primary text-xs rounded-full"
          >
            {s}
            <button
              onClick={() => onChange(skills.filter((x) => x !== s))}
              className="hover:text-error"
            >
              ×
            </button>
          </span>
        ))}
      </div>
    </div>
  )
}

function ResumeStep({ resumeText, onChange }: { resumeText: string; onChange: (v: string) => void }) {
  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-semibold text-text-main">Resume Text</h2>
      <p className="text-xs text-text-muted">
        Paste the plain text of your resume. This is sent to the AI when generating answers — the more detail, the better.
      </p>
      <textarea
        value={resumeText}
        onChange={(e) => onChange(e.target.value)}
        rows={14}
        placeholder="Paste your resume here…"
        className="border border-border rounded px-2 py-1.5 text-xs resize-y focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background"
      />
    </div>
  )
}

// ── Primitives ────────────────────────────────────────────────────────────────

function LabeledInput({
  label,
  value,
  onChange,
  type = 'text',
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <div className="flex flex-col gap-1 flex-1">
      <label className="text-xs font-medium text-text-muted">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-border rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background"
      />
    </div>
  )
}

function LabeledTextarea({
  label,
  value,
  onChange,
  rows = 3,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  rows?: number
}) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-xs font-medium text-text-muted">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        className="border border-border rounded px-2 py-1.5 text-sm resize-y focus:outline-none focus:ring-2 focus:ring-primary/40 bg-background"
      />
    </div>
  )
}

function CheckRow({
  label,
  checked,
  onChange,
}: {
  label: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <label className="flex items-center gap-2 text-sm text-text-main cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="accent-primary"
      />
      {label}
    </label>
  )
}
