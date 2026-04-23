import { createClient } from '@/utils/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import type { Metadata } from 'next'
import ProductImageGallery from '@/components/ui/ProductImageGallery'

interface Props {
    params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const { id } = await params
    const supabase = await createClient()
    const { data } = await supabase.from('products').select('name, description').eq('id', id).single()
    if (!data) return { title: 'Produk Tidak Ditemukan' }
    return {
        title: data.name,
        description: data.description ?? undefined,
    }
}

export default async function ProductDetailPage({ params }: Props) {
    const { id } = await params
    const supabase = await createClient()

    const { data: product } = await supabase
        .from('products')
        .select('*, categories(name, slug)')
        .eq('id', id)
        .eq('is_active', true)
        .single()

    if (!product) notFound()

    const category = product.categories as { name: string; slug: string } | null

    const conditionLabel = product.condition === 'NEW' ? 'Baru' : 'Bekas'
    const conditionColor = product.condition === 'NEW'
        ? 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/40'
        : 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/40'

    return (
        <main className="min-h-screen bg-background">

            {/* Breadcrumb */}
            <div className="border-b border-border bg-background">
                <Container>
                    <div className="flex items-center gap-2 py-4 text-[11px] font-bold uppercase tracking-widest text-muted-foreground">
                        <Link href="/" className="hover:text-foreground transition-colors">Home</Link>
                        <span>/</span>
                        {category && (
                            <>
                                <Link href="/categories" className="hover:text-foreground transition-colors">{category.name}</Link>
                                <span>/</span>
                            </>
                        )}
                        <span className="text-foreground truncate max-w-[200px]">{product.name}</span>
                    </div>
                </Container>
            </div>

            <Container className="py-12 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20">

                    {/* ── Left: Image Gallery ── */}
                    <ProductImageGallery images={product.image_urls ?? []} name={product.name} />

                    {/* ── Right: Product Info ── */}
                    <div className="flex flex-col">

                        {/* Category + Condition */}
                        <div className="flex items-center gap-3 mb-4">
                            {category && (
                                <span className="text-[11px] font-black uppercase tracking-[0.25em] text-sakura-500">
                                    {category.name}
                                </span>
                            )}
                            {category && <span className="text-border">·</span>}
                            <span className={`inline-flex items-center gap-1.5 border px-2.5 py-1 text-[11px] font-black uppercase tracking-wider ${conditionColor}`}>
                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                {conditionLabel}
                            </span>
                        </div>

                        {/* Product Name */}
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-foreground leading-tight mb-6">
                            {product.name}
                        </h1>

                        {/* Price block */}
                        <div className="border border-border p-6 mb-6 relative overflow-hidden">
                            {/* Accent line */}
                            <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-sakura-500" />
                            <p className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                                Estimasi Harga
                            </p>
                            <p className="text-4xl font-black text-foreground tabular-nums tracking-tight">
                                ¥{product.price_jpy.toLocaleString('ja-JP')}
                            </p>
                            <p className="text-xs text-muted-foreground mt-2">
                                Harga belum termasuk ongkir lokal. Kurs JPY akan dikonfirmasi saat order.
                            </p>
                        </div>

                        {/* Specs grid */}
                        <div className="grid grid-cols-2 gap-px bg-border mb-6">
                            {[
                                { label: 'Kondisi', value: conditionLabel },
                                { label: 'Berat Est.', value: product.estimated_weight_gram ? `${product.estimated_weight_gram} gr` : '—' },
                                { label: 'Kategori', value: category?.name ?? '—' },
                                { label: 'Stok', value: product.stock_quantity > 0 ? `${product.stock_quantity} tersisa` : 'Habis' },
                            ].map((spec) => (
                                <div key={spec.label} className="bg-background p-4">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{spec.label}</p>
                                    <p className="text-sm font-bold text-foreground mt-1">{spec.value}</p>
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="flex flex-col gap-3">
                            <a
                                href="https://wa.me/62"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="group relative flex items-center justify-between bg-foreground text-background px-7 py-4 font-black text-sm uppercase tracking-widest overflow-hidden transition-all hover:bg-sakura-500 active:scale-[0.97]"
                                style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)' }}
                            >
                                <span>Order via WhatsApp</span>
                                <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                            </a>
                            <Link
                                href="/#katalog"
                                className="group flex items-center justify-between border border-border px-6 py-4 text-sm font-bold text-foreground hover:border-foreground hover:bg-muted/30 transition-all"
                            >
                                <span>Lihat Produk Lain</span>
                                <svg className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                </svg>
                            </Link>
                        </div>

                        {/* Trust strip */}
                        <div className="mt-6 pt-6 border-t border-border flex flex-wrap gap-4">
                            {[
                                'Pembeli asli dari Jepang',
                                'Bayar via QRIS',
                                'Tracking realtime',
                            ].map((t) => (
                                <div key={t} className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <span className="text-sakura-500">✦</span>
                                    {t}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* ── Description ── */}
                {product.description && (
                    <div className="mt-16 pt-12 border-t border-border">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="h-px w-8 bg-sakura-500" />
                            <span className="text-[11px] font-black uppercase tracking-[0.25em] text-sakura-500">Deskripsi</span>
                        </div>
                        <div className="max-w-2xl">
                            <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
                                {product.description}
                            </p>
                        </div>
                    </div>
                )}
            </Container>
        </main>
    )
}