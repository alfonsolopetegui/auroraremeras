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

    // Leer query params
    const url = new URL(req.url);
    const type = url.searchParams.get("type");
    const dataId = url.searchParams.get("data.id");

    // Leer body completo para logs
    const body = await req.json().catch(() => ({}));
    console.log("🔔 WEBHOOK BODY:", JSON.stringify(body, null, 2));
    console.log("[Webhook] Query params:", { type, dataId });

    // Solo procesar pagos
    if (type !== "payment" || !dataId) {
      console.log("[Webhook] Skipping: not a payment notification");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Consultar el pago en Mercado Pago
    const client = new MercadoPagoConfig({ accessToken });
    const payment = new Payment(client);

    const paymentData = await payment.get({ id: dataId });
    
    console.log("🔔 Payment Status:", paymentData.status);
    console.log("🔔 Payment ID:", paymentData.id);
    console.log("🔔 External reference:", paymentData.external_reference);
    console.log("[Webhook] Full payment data:", {
      id: paymentData.id,
      status: paymentData.status,
      status_detail: paymentData.status_detail,
      external_reference: paymentData.external_reference,
      transaction_amount: paymentData.transaction_amount,
    });

    const externalReference = paymentData.external_reference;
    if (!externalReference) {
      console.warn("[Webhook] No external_reference found");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Buscar la orden
    const order = await prisma.order.findUnique({
      where: { id: externalReference },
    });

    if (!order) {
      console.warn("[Webhook] Order not found:", externalReference);
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Idempotencia: si ya procesamos este pago, no hacer nada
    if (order.mercadoPagoPaymentId === String(paymentData.id)) {
      console.log("[Webhook] Payment already processed");
      return NextResponse.json({ received: true }, { status: 200 });
    }

    // Mapear status de Mercado Pago a nuestro sistema
    let newStatus = order.status;
    if (paymentData.status === "approved") {
      newStatus = "paid";
    } else if (paymentData.status === "rejected") {
      newStatus = "rejected";
    } else if (paymentData.status === "pending" || paymentData.status === "in_process") {
      newStatus = "pending";
    }

    // Actualizar orden
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
      newStatus: newStatus,
      paymentId: paymentData.id,
      approved: paymentData.status === "approved",
    });

    // Siempre responder 200
    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: any) {
    console.error("[Webhook] Error:", err);
    // SIEMPRE responder 200 aunque haya error
    return NextResponse.json({ received: true }, { status: 200 });
  }
}
