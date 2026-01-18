import Link from "next/link";
import { Suspense } from "react";
import PendingStatusContent from "../pending-status-content";

export const revalidate = 0;

export default function CheckoutPending() {
  const handleCartCleared = () => {
    console.log("Carrito limpiado tras confirmación de pago");
  };

  return (
    <main style={{ padding: "2rem" }}>
      <h1>Pago pendiente</h1>
      <p>
        Tu pago está siendo verificado por Mercado Pago. Esto puede tomar algunos minutos.
      </p>

      <Suspense fallback={<p>Verificando estado del pago...</p>}>
        <PendingStatusContent onCartCleared={handleCartCleared} />
      </Suspense>

      <p>Te enviaremos un email cuando se confirme el resultado.</p>

      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <Link href="/cart" className="continue-shopping-link">
          Volver al carrito
        </Link>
        <Link
          href="/"
          className="continue-shopping-link"
          style={{ backgroundColor: "#666" }}
        >
          Volver a la tienda
        </Link>
      </div>
    </main>
  );
}


