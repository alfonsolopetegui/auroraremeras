"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type SuccessStatusContentProps = {
  onCartCleared?: () => void;
};

export default function SuccessStatusContent({
  onCartCleared,
}: SuccessStatusContentProps) {
  const searchParams = useSearchParams();
  const [cartCleared, setCartCleared] = useState(false);

  useEffect(() => {
    const orderId =
      searchParams.get("external_reference") ||
      sessionStorage.getItem("lastOrderId");

    if (!orderId) {
      console.warn("No order ID found, cannot verify status");
      return;
    }

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
          localStorage.removeItem("remeras_cart");
          window.dispatchEvent(new Event("cartUpdated"));
          setCartCleared(true);
          sessionStorage.removeItem("lastOrderId");
          console.log("✅ Cart cleared - payment approved");
          onCartCleared?.();
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
    }, 2000);

    return () => clearInterval(interval);
  }, [searchParams, cartCleared, onCartCleared]);

  return (
    <>
      {cartCleared && (
        <p style={{ color: "green", fontWeight: "bold" }}>✅ Pago confirmado</p>
      )}
    </>
  );
}
