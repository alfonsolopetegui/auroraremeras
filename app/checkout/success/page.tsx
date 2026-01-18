"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function CheckoutSuccess() {
  const searchParams = useSearchParams();
  const [cartCleared, setCartCleared] = useState(false);

  useEffect(() => {
    // Intentar obtener el order_id de la URL o de sessionStorage
    const orderId = searchParams.get("external_reference") || 
                    sessionStorage.getItem("lastOrderId");

    if (!orderId) {
      console.warn("No order ID found, cannot verify status");
      return;
    }

    // Verificar el estado de la orden cada 2 segundos
    let attempts = 0;
    const maxAttempts = 10;

    const checkOrderStatus = async () => {
      try {
        const response = await fetch(`/api/order/status?orderId=${orderId}`);
        if (!response.ok) {
          console.error("Failed to fetch order status");
          return;
        }

        const data = await response.json();
        console.log("Order status check:", data);

        if (data.shouldClearCart && !cartCleared) {
          // Vaciar el carrito
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

    // Primera verificación inmediata
    checkOrderStatus();

    // Continuar verificando si no se limpió el carrito
    const interval = setInterval(() => {
      if (cartCleared || attempts >= maxAttempts) {
        clearInterval(interval);
        return;
      }
      checkOrderStatus();
    }, 2000);

    return () => clearInterval(interval);
  }, [searchParams, cartCleared]);

  return (
    <main>
      <h1>Pago recibido</h1>
      <p>Estamos procesando la confirmación de tu pago.</p>
      {cartCleared && (
        <p style={{ color: "green", fontWeight: "bold" }}>
          ✅ Pago confirmado
        </p>
      )}
      <p>Te enviaremos un email cuando se confirme el resultado.</p>
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <Link href="/" className="continue-shopping-link">
          Volver a la tienda
        </Link>
      </div>
    </main>
  );
}

