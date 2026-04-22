import { createClient } from '@/utils/supabase/server';
import { NavbarClient } from './NavbarClient';

export async function Navbar() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let fullName: string | null = null;
  let isAdmin = false;

  if (user) {
    // Ambil nama dari profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('full_name')
      .eq('id', user.id)
      .single();
    fullName = profile?.full_name ?? null;

    // Cek role dari user_metadata (bukan dari DB — aman dari RLS bypass)
    isAdmin = user.user_metadata?.role === 'admin';
  }

  return (
    <NavbarClient
      isLoggedIn={!!user}
      userFullName={fullName}
      isAdmin={isAdmin}
    />
  );
}