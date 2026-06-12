import mongoose, { Schema, Document } from "mongoose";

export interface IFavorite extends Document {
  userId: mongoose.Types.ObjectId;
  productId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const FavoriteSchema = new Schema<IFavorite>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
  },
  { timestamps: true }
);

FavoriteSchema.index({ userId: 1, productId: 1 }, { unique: true });

export default (mongoose.models.Favorite as mongoose.Model<IFavorite>) ||
  mongoose.model<IFavorite>("Favorite", FavoriteSchema);
