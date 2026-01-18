"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

type PendingStatusContentProps = {
  onCartCleared?: () => void;
};

export default function PendingStatusContent({
  onCartCleared,
}: PendingStatusContentProps) {
  const searchParams = useSearchParams();
  const [orderStatus, setOrderStatus] = useState<string>("pending");
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
    }, 3000);

    return () => clearInterval(interval);
  }, [searchParams, cartCleared, onCartCleared]);

  return (
    <>
      {orderStatus === "paid" && (
        <p style={{ color: "green", fontWeight: "bold" }}>✅ Pago confirmado</p>
      )}
      {orderStatus === "rejected" && (
        <p style={{ color: "red", fontWeight: "bold" }}>❌ Pago rechazado</p>
      )}
    </>
  );
}
