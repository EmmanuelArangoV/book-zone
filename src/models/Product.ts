import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  author: string;
  description: string;
  shortDescription: string;
  price: number;
  image: string;
  stock: number;
  category: string;
  specifications: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    author: { type: String, required: true },
    shortDescription: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    // Solo en detalle
    description: { type: String, required: true, select: false },
    stock: { type: Number, required: true, default: 0, select: false },
    specifications: { type: Schema.Types.Mixed, default: {}, select: false },
  },
  { timestamps: true }
);

export default (mongoose.models.Product as mongoose.Model<IProduct>) ||
  mongoose.model<IProduct>("Product", ProductSchema);
