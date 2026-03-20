/**
 * FieldReview — shows every field that was filled so the user can
 * review and edit values before submitting the application.
 *
 * TODO: Persist filled field state in chrome.storage.session and read it here.
 */

import React from 'react'

interface FilledField {
  label: string
  selector: string
  value: string
}

// Placeholder — will be populated from storage in a future iteration
const MOCK_FIELDS: FilledField[] = []

export default function FieldReview() {
  if (MOCK_FIELDS.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-2 text-gray-400 text-sm">
        <p>No fields filled yet.</p>
        <p className="text-xs">Use the Application tab to autofill the form first.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-semibold text-base">Review Filled Fields</h2>
      {MOCK_FIELDS.map((field) => (
        <div key={field.selector} className="flex flex-col gap-1">
          <label className="text-xs font-medium text-gray-600">{field.label}</label>
          <input
            type="text"
            defaultValue={field.value}
            className="border border-gray-300 rounded px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
      ))}

      <button className="mt-2 bg-indigo-600 text-white py-2 rounded font-medium hover:bg-indigo-700 transition-colors">
        Apply Changes to Page
      </button>
    </div>
  )
}
