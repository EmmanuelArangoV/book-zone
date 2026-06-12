import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getCartByUserId,
  addToCart,
  removeFromCart,
} from "@/services/cartService";

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

    const cart = await getCartByUserId(session.user.id);
    return NextResponse.json(cart ?? { items: [] });
  } catch {
    return NextResponse.json(
      { error: "Error al obtener el carrito" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await requireSession();
    if (!session) {
      return NextResponse.json({ error: "No autorizado" }, { status: 401 });
    }

    const { productId, quantity } = await req.json();

    if (!productId || !quantity || quantity < 1) {
      return NextResponse.json(
        { error: "productId y quantity son requeridos" },
        { status: 400 }
      );
    }

    const cart = await addToCart(session.user.id, productId, quantity);
    return NextResponse.json(cart);
  } catch {
    return NextResponse.json(
      { error: "Error al agregar al carrito" },
      { status: 500 }
    );
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
      return NextResponse.json(
        { error: "productId es requerido" },
        { status: 400 }
      );
    }

    const cart = await removeFromCart(session.user.id, productId);
    return NextResponse.json(cart ?? { items: [] });
  } catch {
    return NextResponse.json(
      { error: "Error al eliminar del carrito" },
      { status: 500 }
    );
  }
}
