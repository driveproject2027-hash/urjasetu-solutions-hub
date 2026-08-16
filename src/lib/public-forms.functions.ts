import { createServerFn } from '@tanstack/react-start'
import { getRequestHeader } from '@tanstack/react-start/server'

import type { PublicFormInput } from './validation'

export const submitPublicForm = createServerFn({ method: 'POST' })
  .inputValidator((input: PublicFormInput) => input)
  .handler(async ({ data }) => {
    const { handlePublicSubmission, resolveOptionalUser, SubmissionError } = await import(
      './public-forms.server'
    )
    const { RateLimitError } = await import('./rate-limit.server')
    const { firstIssue } = await import('./validation')

    try {
      const userId = await resolveOptionalUser(getRequestHeader('authorization'))
      return await handlePublicSubmission(data, userId)
    } catch (error) {
      if (error instanceof RateLimitError) {
        throw new Error('Too many submissions from this device. Please try again later.')
      }
      const issue = firstIssue(error)
      if (issue) throw new Error(issue)
      if (error instanceof SubmissionError) throw new Error(error.message)
      console.error('[submitPublicForm] unexpected failure', error)
      throw new Error('Something went wrong. Please try again in a moment.')
    }
  })

export const checkAuthThrottle = createServerFn({ method: 'POST' })
  .inputValidator((input: { action: 'signin' | 'signup' | 'reset'; email: string; outcome: 'attempt' | 'failure' | 'success' }) => input)
  .handler(async ({ data }) => {
    const { evaluateAuthThrottle } = await import('./auth-throttle.server')
    try {
      return await evaluateAuthThrottle(data)
    } catch (error) {
      const { firstIssue } = await import('./validation')
      const issue = firstIssue(error)
      if (issue) return { allowed: true, retryAfterSeconds: 0 }
      console.error('[checkAuthThrottle] unexpected failure', error)
      return { allowed: true, retryAfterSeconds: 0 }
    }
  })
