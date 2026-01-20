import { getAllProducts } from '../actions'
import { ProductList } from '../components/ProductList'

export default async function ProductsPage() {
  const products = await getAllProducts()
  return <ProductList products={products} />
}
