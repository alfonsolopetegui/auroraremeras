'use client'

import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface ProductListProps {
  products: any[]
  onToggle: (id: string) => Promise<void>
}

export function ProductList({ products, onToggle }: ProductListProps) {
  const router = useRouter()

  async function handleToggleActive(id: string) {
    await onToggle(id)
    router.refresh()
  }

  return (
    <div className="products-wrapper">
      <div className="products-header">
        <div>
          <h1>Productos</h1>
          <p className="products-subtitle">Gestiona productos y variantes</p>
        </div>
        <Link className="btn-primary" href="/admin/products/new">
          + Nuevo producto
        </Link>
      </div>

      <table className="products-table">
        <thead>
          <tr>
            <th>Producto</th>
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
                <td>
                  <div className="product-cell">
                    <div className="product-thumb">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} />
                      ) : (
                        <div className="product-thumb-placeholder">No img</div>
                      )}
                    </div>
                    <div>
                      <div className="product-name">{product.name}</div>
                      <div className="product-meta">{product.description || 'Sin descripción'}</div>
                    </div>
                  </div>
                </td>
                <td>${product.price}</td>
                <td>{totalStock}</td>
                <td>
                  <button
                    className={product.active ? 'badge badge-success' : 'badge badge-muted'}
                    onClick={() => handleToggleActive(product.id)}
                  >
                    {product.active ? 'Activo' : 'Inactivo'}
                  </button>
                </td>
                <td>
                  <Link className="btn-ghost" href={`/admin/products/${product.id}/edit`}>
                    Editar
                  </Link>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
