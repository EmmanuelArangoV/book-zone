import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import {
  getFavoritesByUserId,
  addFavorite,
  removeFavorite,
} from "@/services/favoritesService";

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

    const favorites = await getFavoritesByUserId(session.user.id);
    return NextResponse.json(favorites);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener los favoritos" },
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

    const { productId } = await req.json();

    if (!productId) {
      return NextResponse.json(
        { error: "productId es requerido" },
        { status: 400 }
      );
    }

    const favorite = await addFavorite(session.user.id, productId);
    return NextResponse.json(favorite, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Error al agregar a favoritos" },
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

    await removeFavorite(session.user.id, productId);
    return NextResponse.json({ message: "Eliminado de favoritos" });
  } catch {
    return NextResponse.json(
      { error: "Error al eliminar de favoritos" },
      { status: 500 }
    );
  }
}
