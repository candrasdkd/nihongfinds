import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest) {
    let supabaseResponse = NextResponse.next({
        request: {
            headers: request.headers,
        },
    })

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                    supabaseResponse = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    supabaseResponse.cookies.set({
                        name,
                        value,
                        ...options,
                    })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                    supabaseResponse = NextResponse.next({
                        request: {
                            headers: request.headers,
                        },
                    })
                    supabaseResponse.cookies.set({
                        name,
                        value: '',
                        ...options,
                    })
                },
            },
        }
    )

    // Ini penting agar token sesi selalu ter-refresh jika user masih aktif
    const { data: { user } } = await supabase.auth.getUser()
    console.log('MIDDLEWARE USER DETECTED:', user ? user.id : 'null')

    const url = request.nextUrl.clone()
    const isAuthPage = url.pathname.startsWith('/login') || url.pathname.startsWith('/register')
    
    // Asumsi rute yang butuh login:
    const isProtectedPage = url.pathname.startsWith('/admin') || url.pathname.startsWith('/orders')

    if (user && isAuthPage) {
        // Jika sudah login tapi akses halaman login/register, tendang ke home
        const redirectResponse = NextResponse.redirect(new URL('/', request.url))
        supabaseResponse.cookies.getAll().forEach((cookie) => {
            redirectResponse.cookies.set(cookie.name, cookie.value)
        })
        return redirectResponse
    }

    if (!user && isProtectedPage) {
        // Jika belum login tapi akses halaman private, tendang ke login
        const redirectResponse = NextResponse.redirect(new URL('/login', request.url))
        supabaseResponse.cookies.getAll().forEach((cookie) => {
            redirectResponse.cookies.set(cookie.name, cookie.value)
        })
        return redirectResponse
    }

    return supabaseResponse
}