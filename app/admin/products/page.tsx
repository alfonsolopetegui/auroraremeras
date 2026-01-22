import { getAllProducts } from '../actions'
import { ProductList } from '../components/ProductList'

// No cache so the admin list always shows fresh data
export const revalidate = 0

export default async function ProductsPage() {
  const products = await getAllProducts()
  return <ProductList products={products} />
}
