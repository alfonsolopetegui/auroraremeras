import { redirect } from 'next/navigation'
import { ProductForm } from '../../../components/ProductForm'
import { updateProductAction } from '../../../actions'

// Server component: provides server action to the client form
export function EditProductForm({ product }: { product: any }) {
  async function handleSave(data: any) {
    'use server'
    await updateProductAction(product.id, data)
    redirect('/admin/products')
  }

  return <ProductForm product={product} onSave={handleSave} />
}
