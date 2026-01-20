'use client'

import { useState } from 'react'
import Link from 'next/link'

const CART_STORAGE_KEY = 'remeras_cart'

interface Variant {
  id: string
  size: string
  color: string
  stock: number
}

interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  variants: Variant[]
}

export function ProductDetailClient({ product }: { product: Product }) {
  const [selectedSize, setSelectedSize] = useState<string>(
    product.variants[0]?.size || 'M'
  )
  const [selectedColor, setSelectedColor] = useState<string>(
    product.variants[0]?.color || 'Negro'
  )
  const [quantity, setQuantity] = useState<number>(1)
  const [addedMessage, setAddedMessage] = useState(false)

  const uniqueSizes = [...new Set(product.variants.map((v) => v.size))]
  const uniqueColors = [...new Set(product.variants.map((v) => v.color))]

  const handleAddToCart = () => {
    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      imageUrl: product.imageUrl,
    }

    const stored = localStorage.getItem(CART_STORAGE_KEY)
    const cart = stored ? JSON.parse(stored) : []

    const existingItem = cart.find(
      (item: any) =>
        item.productId === product.id &&
        item.size === selectedSize &&
        item.color === selectedColor
    )

    if (existingItem) {
      existingItem.quantity += quantity
    } else {
      cart.push(cartItem)
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))

    window.dispatchEvent(new Event('cartUpdated'))

    setAddedMessage(true)
    setTimeout(() => setAddedMessage(false), 2000)
  }

  return (
    <main className="product-detail-container">
      <Link href="/" className="back-link">
        ← Volver
      </Link>

      <div className="product-detail">
        <div className="product-image-section">
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="product-detail-image"
            />
          )}
        </div>

        <div className="product-info-section">
          <h1 className="product-detail-name">{product.name}</h1>

          <p className="product-detail-description">{product.description}</p>

          <p className="product-detail-price">${product.price.toFixed(2)}</p>

          <div className="product-options">
            <div className="option-group">
              <label htmlFor="size">Talle</label>
              <select
                id="size"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="select-input"
              >
                {uniqueSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="option-group">
              <label htmlFor="color">Color</label>
              <select
                id="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="select-input"
              >
                {uniqueColors.map((color) => (
                  <option key={color} value={color}>
                    {color}
                  </option>
                ))}
              </select>
            </div>

            <div className="option-group">
              <label htmlFor="quantity">Cantidad</label>
              <input
                id="quantity"
                type="number"
                min="1"
                max="10"
                value={quantity}
                onChange={(e) => setQuantity(parseInt(e.target.value))}
                className="quantity-input"
              />
            </div>
          </div>

          <button onClick={handleAddToCart} className="add-to-cart-button">
            {addedMessage ? '✓ Agregado al carrito' : 'Agregar al carrito'}
          </button>
        </div>
      </div>
    </main>
  )
}
