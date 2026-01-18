"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function CheckoutPending() {
  const searchParams = useSearchParams();
  const [orderStatus, setOrderStatus] = useState<string>("pending");
  const [cartCleared, setCartCleared] = useState(false);

  useEffect(() => {
    const orderId = searchParams.get("external_reference") || 
                    sessionStorage.getItem("lastOrderId");

    if (!orderId) {
      console.warn("No order ID found, cannot verify status");
      return;
    }

    // Verificar el estado cada 3 segundos
    let attempts = 0;
    const maxAttempts = 20;

    const checkOrderStatus = async () => {
      try {
        const response = await fetch(`/api/order/status?orderId=${orderId}`);
        if (!response.ok) return;

        const data = await response.json();
        console.log("Order status check:", data);
        setOrderStatus(data.status);

        if (data.shouldClearCart && !cartCleared) {
          localStorage.removeItem("remeras_cart");
          window.dispatchEvent(new Event("cartUpdated"));
          setCartCleared(true);
          sessionStorage.removeItem("lastOrderId");
          console.log("✅ Cart cleared - payment approved");
        }

        attempts++;
      } catch (err) {
        console.error("Error checking order status:", err);
      }
    };

    checkOrderStatus();

    const interval = setInterval(() => {
      if (cartCleared || attempts >= maxAttempts) {
        clearInterval(interval);
        return;
      }
      checkOrderStatus();
    }, 3000);

    return () => clearInterval(interval);
  }, [searchParams, cartCleared]);

  return (
    <main>
      <h1>Pago pendiente</h1>
      <p>Tu pago está siendo verificado por Mercado Pago. Esto puede tomar algunos minutos.</p>
      {orderStatus === "paid" && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          ✅ Pago confirmado
        </p>
      )}
      {orderStatus === "rejected" && (
        <p style={{ color: "red", fontWeight: "bold" }}>
          ❌ Pago rechazado
        </p>
      )}
      <p>Te enviaremos un email cuando se confirme el resultado.</p>
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <Link href="/cart" className="continue-shopping-link">
          Volver al carrito
        </Link>
        <Link href="/" className="continue-shopping-link" style={{ backgroundColor: "#666" }}>
          Volver a la tienda
        </Link>
      </div>
    </main>
  );
}

