import Link from "next/link"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export default async function Home() {
  const products = await prisma.product.findMany({
    where: { active: true },
    include: { variants: true },
    orderBy: { createdAt: "desc" },
  })

  return (
    <main className="home-container">
      <h1>Remeras</h1>
      <p className="subtitle">Descubre nuestras remeras impresas</p>
      
      <div className="products-grid">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="product-card"
          >
            {product.imageUrl && (
              <img
                src={product.imageUrl}
                alt={product.name}
                className="product-image"
              />
            )}
            <h2 className="product-name">{product.name}</h2>
            <p className="product-price">${product.price.toFixed(2)}</p>
          </Link>
        ))}
      </div>

      {products.length === 0 && (
        <p className="no-products">No hay productos disponibles.</p>
      )}
    </main>
  )
}
