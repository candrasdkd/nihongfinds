import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { type NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Signout error:', error.message)
  }

  revalidatePath('/', 'layout')
  return NextResponse.redirect(new URL('/login', request.url))
}
