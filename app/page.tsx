import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
};

const products: Product[] = [
  {
    id: "1",
    name: "Remera Clásica Blanca",
    price: 29.99,
    imageUrl: "/remerablanca.jpg",
  },
  {
    id: "2",
    name: "Remera Negra Premium",
    price: 34.99,
    imageUrl: "/remeranegra.jpg",
  },
  {
    id: "3",
    name: "Remera Deportiva Roja",
    price: 31.99,
    imageUrl: "/remeraroja.jpg",
  },
  {
    id: "4",
    name: "Remera Salmón Casual",
    price: 36.99,
    imageUrl: "/remerasalmon.jpg",
  },
];

export default function Home() {
  return (
    <main className="home-container">
      <h1>Remeras</h1>
      <p className="subtitle">Descubre nuestras remeras impresas</p>
      
      <div className="products-grid">
        {products.map((product) => (
          <Link
            key={product.id}
            href={`/product/${product.id}`}
            className="product-card"
          >
            <img
              src={product.imageUrl}
              alt={product.name}
              className="product-image"
            />
            <h2 className="product-name">{product.name}</h2>
            <p className="product-price">${product.price.toFixed(2)}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}
