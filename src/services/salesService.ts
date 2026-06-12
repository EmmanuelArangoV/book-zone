import { Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Sale from "@/models/Sale";

export interface SaleItemInput {
  productId: string;
  quantity: number;
  price: number;
}

export async function createSale(
  userId: string,
  items: SaleItemInput[],
  total: number
) {
  await connectDB();
  const saleItems = items.map((item) => ({
    ...item,
    productId: new Types.ObjectId(item.productId),
  }));
  return Sale.create({ userId, items: saleItems, total });
}

export async function getSalesByMonth(year: number, month: number) {
  await connectDB();
  const start = new Date(year, month - 1, 1);
  const end = new Date(year, month, 1);
  return Sale.find({ createdAt: { $gte: start, $lt: end } }).populate(
    "items.productId",
    "name image"
  );
}

export async function getSalesByUserId(userId: string) {
  await connectDB();
  return Sale.find({ userId })
    .sort({ createdAt: -1 })
    .populate("items.productId", "name image");
}
