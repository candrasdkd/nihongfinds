import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Container } from '@/components/ui/Container'
import type { Metadata } from 'next'
import type { OrderStatus } from '@/types'
import { ORDER_STATUS_LABELS } from '@/types'

export const metadata: Metadata = {
    title: 'Pesanan Saya',
    description: 'Riwayat dan status pesanan jastip Nihong Finds kamu.',
}

const STATUS_STYLE: Record<OrderStatus, string> = {
    WAITING_DP: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800/40',
    PURCHASED: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800/40',
    SHIPPED_TO_INDO: 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20 border-purple-200 dark:border-purple-800/40',
    SHIPPED_LOCAL: 'text-sakura-600 dark:text-sakura-400 bg-sakura-50 dark:bg-sakura-900/20 border-sakura-200 dark:border-sakura-800/40',
    COMPLETED: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800/40',
}

const STATUS_STEP: Record<OrderStatus, number> = {
    WAITING_DP: 1,
    PURCHASED: 2,
    SHIPPED_TO_INDO: 3,
    SHIPPED_LOCAL: 4,
    COMPLETED: 5,
}

export default async function OrdersPage() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: orders } = await supabase
        .from('orders')
        .select('*, order_items(id, item_name, price_jpy, quantity, image_url)')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

    const hasOrders = orders && orders.length > 0

    return (
        <main className="min-h-screen bg-background">

            {/* ── Header ── */}
            <section className="relative border-b border-border overflow-hidden">
                <div
                    aria-hidden
                    className="pointer-events-none select-none absolute right-0 top-1/2 -translate-y-1/2 font-black text-foreground/[0.04] leading-none"
                    style={{ fontSize: 'clamp(100px, 18vw, 240px)', lineHeight: 1 }}
                >
                    注文
                </div>
                <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-gradient-to-b from-transparent via-sakura-500 to-transparent opacity-60" />

                <Container className="py-16 md:py-20 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="h-px w-8 bg-sakura-500" />
                        <span className="text-[11px] font-black uppercase tracking-[0.25em] text-sakura-500">Akun</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-none mb-2">
                        Pesanan Saya
                    </h1>
                    <p className="text-muted-foreground text-sm mt-4">
                        {hasOrders ? `${orders.length} pesanan ditemukan` : 'Belum ada pesanan'}
                    </p>
                </Container>
            </section>

            <Container className="py-12 md:py-16">

                {/* Empty state */}
                {!hasOrders && (
                    <div className="flex flex-col items-center justify-center py-28 border-2 border-dashed border-border">
                        <span className="text-6xl font-black text-foreground/10 mb-4">注</span>
                        <h3 className="text-lg font-black text-foreground">Belum Ada Pesanan</h3>
                        <p className="mt-2 text-sm text-muted-foreground text-center max-w-xs">
                            Kamu belum pernah melakukan order. Yuk mulai belanja dari Tokyo!
                        </p>
                        <Link
                            href="/#katalog"
                            className="mt-8 group relative inline-flex items-center gap-3 bg-foreground text-background px-7 py-4 font-black text-sm uppercase tracking-widest overflow-hidden transition-all hover:bg-sakura-500 active:scale-[0.97]"
                            style={{ clipPath: 'polygon(0 0, calc(100% - 12px) 0, 100% 100%, 12px 100%)' }}
                        >
                            <span>Lihat Katalog</span>
                            <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </Link>
                    </div>
                )}

                {/* Order list */}
                {hasOrders && (
                    <div className="space-y-6">
                        {orders.map((order) => {
                            const status = order.status as OrderStatus
                            const step = STATUS_STEP[status]
                            const items = order.order_items as Array<{
                                id: string; item_name: string; price_jpy: number; quantity: number; image_url: string | null
                            }>

                            return (
                                <article key={order.id} className="border border-border bg-card overflow-hidden">

                                    {/* Order header */}
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-6 border-b border-border">
                                        <div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-1">
                                                ID Pesanan
                                            </p>
                                            <p className="text-sm font-black text-foreground font-mono">
                                                #{order.id.slice(0, 8).toUpperCase()}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            {/* Status badge */}
                                            <span className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-[11px] font-black uppercase tracking-wider ${STATUS_STYLE[status]}`}>
                                                <span className="h-1.5 w-1.5 rounded-full bg-current" />
                                                {ORDER_STATUS_LABELS[status]}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Progress bar */}
                                    <div className="px-6 py-4 bg-muted/30 border-b border-border">
                                        <div className="flex items-center gap-0">
                                            {Object.entries(ORDER_STATUS_LABELS).map(([s, label], i) => {
                                                const isActive = i < step
                                                const isCurrent = i === step - 1
                                                return (
                                                    <div key={s} className="flex items-center flex-1 last:flex-none">
                                                        <div className="flex flex-col items-center gap-1">
                                                            <div className={`h-2.5 w-2.5 rounded-full border-2 transition-all ${isCurrent ? 'border-sakura-500 bg-sakura-500 scale-125' :
                                                                    isActive ? 'border-foreground bg-foreground' :
                                                                        'border-border bg-background'
                                                                }`} />
                                                            <span className={`text-[8px] font-black uppercase tracking-wide hidden sm:block ${isCurrent ? 'text-sakura-500' :
                                                                    isActive ? 'text-foreground' :
                                                                        'text-muted-foreground/40'
                                                                }`}>
                                                                {label.split(' ')[0]}
                                                            </span>
                                                        </div>
                                                        {i < 4 && (
                                                            <div className={`flex-1 h-0.5 mx-1 transition-all ${isActive ? 'bg-foreground' : 'bg-border'}`} />
                                                        )}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>

                                    {/* Order items */}
                                    <div className="p-6">
                                        <div className="space-y-3 mb-6">
                                            {items.slice(0, 3).map((item) => (
                                                <div key={item.id} className="flex items-center gap-4">
                                                    <div className="h-14 w-14 shrink-0 border border-border bg-muted overflow-hidden">
                                                        {item.image_url ? (
                                                            <img src={item.image_url} alt={item.item_name} className="h-full w-full object-cover" />
                                                        ) : (
                                                            <div className="h-full w-full flex items-center justify-center text-muted-foreground/30 text-lg font-black">品</div>
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-foreground truncate">{item.item_name}</p>
                                                        <p className="text-xs text-muted-foreground">¥{item.price_jpy.toLocaleString('ja-JP')} × {item.quantity}</p>
                                                    </div>
                                                </div>
                                            ))}
                                            {items.length > 3 && (
                                                <p className="text-xs text-muted-foreground pl-[72px]">+{items.length - 3} item lainnya</p>
                                            )}
                                        </div>

                                        {/* Order summary */}
                                        <div className="grid grid-cols-2 gap-px bg-border pt-4 border-t border-border">
                                            {[
                                                { label: 'Total', value: `Rp ${order.total_amount.toLocaleString('id-ID')}` },
                                                { label: 'DP', value: `Rp ${order.dp_amount.toLocaleString('id-ID')}` },
                                                order.tracking_number_intl && { label: 'Resi Intl', value: order.tracking_number_intl },
                                                order.tracking_number_local && { label: 'Resi Lokal', value: order.tracking_number_local },
                                            ].filter(Boolean).map((spec: any) => (
                                                <div key={spec.label} className="bg-card p-3">
                                                    <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">{spec.label}</p>
                                                    <p className="text-sm font-bold text-foreground mt-0.5 truncate">{spec.value}</p>
                                                </div>
                                            ))}
                                        </div>

                                        {/* Action */}
                                        {status === 'WAITING_DP' && (
                                            <div className="mt-4">
                                                <a
                                                    href="https://wa.me/62"
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="group relative inline-flex items-center gap-3 bg-foreground text-background px-6 py-3 font-black text-xs uppercase tracking-widest overflow-hidden transition-all hover:bg-sakura-500 active:scale-[0.97]"
                                                    style={{ clipPath: 'polygon(0 0, calc(100% - 10px) 0, 100% 100%, 10px 100%)' }}
                                                >
                                                    <span>Konfirmasi Pembayaran</span>
                                                    <svg className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                                                    </svg>
                                                </a>
                                            </div>
                                        )}
                                    </div>
                                </article>
                            )
                        })}
                    </div>
                )}

                {/* Back to catalog */}
                <div className="mt-12 flex items-center justify-center">
                    <Link
                        href="/#katalog"
                        className="group inline-flex items-center gap-2 text-sm font-bold text-muted-foreground border-b border-transparent hover:text-foreground hover:border-foreground transition-all pb-0.5"
                    >
                        <svg className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali Belanja
                    </Link>
                </div>
            </Container>
        </main>
    )
}