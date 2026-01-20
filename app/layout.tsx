import "../styles/globals.css";
import "../styles/admin.css";
import Header from "./components/Header";

export const metadata = {
  title: "Remeras E-commerce",
  description: "Tienda de remeras impresas",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <Header />
        {children}
      </body>
    </html>
  );
}
