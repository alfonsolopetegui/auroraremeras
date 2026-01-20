import { getProductById } from '../../../actions'
import { EditProductForm } from './EditProductForm'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const product = await getProductById(id)

  if (!product) {
    return <div>Producto no encontrado</div>
  }

  return <EditProductForm product={product} />
}
