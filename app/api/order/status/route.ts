import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const runtime = "nodejs";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const orderId = url.searchParams.get("orderId");

    if (!orderId) {
      return NextResponse.json(
        { error: "Missing orderId parameter" },
        { status: 400 }
      );
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
      select: {
        id: true,
        status: true,
        mercadoPagoPaymentId: true,
        updatedAt: true,
      },
    });

    if (!order) {
      return NextResponse.json(
        { error: "Order not found" },
        { status: 404 }
      );
    }

    // Determinar si se debe vaciar el carrito
    const shouldClearCart = order.status === "paid";

    return NextResponse.json({
      orderId: order.id,
      status: order.status,
      shouldClearCart,
      updatedAt: order.updatedAt,
    });
  } catch (err: any) {
    console.error("[Order Status API] Error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
