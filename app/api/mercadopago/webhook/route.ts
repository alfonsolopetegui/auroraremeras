import { NextResponse } from "next/server";
import { MercadoPagoConfig, Payment } from "mercadopago";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      console.error("Missing MERCADOPAGO_ACCESS_TOKEN");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Leer body del webhook
    const body = await req.json().catch(() => ({} as any));
    console.log("🔔 WEBHOOK BODY:", JSON.stringify(body, null, 2));

    const paymentId = body?.data?.id;
    if (!paymentId) {
      return NextResponse.json({ error: "No payment id" }, { status: 200 });
    }

    // Consultar el pago en Mercado Pago
    const client = new MercadoPagoConfig({ accessToken });
    const payment = new Payment(client);
    const paymentData = await payment.get({ id: String(paymentId) });

    console.log("🔔 Payment ID:", paymentData.id);
    console.log("🔔 Payment Status:", paymentData.status);
    console.log("🔔 External reference:", paymentData.external_reference);

    const externalReference = paymentData.external_reference;
    if (!externalReference) {
      console.warn("[Webhook] No external_reference found");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    const order = await prisma.order.findUnique({ where: { id: externalReference } });
    if (!order) {
      console.warn("[Webhook] Order not found:", externalReference);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Idempotencia: si ya procesamos este pago, no hacer nada
    if (order.mercadoPagoPaymentId === String(paymentData.id)) {
      console.log("[Webhook] Payment already processed");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Mapear status
    let newStatus = order.status;
    if (paymentData.status === "approved") newStatus = "paid";
    else if (paymentData.status === "rejected") newStatus = "rejected";
    else if (paymentData.status === "pending" || paymentData.status === "in_process") newStatus = "pending";

    await prisma.order.update({
      where: { id: order.id },
      data: {
        status: newStatus,
        mercadoPagoPaymentId: String(paymentData.id),
      },
    });

    console.log("✅ [Webhook] Order updated:", {
      orderId: order.id,
      oldStatus: order.status,
      newStatus,
      paymentId: paymentData.id,
      approved: paymentData.status === "approved",
    });

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error("[Webhook] Error:", err);
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
