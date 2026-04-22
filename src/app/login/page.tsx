import type { Metadata } from 'next'
import LoginClient from './LoginClient'

export const metadata: Metadata = {
  title: 'Masuk',
  description: 'Masuk ke akun Nihong Finds kamu.',
}

export default function LoginPage() {
  return <LoginClient />
}