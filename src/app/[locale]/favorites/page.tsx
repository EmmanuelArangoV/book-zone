'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import favoritesService from '@/services/favoritesService';
import cartService from '@/services/cartService';
import { useCart } from '@/context/CartContext';

interface FavoriteProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  shortDescription: string;
}

interface FavoriteItem {
  _id: string;
  productId: FavoriteProduct;
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState<FavoriteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const t = useTranslations('favorites');
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) ?? 'es';
  const { refreshCart } = useCart();

  useEffect(() => {
    favoritesService.getFavorites()
      .then(({ data }) => {
        if (Array.isArray(data)) setFavorites(data);
        setLoading(false);
      })
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.push(`/${locale}/login`);
        }
        setLoading(false);
      });
  }, [locale, router]);

  const removeFavorite = async (productId: string) => {
    try {
      await favoritesService.removeFavorite(productId);
      setFavorites(prev => prev.filter(f => f.productId._id !== productId));
    } catch { /* silent */ }
  };

  const addToCart = async (productId: string) => {
    try {
      await cartService.addItem(productId);
      await refreshCart();
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 401) {
        router.push(`/${locale}/login`);
      }
    }
  };

  return (
    <>
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 min-h-[60vh]">
        <h1 className="text-3xl font-black uppercase tracking-widest text-[#1c1410] mb-8 border-b-4 border-[#1c1410] pb-4">
          {t('title')}
        </h1>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="w-8 h-8 border-4 border-[#1c1410] border-t-[#c8860a] animate-spin" />
          </div>
        ) : favorites.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <div className="w-20 h-20 border-2 border-[#1c1410] flex items-center justify-center bg-[#e8e0cc]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#5c3d2e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </div>
            <p className="text-[#5c3d2e] text-lg font-bold uppercase tracking-widest">{t('empty')}</p>
            <Link
              href={`/${locale}`}
              className="bg-[#1c1410] text-[#f7f3e9] font-black px-8 py-3 uppercase tracking-widest text-xs border-2 border-[#1c1410] hover:bg-[#c8860a] hover:text-[#1c1410] hover:border-[#c8860a] transition-colors"
            >
              Explorar libros
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {favorites.map(fav => (
              <div key={fav._id} className="bg-[#fefcf5] border-2 border-[#1c1410] flex flex-col">
                <div className="relative w-full h-52 overflow-hidden border-b-2 border-[#1c1410] bg-[#e8e0cc]">
                  <Link href={`/${locale}/products/${fav.productId._id}`}>
                    <Image
                      src={fav.productId.image}
                      alt={fav.productId.name}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </Link>
                  <button
                    onClick={() => removeFavorite(fav.productId._id)}
                    className="absolute top-2 right-2 p-1.5 border-2 border-[#1c1410] bg-[#c8860a] text-[#1c1410] hover:bg-[#fefcf5] transition-colors"
                    aria-label="Remove from favorites"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>
                </div>
                <div className="p-3 flex flex-col flex-1">
                  <Link href={`/${locale}/products/${fav.productId._id}`}>
                    <h3 className="text-xs font-bold text-[#1c1410] leading-tight line-clamp-2 mb-1 hover:text-[#c8860a] uppercase tracking-wide">
                      {fav.productId.name}
                    </h3>
                  </Link>
                  <p className="text-sm font-bold text-[#1c1410] mb-3">
                    $ {fav.productId.price.toFixed(2)}
                  </p>
                  <button
                    onClick={() => addToCart(fav.productId._id)}
                    className="mt-auto w-full py-2 text-xs font-black uppercase tracking-widest border-2 bg-[#1c1410] text-[#f7f3e9] border-[#1c1410] hover:bg-[#c8860a] hover:text-[#1c1410] hover:border-[#c8860a] transition-colors"
                  >
                    + Cart
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
