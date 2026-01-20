import { LayoutAdmin } from './components/LayoutAdmin'
import { ReactNode } from 'react'

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <LayoutAdmin>{children}</LayoutAdmin>
}
