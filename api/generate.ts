/**
 * Fieldwork — Vercel Serverless Function
 * POST /api/generate
 *
 * Receives a job application question + resume + context,
 * calls OpenAI gpt-4o-mini, and returns a tailored answer.
 *
 * Environment variables required:
 *   OPENAI_API_KEY — your OpenAI secret key
 *
 * Rate limiting: max 10 requests per userId per day (tracked in-memory per instance).
 * For production, swap with a persistent store (Redis, KV, etc.).
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const MODEL = 'gpt-4o-mini'
const MAX_TOKENS = 500
const DAILY_LIMIT = 10

// In-memory rate limit map: userId → { count, date }
// Resets on cold-start; good enough for MVP free tier.
const rateLimitMap = new Map<string, { count: number; date: string }>()

interface RequestBody {
  question: string
  resumeText: string
  jobDescription?: string
  companyName?: string
  jobTitle?: string
}

function todayUTC(): string {
  return new Date().toISOString().slice(0, 10)
}

function checkRateLimit(userId: string): { allowed: boolean; remaining: number } {
  const today = todayUTC()
  const entry = rateLimitMap.get(userId)

  if (!entry || entry.date !== today) {
    rateLimitMap.set(userId, { count: 1, date: today })
    return { allowed: true, remaining: DAILY_LIMIT - 1 }
  }

  if (entry.count >= DAILY_LIMIT) {
    return { allowed: false, remaining: 0 }
  }

  entry.count += 1
  return { allowed: true, remaining: DAILY_LIMIT - entry.count }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // CORS preflight
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-User-Id')

  if (req.method === 'OPTIONS') return res.status(200).end()
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Rate limiting
  const userId = (req.headers['x-user-id'] as string | undefined)?.slice(0, 64) ?? 'anonymous'
  const { allowed, remaining } = checkRateLimit(userId)

  res.setHeader('X-RateLimit-Remaining', String(remaining))

  if (!allowed) {
    return res.status(429).json({
      error: `Daily limit of ${DAILY_LIMIT} answers reached. Try again tomorrow.`,
    })
  }

  const { question, resumeText, jobDescription, companyName, jobTitle } =
    (req.body ?? {}) as Partial<RequestBody>

  if (!question?.trim() || !resumeText?.trim()) {
    return res.status(400).json({ error: '`question` and `resumeText` are required.' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY is not configured.' })
  }

  const systemPrompt = `You are a professional job application assistant. Generate concise, authentic-sounding answers for job application questions.

Rules:
- Write in first person as the applicant
- Keep answers 2-4 sentences unless the question clearly asks for more detail
- Reference specific details from the resume and job description to make answers feel personalized
- Match the tone to the company (startup = more casual, enterprise = more formal)
- NEVER make up experiences the applicant doesn't have in their resume
- NEVER use generic filler phrases like "I am passionate about..." or "I would be thrilled to..."
- Be specific and concrete — reference actual skills, projects, or experiences from the resume`

  const contextParts = [
    companyName ? `COMPANY: ${companyName}` : null,
    jobTitle ? `JOB TITLE: ${jobTitle}` : null,
    jobDescription ? `JOB DESCRIPTION:\n${jobDescription.slice(0, 3000)}` : null,
    `MY RESUME:\n${resumeText.slice(0, 3000)}`,
    `APPLICATION QUESTION:\n"${question}"`,
    'Write a strong, specific answer to this question based on my resume and this job description.',
  ]
    .filter(Boolean)
    .join('\n\n')

  try {
    const openAiRes = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: MAX_TOKENS,
        temperature: 0.7,
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: contextParts },
        ],
      }),
    })

    if (!openAiRes.ok) {
      const errText = await openAiRes.text()
      console.error('[Fieldwork] OpenAI error:', errText)
      return res.status(502).json({ error: 'OpenAI request failed.' })
    }

    const data = await openAiRes.json() as { choices?: Array<{ message?: { content?: string } }> }
    const answer = data.choices?.[0]?.message?.content?.trim() ?? ''
    return res.status(200).json({ answer })
  } catch (err) {
    console.error('[Fieldwork] Unexpected error:', err)
    return res.status(500).json({ error: 'Internal server error.' })
  }
}
