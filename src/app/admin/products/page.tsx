import { createClient } from '@/utils/supabase/server'
import { createProduct } from './actions'
import Link from 'next/link'
import ImagePicker from '@/components/ImagePicker'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Katalog Admin',
  description: 'Kelola produk Nihong Finds.',
}

export default async function AdminProductsPage(props: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const searchParams = await props.searchParams
  const supabase = await createClient()

  // Ambil data kategori dari DB
  const { data: categories } = await supabase
    .from('categories')
    .select('id, name')
    .order('name', { ascending: true })

  return (
    <div className="relative min-h-[calc(100vh-4rem)] px-4 py-12 sm:px-6 lg:px-8">
      {/* Background mesh (konsisten dengan tema) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 hero-mesh opacity-30 dark:opacity-20" />

      <div className="relative mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-3 py-1 dark:border-brand-800/50 dark:bg-brand-900/20">
              <span className="flex h-2 w-2 rounded-full bg-brand-500"></span>
              <span className="text-[11px] font-bold uppercase tracking-wider text-brand-700 dark:text-brand-300">
                Admin Panel
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-foreground md:text-4xl">
              Katalog Produk
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Tambah produk baru ke etalase Nihong Finds.
            </p>
          </div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-5 py-2.5 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-muted active:scale-95"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Kembali ke Etalase
          </Link>
        </div>

        {/* Notifications */}
        {searchParams.success && (
          <div className="animate-fade-in mb-8 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 px-5 py-4">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-400">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
              {searchParams.success}
            </p>
          </div>
        )}

        {searchParams.error && (
          <div className="animate-fade-in mb-8 flex items-start gap-3 rounded-2xl border border-destructive/20 bg-destructive/10 px-5 py-4">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-destructive/20 text-destructive">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-sm font-medium text-destructive">
              {searchParams.error}
            </p>
          </div>
        )}

        {/* Form Container */}
        <form action={createProduct} className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          
          {/* Kolom Kiri: Detail Produk (8 kolom di LG) */}
          <div className="flex flex-col gap-6 lg:col-span-7 xl:col-span-8">
            <div className="glass overflow-hidden rounded-3xl p-1">
              <div className="rounded-[22px] bg-card p-6 shadow-sm sm:p-8">
                <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-foreground">
                  <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Informasi Dasar
                </h2>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="name" className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      Nama Barang
                    </label>
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      placeholder="Contoh: Starbucks Japan Spring Mug"
                      className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>

                  <div>
                    <label htmlFor="category_id" className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      Kategori
                    </label>
                    <div className="relative">
                      <select
                        id="category_id"
                        name="category_id"
                        required
                        className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-3 pr-10 text-sm text-foreground transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                      >
                        <option value="">Pilih Kategori...</option>
                        {categories?.map((cat) => (
                          <option key={cat.id} value={cat.id}>{cat.name}</option>
                        ))}
                      </select>
                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-muted-foreground">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="description" className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      Deskripsi Barang
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      rows={6}
                      placeholder="Jelaskan kondisi, kelengkapan, atau jadwal PO..."
                      className="w-full resize-y rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Atribut & Foto (4 kolom di LG) */}
          <div className="flex flex-col gap-6 lg:col-span-5 xl:col-span-4">
            {/* Harga & Spesifikasi */}
            <div className="glass overflow-hidden rounded-3xl p-1">
              <div className="rounded-[22px] bg-card p-6 shadow-sm">
                <h2 className="mb-6 flex items-center gap-2 text-lg font-bold text-foreground">
                  <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12m-3-2.818l.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Harga & Spesifikasi
                </h2>
                
                <div className="space-y-5">
                  <div>
                    <label htmlFor="price_jpy" className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                      Harga (JPY ¥)
                    </label>
                    <div className="relative">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4 text-muted-foreground font-medium">
                        ¥
                      </div>
                      <input
                        id="price_jpy"
                        name="price_jpy"
                        type="number"
                        required
                        min="0"
                        placeholder="0"
                        className="w-full rounded-xl border border-border bg-background py-3 pl-8 pr-4 text-sm font-medium text-foreground transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="condition" className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        Kondisi
                      </label>
                      <div className="relative">
                        <select
                          id="condition"
                          name="condition"
                          className="w-full appearance-none rounded-xl border border-border bg-background px-4 py-3 pr-8 text-sm font-medium text-foreground transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                        >
                          <option value="NEW">Baru</option>
                          <option value="USED">Bekas</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-muted-foreground">
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <div>
                      <label htmlFor="weight" className="mb-2 block text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        Berat (gr)
                      </label>
                      <div className="relative">
                        <input
                          id="weight"
                          name="weight"
                          type="number"
                          min="0"
                          placeholder="0"
                          className="w-full rounded-xl border border-border bg-background py-3 pl-4 pr-8 text-sm font-medium text-foreground transition-all focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20"
                        />
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-xs text-muted-foreground">
                          gr
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Foto Produk */}
            <div className="glass overflow-hidden rounded-3xl p-1">
              <div className="rounded-[22px] bg-card p-6 shadow-sm">
                <h2 className="mb-4 flex items-center gap-2 text-lg font-bold text-foreground">
                  <svg className="h-5 w-5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Foto Produk
                </h2>
                <ImagePicker />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="shimmer-hover flex w-full items-center justify-center gap-2 rounded-2xl bg-foreground px-4 py-4 text-sm font-bold text-background shadow-lg shadow-foreground/20 transition-all hover:shadow-xl hover:shadow-foreground/30 active:scale-[0.98]"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              Simpan ke Katalog
            </button>
          </div>
          
        </form>
      </div>
    </div>
  )
}