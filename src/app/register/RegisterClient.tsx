'use client'

import { useState, useTransition } from 'react'
import { signup } from './actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Modal, type ModalType } from '@/components/ui/Modal'

export default function RegisterClient() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [modalState, setModalState] = useState<{
    isOpen: boolean
    type: ModalType
    title: string
    message: string
    needsVerification?: boolean
  }>({
    isOpen: false,
    type: 'loading',
    title: '',
    message: '',
  })

  const [pendingFormData, setPendingFormData] = useState<FormData | null>(null)

  const closeModal = () => setModalState(prev => ({ ...prev, isOpen: false }))

  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    setPendingFormData(formData)
    setModalState({
      isOpen: true,
      type: 'confirm',
      title: 'Konfirmasi Pendaftaran',
      message: 'Pastikan data yang kamu masukkan sudah benar.',
    })
  }

  const executeRegister = () => {
    if (!pendingFormData) return

    setModalState({
      isOpen: true,
      type: 'loading',
      title: 'Memproses...',
      message: 'Sedang membuat akun barumu di server.',
    })

    startTransition(async () => {
      const result = await signup(pendingFormData)

      if (result?.error) {
        setModalState({ isOpen: true, type: 'error', title: 'Gagal Mendaftar', message: result.error })
        return
      }

      if (result?.needsVerification) {
        setModalState({
          isOpen: true,
          type: 'success',
          title: 'Cek Emailmu!',
          message: 'Link verifikasi sudah dikirim. Klik link tersebut untuk mengaktifkan akun.',
          needsVerification: true,
        })
      } else {
        setModalState({
          isOpen: true,
          type: 'success',
          title: 'Berhasil Mendaftar!',
          message: 'Akunmu berhasil dibuat. Irasshaimase!',
          needsVerification: false,
        })
      }
    })
  }

  const handleSuccessOK = () => {
    closeModal()
    if (modalState.needsVerification) {
      router.replace('/login')
    } else {
      router.replace('/')
    }
  }

  return (
    <div className="relative min-h-screen flex overflow-hidden bg-background">

      <Modal
        isOpen={modalState.isOpen}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        onClose={closeModal}
        onConfirm={
          modalState.type === 'confirm' ? executeRegister :
            modalState.type === 'success' ? handleSuccessOK : undefined
        }
      />

      {/* ── Left Panel — Decorative (hidden on mobile) ── */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-foreground flex-col justify-between p-12 overflow-hidden">

        {/* Giant kanji watermark */}
        <div
          aria-hidden
          className="pointer-events-none select-none absolute right-0 bottom-0 font-black text-background/[0.05] leading-none"
          style={{ fontSize: 'clamp(160px, 22vw, 320px)', lineHeight: 0.85 }}
        >
          新
        </div>

        {/* Thin accent line */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-sakura-500 to-transparent opacity-60" />

        {/* Top — Logo */}
        <Link href="/" className="flex items-center gap-2 w-fit z-10">
          <div className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-gradient-to-br from-sakura-500 to-sakura-600 shadow-md shadow-sakura-500/20">
            <span className="text-sm font-black text-white">日</span>
          </div>
          <span className="text-lg font-black tracking-tighter text-background">
            Nihong<span className="text-sakura-500">.</span>Finds
          </span>
        </Link>

        {/* Center — Editorial text */}
        <div className="z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="h-px w-8 bg-sakura-500" />
            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-sakura-500">
              Mulai Perjalanan
            </span>
          </div>
          <h1 className="font-black tracking-tighter text-background leading-[0.9] mb-6" style={{ fontSize: 'clamp(48px, 5vw, 80px)' }}>
            Irasshaimase
            <span className="text-sakura-500">.</span>
          </h1>
          <p className="text-background/50 text-sm leading-relaxed max-w-xs">
            いらっしゃいませ。<br />
            Buka akses ke ribuan tren eksklusif Jepang, langsung ke tanganmu.
          </p>

          {/* Benefits list */}
          <div className="mt-10 pt-8 border-t border-white/10 space-y-4">
            {[
              { icon: '✦', text: 'Katalog eksklusif langsung dari Tokyo' },
              { icon: '✦', text: 'Tracking realtime dari Jepang ke Indonesia' },
              { icon: '✦', text: 'Bayar DP & pelunasan via QRIS' },
              { icon: '✦', text: 'Harga transparan, tanpa hidden fee' },
            ].map((b) => (
              <div key={b.text} className="flex items-start gap-3">
                <span className="text-sakura-500 text-xs mt-0.5 shrink-0">{b.icon}</span>
                <span className="text-sm text-background/60">{b.text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom — back link */}
        <Link
          href="/"
          className="group z-10 inline-flex items-center gap-2 text-sm font-bold text-background/40 hover:text-background transition-colors"
        >
          <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Kembali ke Etalase
        </Link>
      </div>

      {/* ── Right Panel — Form ── */}
      <div className="flex-1 flex items-center justify-center p-6 py-16 lg:p-16 relative">

        {/* Subtle noise */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px',
          }}
        />

        {/* Thin right accent line */}
        <div className="absolute right-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-sakura-500/30 to-transparent opacity-40 hidden lg:block" />

        <div className="w-full max-w-sm animate-fade-up">

          {/* Mobile logo */}
          <Link href="/" className="flex items-center gap-2 mb-10 lg:hidden">
            <div className="flex h-8 w-8 items-center justify-center rounded-[12px] bg-gradient-to-br from-sakura-500 to-sakura-600">
              <span className="text-xs font-black text-white">日</span>
            </div>
            <span className="text-base font-black tracking-tighter text-foreground">
              Nihong<span className="text-sakura-500">.</span>Finds
            </span>
          </Link>

          {/* Form header */}
          <div className="mb-10">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-px w-8 bg-sakura-500" />
              <span className="text-[11px] font-black uppercase tracking-[0.25em] text-sakura-500">Buat Akun</span>
            </div>
            <h2 className="text-3xl font-black tracking-tighter text-foreground">
              Daftar
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Sudah punya akun?{' '}
              <Link href="/login" className="font-bold text-foreground border-b border-foreground hover:text-sakura-500 hover:border-sakura-500 transition-colors">
                Masuk di sini
              </Link>
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">

            {/* Full Name */}
            <div>
              <label htmlFor="register-fullname" className="block text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                Nama Lengkap
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <input
                  id="register-fullname"
                  name="fullName"
                  type="text"
                  placeholder="Nama Kamu"
                  required
                  autoComplete="name"
                  className="w-full border border-border bg-background py-3.5 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-all focus:border-foreground focus:ring-2 focus:ring-foreground/10 rounded-none"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="register-email" className="block text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  id="register-email"
                  name="email"
                  type="email"
                  placeholder="kamu@contoh.com"
                  required
                  autoComplete="email"
                  className="w-full border border-border bg-background py-3.5 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-all focus:border-foreground focus:ring-2 focus:ring-foreground/10 rounded-none"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="register-password" className="block text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  id="register-password"
                  name="password"
                  type="password"
                  placeholder="Min. 6 karakter"
                  required
                  minLength={6}
                  autoComplete="new-password"
                  className="w-full border border-border bg-background py-3.5 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/40 outline-none transition-all focus:border-foreground focus:ring-2 focus:ring-foreground/10 rounded-none"
                />
              </div>
            </div>

            {/* Submit — clip-path button */}
            <div className="mt-2">
              <button
                type="submit"
                disabled={isPending}
                className="group relative w-full flex items-center justify-between bg-foreground text-background px-7 py-4 font-black text-sm uppercase tracking-widest overflow-hidden transition-all hover:bg-sakura-500 active:scale-[0.97] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)' }}
              >
                <span>Daftar Sekarang</span>
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-8">
            <div className="flex-1 h-px bg-border" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Atau</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Login CTA */}
          <Link
            href="/login"
            className="group flex items-center justify-between w-full border border-border px-6 py-4 text-sm font-bold text-foreground hover:border-foreground hover:bg-muted/30 transition-all"
          >
            <span>Sudah punya akun? Masuk</span>
            <svg className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </Link>

          <p className="mt-8 text-[11px] leading-relaxed text-muted-foreground text-center">
            Dengan mendaftar, kamu menyetujui{' '}
            <Link href="/terms" className="font-medium hover:text-foreground hover:underline">Syarat Ketentuan</Link>
            {' '}dan{' '}
            <Link href="/privacy" className="font-medium hover:text-foreground hover:underline">Kebijakan Privasi</Link>
          </p>
        </div>
      </div>
    </div>
  )
}