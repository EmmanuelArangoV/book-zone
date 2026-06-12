import { getTranslations } from 'next-intl/server';

const stats = [
  { value: '17,237', labelKey: 'happyCustomers' },
  { value: '16,728', labelKey: 'totalBooks' },
  { value: '1,287', labelKey: 'authors' },
  { value: '1,287', labelKey: 'booksSold' },
] as const;

export default async function StatsSection() {
  const t = await getTranslations('stats');

  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(({ value, labelKey }) => (
          <div
            key={labelKey}
            className="border border-gray-200 rounded-xl p-6 text-center hover:border-indigo-300 transition-colors"
          >
            <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
            <p className="text-sm text-gray-500">{t(labelKey)}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
