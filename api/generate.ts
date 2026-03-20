/**
 * ApplyPilot — Vercel Serverless Function
 * POST /api/generate
 *
 * Receives a job application question + resume text (+ optional job description),
 * proxies to OpenAI gpt-4o-mini, and returns a tailored answer.
 *
 * Environment variables required (set in Vercel dashboard):
 *   OPENAI_API_KEY — your OpenAI secret key
 */

import type { VercelRequest, VercelResponse } from '@vercel/node'

const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions'
const MODEL = 'gpt-4o-mini'
const MAX_TOKENS = 400

interface GenerateRequestBody {
  question: string
  resumeText: string
  jobDescription?: string
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { question, resumeText, jobDescription } =
    req.body as Partial<GenerateRequestBody>

  if (!question?.trim() || !resumeText?.trim()) {
    return res
      .status(400)
      .json({ error: '`question` and `resumeText` are required.' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    return res.status(500).json({ error: 'OPENAI_API_KEY is not configured.' })
  }

  const systemPrompt = `You are an expert job application assistant.
Write concise, genuine, and compelling answers to job application questions.
Base your answer on the candidate's resume and, where provided, the job description.
Keep answers under 250 words unless the question clearly warrants more detail.
Do not invent facts not present in the resume.`

  const userPrompt = [
    jobDescription
      ? `Job Description:\n${jobDescription.slice(0, 2000)}`
      : null,
    `Resume / Work History:\n${resumeText.slice(0, 3000)}`,
    `Question:\n${question}`,
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
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt },
        ],
      }),
    })

    if (!openAiRes.ok) {
      const err = await openAiRes.text()
      console.error('[ApplyPilot] OpenAI error:', err)
      return res.status(502).json({ error: 'OpenAI request failed.' })
    }

    const data = await openAiRes.json()
    const answer: string = data.choices?.[0]?.message?.content?.trim() ?? ''

    return res.status(200).json({ answer })
  } catch (err) {
    console.error('[ApplyPilot] Unexpected error:', err)
    return res.status(500).json({ error: 'Internal server error.' })
  }
}
