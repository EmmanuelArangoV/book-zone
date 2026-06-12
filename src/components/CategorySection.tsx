import { getTranslations } from 'next-intl/server';
import Image from 'next/image';
import Link from 'next/link';
import { Category } from '@/types';

interface CategorySectionProps {
  categories: Category[];
}

export default async function CategorySection({ categories }: CategorySectionProps) {
  const t = await getTranslations('home');

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">{t('categoriesTitle')}</h2>
        <Link href="#" className="text-sm text-gray-500 hover:text-indigo-600 transition-colors">
          {t('seeAll')}
        </Link>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {categories.map((category) => (
          <Link key={category._id} href={`#${category.slug}`} className="group">
            <div className={`relative rounded-xl overflow-hidden h-48 ${category.bgColor}`}>
              <Image
                src={category.image}
                alt={category.name}
                fill
                className="object-cover mix-blend-multiply opacity-80 transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 33vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
              <div className="absolute bottom-3 left-4">
                <span className="text-white font-semibold text-sm drop-shadow">
                  {category.name}
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
