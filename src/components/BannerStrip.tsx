import { getTranslations } from 'next-intl/server';

export default async function BannerStrip() {
  const t = await getTranslations('home');
  const label = t('newBooks');

  const items = Array(12).fill(label);

  return (
    <div className="relative overflow-hidden bg-indigo-600 py-4 -skew-y-1 my-6">
      <div className="skew-y-1">
        <div className="flex animate-marquee whitespace-nowrap">
          {items.concat(items).map((text, i) => (
            <span key={i} className="inline-flex items-center gap-3 mx-6 text-white font-semibold text-sm uppercase tracking-widest">
              <svg className="h-4 w-4 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2a10 10 0 100 20A10 10 0 0012 2zm0 3a7 7 0 110 14A7 7 0 0112 5z" opacity="0.3" />
                <path d="M12 7a5 5 0 100 10A5 5 0 0012 7z" />
              </svg>
              {text}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
