"use client";

export const dynamic = "force-dynamic";

import Link from "next/link";
import { Suspense } from "react";
import SuccessStatusContent from "../success-status-content";

export default function CheckoutSuccess() {
  return (
    <main>
      <h1>Pago recibido</h1>
      <p>Estamos procesando la confirmación de tu pago.</p>
      <Suspense fallback={<p>Verificando estado del pago...</p>}>
        <SuccessStatusContent />
      </Suspense>
      <p>Te enviaremos un email cuando se confirme el resultado.</p>
      <div style={{ marginTop: "2rem", display: "flex", gap: "1rem" }}>
        <Link href="/" className="continue-shopping-link">
          Volver a la tienda
        </Link>
      </div>
    </main>
  );
}

