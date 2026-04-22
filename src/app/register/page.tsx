import type { Metadata } from 'next'
import RegisterClient from './RegisterClient'

export const metadata: Metadata = {
  title: 'Daftar Akun',
  description: 'Buat akun Nihong Finds dan mulai belanja dari Tokyo.',
}

export default function RegisterPage() {
  return <RegisterClient />
}