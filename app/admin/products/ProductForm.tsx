'use client'

import { useState } from 'react'
import { VariantRow } from './VariantRow'

interface ProductFormProps {
  product?: {
    id: string
    name: string
    description: string
    price: number
    imageUrl: string
    active: boolean
    variants: { id?: string; size: 'S' | 'M' | 'L' | 'XL'; color: string; stock: number }[]
  }
  onSave: (data: any) => Promise<void>
}

export function ProductForm({ product, onSave }: ProductFormProps) {
  const [name, setName] = useState(product?.name || '')
  const [description, setDescription] = useState(product?.description || '')
  const [price, setPrice] = useState(product?.price || 0)
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '')
  const [active, setActive] = useState(product?.active ?? true)
  const [variants, setVariants] = useState(product?.variants || [])

  function handleAddVariant() {
    setVariants([...variants, { size: 'M' as const, color: '', stock: 0 }])
  }

  function handleVariantChange(index: number, updatedVariant: any) {
    const newVariants = [...variants]
    newVariants[index] = updatedVariant
    setVariants(newVariants)
  }

  function handleDeleteVariant(index: number) {
    setVariants(variants.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!name || price <= 0) {
      alert('Nombre y precio son obligatorios. Precio debe ser mayor a 0.')
      return
    }

    if (variants.some((v) => v.stock < 0)) {
      alert('Stock no puede ser negativo.')
      return
    }

    await onSave({
      name,
      description,
      price,
      imageUrl,
      active,
      variants,
    })
  }

  return (
    <form onSubmit={handleSubmit}>
      <h1>{product ? 'Editar producto' : 'Nuevo producto'}</h1>

      <div>
        <label>Nombre *</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
      </div>

      <div>
        <label>Descripción</label>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
      </div>

      <div>
        <label>Precio *</label>
        <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
      </div>

      <div>
        <label>Imagen URL</label>
        <input type="text" value={imageUrl} onChange={(e) => setImageUrl(e.target.value)} />
      </div>

      <div>
        <label>
          <input type="checkbox" checked={active} onChange={(e) => setActive(e.target.checked)} />
          Activo
        </label>
      </div>

      <h2>Variantes</h2>
      <button type="button" onClick={handleAddVariant}>
        Agregar variante
      </button>

      {variants.map((variant, index) => (
        <VariantRow
          key={index}
          variant={variant}
          onChange={(updated) => handleVariantChange(index, updated)}
          onDelete={() => handleDeleteVariant(index)}
        />
      ))}

      <button type="submit">Guardar</button>
    </form>
  )
}
