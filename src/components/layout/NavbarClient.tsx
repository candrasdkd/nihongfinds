'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

interface NavbarClientProps {
  isLoggedIn: boolean;
  userFullName: string | null;
  isAdmin: boolean; // ← baru
}

const NAV_LINKS = [
  { href: '/#katalog', label: 'Katalog' },
  { href: '/orders', label: 'Pesanan Saya' },
];

export function NavbarClient({ isLoggedIn, userFullName, isAdmin }: NavbarClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [actualIsLoggedIn, setActualIsLoggedIn] = useState(isLoggedIn);
  const [actualFullName, setActualFullName] = useState(userFullName);
  const [actualIsAdmin, setActualIsAdmin] = useState(isAdmin);

  useEffect(() => {
    setActualIsLoggedIn(isLoggedIn);
    setActualFullName(userFullName);
    setActualIsAdmin(isAdmin);
  }, [isLoggedIn, userFullName, isAdmin]);

  // Sync pada navigasi BFCache / history pop
  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      const loggedIn = !!user;
      if (loggedIn !== actualIsLoggedIn) {
        setActualIsLoggedIn(loggedIn);
        setActualIsAdmin(user?.user_metadata?.role === 'admin');
        if (!user) setActualFullName(null);
        router.refresh();
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const loggedIn = !!session;
        if (loggedIn !== actualIsLoggedIn) {
          setActualIsLoggedIn(loggedIn);
          if (loggedIn && session?.user) {
            const role = session.user.user_metadata?.role;
            setActualIsAdmin(role === 'admin');
            const { data } = await supabase
              .from('profiles')
              .select('full_name')
              .eq('id', session.user.id)
              .single();
            setActualFullName(data?.full_name ?? null);
          } else {
            setActualIsAdmin(false);
            setActualFullName(null);
          }
          router.refresh();
        }
      }
    );

    return () => subscription.unsubscribe();
  }, [actualIsLoggedIn, router]);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setIsMenuOpen(false); }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled
          ? 'bg-background/70 backdrop-blur-2xl border-b border-border/50 shadow-sm shadow-foreground/5 py-1'
          : 'bg-gradient-to-b from-background/80 to-transparent py-2'
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group" aria-label="Nihong Finds - Halaman Utama">
            <div className="flex h-9 w-9 items-center justify-center rounded-[14px] bg-gradient-to-br from-sakura-500 to-sakura-600 shadow-md shadow-sakura-500/20 transition-all duration-300 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-lg group-hover:shadow-sakura-500/40">
              <span className="text-sm font-black text-white">日</span>
            </div>
            <span className="text-lg font-black tracking-tighter text-foreground">
              Nihong<span className="text-sakura-500">.</span>Finds
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-2" aria-label="Navigasi utama">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`relative px-4 py-2 text-sm font-bold transition-colors duration-200 ${pathname === link.href
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-foreground/5 rounded-full'
                  }`}
              >
                {link.label}
                {pathname === link.href && (
                  <span className="absolute left-1/2 bottom-1 h-1 w-1 -translate-x-1/2 rounded-full bg-sakura-500" />
                )}
              </Link>
            ))}

            {/* Admin link — hanya tampil jika role === 'admin' */}
            {actualIsAdmin && (
              <Link
                href="/admin/products"
                className={`relative px-4 py-2 text-sm font-bold transition-colors duration-200 rounded-full ${pathname.startsWith('/admin')
                    ? 'text-brand-600 bg-brand-50 dark:text-brand-400 dark:bg-brand-900/30'
                    : 'text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-900/20'
                  }`}
              >
                ⚙ Admin
              </Link>
            )}
          </nav>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {actualIsLoggedIn ? (
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium text-muted-foreground">
                  Halo, <span className="font-bold text-foreground">{actualFullName ?? 'User'}</span>
                </span>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="rounded-full border border-border bg-card px-5 py-2 text-sm font-bold text-muted-foreground shadow-sm transition-all hover:border-destructive/30 hover:bg-destructive/5 hover:text-destructive active:scale-95"
                  >
                    Keluar
                  </button>
                </form>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-full px-5 py-2.5 text-sm font-bold text-muted-foreground transition-all hover:bg-foreground/5 hover:text-foreground active:scale-95"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="shimmer-hover rounded-full bg-gradient-to-r from-sakura-600 to-sakura-500 px-6 py-2.5 text-sm font-bold text-white shadow-md shadow-sakura-500/20 transition-all hover:opacity-90 hover:shadow-lg hover:shadow-sakura-500/30 active:scale-95"
                >
                  Daftar
                </Link>
              </>
            )}
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className="flex md:hidden h-10 w-10 items-center justify-center rounded-xl bg-foreground/5 text-foreground transition-all hover:bg-foreground/10 active:scale-95"
            aria-label={isMenuOpen ? 'Tutup menu' : 'Buka menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
          >
            <svg className="h-5 w-5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden absolute top-full left-0 right-0 border-b border-border bg-background/95 backdrop-blur-2xl shadow-xl transition-all duration-300 overflow-hidden ${isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0 pointer-events-none'
          }`}
        aria-hidden={!isMenuOpen}
      >
        <nav className="flex flex-col gap-2 p-4">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center rounded-2xl px-5 py-3.5 text-sm font-bold transition-all ${pathname === link.href
                  ? 'bg-sakura-50/50 text-sakura-600 dark:bg-sakura-500/10 dark:text-sakura-400'
                  : 'text-muted-foreground hover:bg-foreground/5 hover:text-foreground'
                }`}
            >
              {link.label}
            </Link>
          ))}

          {/* Admin link mobile */}
          {actualIsAdmin && (
            <Link
              href="/admin/products"
              className={`flex items-center rounded-2xl px-5 py-3.5 text-sm font-bold transition-all ${pathname.startsWith('/admin')
                  ? 'bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400'
                  : 'text-brand-600 hover:bg-brand-50 dark:text-brand-400 dark:hover:bg-brand-900/20'
                }`}
            >
              ⚙ Admin Panel
            </Link>
          )}

          <div className="mt-4 border-t border-border pt-4 flex flex-col gap-3">
            {actualIsLoggedIn ? (
              <>
                <p className="px-5 text-xs text-muted-foreground">
                  Login sebagai <span className="font-bold text-foreground">{actualFullName ?? 'User'}</span>
                  {actualIsAdmin && (
                    <span className="ml-2 rounded-full bg-brand-100 px-2 py-0.5 text-[10px] font-black text-brand-700 dark:bg-brand-900/30 dark:text-brand-300">
                      ADMIN
                    </span>
                  )}
                </p>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="w-full rounded-2xl border border-destructive/20 bg-destructive/5 px-5 py-3.5 text-sm font-bold text-destructive transition-all hover:bg-destructive/10 active:scale-95"
                  >
                    Keluar Akun
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="w-full rounded-2xl border-2 border-border bg-transparent px-5 py-3.5 text-center text-sm font-bold text-foreground transition-all hover:bg-foreground/5 active:scale-95"
                >
                  Masuk
                </Link>
                <Link
                  href="/register"
                  className="w-full rounded-2xl bg-gradient-to-r from-sakura-600 to-sakura-500 px-5 py-3.5 text-center text-sm font-bold text-white shadow-lg shadow-sakura-500/25 transition-all hover:opacity-90 active:scale-95"
                >
                  Daftar Sekarang
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}