import React from 'react';
import Link from 'next/link';
import { Badge } from './Badge';
import type { ProductCardProps } from '@/types';

export const ProductCard = ({
  id,
  name,
  price_jpy,
  image_url,
  category_name,
  condition,
}: ProductCardProps) => {
  return (
    <article className="card-lift group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card">
      {/* Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-muted">
        <img
          src={image_url ?? `https://placehold.co/400x500/f1f5f9/94a3b8?text=${encodeURIComponent(name)}`}
          alt={name}
          className="h-full w-full object-cover transition-transform duration-500 will-change-transform group-hover:scale-[1.06]"
          loading="lazy"
        />

        {/* Gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Condition badge */}
        <div className="absolute left-3 top-3">
          <Badge variant={condition === 'NEW' ? 'success' : 'warning'}>
            {condition === 'NEW' ? '✦ Baru' : 'Bekas'}
          </Badge>
        </div>

        {/* Quick add button — appears on hover */}
        <div className="absolute inset-x-3 bottom-3 translate-y-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <Link
            href={`/product/${id}`}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/90 px-4 py-2.5 text-xs font-bold text-foreground backdrop-blur-sm transition-colors hover:bg-white dark:bg-slate-900/90 dark:text-foreground dark:hover:bg-slate-900"
          >
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
            </svg>
            Lihat Detail
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        {/* Category */}
        <p className="text-[10px] font-bold uppercase tracking-widest text-brand-500 dark:text-brand-400">
          {category_name ?? 'Lainnya'}
        </p>

        {/* Name — full card clickable via absolute span */}
        <h3 className="relative mt-1 line-clamp-2 text-sm font-semibold leading-snug text-foreground md:text-[15px]">
          <Link href={`/product/${id}`}>
            <span className="absolute inset-0 rounded-2xl" aria-hidden />
            {name}
          </Link>
        </h3>

        {/* Price */}
        <div className="mt-auto flex items-end justify-between pt-4">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-wider text-muted-foreground">
              Estimasi Harga
            </p>
            <p className="mt-0.5 text-lg font-black tabular-nums text-foreground">
              ¥{price_jpy.toLocaleString('ja-JP')}
            </p>
          </div>

          {/* Arrow icon */}
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-foreground/5 text-foreground transition-all duration-200 group-hover:bg-foreground group-hover:text-background">
            <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </div>
    </article>
  );
};
