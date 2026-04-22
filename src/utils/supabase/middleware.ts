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
                    request.cookies.set({ name, value, ...options })
                    supabaseResponse = NextResponse.next({
                        request: { headers: request.headers },
                    })
                    supabaseResponse.cookies.set({ name, value, ...options })
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options })
                    supabaseResponse = NextResponse.next({
                        request: { headers: request.headers },
                    })
                    supabaseResponse.cookies.set({ name, value: '', ...options })
                },
            },
        }
    )

    // Refresh session token
    const { data: { user } } = await supabase.auth.getUser()
    console.log('MIDDLEWARE USER DETECTED:', user ? user.id : 'null')

    const url = request.nextUrl.clone()
    const pathname = url.pathname

    const isAuthPage = pathname.startsWith('/login') || pathname.startsWith('/register')
    const isAdminPage = pathname.startsWith('/admin')
    const isProtectedPage = pathname.startsWith('/orders') || pathname.startsWith('/profile')

    // ─── 1. Redirect authenticated user away from auth pages ──────────────────
    if (user && isAuthPage) {
        const redirectResponse = NextResponse.redirect(new URL('/', request.url))
        supabaseResponse.cookies.getAll().forEach((c) =>
            redirectResponse.cookies.set(c.name, c.value)
        )
        return redirectResponse
    }

    // ─── 2. Guard: unauthenticated user → login ────────────────────────────────
    if (!user && (isAdminPage || isProtectedPage)) {
        const redirectResponse = NextResponse.redirect(new URL('/login', request.url))
        supabaseResponse.cookies.getAll().forEach((c) =>
            redirectResponse.cookies.set(c.name, c.value)
        )
        return redirectResponse
    }

    // ─── 3. Guard: admin pages — require role === 'admin' ─────────────────────
    if (user && isAdminPage) {
        const role = user.user_metadata?.role as string | undefined
        if (role !== 'admin') {
            // Non-admin user trying to access admin → redirect home with error flag
            const redirectResponse = NextResponse.redirect(
                new URL('/?error=unauthorized', request.url)
            )
            supabaseResponse.cookies.getAll().forEach((c) =>
                redirectResponse.cookies.set(c.name, c.value)
            )
            return redirectResponse
        }
    }

    // ─── 4. Guard: checkout/orders — require profile complete ─────────────────
    //    (whatsapp_number & address wajib ada sebelum bisa order)
    if (user && pathname.startsWith('/orders/checkout')) {
        const { data: profile } = await supabase
            .from('profiles')
            .select('whatsapp_number, address')
            .eq('id', user.id)
            .single()

        const isProfileIncomplete =
            !profile?.whatsapp_number || !profile?.address

        if (isProfileIncomplete) {
            const redirectResponse = NextResponse.redirect(
                new URL('/profile?incomplete=1', request.url)
            )
            supabaseResponse.cookies.getAll().forEach((c) =>
                redirectResponse.cookies.set(c.name, c.value)
            )
            return redirectResponse
        }
    }

    return supabaseResponse
}