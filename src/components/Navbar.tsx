'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import { useParams, usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { data: session } = useSession();
  const params = useParams();
  const pathname = usePathname();
  const router = useRouter();
  const locale = (params?.locale as string) ?? 'es';
  const t = useTranslations('nav');
  const [langOpen, setLangOpen] = useState(false);
  const { cartCount } = useCart();

  const locales = [
    { code: 'es', label: 'ES' },
    { code: 'en', label: 'EN' },
    { code: 'pt', label: 'PT' },
  ];

  const switchLocale = (newLocale: string) => {
    const newPath = pathname.replace(`/${locale}`, `/${newLocale}`);
    router.push(newPath);
    setLangOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#1c1410] border-b-4 border-[#c8860a]">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">

          {/* Logo */}
          <Link href={`/${locale}`} className="flex-shrink-0">
            <span className="text-xl font-light text-[#f7f3e9] tracking-widest uppercase">BOOK</span>
            <span className="text-xl font-black text-[#c8860a] tracking-widest uppercase">ZONE</span>
          </Link>

          {/* Right side */}
          <div className="flex items-center gap-1">

            {/* Language switcher */}
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="px-3 py-1.5 text-xs font-black text-[#f7f3e9] border-2 border-[#c8860a] uppercase tracking-widest hover:bg-[#c8860a] hover:text-[#1c1410] transition-colors"
              >
                {locale.toUpperCase()}
              </button>
              {langOpen && (
                <div className="absolute right-0 top-full mt-1 bg-[#1c1410] border-2 border-[#c8860a] z-10 min-w-[60px]">
                  {locales.filter(l => l.code !== locale).map(l => (
                    <button
                      key={l.code}
                      onClick={() => switchLocale(l.code)}
                      className="block w-full px-4 py-2 text-xs font-black text-[#f7f3e9] uppercase tracking-widest hover:bg-[#c8860a] hover:text-[#1c1410] transition-colors text-center border-b border-[#3a2a1a] last:border-0"
                    >
                      {l.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Favorites */}
            <Link
              href={`/${locale}/favorites`}
              className="p-2 text-[#f7f3e9] hover:text-[#c8860a] transition-colors"
              aria-label={t('favorites')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </Link>

            {/* Cart */}
            <Link
              href={`/${locale}/cart`}
              className="relative p-2 text-[#f7f3e9] hover:text-[#c8860a] transition-colors"
              aria-label={t('cart')}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] bg-[#c8860a] text-[#1c1410] text-[10px] font-black flex items-center justify-center px-1 leading-none">
                  {cartCount > 99 ? '99+' : cartCount}
                </span>
              )}
            </Link>

            {/* Auth */}
            {session ? (
              <div className="flex items-center gap-1 pl-2 border-l-2 border-[#c8860a]">
                <span className="hidden sm:block text-xs font-black text-[#c8860a] uppercase tracking-widest max-w-24 truncate">
                  {session.user?.name}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: `/${locale}` })}
                  className="p-2 text-[#f7f3e9] hover:text-red-400 transition-colors"
                  aria-label={t('logout')}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </button>
              </div>
            ) : (
              <Link
                href={`/${locale}/login`}
                className="ml-1 pl-2 border-l-2 border-[#c8860a] p-2 text-[#f7f3e9] hover:text-[#c8860a] transition-colors"
                aria-label={t('login')}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
