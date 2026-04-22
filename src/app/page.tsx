import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { ProductCard } from '@/components/ui/ProductCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Nihong Finds — Jastip Jepang Terpercaya',
  description: 'Kurasi pilihan barang langsung dari pusat trend Tokyo. Jastip aman, terpercaya, dan transparan. Bayar via QRIS.',
}

const HOW_IT_WORKS = [
  {
    step: '01',
    kanji: '選',
    title: 'Pilih Produk',
    desc: 'Browse katalog. Semua harga sudah include estimasi ongkir dari Jepang.',
  },
  {
    step: '02',
    kanji: '払',
    title: 'Bayar DP via QRIS',
    desc: 'Konfirmasi order dengan DP. Aman, instan, terkonfirmasi otomatis.',
  },
  {
    step: '03',
    kanji: '買',
    title: 'Kami Belikan di Tokyo',
    desc: 'Tim kami langsung belikan & kirim ke Indonesia.',
  },
  {
    step: '04',
    kanji: '受',
    title: 'Lunasi & Terima',
    desc: 'Setelah barang tiba, lunasi dan barang dikirim ke alamatmu.',
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
          HERO — Editorial Split Layout
      ══════════════════════════════════════════ */}
      <section className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden bg-background">

        {/* Subtle noise texture overlay */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
            backgroundRepeat: 'repeat',
            backgroundSize: '128px',
          }}
        />

        {/* Giant kanji watermark — right side */}
        <div
          aria-hidden
          className="pointer-events-none select-none absolute right-0 top-1/2 -translate-y-1/2 leading-none font-black text-foreground/[0.04] dark:text-foreground/[0.05]"
          style={{ fontSize: 'clamp(200px, 30vw, 480px)', lineHeight: 1, letterSpacing: '-0.05em' }}
        >
          日本
        </div>

        {/* Thin accent line — left edge */}
        <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-sakura-500 to-transparent opacity-60" />

        <Container className="relative z-10 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

            {/* Left column — copy */}
            <div>
              {/* Eyebrow */}
              <div className="flex items-center gap-3 mb-8 animate-fade-up">
                <div className="h-px w-12 bg-sakura-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.3em] text-sakura-500">
                  Tokyo → Jakarta
                </span>
              </div>

              {/* Main heading — editorial style */}
              <h1 className="animate-fade-up delay-75 font-black tracking-tighter leading-[0.9] text-foreground" style={{ fontSize: 'clamp(64px, 9vw, 128px)' }}>
                Nihong
                <br />
                <span className="relative">
                  Finds
                  <span className="absolute -bottom-2 left-0 h-[5px] w-full bg-sakura-500 rounded-full" />
                </span>
              </h1>

              {/* Japanese subtitle */}
              <p className="animate-fade-up delay-100 mt-8 text-muted-foreground font-medium" style={{ fontSize: 'clamp(13px, 1.5vw, 16px)', lineHeight: 1.8 }}>
                日本のトレンドを、あなたの元へ。
                <br />
                <span className="text-foreground font-semibold">Kurasi barang pilihan langsung dari Tokyo.</span>{' '}
                Jastip aman, terpercaya, dan 100% transparan.
              </p>

              {/* CTA row */}
              <div className="animate-fade-up delay-200 mt-10 flex flex-wrap gap-4 items-center">
                <Link
                  href="#katalog"
                  className="group relative inline-flex items-center gap-3 bg-foreground text-background px-7 py-4 font-black text-sm uppercase tracking-widest overflow-hidden transition-all hover:gap-5 active:scale-[0.97]"
                  style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)' }}
                >
                  <span>Lihat Katalog</span>
                  <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>
                <Link
                  href="/orders"
                  className="inline-flex items-center gap-2 border-b-2 border-foreground/30 pb-0.5 text-sm font-bold text-muted-foreground hover:text-foreground hover:border-foreground transition-all"
                >
                  Cek Status Order
                </Link>
              </div>

              {/* Social proof strip */}
              <div className="animate-fade-up delay-300 mt-12 flex items-center gap-6 pt-8 border-t border-border">
                <div>
                  <p className="text-3xl font-black text-foreground tabular-nums">200<span className="text-sakura-500">+</span></p>
                  <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">Pembeli Puas</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <p className="text-3xl font-black text-foreground tabular-nums">4.9<span className="text-sakura-500">★</span></p>
                  <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">Rating</p>
                </div>
                <div className="w-px h-10 bg-border" />
                <div>
                  <p className="text-3xl font-black text-foreground">QRIS</p>
                  <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider mt-0.5">Pembayaran</p>
                </div>
              </div>
            </div>

            {/* Right column — decorative card stack */}
            <div className="hidden lg:flex items-center justify-center relative h-[500px]">
              {/* Card 1 — back */}
              <div
                className="absolute w-64 h-80 border border-border bg-muted/50 rounded-3xl"
                style={{ transform: 'rotate(-6deg) translate(-20px, 20px)' }}
              />
              {/* Card 2 — middle */}
              <div
                className="absolute w-64 h-80 border border-border bg-card rounded-3xl shadow-xl"
                style={{ transform: 'rotate(2deg) translate(20px, -10px)' }}
              >
                <div className="p-6 h-full flex flex-col">
                  <div className="h-40 rounded-2xl bg-gradient-to-br from-brand-100 to-brand-200 dark:from-brand-900/40 dark:to-brand-800/40 flex items-center justify-center">
                    <span className="text-6xl font-black text-brand-700/30 dark:text-brand-300/20">品</span>
                  </div>
                  <div className="mt-4 space-y-1.5">
                    <div className="h-2.5 w-3/4 rounded-full bg-muted" />
                    <div className="h-2 w-1/2 rounded-full bg-muted" />
                    <div className="h-2 w-2/3 rounded-full bg-muted mt-3" />
                  </div>
                </div>
              </div>
              {/* Card 3 — front */}
              <div
                className="absolute w-64 h-80 border-2 border-sakura-500/30 bg-card rounded-3xl shadow-2xl shadow-sakura-500/10"
                style={{ transform: 'rotate(-2deg) translate(-30px, -20px)' }}
              >
                <div className="p-6 h-full flex flex-col">
                  <div className="h-40 rounded-2xl bg-gradient-to-br from-sakura-100 to-sakura-200 dark:from-sakura-900/40 dark:to-sakura-800/40 flex items-center justify-center">
                    <span className="text-6xl font-black text-sakura-500/40">日</span>
                  </div>
                  <div className="mt-4 space-y-1.5">
                    <div className="h-2.5 w-4/5 rounded-full bg-muted" />
                    <div className="h-2 w-1/2 rounded-full bg-muted" />
                    <div className="flex items-center justify-between mt-4">
                      <div className="h-5 w-16 rounded-full bg-sakura-100 dark:bg-sakura-900/30" />
                      <div className="h-6 w-20 rounded-full bg-foreground/10" />
                    </div>
                  </div>
                </div>
              </div>
              {/* Live badge floating */}
              <div className="absolute top-8 right-8 flex items-center gap-2 bg-card border border-border rounded-full px-4 py-2 shadow-lg animate-float">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-badge-pulse" />
                <span className="text-[11px] font-bold text-foreground">Buka Order</span>
              </div>
            </div>
          </div>
        </Container>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <div className="w-5 h-8 border-2 border-foreground rounded-full flex justify-center pt-1.5">
            <div className="w-0.5 h-2 bg-foreground rounded-full animate-bounce" />
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TICKER MARQUEE
      ══════════════════════════════════════════ */}
      <div className="border-y border-border bg-foreground py-3 overflow-hidden select-none">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array(3).fill(null).map((_, i) => (
            <div key={i} className="flex items-center gap-0 flex-shrink-0">
              {['JASTIP JEPANG', '日本直送', 'BAYAR QRIS', 'TOKYO FINDS', '100% TERPERCAYA', '品質保証', 'REAL-TIME TRACKING', '翌日発送'].map((t) => (
                <span key={t} className="inline-flex items-center gap-6 px-6 text-[11px] font-black uppercase tracking-[0.2em] text-background/70">
                  <span>{t}</span>
                  <span className="text-sakura-500 text-sm">✦</span>
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════
          KATALOG SECTION
      ══════════════════════════════════════════ */}
      <section id="katalog" className="py-20 md:py-28 bg-background">
        <Container>
          {/* Section header — asymmetric */}
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8 bg-sakura-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-sakura-500">
                  Koleksi Terbaru
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-none">
                Baru Mendarat
                <br />
                <span className="text-muted-foreground/40">dari Tokyo</span>
              </h2>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2">
              <p className="text-sm text-muted-foreground max-w-xs text-left md:text-right">
                Update setiap minggu. Stok terbatas.
              </p>
              <Link
                href="/categories"
                className="group inline-flex items-center gap-2 text-sm font-bold text-foreground border-b border-foreground pb-0.5 hover:text-sakura-500 hover:border-sakura-500 transition-colors"
              >
                Semua Kategori
                <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>

          {/* Product grid */}
          {products && products.length > 0 ? (
            <>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
                {products.map((item, index) => (
                  <div
                    key={item.id}
                    className="animate-fade-up"
                    style={{ animationDelay: `${index * 60}ms` }}
                  >
                    <ProductCard
                      id={item.id}
                      name={item.name}
                      price_jpy={item.price_jpy}
                      image_url={item.image_urls?.[0] ?? null}
                      category_name={(item.categories as { name: string } | null)?.name}
                      condition={item.condition}
                    />
                  </div>
                ))}
              </div>
              <div className="mt-10 flex justify-center md:hidden">
                <Link
                  href="/categories"
                  className="inline-flex items-center gap-2 border border-border px-6 py-3 text-sm font-bold text-foreground hover:bg-muted transition-colors rounded-full"
                >
                  Lihat Semua →
                </Link>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-28 border-2 border-dashed border-border rounded-3xl bg-muted/20">
              <span className="text-6xl font-black text-foreground/10 mb-4">品</span>
              <h3 className="text-lg font-black text-foreground">Katalog Masih Kosong</h3>
              <p className="mt-2 text-sm text-muted-foreground text-center max-w-xs">
                Tim kami sedang hunting barang terbaik di Tokyo. Cek lagi besok ya!
              </p>
            </div>
          )}
        </Container>
      </section>

      {/* ══════════════════════════════════════════
          HOW IT WORKS — Dark editorial
      ══════════════════════════════════════════ */}
      <section className="relative bg-foreground overflow-hidden py-24 md:py-32">

        {/* Giant step number watermark */}
        <div
          aria-hidden
          className="pointer-events-none select-none absolute -right-8 top-1/2 -translate-y-1/2 font-black text-background/[0.03] leading-none"
          style={{ fontSize: 'clamp(120px, 20vw, 280px)' }}
        >
          CARA ORDER
        </div>

        <Container className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="h-px w-8 bg-sakura-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-sakura-500">
                  Cara Order
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-background leading-none">
                Semudah
                <br />
                <span className="text-background/30">4 Langkah</span>
              </h2>
            </div>
            <Link
              href="#katalog"
              className="group self-start md:self-auto inline-flex items-center gap-3 bg-sakura-500 text-white px-6 py-3.5 font-black text-sm uppercase tracking-widest hover:bg-sakura-600 transition-colors active:scale-95"
              style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 100%, 10px 100%)' }}
            >
              Mulai Order
              <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-white/10">
            {HOW_IT_WORKS.map((item, i) => (
              <div
                key={item.step}
                className="group bg-foreground p-8 hover:bg-white/5 transition-colors duration-300"
              >
                {/* Kanji + step number */}
                <div className="flex items-start justify-between mb-6">
                  <span className="text-6xl font-black text-background/10 group-hover:text-background/20 transition-colors leading-none">
                    {item.kanji}
                  </span>
                  <span className="text-[11px] font-black tracking-widest text-sakura-500 mt-1">
                    {item.step}
                  </span>
                </div>
                <h3 className="text-base font-black text-background mb-3 tracking-tight">{item.title}</h3>
                <p className="text-sm text-background/50 leading-relaxed">{item.desc}</p>

                {/* Progress bar */}
                <div className="mt-6 h-0.5 bg-white/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-sakura-500 rounded-full transition-all duration-500 group-hover:w-full"
                    style={{ width: `${(i + 1) * 25}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════
          TRUST SECTION — Minimal grid
      ══════════════════════════════════════════ */}
      <section className="bg-background border-b border-border py-16 md:py-20">
        <Container>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-border">
            {[
              { num: '✓', label: 'Terverifikasi', desc: 'Pembeli asli dari Jepang' },
              { num: '⚡', label: 'QRIS Instan', desc: 'DP & pelunasan fleksibel' },
              { num: '📍', label: 'Real-time Track', desc: 'Tokyo sampai tanganmu' },
              { num: '0', label: 'Hidden Fee', desc: 'Harga jujur, transparan' },
            ].map((item) => (
              <div key={item.label} className="bg-background p-8 group hover:bg-muted/30 transition-colors">
                <p className="text-3xl mb-3 text-foreground/70 group-hover:scale-110 transition-transform inline-block">{item.num}</p>
                <p className="font-black text-foreground text-sm uppercase tracking-wide">{item.label}</p>
                <p className="text-xs text-muted-foreground mt-1">{item.desc}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* ══════════════════════════════════════════
          CTA — WhatsApp
      ══════════════════════════════════════════ */}
      <section className="relative py-20 md:py-28 overflow-hidden bg-background">

        {/* Background accent */}
        <div
          aria-hidden
          className="pointer-events-none select-none absolute left-0 top-1/2 -translate-y-1/2 font-black text-foreground/[0.025] leading-none"
          style={{ fontSize: 'clamp(80px, 15vw, 200px)' }}
        >
          お問い合わせ
        </div>

        <Container className="relative z-10">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-10">
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-px w-8 bg-emerald-500" />
                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-emerald-600 dark:text-emerald-400">
                  Ada Pertanyaan?
                </span>
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-none mb-4">
                Chat via
                <br />
                WhatsApp
              </h2>
              <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                Tim kami siap bantu dari tanya produk sampai tracking pengiriman. Respon cepat, gak pake lama.
              </p>
            </div>

            <div className="flex flex-col gap-4 shrink-0">
              <a
                href="https://wa.me/62"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-4 bg-emerald-500 text-white px-8 py-5 font-black text-base hover:bg-emerald-600 transition-all active:scale-95 shadow-2xl shadow-emerald-500/25"
                style={{ clipPath: 'polygon(0 0, calc(100% - 14px) 0, 100% 100%, 14px 100%)' }}
              >
                <svg className="h-5 w-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
                <span>Chat WhatsApp</span>
                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </a>
              <Link
                href="#katalog"
                className="text-center text-sm font-bold text-muted-foreground hover:text-foreground transition-colors border-b border-transparent hover:border-foreground pb-0.5"
              >
                Atau lihat katalog dulu →
              </Link>
            </div>
          </div>
        </Container>
      </section>

    </main>
  )
}