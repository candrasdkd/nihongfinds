import Link from 'next/link';
import { Container } from '@/components/ui/Container';

const FOOTER_LINKS = {
  Belanja: [
    { href: '/#katalog', label: 'Katalog Produk' },
    { href: '/categories', label: 'Kategori' },
  ],
  Akun: [
    { href: '/orders', label: 'Pesanan Saya' },
    { href: '/profile', label: 'Profil' },
    { href: '/login', label: 'Masuk' },
  ],
  Info: [
    { href: '/cara-order', label: 'Cara Order' },
    { href: '/faq', label: 'FAQ' },
    { href: '/kontak', label: 'Hubungi Kami' },
  ],
};

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-muted/30">
      <Container>
        {/* Top section */}
        <div className="py-12 grid grid-cols-2 gap-8 md:grid-cols-4 md:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 w-fit" aria-label="Nihong Finds">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-slate-800 to-slate-600 dark:from-white dark:to-slate-300">
                <span className="text-xs font-black text-white dark:text-slate-900">日</span>
              </div>
              <span className="text-base font-black tracking-tight text-foreground">
                Nihong<span className="text-brand-500">.</span>Finds
              </span>
            </Link>
            <p className="mt-4 text-sm text-muted-foreground leading-relaxed">
              Jastip barang Jepang pilihan. Aman, transparan, dan terpercaya langsung dari Tokyo.
            </p>
            {/* Social / WA */}
            <a
              href="https://wa.me/62"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-4 py-2 text-xs font-semibold text-emerald-700 dark:text-emerald-400 transition-colors hover:bg-emerald-500/20"
              aria-label="Chat via WhatsApp"
            >
              <svg className="h-3.5 w-3.5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              Chat via WhatsApp
            </a>
          </div>

          {/* Link Groups */}
          {Object.entries(FOOTER_LINKS).map(([group, links]) => (
            <div key={group}>
              <h3 className="text-xs font-bold uppercase tracking-widest text-foreground mb-4">
                {group}
              </h3>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            &copy; {year}{' '}
            <span className="font-semibold text-foreground">Nihong Finds</span>
            . All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Pembayaran via{' '}
            <span className="font-semibold">QRIS</span>
            {' '}· Powered by{' '}
            <span className="font-semibold">Midtrans</span>
          </p>
        </div>
      </Container>
    </footer>
  );
}
