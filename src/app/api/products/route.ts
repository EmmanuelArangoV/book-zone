import { NextResponse } from "next/server";
import { getAllProducts } from "@/services/productService";

export async function GET() {
  try {
    const products = await getAllProducts();
    return NextResponse.json(products);
  } catch {
    return NextResponse.json(
      { error: "Error al obtener los productos" },
      { status: 500 }
    );
  }
}
