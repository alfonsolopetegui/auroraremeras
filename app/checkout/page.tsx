"use client";

import { useEffect, useState } from "react";

type CartItem = {
  productId: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  imageUrl?: string;
};

const CART_STORAGE_KEY = "remeras_cart";

export default function CheckoutPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      if (!raw) return;
      const parsed: CartItem[] = JSON.parse(raw);
      setCart(Array.isArray(parsed) ? parsed : []);
    } catch {
      setCart([]);
    }
  }, []);

  async function startCheckout() {
    try {
      setLoading(true);
      setError(null);

      // Map cart items to API format: id, title, price, quantity
      const items = cart.map((it) => ({
        id: it.productId,
        title: it.name,
        price: it.price,
        quantity: it.quantity,
      }));

      if (items.length === 0) {
        setError("El carrito está vacío.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "No se pudo iniciar el pago");
      }

      const data: { init_point?: string; order_id?: string } = await res.json();
      if (!data.init_point) {
        throw new Error("Respuesta inválida del servidor");
      }

      // Guardar order_id en sessionStorage para usarlo luego
      if (data.order_id) {
        sessionStorage.setItem("lastOrderId", data.order_id);
      }

      // Redirect to Mercado Pago checkout
      window.location.href = data.init_point;
    } catch (e: any) {
      setError(e?.message || "Error desconocido");
    } finally {
      setLoading(false);
    }
  }

  const total = cart.reduce((sum, it) => sum + it.price * it.quantity, 0);

  return (
    <main>
      <h1>Checkout</h1>

      {cart.length === 0 ? (
        <p>Tu carrito está vacío. Agrega productos para continuar.</p>
      ) : (
        <>
          <ul style={{ listStyle: "none", padding: 0, margin: "1rem 0" }}>
            {cart.map((item) => (
              <li key={`${item.productId}-${item.size}-${item.color}`} style={{ padding: "0.75rem 0", borderBottom: "1px solid #eee" }}>
                <strong>{item.name}</strong> — {item.quantity} x ${item.price.toFixed(2)}
                <div style={{ color: "#666", fontSize: "0.9rem" }}>Talle: {item.size} | Color: {item.color}</div>
              </li>
            ))}
          </ul>

          <div style={{ fontWeight: 700, marginBottom: "1rem" }}>Total: ${total.toFixed(2)}</div>

          <button
            onClick={startCheckout}
            disabled={loading || cart.length === 0}
            className="checkout-button"
          >
            {loading ? "Generando preferencia..." : "Ir a checkout"}
          </button>

          {error && (
            <p style={{ color: "#d32f2f", marginTop: "1rem" }}>{error}</p>
          )}
        </>
      )}
    </main>
  );
}
