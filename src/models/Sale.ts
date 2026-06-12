import mongoose, { Schema, Document } from "mongoose";

export interface ISaleItem {
  productId: mongoose.Types.ObjectId;
  quantity: number;
  price: number;
}

export interface ISale extends Document {
  userId: mongoose.Types.ObjectId;
  items: ISaleItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

const SaleItemSchema = new Schema<ISaleItem>(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
  },
  { _id: false }
);

const SaleSchema = new Schema<ISale>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    items: { type: [SaleItemSchema], required: true },
    total: { type: Number, required: true },
  },
  { timestamps: true }
);

export default (mongoose.models.Sale as mongoose.Model<ISale>) ||
  mongoose.model<ISale>("Sale", SaleSchema);
