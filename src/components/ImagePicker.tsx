'use client'

import { useState, ChangeEvent, useRef } from 'react'
import Image from 'next/image' // Kita pakai Next Image biar optimal

export default function ImagePicker() {
    const [previews, setPreviews] = useState<string[]>([])
    const [selectedForPreview, setSelectedForPreview] = useState<string | null>(null) // State untuk modal gede
    const fileInputRef = useRef<HTMLInputElement>(null)

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files
        if (files) {
            const fileArray = Array.from(files)

            // Buat URL preview baru
            const newPreviews = fileArray.map(file => URL.createObjectURL(file))

            // Tambahkan ke preview yang sudah ada (bukan ditimpa) agar bisa nambah foto berkali-kali
            setPreviews(prev => [...prev, ...newPreviews])
        }
    }

    const clearImages = () => {
        previews.forEach(url => URL.revokeObjectURL(url))
        setPreviews([])
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const removeOneImage = (index: number) => {
        const newPreviews = [...previews]
        // Bersihkan memori dari URL yang dihapus
        URL.revokeObjectURL(newPreviews[index])
        newPreviews.splice(index, 1)
        setPreviews(newPreviews)
    }

    return (
        <div className="space-y-4">
            {/* Header Bagian Foto */}
            <div className="flex items-center justify-between gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                    Galeri Foto ({previews.length})
                </label>
                {previews.length > 0 && (
                    <button
                        type="button"
                        onClick={clearImages}
                        className="text-[11px] font-medium text-red-500 hover:text-red-600 hover:underline transition-colors"
                    >
                        Hapus Semua
                    </button>
                )}
            </div>

            {/* AREA DROPZONE/TOMBOL PILIH (Dipercantik) */}
            <div
                onClick={() => fileInputRef.current?.click()}
                className="relative border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-2xl p-6 hover:border-blue-500 dark:hover:border-blue-400 hover:bg-gray-50 dark:hover:bg-blue-950/20 transition-all group bg-white dark:bg-gray-900 cursor-pointer shadow-inner"
            >
                {/* Input File Asli (Hidden) */}
                <input
                    ref={fileInputRef}
                    name="images"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                    className="hidden"
                />

                <div className="text-center space-y-2">
                    {/* Ikon Upload Modern */}
                    <div className="mx-auto h-14 w-14 text-gray-400 dark:text-gray-600 mb-2 flex items-center justify-center border-2 border-gray-200 dark:border-gray-700 rounded-full group-hover:scale-110 group-hover:border-blue-300 dark:group-hover:border-blue-700 transition-all duration-300">
                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        {previews.length > 0 ? 'Tambah Foto Lagi' : 'Pilih Foto Produk'}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 max-w-xs mx-auto">
                        Seret foto ke sini atau klik untuk memilih. Anda bisa memilih banyak sekaligus.
                    </p>
                </div>
            </div>

            {/* GRID PREVIEW THUMBNAIL (DIROMBAK TOTAL) */}
            {previews.length > 0 && (
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mt-5 pt-4 border-t dark:border-gray-800">
                    {previews.map((url, index) => (
                        <div
                            key={index}
                            className="group relative aspect-square rounded-xl overflow-hidden border-2 border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-900 shadow-sm transition-all hover:shadow-md hover:border-blue-200 dark:hover:border-blue-800"
                        >
                            {/* Gambar Utama */}
                            <img
                                src={url}
                                alt={`Preview produk ${index + 1}`}
                                className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                            />

                            {/* OVERLAY: Tombol muncul saat Hover (Modern & Bersih) */}
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2.5 p-2">
                                {/* Tombol Lihat Gede */}
                                <button
                                    type="button"
                                    onClick={() => setSelectedForPreview(url)}
                                    className="p-2 bg-white/90 rounded-full text-gray-900 hover:bg-white hover:scale-110 transition-all shadow"
                                    title="Lihat ukuran penuh"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </button>

                                {/* Tombol Hapus Satuan */}
                                <button
                                    type="button"
                                    onClick={() => removeOneImage(index)}
                                    className="p-2 bg-red-500/90 rounded-full text-white hover:bg-red-600 hover:scale-110 transition-all shadow"
                                    title="Hapus foto ini"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Indikator Nomor (Opsional, di pojok) */}
                            <div className="absolute top-1.5 left-1.5 bg-black/50 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full backdrop-blur-sm">
                                {index + 1}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* MODAL PREVIEW GEDHE (FULLSCREEN LIGHTBOX) */}
            {selectedForPreview && (
                <div
                    className="fixed inset-0 z-[999] bg-black/90 backdrop-blur-sm flex items-center justify-center p-4 md:p-12 transition-all duration-300 animate-in fade-in"
                    onClick={() => setSelectedForPreview(null)} // Klik layar hitam buat nutup
                >
                    {/* Tombol Tutup X */}
                    <button className="absolute top-6 right-6 text-gray-300 hover:text-white text-4xl font-light transition-transform hover:rotate-90">&times;</button>

                    <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
                        {/* Foto Gede Proposional */}
                        <img
                            src={selectedForPreview}
                            alt="Full Preview Produk"
                            className="max-w-full max-h-full object-contain shadow-2xl rounded-2xl border-4 border-white/10"
                        />
                    </div>
                </div>
            )}
        </div>
    )
}