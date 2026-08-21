import { createServerFn } from '@tanstack/react-start'

import { requireSupabaseAuth } from '@/integrations/supabase/auth-middleware'

export type AdminUser = {
  userId: string
  email: string
  fullName: string
  level: 'super_admin' | 'admin'
  post: string
  sections: string[]
}

async function assertSuperAdmin(context: { supabase: any; userId: string }) {
  const { data, error } = await context.supabase.rpc('has_role', {
    _user_id: context.userId,
    _role: 'super_admin',
  })
  if (error) throw new Error(error.message)
  if (!data) throw new Error('Forbidden')
}

export const listAdmins = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<AdminUser[]> => {
    await assertSuperAdmin(context as never)
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

    const { data: roles, error } = await supabaseAdmin
      .from('user_roles')
      .select('user_id, role')
      .in('role', ['admin', 'super_admin'])
    if (error) throw new Error(error.message)

    const ids = [...new Set((roles ?? []).map((r) => r.user_id))]
    if (ids.length === 0) return []

    const { data: profiles } = await supabaseAdmin
      .from('profiles')
      .select('id, email, full_name')
      .in('id', ids)

    const { data: perms } = await supabaseAdmin
      .from('admin_permissions')
      .select('user_id, post, sections')
      .in('user_id', ids)

    return ids.map((id) => {
      const profile = profiles?.find((p) => p.id === id)
      const perm = perms?.find((p) => p.user_id === id)
      const isSuper = (roles ?? []).some((r) => r.user_id === id && r.role === 'super_admin')
      return {
        userId: id,
        email: profile?.email ?? '',
        fullName: profile?.full_name ?? '',
        level: isSuper ? ('super_admin' as const) : ('admin' as const),
        post: perm?.post ?? 'full_admin',
        sections: perm?.sections ?? ['all'],
      }
    })
  })

export const setAdminAccess = createServerFn({ method: 'POST' })
  .middleware([requireSupabaseAuth])
  .inputValidator(
    (input: {
      email: string
      level: 'super_admin' | 'admin' | 'none'
      post?: string
      sections?: string[]
    }) => {
      const email = (input?.email ?? '').trim().toLowerCase()
      if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) throw new Error('Enter a valid email address')
      if (!['super_admin', 'admin', 'none'].includes(input?.level)) throw new Error('Unknown access level')
      const allowed = [
        'all',
        'joinus',
        'requests',
        'stories',
        'needs',
        'quotes',
        'events',
        'resources',
        'impact',
        'workspace',
      ]
      const sections = (input.sections ?? []).filter((s) => allowed.includes(s))
      return { email, level: input.level, post: input.post ?? 'custom', sections }
    },
  )
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context as never)
    const { supabaseAdmin } = await import('@/integrations/supabase/client.server')

    const { data: profile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('id, email')
      .ilike('email', data.email)
      .maybeSingle()
    if (profileError) throw new Error(profileError.message)
    if (!profile) throw new Error('No UrjaSethu account found with that email. Ask them to sign up first.')

    if (profile.id === context.userId && data.level !== 'super_admin') {
      throw new Error('You cannot remove your own super admin access.')
    }

    const { error: delError } = await supabaseAdmin
      .from('user_roles')
      .delete()
      .eq('user_id', profile.id)
      .in('role', ['admin', 'super_admin'])
    if (delError) throw new Error(delError.message)

    if (data.level !== 'none') {
      const { error: insError } = await supabaseAdmin
        .from('user_roles')
        .insert({ user_id: profile.id, role: data.level })
      if (insError) throw new Error(insError.message)
    }

    return { email: data.email, level: data.level }
  })
