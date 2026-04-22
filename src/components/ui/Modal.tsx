'use client'

import React from 'react'

export type ModalType = 'confirm' | 'success' | 'error' | 'loading'

interface ModalProps {
  isOpen: boolean
  type: ModalType
  title: string
  message: string
  onClose?: () => void
  onConfirm?: () => void
}

export function Modal({ isOpen, type, title, message, onClose, onConfirm }: ModalProps) {
  if (!isOpen) return null

  // Ikon dinamis berdasarkan tipe modal
  const renderIcon = () => {
    switch (type) {
      case 'loading':
        return (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-100 dark:bg-brand-900/30">
            <svg className="h-8 w-8 animate-spin text-brand-600 dark:text-brand-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )
      case 'success':
        return (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/30">
            <svg className="h-8 w-8 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )
      case 'error':
        return (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <svg className="h-8 w-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        )
      case 'confirm':
        return (
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 dark:bg-amber-900/30">
            <svg className="h-8 w-8 text-amber-600 dark:text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )
    }
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop (Klik di luar bisa nutup kecuali lg loading) */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm transition-opacity" 
        onClick={type !== 'loading' ? onClose : undefined} 
      />
      
      {/* Modal Box */}
      <div className="relative w-full max-w-sm animate-scale-in rounded-3xl border border-border bg-card p-8 shadow-2xl text-center">
        
        {/* Close Button (X) */}
        {type !== 'loading' && (
          <button 
            onClick={onClose}
            className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* Icon */}
        <div className="mb-6 flex justify-center">
          {renderIcon()}
        </div>

        {/* Text */}
        <h3 className="mb-2 text-xl font-bold text-foreground">{title}</h3>
        <p className="text-sm text-muted-foreground">{message}</p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col gap-3">
          {type === 'confirm' && (
            <>
              <button 
                onClick={onConfirm}
                className="w-full rounded-xl bg-foreground px-4 py-3.5 text-sm font-bold text-background transition-all hover:opacity-90 active:scale-95"
              >
                Ya, Lanjutkan
              </button>
              <button 
                onClick={onClose}
                className="w-full rounded-xl border border-border px-4 py-3.5 text-sm font-bold text-foreground transition-all hover:bg-muted active:scale-95"
              >
                Batal
              </button>
            </>
          )}

          {(type === 'success' || type === 'error') && (
            <button 
              onClick={onConfirm || onClose}
              className={`w-full rounded-xl px-4 py-3.5 text-sm font-bold text-white transition-all hover:opacity-90 active:scale-95 ${
                type === 'success' ? 'bg-emerald-600' : 'bg-destructive'
              }`}
            >
              {type === 'success' ? 'OK, Mengerti' : 'Tutup'}
            </button>
          )}
        </div>

      </div>
    </div>
  )
}
