import { getAllProducts } from '../actions'
import { ProductList } from '../components/ProductList'
import { toggleProductActiveAction } from '../actions'

// No cache so the admin list always shows fresh data
export const revalidate = 0

export default async function ProductsPage() {
  const products = await getAllProducts()
  async function handleToggle(id: string) {
    'use server'
    await toggleProductActiveAction(id)
  }

  return <ProductList products={products} onToggle={handleToggle} />
}
