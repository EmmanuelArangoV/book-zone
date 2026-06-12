'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';

interface ProductActionsProps {
  productId: string;
}

export default function ProductActions({ productId }: ProductActionsProps) {
  const t = useTranslations('product');
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) ?? 'es';
  const [cartAdded, setCartAdded] = useState(false);
  const [buying, setBuying] = useState(false);
  const { refreshCart } = useCart();

  const addToCart = async () => {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    if (res.status === 401) {
      router.push(`/${locale}/login`);
      return;
    }
    if (res.ok) {
      setCartAdded(true);
      setTimeout(() => setCartAdded(false), 2000);
      await refreshCart();
    }
  };

  const handleBuy = async () => {
    setBuying(true);
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, quantity: 1 }),
    });
    if (res.status === 401) {
      router.push(`/${locale}/login`);
      setBuying(false);
      return;
    }
    if (res.ok) {
      await refreshCart();
      router.push(`/${locale}/cart`);
    }
    setBuying(false);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3 mt-6">
      <button
        onClick={addToCart}
        className={`flex-1 font-black py-3 px-6 uppercase tracking-widest text-xs border-2 transition-colors ${
          cartAdded
            ? 'bg-[#c8860a] text-[#1c1410] border-[#c8860a]'
            : 'bg-[#1c1410] text-[#f7f3e9] border-[#1c1410] hover:bg-[#c8860a] hover:text-[#1c1410] hover:border-[#c8860a]'
        }`}
      >
        {cartAdded ? `✓ ${t('addToCart')}` : t('addToCart')}
      </button>
      <button
        onClick={handleBuy}
        disabled={buying}
        className="flex-1 border-2 border-[#1c1410] text-[#1c1410] bg-transparent hover:bg-[#1c1410] hover:text-[#f7f3e9] font-black py-3 px-6 uppercase tracking-widest text-xs transition-colors disabled:opacity-60"
      >
        {t('buy')}
      </button>
    </div>
  );
}
