'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import cartService from '@/services/cartService';
import salesService, { SaleItem } from '@/services/salesService';
import { useCart } from '@/context/CartContext';

interface CartProduct {
  _id: string;
  name: string;
  price: number;
  image: string;
  stock: number;
}

interface CartItem {
  productId: CartProduct;
  quantity: number;
}

interface CartData {
  items: CartItem[];
}

export default function CartPage() {
  const [cart, setCart] = useState<CartData | null>(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState('');
  const t = useTranslations('cart');
  const params = useParams();
  const router = useRouter();
  const locale = (params?.locale as string) ?? 'es';
  const { refreshCart } = useCart();

  useEffect(() => {
    cartService.getCart()
      .then(({ data }) => { setCart(data); setLoading(false); })
      .catch((err) => {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          router.push(`/${locale}/login`);
        }
        setLoading(false);
      });
  }, [locale, router]);

  const removeItem = async (productId: string) => {
    try {
      const { data } = await cartService.removeItem(productId);
      setCart(data);
      await refreshCart();
    } catch { /* silent */ }
  };

  const checkout = async () => {
    if (!cart || cart.items.length === 0) return;
    setCheckoutError('');
    setCheckingOut(true);

    const items: SaleItem[] = cart.items.map(item => ({
      productId: item.productId._id,
      quantity: item.quantity,
      price: item.productId.price,
    }));
    const total = cart.items.reduce(
      (acc, item) => acc + item.productId.price * item.quantity, 0
    );

    try {
      await salesService.createSale(items, total);
      await Promise.all(cart.items.map(item => cartService.removeItem(item.productId._id)));
      await refreshCart();
      setCart({ items: [] });
      router.push(`/${locale}`);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setCheckoutError(err.response?.data?.error ?? 'Error al procesar la compra');
      }
    } finally {
      setCheckingOut(false);
    }
  };

  const cartItems = cart?.items ?? [];
  const total = cartItems.reduce(
    (acc, item) => acc + item.productId.price * item.quantity, 0
  );
  const hasOutOfStock = cartItems.some(item => item.productId.stock < item.quantity);

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
        ) : cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-6">
            <div className="w-20 h-20 border-2 border-[#1c1410] flex items-center justify-center bg-[#e8e0cc]">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-[#5c3d2e]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <p className="text-[#5c3d2e] text-lg font-bold uppercase tracking-widest">{t('empty')}</p>
            <Link href={`/${locale}`} className="bg-[#1c1410] text-[#f7f3e9] font-black px-8 py-3 uppercase tracking-widest text-xs border-2 border-[#1c1410] hover:bg-[#c8860a] hover:text-[#1c1410] hover:border-[#c8860a] transition-colors">
              Explorar libros
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-3">
              {cartItems.map((item, idx) => {
                const outOfStock = item.productId.stock < item.quantity;
                return (
                  <div key={idx} className={`flex gap-4 bg-[#fefcf5] border-2 p-4 ${outOfStock ? 'border-red-600' : 'border-[#1c1410]'}`}>
                    <div className="relative w-16 h-20 flex-shrink-0 border border-[#1c1410]">
                      <Image src={item.productId.image} alt={item.productId.name} fill className="object-cover" sizes="64px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-black text-[#1c1410] uppercase text-xs tracking-wide line-clamp-2">{item.productId.name}</h3>
                      <p className="text-[#5c3d2e] text-xs mt-1 uppercase tracking-wide">{t('quantity')}: {item.quantity}</p>
                      <p className="font-bold text-[#1c1410] mt-1 text-sm">$ {(item.productId.price * item.quantity).toFixed(2)}</p>
                      {outOfStock && (
                        <p className="text-xs font-black text-red-600 uppercase tracking-wide mt-1">
                          ⚠ Stock insuficiente ({item.productId.stock} disponible{item.productId.stock !== 1 ? 's' : ''})
                        </p>
                      )}
                    </div>
                    <button onClick={() => removeItem(item.productId._id)} className="text-xs font-bold uppercase tracking-wide text-[#5c3d2e] hover:text-red-700 transition-colors self-start flex-shrink-0">
                      {t('remove')}
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="bg-[#fefcf5] border-2 border-[#1c1410] p-6 h-fit">
              <h2 className="text-xs font-black uppercase tracking-widest text-[#1c1410] mb-4 border-b-2 border-[#1c1410] pb-2">Resumen</h2>
              <div className="space-y-2 mb-4">
                {cartItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs text-[#5c3d2e]">
                    <span className="truncate max-w-[140px]">{item.productId.name}</span>
                    <span className="font-bold text-[#1c1410] ml-2">$ {(item.productId.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="flex items-center justify-between border-t-2 border-[#1c1410] pt-4 mb-6">
                <span className="text-xs uppercase tracking-widest font-black text-[#1c1410]">{t('total')}</span>
                <span className="text-2xl font-black text-[#1c1410]">$ {total.toFixed(2)}</span>
              </div>
              {checkoutError && (
                <p className="text-xs font-bold text-red-700 bg-red-50 border-2 border-red-600 px-3 py-2 uppercase tracking-wide mb-4">{checkoutError}</p>
              )}
              {hasOutOfStock && (
                <p className="text-xs font-bold text-red-600 border-2 border-red-600 px-3 py-2 uppercase tracking-wide mb-4">⚠ Retira los artículos sin stock para continuar</p>
              )}
              <button
                onClick={checkout}
                disabled={checkingOut || hasOutOfStock}
                className={`w-full py-4 font-black uppercase tracking-widest text-sm border-2 transition-colors ${
                  hasOutOfStock
                    ? 'bg-[#e8e0cc] text-[#5c3d2e] border-[#5c3d2e] cursor-not-allowed'
                    : 'bg-[#1c1410] text-[#f7f3e9] border-[#1c1410] hover:bg-[#c8860a] hover:text-[#1c1410] hover:border-[#c8860a]'
                } disabled:opacity-60`}
              >
                {checkingOut ? 'Procesando...' : t('checkout')}
              </button>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
