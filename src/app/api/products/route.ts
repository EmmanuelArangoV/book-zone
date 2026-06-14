import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    const products = await Product.find({})
      .select("name author price image shortDescription category")
      .lean();

    return NextResponse.json(products);
  } catch {
    return NextResponse.json({ error: "Error al obtener los productos" }, { status: 500 });
  }
}
