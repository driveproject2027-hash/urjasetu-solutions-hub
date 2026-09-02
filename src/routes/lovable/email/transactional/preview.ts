import * as React from 'react'
import { render } from '@react-email/render'
import { createFileRoute, notFound } from '@tanstack/react-router'
import { TEMPLATES } from '@/lib/email-templates/registry'

export const Route = createFileRoute('/lovable/email/transactional/preview')({
  loader: () => {
    if (import.meta.env.PROD) throw notFound()
  },
  component: TransactionalEmailPreviewPage,
  server: {
    handlers: {
      POST: async () => {
        if (import.meta.env.PROD) return new Response(null, { status: 404 })
        const templateNames = Object.keys(TEMPLATES)
        const results: Array<{
          templateName: string
          displayName: string
          subject: string
          html: string
          status: 'ready' | 'preview_data_required' | 'render_failed'
          errorMessage?: string
        }> = []

        for (const name of templateNames) {
          const entry = TEMPLATES[name]
          if (!entry) continue
          const displayName = entry.displayName || name

          if (!entry.previewData) {
            results.push({
              templateName: name,
              displayName,
              subject: '',
              html: '',
              status: 'preview_data_required',
            })
            continue
          }

          try {
            const html = await render(React.createElement(entry.component, entry.previewData))
            const resolvedSubject =
              typeof entry.subject === 'function' ? entry.subject(entry.previewData) : entry.subject

            results.push({
              templateName: name,
              displayName,
              subject: resolvedSubject,
              html,
              status: 'ready',
            })
          } catch (err) {
            results.push({
              templateName: name,
              displayName,
              subject: '',
              html: '',
              status: 'render_failed',
              errorMessage: err instanceof Error ? err.message : String(err),
            })
          }
        }

        return Response.json({ templates: results })
      },
    },
  },
})

function TransactionalEmailPreviewPage() {
  return React.createElement(
    'main',
    { className: 'container-page py-16' },
    React.createElement('h1', { className: 'font-display text-2xl font-semibold' }, 'Transactional email previews'),
    React.createElement(
      'p',
      { className: 'mt-3 text-sm text-muted-foreground' },
      'This endpoint accepts POST requests for rendering transactional email templates.',
    ),
  )
}
