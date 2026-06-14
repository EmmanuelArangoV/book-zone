'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import cartService from '@/services/cartService';

interface CartContextType {
  cartCount: number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType>({
  cartCount: 0,
  refreshCart: async () => {},
});

export function CartProvider({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession();
  const [cartCount, setCartCount] = useState(0);

  const refreshCart = useCallback(async () => {
    if (!session) {
      setCartCount(0);
      return;
    }
    try {
      const { data } = await cartService.getCart();
      const count = (data.items ?? []).reduce(
        (acc: number, item: { quantity: number }) => acc + item.quantity,
        0
      );
      setCartCount(count);
    } catch {
      setCartCount(0);
    }
  }, [session]);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  return (
    <CartContext.Provider value={{ cartCount, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
