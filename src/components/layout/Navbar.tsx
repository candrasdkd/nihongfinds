import { createClient } from '@/utils/supabase/server';
import { NavbarClient } from './NavbarClient';

/**
 * Server Component: fetch session di server, kirim ke NavbarClient.
 * Ini agar tidak ada layout shift dan auth state langsung tersedia saat render.
 */
export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Ambil nama dari profile jika user login
  let fullName: string | null = null;
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();
    fullName = profile?.full_name ?? null;
  }

  return <NavbarClient isLoggedIn={!!user} userFullName={fullName} />;
}
