'use client'

import { useRouter } from 'next/navigation'
import { ProductForm } from '../../components/ProductForm'
import { createProductAction } from '../../actions'

export default function NewProductPage() {
  const router = useRouter()

  async function handleSave(data: any) {
    await createProductAction(data)
    router.push('/admin/products')
  }

  return <ProductForm onSave={handleSave} />
}
