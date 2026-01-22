import { redirect } from 'next/navigation'
import { ProductForm } from '../../components/ProductForm'
import { createProductAction } from '../../actions'

// Server component: passes server action to client form
export default function NewProductPage() {
  async function handleSave(data: any) {
    'use server'
    await createProductAction(data)
    redirect('/admin/products')
  }

  return <ProductForm onSave={handleSave} />
}
