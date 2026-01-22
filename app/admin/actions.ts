'use server'

import { PrismaClient } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { uploadProductImage, deleteProductImage } from '@/lib/blob'

const prisma = new PrismaClient()

export async function getAllProducts() {
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
    variants: p.variants,
  }))
}

export async function getProductById(id: string) {
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
    variants: product.variants,
  }
}

export async function createProductAction(data: any) {
  let imageUrl = data.imageUrl

  if (imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('data:')) {
    imageUrl = await uploadProductImage(imageUrl)
  }

  const variants = Array.isArray(data.variants)
    ? data.variants.map((v: any) => ({
        size: String(v.size),
        color: String(v.color),
        stock: Number(v.stock),
      }))
    : []

  await prisma.product.create({
    data: {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      imageUrl,
      active: Boolean(data.active),
      variants: {
        create: variants,
      },
    },
  })
  
  revalidatePath('/admin/products')
  revalidatePath('/')
}

export async function updateProductAction(id: string, data: any) {
  let imageUrl = data.imageUrl
  const existing = await prisma.product.findUnique({ where: { id } })

  if (imageUrl && typeof imageUrl === 'string' && imageUrl.startsWith('data:')) {
    const newUrl = await uploadProductImage(imageUrl)
    await deleteProductImage(existing?.imageUrl)
    imageUrl = newUrl
  }

  const variants = Array.isArray(data.variants)
    ? data.variants.map((v: any) => ({
        size: String(v.size),
        color: String(v.color),
        stock: Number(v.stock),
      }))
    : []

  await prisma.product.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      price: Number(data.price),
      imageUrl,
      active: Boolean(data.active),
      variants: {
        deleteMany: {},
        create: variants,
      },
    },
  })
  
  revalidatePath('/admin/products')
  revalidatePath('/')
}

export async function toggleProductActiveAction(id: string) {
  const product = await prisma.product.findUnique({ where: { id } })
  if (!product) return

  await prisma.product.update({
    where: { id },
    data: { active: !product.active },
  })

  revalidatePath('/admin/products')
  revalidatePath('/')
}
