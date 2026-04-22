import { type NextRequest } from 'next/server'
// Tetap biarkan import ini mengarah ke file utility middleware Supabase
import { updateSession } from '@/utils/supabase/middleware'

// UBAH: Nama fungsi sekarang dikembalikan menjadi 'middleware' agar Next.js bisa mendeteksinya
export async function middleware(request: NextRequest) {
    console.log('MIDDLEWARE RUNNING:', request.nextUrl.pathname)
    return await updateSession(request)
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
    ],
}