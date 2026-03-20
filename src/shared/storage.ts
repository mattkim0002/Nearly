/**
 * Chrome storage helpers — typed wrappers around chrome.storage.local
 */

import type { UserProfile, AppState } from './types'

const STORAGE_KEY = 'fieldwork_state'

function generateUserId(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const DEFAULT_STATE: AppState = {
  profile: null,
  isSetupComplete: false,
  userId: generateUserId(),
  dailyAICount: 0,
  dailyAICountDate: '',
}

export async function loadState(): Promise<AppState> {
  return new Promise((resolve) => {
    chrome.storage.local.get(STORAGE_KEY, (result) => {
      const saved = result[STORAGE_KEY] as Partial<AppState> | undefined
      resolve({ ...DEFAULT_STATE, ...(saved ?? {}) })
    })
  })
}

export async function saveState(state: Partial<AppState>): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.get(STORAGE_KEY, (result) => {
      const current = (result[STORAGE_KEY] as Partial<AppState>) ?? {}
      chrome.storage.local.set({ [STORAGE_KEY]: { ...current, ...state } }, resolve)
    })
  })
}

export async function loadProfile(): Promise<UserProfile | null> {
  const state = await loadState()
  return state.profile
}

export async function saveProfile(profile: UserProfile): Promise<void> {
  await saveState({ profile, isSetupComplete: true })
}

export async function clearProfile(): Promise<void> {
  await saveState({ profile: null, isSetupComplete: false })
}

/** Increment daily AI count, resetting if the date has changed. Returns new count. */
export async function incrementAICount(): Promise<number> {
  const state = await loadState()
  const today = new Date().toISOString().slice(0, 10)
  const count = state.dailyAICountDate === today ? state.dailyAICount + 1 : 1
  await saveState({ dailyAICount: count, dailyAICountDate: today })
  return count
}

export async function getDailyAICount(): Promise<{ count: number; date: string }> {
  const state = await loadState()
  const today = new Date().toISOString().slice(0, 10)
  if (state.dailyAICountDate !== today) return { count: 0, date: today }
  return { count: state.dailyAICount, date: state.dailyAICountDate }
}

export const DAILY_AI_LIMIT = 10
