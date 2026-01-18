"use client";

import { use, useState } from "react";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
};

const products: Product[] = [
  {
    id: "1",
    name: "Remera Clásica Blanca",
    description:
      "Remera 100% algodón, cómoda y versátil. Perfecta para cualquier ocasión.",
    price: 29.99,
    imageUrl: "/remerablanca.jpg",
  },
  {
    id: "2",
    name: "Remera Negra Premium",
    description:
      "Remera de alta calidad en color negro. Material resistente y duradero.",
    price: 34.99,
    imageUrl: "/remeranegra.jpg",
  },
  {
    id: "3",
    name: "Remera Deportiva Roja",
    description:
      "Remera ideal para actividades deportivas. Tela transpirable y cómoda.",
    price: 31.99,
    imageUrl: "/remeraroja.jpg",
  },
  {
    id: "4",
    name: "Remera Salmón Casual",
    description:
      "Remera casual en tono salmón. Perfecta para un look relajado.",
    price: 36.99,
    imageUrl: "/remerasalmon.jpg",
  },
];

const sizes = ["S", "M", "L", "XL"];
const colors = ["Blanco", "Negro", "Rojo", "Azul"];
const CART_STORAGE_KEY = "remeras_cart";

export default function ProductDetail({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [selectedSize, setSelectedSize] = useState<string>("M");
  const [selectedColor, setSelectedColor] = useState<string>("Negro");
  const [quantity, setQuantity] = useState<number>(1);
  const [addedMessage, setAddedMessage] = useState(false);

  const product = products.find((p) => p.id === id);

  if (!product) {
    return (
      <main className="product-detail-container">
        <h1>Producto no encontrado</h1>
        <Link href="/">Volver a la tienda</Link>
      </main>
    );
  }

  const handleAddToCart = () => {
    const cartItem = {
      productId: product.id,
      name: product.name,
      price: product.price,
      size: selectedSize,
      color: selectedColor,
      quantity: quantity,
      imageUrl: product.imageUrl,
    };

    const stored = localStorage.getItem(CART_STORAGE_KEY);
    const cart = stored ? JSON.parse(stored) : [];

    const existingItem = cart.find(
      (item: any) =>
        item.productId === product.id &&
        item.size === selectedSize &&
        item.color === selectedColor
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push(cartItem);
    }

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    
    // Disparar evento personalizado para actualizar el header
    window.dispatchEvent(new Event("cartUpdated"));
    
    // Mostrar mensaje de confirmación
    setAddedMessage(true);
    setTimeout(() => setAddedMessage(false), 2000);
  };

  return (
    <main className="product-detail-container">
      <Link href="/" className="back-link">
        ← Volver
      </Link>

      <div className="product-detail">
        <div className="product-image-section">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="product-detail-image"
          />
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
                {sizes.map((size) => (
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
                {colors.map((color) => (
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

          <button
            onClick={handleAddToCart}
            className="add-to-cart-button"
          >
            {addedMessage ? "✓ Agregado al carrito" : "Agregar al carrito"}
          </button>
        </div>
      </div>
    </main>
  );
}
