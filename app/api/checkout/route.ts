import { NextResponse } from "next/server";
import { MercadoPagoConfig, Preference } from "mercadopago";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const runtime = "nodejs";

type CartItemInput = {
  id: string;
  title: string;
  price: number;
  quantity: number;
};

function isValidItem(item: any): item is CartItemInput {
  return (
    item &&
    typeof item.id === "string" &&
    typeof item.title === "string" &&
    typeof item.price === "number" &&
    item.price > 0 &&
    typeof item.quantity === "number" &&
    Number.isInteger(item.quantity) &&
    item.quantity >= 1
  );
}

export async function POST(req: Request) {
  try {
    const accessToken = process.env.MERCADOPAGO_ACCESS_TOKEN;
    if (!accessToken) {
      return NextResponse.json(
        { error: "Missing MERCADOPAGO_ACCESS_TOKEN" },
        { status: 500 },
      );
    }

    const body = await req.json().catch(() => null);
    const items: unknown = body?.items ?? body;

    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Invalid payload: expected non-empty items array" },
        { status: 400 },
      );
    }

    const validItems = items.filter(isValidItem) as CartItemInput[];
    if (validItems.length !== items.length) {
      return NextResponse.json(
        { error: "Invalid item fields: id, title, price>0, quantity>=1" },
        { status: 400 },
      );
    }

    // Calcular total
    const totalAmount = validItems.reduce(
      (sum, it) => sum + it.price * it.quantity,
      0
    );

    // Crear orden en la base de datos
    const order = await prisma.order.create({
      data: {
        totalAmount,
        status: "pending",
      },
    });

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

    const client = new MercadoPagoConfig({ accessToken });
    const preference = new Preference(client);

    const result = await preference.create({
      body: {
        items: validItems.map((it) => ({
          id: it.id,
          title: it.title,
          quantity: it.quantity,
          unit_price: it.price,
        })),
        external_reference: order.id,
        back_urls: {
          success: `${siteUrl}/checkout/success`,
          failure: `${siteUrl}/checkout/failure`,
          pending: `${siteUrl}/checkout/pending`,
        },
        notification_url: `${siteUrl}/api/mercadopago/webhook`,
      },
    });

    // Some SDK versions nest the response; normalize to expose init_point
    const initPoint =
      (result as any)?.init_point || (result as any)?.response?.init_point;
    const preferenceId = 
      (result as any)?.id || (result as any)?.response?.id;

    if (!initPoint) {
      return NextResponse.json(
        { error: "Unable to create preference or missing init_point" },
        { status: 500 },
      );
    }

    // Actualizar orden con preference ID
    await prisma.order.update({
      where: { id: order.id },
      data: { mercadoPagoPreferenceId: preferenceId },
    });

    return NextResponse.json({ init_point: initPoint, order_id: order.id });
  } catch (err: any) {
    console.error("MERCADO PAGO ERROR:", err);

    return NextResponse.json(
      {
        error: "Checkout error",
        message: err?.message,
        cause: err?.cause,
        response: err?.response,
      },
      { status: 500 },
    );
  }
}
