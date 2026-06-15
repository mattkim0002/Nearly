/**
 * AI client — calls the Vercel serverless function to generate answers.
 */

import type { GenerateRequest, GenerateResponse } from '../shared/types'
import { incrementAICount, getDailyAICount, DAILY_AI_LIMIT, loadState } from '../shared/storage'

const API_URL = 'https://fieldwork-app.vercel.app/api/generate'

export class DailyLimitError extends Error {
  constructor() {
    super(`Daily limit of ${DAILY_AI_LIMIT} AI answers reached. Try again tomorrow.`)
    this.name = 'DailyLimitError'
  }
}

export async function generateAnswer(req: GenerateRequest): Promise<string> {
  const { count } = await getDailyAICount()
  if (count >= DAILY_AI_LIMIT) throw new DailyLimitError()

  const state = await loadState()

  const res = await fetch(API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-User-Id': state.userId,
    },
    body: JSON.stringify(req),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`API error ${res.status}: ${text}`)
  }

  const data = (await res.json()) as GenerateResponse
  await incrementAICount()
  return data.answer
}
