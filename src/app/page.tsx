import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { ProductCard } from '@/components/ui/ProductCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nihong Finds — Jastip Jepang Terpercaya',
  description: 'Kurasi pilihan barang langsung dari pusat trend Tokyo. Jastip aman, terpercaya, dan transparan. Bayar via QRIS.',
}

// ─── Trust badges data ───────────────────────────────
const TRUST_ITEMS = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 12c0 6.627 5.373 12 12 12s12-5.373 12-12c0-2.172-.578-4.21-1.588-5.963" />
      </svg>
    ),
    label: 'Terverifikasi',
    desc: 'Pembeli asli dari Jepang',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
      </svg>
    ),
    label: 'Bayar via QRIS',
    desc: 'DP & pelunasan fleksibel',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
      </svg>
    ),
    label: 'Tracking Realtime',
    desc: 'Dari Tokyo sampai tangan lo',
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
      </svg>
    ),
    label: '100% Transparan',
    desc: 'Harga jujur, tanpa biaya tersembunyi',
  },
]

// ─── Steps data ──────────────────────────────────────
const HOW_IT_WORKS = [
  {
    step: '01',
    title: 'Pilih Produk',
    desc: 'Browse katalog kami. Semua harga sudah termasuk estimasi ongkir dari Jepang ke Indonesia.',
  },
  {
    step: '02',
    title: 'Bayar DP via QRIS',
    desc: 'Konfirmasi order dengan membayar Down Payment. Aman, instan, dan langsung terkonfirmasi otomatis.',
  },
  {
    step: '03',
    title: 'Kami Belikan di Tokyo',
    desc: 'Tim kami langsung belikan barang pilihan lo di Jepang dan kirim ke Indonesia.',
  },
  {
    step: '04',
    title: 'Lunasi & Terima',
    desc: 'Setelah barang tiba di Indonesia, bayar pelunasan dan barang langsung dikirim ke alamat lo.',
  },
]

