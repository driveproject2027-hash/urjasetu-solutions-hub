import { createFileRoute, notFound } from '@tanstack/react-router'

export const Route = createFileRoute('/lovable/email/auth/webhook')({
  loader: () => {
    if (import.meta.env.PROD) throw notFound()
  },
  server: {
    handlers: {
      POST: async () => {
        if (import.meta.env.PROD) return new Response(null, { status: 404 })
        return Response.json(
          {
            message:
              'Deprecated endpoint. Auth emails are now handled by Supabase and transactional emails by Resend.',
          },
          { status: 410 },
        )
      },
    },
  },
})