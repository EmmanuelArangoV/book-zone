import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Sale from "@/models/Sale";
import Product from "@/models/Product";

interface SaleItem {
  productId: string;
  quantity: number;
  price: number;
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const userId = session.user.id as string;
    const { items, total } = await req.json() as { items: SaleItem[]; total: number };

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ error: "items es requerido y no puede estar vacío" }, { status: 400 });
    }

    if (typeof total !== "number" || total <= 0) {
      return NextResponse.json({ error: "total debe ser un número positivo" }, { status: 400 });
    }

    await connectDB();

    // Verify and decrement stock atomically
    for (const item of items) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.productId, stock: { $gte: item.quantity } },
        { $inc: { stock: -item.quantity } },
        { new: true }
      );

      if (!updated) {
        const product = await Product.findById(item.productId).select("name");
        const name = product?.name ?? item.productId;
        return NextResponse.json(
          { error: `Stock insuficiente: "${name}"` },
          { status: 409 }
        );
      }
    }

    const saleItems = items.map((item) => ({
      ...item,
      productId: new Types.ObjectId(item.productId),
    }));

    const sale = await Sale.create({ userId, items: saleItems, total });
    return NextResponse.json(sale, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Error al crear la venta" }, { status: 500 });
  }
}
