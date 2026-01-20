'use client'

import { useRouter } from 'next/navigation'
import { ProductForm } from '../../../components/ProductForm'
import { updateProductAction } from '../../../actions'

export function EditProductForm({ product }: { product: any }) {
  const router = useRouter()

  async function handleSave(data: any) {
    await updateProductAction(product.id, data)
    router.push('/admin/products')
  }

  return <ProductForm product={product} onSave={handleSave} />
}
