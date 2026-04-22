'use client'

import { useState, useTransition } from 'react'
import { login } from './actions'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Modal, type ModalType } from '@/components/ui/Modal'

export default function LoginClient() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const [modalState, setModalState] = useState<{
    isOpen: boolean
    type: ModalType
    title: string
    message: string
  }>({
    isOpen: false,
    type: 'loading',
    title: '',
    message: ''
  })

  const closeModal = () => setModalState(prev => ({ ...prev, isOpen: false }))

  // Saat form di-submit, langsung proses login tanpa konfirmasi
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    executeLogin(formData)
  }

  const executeLogin = (formData: FormData) => {

    setModalState({
      isOpen: true,
      type: 'loading',
      title: 'Memproses...',
      message: 'Sedang menghubungkan ke server Nihong Finds.'
    })

    startTransition(async () => {
      const result = await login(formData)

      if (result?.error) {
        setModalState({
          isOpen: true,
          type: 'error',
          title: 'Login Gagal',
          message: result.error
        })
      } else if (result?.success) {
        setModalState({
          isOpen: true,
          type: 'success',
          title: 'Berhasil Masuk',
          message: 'Okaerinasai! Selamat datang kembali.'
        })
      }
    })
  }

  // Dipanggil setelah modal success di-klik OK
  const handleSuccessOK = () => {
    closeModal()
    router.replace('/')
  }

  return (
    <div className="relative flex flex-col min-h-screen items-center justify-center w-full overflow-hidden px-4 pb-16 pt-24">

      {/* Modal Eksternal */}
      <Modal
        isOpen={modalState.isOpen}
        type={modalState.type}
        title={modalState.title}
        message={modalState.message}
        onClose={closeModal}
        onConfirm={modalState.type === 'success' ? handleSuccessOK : undefined}
      />

      {/* ─── Background & Thematic Elements ─── */}
      <div aria-hidden className="pointer-events-none absolute inset-0 bg-background" />
      <div aria-hidden className="pointer-events-none absolute inset-0 hero-mesh opacity-80" />

      {/* Giant Typography Watermarks */}
      <div className="pointer-events-none absolute left-[-5%] top-1/4 select-none opacity-10 mix-blend-multiply dark:mix-blend-screen dark:opacity-20">
        <span className="text-[18rem] font-black leading-none" style={{ writingMode: 'vertical-rl' }}>
          東京
        </span>
      </div>
      <div className="pointer-events-none absolute right-[-5%] bottom-1/4 select-none opacity-10 mix-blend-multiply dark:mix-blend-screen dark:opacity-20">
        <span className="text-[18rem] font-black leading-none tracking-tighter">
          JKT
        </span>
      </div>

      <div className="pointer-events-none absolute top-0 left-1/2 h-[40rem] w-[40rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-sakura-500/20 to-transparent blur-3xl dark:from-sakura-500/30" />

      {/* ─── Card Container ─── */}
      <div className="relative w-full max-w-md animate-scale-in z-10 mt-8">
        <div className="absolute -top-1 left-4 right-4 h-2 rounded-t-full bg-gradient-to-r from-sakura-400 via-sakura-500 to-sakura-600 opacity-80 blur-[2px]" />

        <div className="relative rounded-3xl border border-border border-t-sakura-500/50 bg-card/80 p-8 shadow-2xl shadow-sakura-500/5 backdrop-blur-xl md:p-10">

          <div className="mb-8 text-center">
            <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-sakura-200/60 bg-sakura-50/80 px-2 py-1.5 backdrop-blur-md dark:border-sakura-800/60 dark:bg-sakura-900/30">
              <div className="flex h-6 items-center justify-center rounded-full bg-red-600 px-3 shadow-sm">
                <span className="text-[10px] font-black tracking-widest text-white">IDN</span>
              </div>
              <span className="text-[10px] font-black tracking-[0.2em] text-[#012E6C] dark:text-white">
                KONEKSI NUSANTARA
              </span>
              <div className="flex h-6 items-center justify-center rounded-full bg-white px-3 shadow-sm">
                <span className="text-[10px] font-black tracking-widest text-red-600">JPN</span>
              </div>
            </div>

            <h1 className="text-3xl font-black tracking-tight text-foreground flex items-center justify-center gap-2">
              Okaerinasai! <span className="text-sakura-500 text-2xl drop-shadow-sm">✦</span>
            </h1>
            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
              Selamat datang kembali. Lanjutkan penjelajahan tren Tokyo-mu hari ini.
            </p>
          </div>

          <form onSubmit={handleFormSubmit} className="flex flex-col gap-5">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="login-email" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                Alamat Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" /></svg>
                </div>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="kamu@contoh.com"
                  required
                  autoComplete="email"
                  className="w-full rounded-xl border border-border bg-background py-3.5 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:border-sakura-500 focus:ring-2 focus:ring-sakura-500/20"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label htmlFor="login-password" className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  Kata Sandi
                </label>
                <Link href="/forgot-password" className="text-[11px] font-bold text-sakura-600 transition-colors hover:text-sakura-700 dark:text-sakura-400">
                  Lupa sandi?
                </Link>
              </div>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                </div>
                <input
                  id="login-password"
                  name="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  autoComplete="current-password"
                  className="w-full rounded-xl border border-border bg-background py-3.5 pl-11 pr-4 text-sm text-foreground placeholder:text-muted-foreground/50 outline-none transition-all focus:border-sakura-500 focus:ring-2 focus:ring-sakura-500/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="shimmer-hover mt-2 w-full rounded-xl bg-gradient-to-r from-sakura-600 to-sakura-500 px-4 py-4 text-sm font-bold text-white shadow-lg shadow-sakura-500/25 transition-all hover:opacity-90 hover:shadow-xl hover:shadow-sakura-500/30 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Masuk ke Akun
            </button>
          </form>

          <div className="my-8 flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-border" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Pengguna Baru?</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-border" />
          </div>

          <Link
            href="/register"
            className="block w-full rounded-xl border-2 border-dashed border-border bg-transparent px-4 py-3.5 text-center text-sm font-bold text-foreground transition-all hover:border-sakura-500/50 hover:bg-sakura-50/50 dark:hover:bg-sakura-900/20 active:scale-[0.98]"
          >
            Buat Akun Gratis Sekarang
          </Link>
        </div>

        <p className="mt-8 text-center text-xs leading-relaxed text-muted-foreground">
          Dengan masuk, kamu menyetujui{' '}
          <Link href="/terms" className="font-medium hover:text-foreground hover:underline">Syarat Ketentuan</Link>
          {' '}serta{' '}
          <Link href="/privacy" className="font-medium hover:text-foreground hover:underline">Kebijakan Privasi</Link> Nihong Finds.
        </p>
      </div>
    </div>
  )
}
