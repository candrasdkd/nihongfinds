'use client'

import { useState } from 'react'

interface Props {
    images: string[]
    name: string
}

export default function ProductImageGallery({ images, name }: Props) {
    const [selected, setSelected] = useState(0)
    const [lightbox, setLightbox] = useState(false)

    const hasImages = images.length > 0
    const src = hasImages
        ? images[selected]
        : `https://placehold.co/800x1000/f1f5f9/94a3b8?text=${encodeURIComponent(name)}`

    return (
        <div className="flex flex-col gap-4">

            {/* Main image */}
            <div
                className="relative aspect-[4/5] overflow-hidden bg-muted cursor-zoom-in border border-border"
                onClick={() => hasImages && setLightbox(true)}
            >
                <img
                    src={src}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-500 hover:scale-[1.03]"
                />
                {/* Zoom hint */}
                {hasImages && (
                    <div className="absolute bottom-4 right-4 flex items-center gap-1.5 bg-background/80 backdrop-blur-sm border border-border px-3 py-1.5">
                        <svg className="h-3.5 w-3.5 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                        <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Perbesar</span>
                    </div>
                )}
                {/* Image counter */}
                {images.length > 1 && (
                    <div className="absolute top-4 left-4 bg-background/80 backdrop-blur-sm border border-border px-3 py-1">
                        <span className="text-[10px] font-black text-foreground">{selected + 1} / {images.length}</span>
                    </div>
                )}
            </div>

            {/* Thumbnail strip */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                    {images.map((url, i) => (
                        <button
                            key={i}
                            type="button"
                            onClick={() => setSelected(i)}
                            className={`relative shrink-0 w-16 h-20 overflow-hidden border-2 transition-all ${i === selected
                                    ? 'border-foreground'
                                    : 'border-border hover:border-muted-foreground'
                                }`}
                        >
                            <img src={url} alt={`${name} ${i + 1}`} className="h-full w-full object-cover" />
                        </button>
                    ))}
                </div>
            )}

            {/* Lightbox */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-[999] bg-black/95 flex items-center justify-center p-4 md:p-12"
                    onClick={() => setLightbox(false)}
                >
                    <button
                        className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all"
                        onClick={() => setLightbox(false)}
                    >
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Prev / Next */}
                    {images.length > 1 && (
                        <>
                            <button
                                className="absolute left-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all"
                                onClick={(e) => { e.stopPropagation(); setSelected((selected - 1 + images.length) % images.length) }}
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                className="absolute right-4 top-1/2 -translate-y-1/2 flex h-10 w-10 items-center justify-center border border-white/20 text-white/70 hover:text-white hover:border-white/40 transition-all"
                                onClick={(e) => { e.stopPropagation(); setSelected((selected + 1) % images.length) }}
                            >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}

                    <div onClick={(e) => e.stopPropagation()} className="max-w-4xl max-h-full">
                        <img
                            src={images[selected]}
                            alt={name}
                            className="max-w-full max-h-[85vh] object-contain"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}