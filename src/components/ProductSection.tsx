import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { Product } from '@/types';
import ProductCard from './ProductCard';

interface ProductSectionProps {
  title: string;
  products: Product[];
  seeAllHref?: string;
}

export default async function ProductSection({ title, products, seeAllHref = '#' }: ProductSectionProps) {
  const t = await getTranslations('home');

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
        <Link href={seeAllHref} className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
          {t('seeAll')}
        </Link>
      </div>

      {/* Horizontal scrollable row */}
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
        {products.map((product) => (
          <ProductCard
            key={product._id}
            _id={product._id}
            name={product.name}
            price={product.price}
            image={product.image}
            shortDescription={product.shortDescription}
            author={product.author}
          />
        ))}
      </div>
    </section>
  );
}
