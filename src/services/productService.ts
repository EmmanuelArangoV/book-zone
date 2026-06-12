import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";

export async function getAllProducts() {
  await connectDB();
  return Product.find({})
    .select("name author price image shortDescription category")
    .lean();
}

export async function getProductById(id: string) {
  await connectDB();
  return Product.findById(id)
    .select("+description +stock +specifications")
    .lean();
}

export async function checkAndDecrementStock(
  items: { productId: string; quantity: number }[]
): Promise<{ ok: boolean; outOfStock?: string }> {
  await connectDB();

  for (const item of items) {
    const result = await Product.findOneAndUpdate(
      { _id: item.productId, stock: { $gte: item.quantity } },
      { $inc: { stock: -item.quantity } },
      { new: true }
    );

    if (!result) {
      const product = await Product.findById(item.productId).select("+stock name");
      const name = product?.name ?? item.productId;
      return { ok: false, outOfStock: name };
    }
  }

  return { ok: true };
}
