/**
 * Chrome storage helpers — thin wrappers around chrome.storage.local
 * so every module works with typed UserProfile objects.
 */

import type { UserProfile } from './types'

const PROFILE_KEY = 'applypilot_profile'

export async function loadProfile(): Promise<UserProfile | null> {
  return new Promise((resolve) => {
    chrome.storage.local.get(PROFILE_KEY, (result) => {
      resolve((result[PROFILE_KEY] as UserProfile) ?? null)
    })
  })
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set({ [PROFILE_KEY]: profile }, resolve)
  })
}

export async function clearProfile(): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.remove(PROFILE_KEY, resolve)
  })
}
