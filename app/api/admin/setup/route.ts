import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  return NextResponse.json({ message: "Setup endpoint" });
}

export async function POST(_request: NextRequest) {
  return NextResponse.json({ message: "Setup endpoint" });
}
