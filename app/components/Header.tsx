"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
};

const CART_STORAGE_KEY = "remeras_cart";

const updateCartCount = () => {
  const stored = localStorage.getItem(CART_STORAGE_KEY);
  if (stored) {
    try {
      const cart: CartItem[] = JSON.parse(stored);
      const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
      return totalItems;
    } catch (error) {
      return 0;
    }
  }
  return 0;
};

export default function Header() {
  const [cartCount, setCartCount] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Cargar cantidad de items desde localStorage
    setCartCount(updateCartCount());
    setIsLoaded(true);

    // Escuchar evento personalizado de actualización del carrito
    const handleCartUpdate = () => {
      setCartCount(updateCartCount());
    };

    window.addEventListener("cartUpdated", handleCartUpdate);
    window.addEventListener("storage", handleCartUpdate);
    
    return () => {
      window.removeEventListener("cartUpdated", handleCartUpdate);
      window.removeEventListener("storage", handleCartUpdate);
    };
  }, []);

  return (
    <header className="header">
      <div className="header-content">
        <Link href="/" className="header-logo">
          Remeras
        </Link>

        <Link href="/cart" className="header-cart">
          🛒
          {isLoaded && (
            <span className="cart-badge">{cartCount}</span>
          )}
        </Link>
      </div>
    </header>
  );
}
