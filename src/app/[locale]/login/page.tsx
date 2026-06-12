'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';

export default function LoginPage() {
  const t = useTranslations('auth');
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) ?? 'es';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError(t('loginError'));
    } else {
      router.push(`/${locale}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f7f3e9] px-4">
      <div className="w-full max-w-md bg-[#fefcf5] border-2 border-[#1c1410] p-8">
        {/* Logo */}
        <Link href={`/${locale}`} className="flex justify-center mb-8">
          <span className="text-2xl font-light text-[#1c1410] uppercase tracking-widest">BOOK</span>
          <span className="text-2xl font-black text-[#c8860a] uppercase tracking-widest">ZONE</span>
        </Link>

        <h1 className="text-xl font-black text-[#1c1410] mb-6 uppercase tracking-widest border-b-2 border-[#1c1410] pb-3">
          {t('loginTitle')}
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-xs font-black uppercase tracking-widest text-[#1c1410] mb-1">
              {t('email')}
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border-2 border-[#1c1410] bg-[#f7f3e9] px-4 py-3 text-sm text-[#1c1410] outline-none focus:border-[#c8860a] transition-colors"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-black uppercase tracking-widest text-[#1c1410] mb-1">
              {t('password')}
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full border-2 border-[#1c1410] bg-[#f7f3e9] px-4 py-3 text-sm text-[#1c1410] outline-none focus:border-[#c8860a] transition-colors"
            />
          </div>

          {error && (
            <p className="text-xs font-bold text-red-700 bg-red-50 border-2 border-red-700 px-4 py-2 uppercase tracking-wide">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#1c1410] hover:bg-[#c8860a] hover:text-[#1c1410] disabled:opacity-60 text-[#f7f3e9] font-black py-3 uppercase tracking-widest text-xs border-2 border-[#1c1410] transition-colors mt-2"
          >
            {loading ? '...' : t('submit')}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-[#5c3d2e] uppercase tracking-wide">
          {t('noAccount')}{' '}
          <Link href={`/${locale}/register`} className="text-[#c8860a] hover:underline font-black">
            {t('signUp')}
          </Link>
        </p>
      </div>
    </div>
  );
}
