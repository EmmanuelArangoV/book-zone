'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import cartService from '@/services/cartService';
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
    try {
      await cartService.addItem(productId);
      setCartAdded(true);
      setTimeout(() => setCartAdded(false), 2000);
      await refreshCart();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push(`/${locale}/login`);
      }
    }
  };

  const handleBuy = async () => {
    setBuying(true);
    try {
      await cartService.addItem(productId);
      await refreshCart();
      router.push(`/${locale}/cart`);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push(`/${locale}/login`);
      }
    } finally {
      setBuying(false);
    }
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
