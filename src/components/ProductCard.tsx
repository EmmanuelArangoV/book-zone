'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import cartService from '@/services/cartService';
import favoritesService from '@/services/favoritesService';
import { useCart } from '@/context/CartContext';

interface ProductCardProps {
  _id: string;
  name: string;
  price: number;
  image: string;
  shortDescription: string;
  author?: string;
  initialFavorited?: boolean;
}

export default function ProductCard({ _id, name, price, image, author, initialFavorited = false }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(initialFavorited);
  const [cartAdded, setCartAdded] = useState(false);
  const t = useTranslations('product');
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) ?? 'es';
  const { refreshCart } = useCart();

  const handleCart = async () => {
    try {
      await cartService.addItem(_id);
      setCartAdded(true);
      setTimeout(() => setCartAdded(false), 1500);
      await refreshCart();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push(`/${locale}/login`);
      }
    }
  };

  const handleFavorite = async () => {
    try {
      if (isFavorited) {
        await favoritesService.removeFavorite(_id);
      } else {
        await favoritesService.addFavorite(_id);
      }
      setIsFavorited(!isFavorited);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push(`/${locale}/login`);
      }
    }
  };

  return (
    <div className="group bg-[#fefcf5] border-2 border-[#1c1410] flex flex-col">
      <div className="relative w-full h-52 overflow-hidden border-b-2 border-[#1c1410] bg-[#e8e0cc]">
        <Link href={`/${locale}/products/${_id}`}>
          <Image
            src={image}
            alt={name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="200px"
          />
        </Link>
        <button
          onClick={handleFavorite}
          className={`absolute top-2 right-2 p-1.5 border-2 border-[#1c1410] transition-colors ${
            isFavorited
              ? 'bg-[#c8860a] text-[#1c1410]'
              : 'bg-[#fefcf5] text-[#1c1410] hover:bg-[#c8860a]'
          }`}
          aria-label="Favorite"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill={isFavorited ? 'currentColor' : 'none'} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
        </button>
      </div>

      <div className="p-3 flex flex-col flex-1">
        <Link href={`/${locale}/products/${_id}`}>
          <h3 className="text-xs font-bold text-[#1c1410] leading-tight line-clamp-2 mb-1 hover:text-[#c8860a] transition-colors uppercase tracking-wide">
            {name}
          </h3>
        </Link>
        {author && (
          <p className="text-xs text-[#5c3d2e] mb-2 truncate italic">{author}</p>
        )}
        <p className="text-sm font-bold text-[#1c1410] mb-3">$ {price.toFixed(2)}</p>
        <button
          onClick={handleCart}
          className={`mt-auto w-full py-2 text-xs font-black uppercase tracking-widest border-2 transition-colors ${
            cartAdded
              ? 'bg-[#c8860a] text-[#1c1410] border-[#c8860a]'
              : 'bg-[#1c1410] text-[#f7f3e9] border-[#1c1410] hover:bg-[#c8860a] hover:text-[#1c1410] hover:border-[#c8860a]'
          }`}
        >
          {cartAdded ? '✓' : t('addToCart')}
        </button>
      </div>
    </div>
  );
}
