import Link from "next/link";

export default function CheckoutFailure() {
  return (
    <main>
      <h1>Pago rechazado</h1>
      <p>Tu pago fue rechazado. Podés intentar nuevamente con otro medio de pago.</p>
      <p>Tus productos siguen en el carrito.</p>
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

