'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import ProductCard from './ProductCard';
import { Product } from '@/types';

interface ProductCatalogProps {
  products: Product[];
  authors: string[];
}

export default function ProductCatalog({ products, authors }: ProductCatalogProps) {
  const [selectedAuthor, setSelectedAuthor] = useState<string | null>(null);
  const t = useTranslations('home');

  const filtered = selectedAuthor
    ? products.filter(p => p.author === selectedAuthor)
    : products;

  return (
    <div className="flex flex-col md:flex-row gap-8">
      {/* Sidebar — author filter */}
      <aside className="md:w-48 flex-shrink-0">
        <h2 className="text-xs font-black uppercase tracking-widest text-[#1c1410] mb-3 border-b-2 border-[#1c1410] pb-2">
          {t('filterByAuthor')}
        </h2>
        <div className="flex flex-wrap md:flex-col gap-1">
          <button
            onClick={() => setSelectedAuthor(null)}
            className={`text-left px-3 py-2 text-xs font-bold uppercase tracking-wide border-l-4 w-full transition-colors ${
              selectedAuthor === null
                ? 'border-[#c8860a] text-[#c8860a] bg-[#e8e0cc]'
                : 'border-transparent text-[#5c3d2e] hover:border-[#1c1410] hover:text-[#1c1410] hover:bg-[#e8e0cc]'
            }`}
          >
            {t('allAuthors')}
          </button>
          {authors.map(author => (
            <button
              key={author}
              onClick={() => setSelectedAuthor(author)}
              className={`text-left px-3 py-2 text-xs font-bold uppercase tracking-wide border-l-4 w-full transition-colors ${
                selectedAuthor === author
                  ? 'border-[#c8860a] text-[#c8860a] bg-[#e8e0cc]'
                  : 'border-transparent text-[#5c3d2e] hover:border-[#1c1410] hover:text-[#1c1410] hover:bg-[#e8e0cc]'
              }`}
            >
              {author}
            </button>
          ))}
        </div>
      </aside>

      {/* Products grid */}
      <div className="flex-1">
        <p className="text-xs text-[#5c3d2e] uppercase tracking-widest font-bold mb-4">
          {filtered.length} {t('books')}
          {selectedAuthor && ` — ${selectedAuthor}`}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map(product => (
            <ProductCard key={product._id} {...product} />
          ))}
        </div>
        {filtered.length === 0 && (
          <div className="py-20 text-center border-2 border-dashed border-[#5c3d2e]">
            <p className="text-[#5c3d2e] uppercase tracking-widest text-sm font-bold">No books found</p>
          </div>
        )}
      </div>
    </div>
  );
}
