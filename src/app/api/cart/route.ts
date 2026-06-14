import { NextRequest, NextResponse } from "next/server";
import { Types } from "mongoose";
import { auth } from "@/lib/auth";
import { connectDB } from "@/lib/mongodb";
import Cart from "@/models/Cart";

type AuthSession = { user: { id: string } };

async function requireSession(): Promise<AuthSession | null> {
  const session = await auth();
  if (!session?.user?.id) return null;
  return session as AuthSession;
}

export async function GET() {
  try {
    const session = await requireSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    await connectDB();
    const cart = await Cart.findOne({ userId: session.user.id }).populate({
      path: "items.productId",
      select: "name price image shortDescription stock",
    });

    return NextResponse.json(cart ?? { items: [] });
  } catch {
    return NextResponse.json({ error: "Error al obtener el carrito" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { productId, quantity = 1 } = await req.json();
    if (!productId || quantity < 1) {
      return NextResponse.json({ error: "productId y quantity son requeridos" }, { status: 400 });
    }

    await connectDB();
    const cart = await Cart.findOne({ userId: session.user.id });

    if (!cart) {
      const newCart = await Cart.create({ userId: session.user.id, items: [{ productId, quantity }] });
      return NextResponse.json(newCart);
    }

    const existingItem = cart.items.find((item) => item.productId.equals(productId));
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.items.push({ productId: new Types.ObjectId(productId), quantity });
    }

    const saved = await cart.save();
    return NextResponse.json(saved);
  } catch {
    return NextResponse.json({ error: "Error al agregar al carrito" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await requireSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { productId } = await req.json();
    if (!productId) {
      return NextResponse.json({ error: "productId es requerido" }, { status: 400 });
    }

    await connectDB();
    const cart = await Cart.findOneAndUpdate(
      { userId: session.user.id },
      { $pull: { items: { productId } } },
      { new: true }
    );

    return NextResponse.json(cart ?? { items: [] });
  } catch {
    return NextResponse.json({ error: "Error al eliminar del carrito" }, { status: 500 });
  }
}