export default async function HomePage() {
  const supabase = await createClient()

  const { data: products } = await supabase
    .from('products')
    .select('*, categories(name)')
    .eq('is_active', true)
    .order('created_at', { ascending: false })
    .limit(8)

  return (
    <main className="min-h-screen overflow-x-hidden">

      {/* ══════════════════════════════════════════
          HERO SECTION
      ══════════════════════════════════════════ */}
      <section className="hero-mesh relative overflow-hidden pb-24 pt-20 md:pb-32 md:pt-28">

        {/* Floating decorative elements */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          {/* Large blurred orb top-right */}
          <div className="absolute -right-20 -top-20 h-[420px] w-[420px] rounded-full bg-gradient-to-br from-brand-200/40 to-sakura-200/20 blur-3xl dark:from-brand-800/20 dark:to-sakura-600/10" />
          {/* Small orb bottom-left */}
          <div className="absolute -bottom-10 -left-10 h-64 w-64 rounded-full bg-gradient-to-tr from-gold-400/15 to-brand-300/20 blur-2xl dark:from-gold-500/8 dark:to-brand-700/10" />

          {/* Floating kanji cards */}
          <div className="animate-float absolute right-[8%] top-[15%] hidden lg:block">
            <div className="glass flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg">
              <span className="text-2xl font-black text-foreground/80">日</span>
            </div>
          </div>
          <div className="animate-float-alt absolute left-[6%] top-[30%] hidden lg:block" style={{ animationDelay: '1.5s' }}>
            <div className="glass flex h-12 w-12 items-center justify-center rounded-xl shadow-md">
              <span className="text-lg font-black text-foreground/60">本</span>
            </div>
          </div>
          <div className="animate-float-slow absolute right-[15%] bottom-[20%] hidden xl:block" style={{ animationDelay: '3s' }}>
            <div className="glass flex h-10 w-10 items-center justify-center rounded-xl shadow-sm">
              <span className="text-base font-black text-foreground/40">品</span>
            </div>
          </div>
        </div>

        <Container className="relative text-center">
          {/* Live badge */}
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-sakura-200 bg-sakura-50 px-4 py-1.5 dark:border-sakura-600/30 dark:bg-sakura-600/10">
            <span className="animate-badge-pulse h-2 w-2 rounded-full bg-sakura-500" />
            <span className="text-xs font-semibold text-sakura-600 dark:text-sakura-400">
              Buka Order · Tokyo 🇯🇵
            </span>
          </div>

          {/* Main heading */}
          <h1 className="animate-fade-up delay-100 mt-6 text-5xl font-black tracking-tighter md:text-7xl lg:text-8xl">
            <span className="text-gradient block">Nihong</span>
            <span className="text-gradient block">Finds</span>
          </h1>

          <p className="animate-fade-up delay-200 mx-auto mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
            Kurasi barang pilihan langsung dari pusat trend{' '}
            <span className="font-semibold text-foreground">Tokyo</span>.{' '}
            Jastip aman, terpercaya, dan 100% transparan.
          </p>

          {/* CTA buttons */}
          <div className="animate-fade-up delay-300 mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="#katalog"
              id="hero-cta-katalog"
              className="shimmer-hover group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-foreground px-8 py-3.5 text-sm font-bold text-background shadow-lg shadow-foreground/20 transition-all hover:shadow-xl hover:shadow-foreground/25 active:scale-95"
            >
              Lihat Katalog
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
            <Link
              href="/orders"
              id="hero-cta-orders"
              className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-8 py-3.5 text-sm font-bold text-foreground shadow-sm transition-all hover:bg-muted active:scale-95"
            >
              Cek Status Order
            </Link>
          </div>

          {/* Social proof */}
          <p className="animate-fade-up delay-400 mt-8 text-xs text-muted-foreground">
            Dipercaya <span className="font-bold text-foreground">200+</span> pembeli ·{' '}
            Rating <span className="font-bold text-foreground">4.9★</span>
          </p>
        </Container>
      </section>

      {/* ══════════════════════════════════════════
          TRUST BAR
      ══════════════════════════════════════════ */}
      <section className="border-y border-border bg-muted/40 py-6">
        <Container>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {TRUST_ITEMS.map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-3 rounded-xl p-3 transition-colors hover:bg-background"
              >
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-100 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-foreground">{item.label}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════
          KATALOG SECTION
      ══════════════════════════════════════════ */}
      <section id="katalog" className="py-20 md:py-28">
        <Container>
          {/* Section header */}
          <div className="flex items-end justify-between">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-sakura-500">
                Koleksi Terbaru
              </span>
              <h2 className="mt-2 text-3xl font-black tracking-tight text-foreground md:text-4xl">
                Baru Mendarat dari Tokyo
              </h2>
              <p className="mt-2 text-muted-foreground">
                Update setiap minggu. Stok terbatas, pesan duluan.
              </p>
            </div>
            <Link
              href="/categories"
              className="hidden items-center gap-1 text-sm font-bold text-brand-600 transition-colors hover:text-brand-700 dark:text-brand-400 dark:hover:text-brand-300 md:flex"
            >
              Semua Kategori
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          {/* Product grid */}
          <div className="mt-10">
            {products && products.length > 0 ? (
              <>
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4 md:gap-6">
                  {products.map((item) => (
                    <ProductCard
                      key={item.id}
                      id={item.id}
                      name={item.name}
                      price_jpy={item.price_jpy}
                      image_url={item.image_urls?.[0] ?? null}
                      category_name={(item.categories as { name: string } | null)?.name}
                      condition={item.condition}
                    />
                  ))}
                </div>
                {/* Mobile: lihat semua */}
                <div className="mt-8 flex justify-center md:hidden">
                  <Link
                    href="/categories"
                    className="rounded-full border border-border bg-card px-6 py-2.5 text-sm font-bold text-foreground transition-colors hover:bg-muted"
                  >
                    Lihat Semua Kategori →
                  </Link>
                </div>
              </>
            ) : (
              /* Empty state */
              <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-border bg-muted/30 py-28 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-border bg-background shadow-sm">
                  <svg className="h-7 w-7 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                  </svg>
                </div>
                <h3 className="mt-5 text-lg font-bold text-foreground">Katalog Masih Kosong</h3>
                <p className="mt-2 max-w-xs text-sm text-muted-foreground">
                  Tim kami sedang hunting barang terbaik di Tokyo. Cek lagi besok ya!
                </p>
              </div>
            )}
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS SECTION
      ══════════════════════════════════════════ */}
      <section className="bg-foreground py-20 md:py-28">
        <Container>
          <div className="mb-14 text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Cara Order
            </span>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-background md:text-4xl">
              Semudah 4 Langkah
            </h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Dari browsing sampai barang di tangan lo.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map((item, i) => (
              <div
                key={item.step}
                className="group relative rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm transition-all duration-300 hover:border-white/20 hover:bg-white/10"
              >
                {/* Connector line (desktop) */}
                {i < HOW_IT_WORKS.length - 1 && (
                  <div aria-hidden="true" className="absolute right-0 top-10 hidden h-px w-6 translate-x-full bg-gradient-to-r from-white/20 to-transparent lg:block" />
                )}
                <span className="text-4xl font-black text-white/10 dark:text-white/10">
                  {item.step}
                </span>
                <h3 className="mt-3 text-base font-bold text-background">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="#katalog"
              id="hiw-cta"
              className="shimmer-hover inline-flex items-center gap-2 rounded-full bg-background px-8 py-3.5 text-sm font-bold text-foreground shadow-xl transition-all hover:shadow-2xl active:scale-95"
            >
              Mulai Order Sekarang
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════
          CTA BANNER SECTION
      ══════════════════════════════════════════ */}
      <section className="relative overflow-hidden py-20">
        {/* Background */}
        <div aria-hidden="true" className="absolute inset-0 hero-mesh opacity-60" />
        <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-background" />

        <Container className="relative text-center">
          <div className="mx-auto max-w-2xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-sakura-200 bg-sakura-50 px-4 py-1.5 dark:border-sakura-600/30 dark:bg-sakura-600/10">
              <span className="text-lg">🌸</span>
              <span className="text-xs font-semibold text-sakura-600 dark:text-sakura-400">
                Ada pertanyaan soal order?
              </span>
            </div>
            <h2 className="mt-2 text-3xl font-black tracking-tight text-foreground md:text-4xl">
              Chat Langsung via WhatsApp
            </h2>
            <p className="mt-4 text-muted-foreground">
              Tim kami siap bantu lo dari tanya-tanya produk sampai tracking pengiriman. Respon cepat, gak pake lama.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href="https://wa.me/62"
                target="_blank"
                rel="noopener noreferrer"
                id="cta-wa-button"
                className="shimmer-hover inline-flex items-center gap-2.5 rounded-full bg-emerald-500 px-8 py-3.5 text-sm font-bold text-white shadow-lg shadow-emerald-500/30 transition-all hover:bg-emerald-600 hover:shadow-xl hover:shadow-emerald-500/40 active:scale-95"
              >
                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                Chat WhatsApp
              </a>
              <Link
                href="#katalog"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-8 py-3.5 text-sm font-bold text-foreground transition-all hover:bg-muted active:scale-95"
              >
                Lihat Katalog
              </Link>
            </div>
          </div>
        </Container>
      </section>

    </main>
  )
}