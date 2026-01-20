'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toggleProductActiveAction } from '../actions'

interface ProductListProps {
  products: any[]
}

export function ProductList({ products }: ProductListProps) {
  const router = useRouter()

  async function handleToggleActive(id: string) {
    await toggleProductActiveAction(id)
    router.refresh()
  }

  return (
    <div>
      <div className="products-header">
        <h1>Productos</h1>
        <Link href="/admin/products/new">Nuevo producto</Link>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Precio</th>
            <th>Stock total</th>
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const totalStock = product.variants.reduce((sum: number, v: any) => sum + v.stock, 0)
            return (
              <tr key={product.id}>
                <td>{product.name}</td>
                <td>${product.price}</td>
                <td>{totalStock}</td>
                <td>
                  <button onClick={() => handleToggleActive(product.id)}>
                    {product.active ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td>
                  <Link href={`/admin/products/${product.id}/edit`}>Editar</Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
