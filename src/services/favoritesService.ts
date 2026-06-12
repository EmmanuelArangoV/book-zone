import { connectDB } from "@/lib/mongodb";
import Favorite from "@/models/Favorite";

export async function getFavoritesByUserId(userId: string) {
  await connectDB();
  return Favorite.find({ userId }).populate("productId", "name price image shortDescription");
}

export async function addFavorite(userId: string, productId: string) {
  await connectDB();
  return Favorite.findOneAndUpdate(
    { userId, productId },
    { userId, productId },
    { upsert: true, new: true }
  );
}

export async function removeFavorite(userId: string, productId: string) {
  await connectDB();
  return Favorite.findOneAndDelete({ userId, productId });
}

export async function isFavorite(userId: string, productId: string) {
  await connectDB();
  const doc = await Favorite.exists({ userId, productId });
  return doc !== null;
}
