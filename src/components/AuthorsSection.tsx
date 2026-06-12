'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Product, Author } from '@/types';

interface AuthorsSectionProps {
  authors: Author[];
  productsByAuthor: Record<string, Product[]>;
}

export default function AuthorsSection({ authors, productsByAuthor }: AuthorsSectionProps) {
  const [selectedAuthorId, setSelectedAuthorId] = useState(authors[0]?._id ?? '');
  const t = useTranslations('home');
  const tProduct = useTranslations('product');
  const params = useParams();
  const locale = (params?.locale as string) ?? 'es';

  const selectedAuthor = authors.find((a) => a._id === selectedAuthorId);
  const currentProducts = selectedAuthor ? (productsByAuthor[selectedAuthor.name] ?? []) : [];

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex border border-gray-200 rounded-lg overflow-hidden">

        {/* ── Author sidebar ─────────────────────────────────────────────── */}
        <div className="w-52 flex-shrink-0 bg-gray-50 border-r border-gray-200 py-3 overflow-y-auto max-h-[480px]">
          {authors.map((author) => (
            <button
              key={author._id}
              onClick={() => setSelectedAuthorId(author._id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors ${
                selectedAuthorId === author._id
                  ? 'bg-white font-semibold text-gray-900 border-r-2 border-indigo-600'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-white/60'
              }`}
            >
              {/* Avatar — plain img to avoid next/image domain config */}
              <img
                src={`https://ui-avatars.com/api/?name=${encodeURIComponent(author.name)}&size=56&background=4f46e5&color=fff&bold=true`}
                alt={author.name}
                className="w-7 h-7 rounded-full flex-shrink-0 object-cover"
              />
              <span className="truncate leading-tight">{author.name}</span>
            </button>
          ))}
        </div>

        {/* ── Books panel ────────────────────────────────────────────────── */}
        <div className="flex-1 p-6 min-w-0">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-xl font-bold text-gray-900">{t('authorsBookTitle')}</h2>
            <span className="text-sm text-gray-400">{t('seeAll')}</span>
          </div>

          {currentProducts.length === 0 ? (
            <div className="flex items-center justify-center h-40 text-gray-400 text-sm">
              No hay libros disponibles para este autor.
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {currentProducts.map((product) => (
                <div
                  key={product._id}
                  className="flex gap-4 border border-gray-100 rounded-lg p-4 hover:border-indigo-200 hover:shadow-sm transition-all"
                >
                  {/* Cover */}
                  <div className="relative w-24 h-32 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                    <Image
                      src={product.image}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="96px"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-400 mb-2">{product.author}</p>
                    {product.shortDescription && (
                      <p className="text-xs text-gray-500 line-clamp-3 mb-3">
                        {product.shortDescription}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-gray-900 text-sm">
                        $ {product.price.toFixed(2)}
                      </span>
                      <Link
                        href={`/${locale}/products/${product._id}`}
                        className="inline-flex items-center gap-1.5 bg-indigo-600 text-white text-xs font-semibold px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        {tProduct('addToCart')}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
