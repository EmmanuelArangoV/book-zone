import { Types } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import Cart from "@/models/Cart";

export async function getCartByUserId(userId: string) {
  await connectDB();
  return Cart.findOne({ userId }).populate({
    path: "items.productId",
    select: "name price image shortDescription stock",
  });
}

export async function addToCart(userId: string, productId: string, quantity: number) {
  await connectDB();

  const cart = await Cart.findOne({ userId });

  if (!cart) {
    return Cart.create({ userId, items: [{ productId, quantity }] });
  }

  const existingItem = cart.items.find(
    (item) => item.productId.equals(productId)
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ productId: new Types.ObjectId(productId), quantity });
  }

  return cart.save();
}

export async function removeFromCart(userId: string, productId: string) {
  await connectDB();
  return Cart.findOneAndUpdate(
    { userId },
    { $pull: { items: { productId } } },
    { new: true }
  );
}

export async function clearCart(userId: string) {
  await connectDB();
  return Cart.findOneAndUpdate(
    { userId },
    { $set: { items: [] } },
    { new: true }
  );
}
