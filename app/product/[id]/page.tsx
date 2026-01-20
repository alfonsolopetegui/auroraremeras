import Link from "next/link"
import { PrismaClient } from "@prisma/client"
import { ProductDetailClient } from "./product-detail-client"

const prisma = new PrismaClient()

interface ProductDetailProps {
  params: {
    id: string
  }
}

export default async function ProductDetail({ params }: ProductDetailProps) {
  const { id } = await params

  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true },
  })

  if (!product) {
    return (
      <main className="product-detail-container">
        <h1>Producto no encontrado</h1>
        <Link href="/">Volver a la tienda</Link>
      </main>
    )
  }

  return (
    <ProductDetailClient
      product={{
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        imageUrl: product.imageUrl,
        variants: product.variants.map((v) => ({
          id: v.id,
          size: v.size,
          color: v.color,
          stock: v.stock,
        })),
      }}
    />
  )
}
