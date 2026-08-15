import { createServerFn } from '@tanstack/react-start'

import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

export type ReviewUpdateResult = {
  status: string
  notified: 'sent' | 'skipped' | 'suppressed' | 'failed'
  recipient?: string
}

const STATUS_LABELS: Record<string, string> = {
  pending: 'Pending review',
  under_review: 'Under review',
  approved: 'Approved',
  rejected: 'Not approved',
  suspended: 'Suspended',
}

const STATUS_MESSAGES: Record<string, string> = {
  pending: 'Your registration has been received and is waiting to be reviewed by our team.',
  under_review: 'Our team is currently reviewing the details you submitted.',
  approved:
    'Your organisation is now listed on UrjaSetu and can receive customer enquiries and quote requests.',
  rejected:
    'After review, we are unable to list your organisation at this time. You are welcome to reapply with updated details.',
  suspended:
    'Your listing has been temporarily suspended and is not visible in the public directory.',
}

const PATH_LABELS: Record<string, string> = {
  solution: 'DRE Solution Provider',
  finance: 'Finance Provider',
  network: 'Network Partner',
}

export const updateJoinUsStatus = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: { id: string; status: string }) => {
    if (!input?.id || !input?.status) throw new Error('Missing application id or status')
    if (!STATUS_LABELS[input.status]) throw new Error('Unknown review status')
    return input
  })
  .handler(async ({ data, context }): Promise<ReviewUpdateResult> => {
    const { supabase, userId } = context

    const { data: isAdmin, error: roleError } = await supabase.rpc('has_role', {
      _user_id: userId,
      _role: 'admin',
    })
    if (roleError) throw new Error(roleError.message)
    if (!isAdmin) throw new Error('Forbidden')

    const { data: before, error: readError } = await supabase
      .from('provider_applications')
      .select('id, status, organisation, contact_person, email, provider_type, admin_notes')
      .eq('id', data.id)
      .maybeSingle()
    if (readError) throw new Error(readError.message)
    if (!before) throw new Error('Application not found')

    const { error: updateError } = await supabase
      .from('provider_applications')
      .update({ status: data.status })
      .eq('id', data.id)
    if (updateError) throw new Error(updateError.message)

    if (before.status === data.status) {
      return { status: data.status, notified: 'skipped' }
    }
    if (!before.email) {
      return { status: data.status, notified: 'skipped' }
    }

    try {
      const { sendTemplateEmail } = await import('@/lib/email-templates/send-email')
      const result = await sendTemplateEmail('join-us-status', before.email, {
        templateData: {
          organisation: before.organisation ?? '',
          contactPerson: before.contact_person ?? '',
          pathLabel: PATH_LABELS[before.provider_type] ?? '',
          statusLabel: STATUS_LABELS[data.status] ?? data.status,
          statusMessage: STATUS_MESSAGES[data.status] ?? '',
          adminNote: before.admin_notes ?? '',
        },
        idempotencyKey: `join-us-status-${before.id}-${data.status}`,
      })
      return {
        status: data.status,
        notified: result.sent ? 'sent' : 'suppressed',
        recipient: before.email,
      }
    } catch (error) {
      console.error('[join-us-status] email send failed', error)
      return { status: data.status, notified: 'failed', recipient: before.email }
    }
  })
