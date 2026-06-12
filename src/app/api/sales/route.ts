import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createSale, SaleItemInput } from "@/services/salesService";
import { checkAndDecrementStock } from "@/services/productService";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const body = await req.json();
    const { items, total } = body as { items: SaleItemInput[]; total: number };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "items es requerido y no puede estar vacío" },
        { status: 400 }
      );
    }

    if (typeof total !== "number" || total <= 0) {
      return NextResponse.json(
        { error: "total debe ser un número positivo" },
        { status: 400 }
      );
    }

    // Check stock and decrement atomically
    const stockResult = await checkAndDecrementStock(
      items.map((i) => ({ productId: i.productId, quantity: i.quantity }))
    );

    if (!stockResult.ok) {
      return NextResponse.json(
        { error: `Stock insuficiente: "${stockResult.outOfStock}"` },
        { status: 409 }
      );
    }

    const sale = await createSale(userId, items, total);
    return NextResponse.json(sale, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al crear la venta" },
      { status: 500 }
    );
  }
}
