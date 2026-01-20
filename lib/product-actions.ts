'use server'

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export interface Product {
  id: string
  name: string
  description: string
  price: number
  imageUrl: string
  active: boolean
  createdAt: string
  variants: Variant[]
}

export interface Variant {
  id: string
  productId: string
  size: 'S' | 'M' | 'L' | 'XL'
  color: string
  stock: number
}

export interface ProductFormData {
  name: string
  description: string
  price: number
  imageUrl: string
  active: boolean
  variants: {
    id?: string
    size: 'S' | 'M' | 'L' | 'XL'
    color: string
    stock: number
  }[]
}

export async function getAllProducts(): Promise<Product[]> {
  const products = await prisma.product.findMany({
    include: { variants: true },
    orderBy: { createdAt: 'desc' },
  })

  return products.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: p.price,
    imageUrl: p.imageUrl,
    active: p.active,
    createdAt: p.createdAt.toISOString(),
    variants: p.variants as Variant[],
  }))
}

export async function getProductById(id: string): Promise<Product | null> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: { variants: true },
  })

  if (!product) return null

  return {
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
    imageUrl: product.imageUrl,
    active: product.active,
    createdAt: product.createdAt.toISOString(),
    variants: product.variants as Variant[],
  }
}

export async function createProduct(data: ProductFormData) {
  await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
      active: data.active,
      variants: {
        create: data.variants.map((v) => ({
          size: v.size,
          color: v.color,
          stock: v.stock,
        })),
      },
    },
  })
}

export async function updateProduct(id: string, data: ProductFormData) {
  await prisma.variant.deleteMany({ where: { productId: id } })
  
  await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      price: data.price,
      imageUrl: data.imageUrl,
      active: data.active,
      variants: {
        create: data.variants.map((v) => ({
          size: v.size,
          color: v.color,
          stock: v.stock,
        })),
      },
    },
  })
}

export async function toggleProductActive(id: string) {
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return

  await prisma.product.update({
    where: { id },
    data: { active: !product.active },
  })
}
