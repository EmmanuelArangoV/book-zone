'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useRouter, useParams } from 'next/navigation';

export default function HeroSection() {
  const t = useTranslations('home');
  const [query, setQuery] = useState('');
  const router = useRouter();
  const params = useParams();
  const locale = (params?.locale as string) ?? 'es';

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/${locale}?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <section className="bg-white py-20 px-4">
      <div className="max-w-3xl mx-auto text-center">
        <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 leading-tight mb-10 tracking-tight">
          {t('heroTitle')}
        </h1>

        <form onSubmit={handleSearch} className="flex items-center max-w-xl mx-auto border border-gray-300 rounded-full overflow-hidden shadow-sm">
          <div className="flex items-center flex-1 px-5 gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t('searchPlaceholder')}
              className="flex-1 py-3 text-sm text-gray-700 outline-none bg-transparent"
            />
          </div>
          <button
            type="submit"
            className="bg-indigo-600 hover:bg-indigo-700 transition-colors px-6 py-3 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </button>
        </form>
      </div>
    </section>
  );
}
