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
  imageUrl: string;
};

const CART_STORAGE_KEY = "remeras_cart";

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Cargar carrito desde localStorage
  useEffect(() => {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      try {
        setCart(JSON.parse(stored));
      } catch (error) {
        console.error("Error loading cart:", error);
        setCart([]);
      }
    }
    setIsLoaded(true);
  }, []);

  // Guardar carrito en localStorage cuando cambia
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      // Disparar evento personalizado para actualizar el header
      window.dispatchEvent(new Event("cartUpdated"));
    }
  }, [cart, isLoaded]);

  const handleIncreaseQuantity = (productId: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const handleDecreaseQuantity = (productId: string) => {
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const handleRemoveItem = (productId: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => item.productId !== productId)
    );
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  if (!isLoaded) {
    return <main className="cart-container">Cargando carrito...</main>;
  }

  return (
    <main className="cart-container">
      <Link href="/" className="back-link">
        ← Volver a la tienda
      </Link>

      <h1>Carrito de compras</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Tu carrito está vacío.</p>
          <Link href="/" className="continue-shopping-link">
            Continuar comprando
          </Link>
        </div>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.productId} className="cart-item">
                <div className="cart-item-image">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="cart-item-thumbnail"
                  />
                </div>

                <div className="cart-item-info">
                  <h3 className="cart-item-name">{item.name}</h3>
                  <p className="cart-item-variant">
                    Talle: {item.size} | Color: {item.color}
                  </p>
                  <p className="cart-item-price">
                    ${item.price.toFixed(2)} por unidad
                  </p>
                </div>

                <div className="cart-item-quantity">
                  <button
                    onClick={() => handleDecreaseQuantity(item.productId)}
                    className="qty-button"
                    aria-label="Disminuir cantidad"
                  >
                    −
                  </button>
                  <span className="qty-value">{item.quantity}</span>
                  <button
                    onClick={() => handleIncreaseQuantity(item.productId)}
                    className="qty-button"
                    aria-label="Aumentar cantidad"
                  >
                    +
                  </button>
                </div>

                <div className="cart-item-total">
                  <p className="subtotal">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <button
                  onClick={() => handleRemoveItem(item.productId)}
                  className="remove-button"
                  aria-label="Eliminar del carrito"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Envío:</span>
              <span>Se coordinará después de la compra</span>
            </div>
            <div className="summary-total">
              <span>Total:</span>
              <span>${totalAmount.toFixed(2)}</span>
            </div>

            <Link href="/checkout" className="checkout-button">
              Ir a checkout
            </Link>
          </div>
        </>
      )}
    </main>
  );
}
