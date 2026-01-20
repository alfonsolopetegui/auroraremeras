'use client'

import Link from 'next/link'
import { ReactNode } from 'react'

export function LayoutAdmin({ children }: { children: ReactNode }) {
  return (
    <div className="admin-layout">
      <aside className="admin-sidebar">
        <h2>Admin Panel</h2>
        <nav>
          <Link href="/admin/products">Productos</Link>
          <Link href="/admin/orders">Pedidos</Link>
          <Link href="/">Cerrar sesión</Link>
        </nav>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  )
}
