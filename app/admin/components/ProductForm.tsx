'use client'

import { useState, useRef } from 'react'
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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [name, setName] = useState(product?.name || '')
  const [description, setDescription] = useState(product?.description || '')
  const [price, setPrice] = useState(product?.price || 0)
  const [imageUrl, setImageUrl] = useState(product?.imageUrl || '')
  const [imagePreview, setImagePreview] = useState<string | null>(product?.imageUrl || null)
  const [active, setActive] = useState(product?.active ?? true)
  const [variants, setVariants] = useState(product?.variants || [])

  function handleUploadButtonClick() {
    fileInputRef.current?.click()
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return

    const MAX_SIZE = 10 * 1024 * 1024 // 10MB
    if (file.size > MAX_SIZE) {
      alert('La imagen no puede superar 10MB.')
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      const result = event.target?.result as string
      setImagePreview(result)
      setImageUrl(result)
    }
    reader.readAsDataURL(file)
  }

  function handleRemoveImage() {
    setImagePreview(null)
    setImageUrl('')
  }

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

    if (!imageUrl) {
      alert('La imagen es obligatoria para el producto.')
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
    <div className="product-form-container">
      <form onSubmit={handleSubmit}>
        <h1>{product ? 'Editar producto' : 'Nuevo producto'}</h1>

        <div className="form-group">
          <label>Nombre *</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Descripción</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <div className="form-group">
          <label>Precio *</label>
          <input type="number" value={price} onChange={(e) => setPrice(Number(e.target.value))} required />
        </div>

        <div className="form-group">
          <label>Imagen del producto</label>
          {imagePreview ? (
            <div className="image-preview">
              <img src={imagePreview} alt="Preview" />
              <button type="button" onClick={handleRemoveImage} className="remove-image-btn">
                Eliminar imagen
              </button>
            </div>
          ) : (
            <>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'none' }}
              />
              <button type="button" onClick={handleUploadButtonClick} className="upload-image-btn">
                📤 Subir imagen
              </button>
            </>
          )}
        </div>

        <div className="form-group form-checkbox">
          <input type="checkbox" id="active" checked={active} onChange={(e) => setActive(e.target.checked)} />
          <label htmlFor="active">Activo</label>
        </div>

        <h2>Variantes</h2>
        <div className="variants-header">
          <button type="button" onClick={handleAddVariant}>
            + Agregar variante
          </button>
        </div>

        {variants.length > 0 && (
          <div className="variants-list">
            {variants.map((variant, index) => (
              <VariantRow
                key={index}
                variant={variant}
                onChange={(updated) => handleVariantChange(index, updated)}
                onDelete={() => handleDeleteVariant(index)}
              />
            ))}
          </div>
        )}

        <div className="form-actions">
          <button type="submit" className="submit-btn">Guardar</button>
        </div>
      </form>
    </div>
  )
}
