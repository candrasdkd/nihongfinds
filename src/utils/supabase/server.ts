import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

// PERUBAHAN NEXT 16: Fungsi ini sekarang wajib async
export async function createClient() {
    // PERUBAHAN NEXT 16: cookies() harus di-await
    const cookieStore = await cookies()

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return cookieStore.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value, ...options })
                    } catch (error) {
                        // Error ini bisa diabaikan jika fungsi dipanggil dari Server Component
                        // karena Server Component murni tidak bisa memanipulasi cookies.
                    }
                },
                remove(name: string, options: CookieOptions) {
                    try {
                        cookieStore.set({ name, value: '', ...options })
                    } catch (error) {
                        // Sama seperti set()
                    }
                },
            },
        }
    )
}