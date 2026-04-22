'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/utils/supabase/server'

export async function signup(formData: FormData) {
    const supabase = await createClient()

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const fullName = formData.get('fullName') as string

    const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: { full_name: fullName },
        },
    })

    if (error) {
        // Email sudah terdaftar → Supabase kembalikan user tanpa error tapi session null
        // Handle explicit error codes
        if (error.message.toLowerCase().includes('already registered')) {
            return { error: 'Email ini sudah terdaftar. Silakan masuk atau gunakan email lain.' }
        }
        return { error: 'Gagal mendaftar: ' + error.message }
    }

    // Supabase returns a user but session === null jika email confirmation aktif
    if (data.user && !data.session) {
        // Email belum diverifikasi — konfirmasi dikirim ke inbox
        return { success: true, needsVerification: true }
    }

    // Email confirmation dimatikan di Supabase dashboard → langsung login
    revalidatePath('/', 'layout')
    return { success: true, needsVerification: false }
}