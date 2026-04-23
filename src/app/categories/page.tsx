import { createClient } from '@/utils/supabase/server'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import { ProductCard } from '@/components/ui/ProductCard'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Kategori',
    description: 'Jelajahi semua kategori produk Nihong Finds dari Tokyo.',
}

export default async function CategoriesPage() {
    const supabase = await createClient()

    // Fetch semua kategori
    const { data: categories } = await supabase
        .from('categories')
        .select('id, name, slug')
        .order('name', { ascending: true })

    // Fetch semua produk aktif sekaligus (lebih efisien dari N+1)
    const { data: products } = await supabase
        .from('products')
        .select('*, categories(name, slug)')
        .eq('is_active', true)
        .order('created_at', { ascending: false })

    // Group produk per category_id
    const productsByCategory = (products ?? []).reduce<Record<string, typeof products>>((acc, p) => {
        const key = p.category_id ?? 'uncategorized'
        if (!acc[key]) acc[key] = []
        acc[key]!.push(p)
        return acc
    }, {})

    const uncategorized = productsByCategory['uncategorized'] ?? []
    const totalProducts = products?.length ?? 0

    return (
        <main className="min-h-screen bg-background">

            {/* ── Hero Header ── */}
            <section className="relative border-b border-border overflow-hidden">
                {/* Kanji watermark */}
                <div
                    aria-hidden
                    className="pointer-events-none select-none absolute right-0 top-1/2 -translate-y-1/2 font-black text-foreground/[0.04] leading-none"
                    style={{ fontSize: 'clamp(100px, 18vw, 240px)', lineHeight: 1 }}
                >
                    種類
                </div>
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-sakura-500 to-transparent opacity-60" />

                <Container className="py-16 md:py-20 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-8 bg-sakura-500" />
                        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-sakura-500">Katalog</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-none mb-4">
                        Semua Kategori
                    </h1>
                    <div className="flex items-center gap-6 mt-6">
                        <div>
                            <span className="text-2xl font-black text-foreground">{categories?.length ?? 0}</span>
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider ml-2">Kategori</span>
                        </div>
                        <div className="w-px h-6 bg-border" />
                        <div>
                            <span className="text-2xl font-black text-foreground">{totalProducts}</span>
                            <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider ml-2">Produk</span>
                        </div>
                    </div>
                </Container>
            </section>

            {/* ── Category Jump Nav ── */}
            {categories && categories.length > 0 && (
                <div className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur-sm">
                    <Container>
                        <div className="flex gap-1 overflow-x-auto py-3 scrollbar-hide">
                            <a
                                href="#semua"
                                className="shrink-0 px-4 py-2 text-[11px] font-black uppercase tracking-widest border border-foreground bg-foreground text-background transition-all"
                            >
                                Semua
                            </a>
                            {categories.map((cat) => (
                                <a
                                    key={cat.id}
                                    href={`#${cat.slug}`}
                                    className="shrink-0 px-4 py-2 text-[11px] font-black uppercase tracking-widest border border-border text-muted-foreground hover:border-foreground hover:text-foreground transition-all"
                                >
                                    {cat.name}
                                </a>
                            ))}
                        </div>
                    </Container>
                </div>
            )}

            <Container className="py-16">

                {/* No products at all */}
                {totalProducts === 0 && (
                    <div className="flex flex-col items-center justify-center py-28 border-2 border-dashed border-border">
                        <span className="text-6xl font-black text-foreground/10 mb-4">品</span>
                        <h3 className="text-lg font-black text-foreground">Belum Ada Produk</h3>
                        <p className="mt-2 text-sm text-muted-foreground text-center max-w-xs">
                            Tim kami sedang hunting barang terbaik di Tokyo.
                        </p>
                        <Link href="/" className="mt-6 text-sm font-bold border-b border-foreground hover:text-sakura-500 hover:border-sakura-500 transition-colors">
                            Kembali ke Home
                        </Link>
                    </div>
                )}

                {/* Per-category sections */}
                <div id="semua" className="space-y-20">
                    {categories?.map((cat) => {
                        const catProducts = productsByCategory[cat.id] ?? []
                        if (catProducts.length === 0) return null
                        return (
                            <section key={cat.id} id={cat.slug}>
                                {/* Section header */}
                                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                                    <div>
                                        <div className="flex items-center gap-3 mb-2">
                                            <div className="h-px w-6 bg-sakura-500" />
                                            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-sakura-500">
                                                {catProducts.length} produk
                                            </span>
                                        </div>
                                        <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground">
                                            {cat.name}
                                        </h2>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
                                    {catProducts.map((item, index) => (
                                        <div
                                            key={item.id}
                                            className="animate-fade-up"
                                            style={{ animationDelay: `${index * 50}ms` }}
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

                                {/* Divider */}
                                <div className="mt-12 h-px bg-border" />
                            </section>
                        )
                    })}

                    {/* Uncategorized */}
                    {uncategorized.length > 0 && (
                        <section id="lainnya">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="h-px w-6 bg-sakura-500" />
                                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-sakura-500">
                                    {uncategorized.length} produk
                                </span>
                            </div>
                            <h2 className="text-2xl md:text-3xl font-black tracking-tighter text-foreground mb-8">Lainnya</h2>
                            <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 md:gap-5">
                                {uncategorized.map((item) => (
                                    <ProductCard
                                        key={item.id}
                                        id={item.id}
                                        name={item.name}
                                        price_jpy={item.price_jpy}
                                        image_url={item.image_urls?.[0] ?? null}
                                        condition={item.condition}
                                    />
                                ))}
                            </div>
                        </section>
                    )}
                </div>
            </Container>
        </main>
    )
}