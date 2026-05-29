import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISeoMetadata {
  title: string;
  description: string;
  keywords: string;
}

export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  composition: string;
  benefits: string[];
  dosage: string;
  packaging: string;
  category: mongoose.Types.ObjectId;
  images: string[];
  featured: boolean;
  seoMetadata: ISeoMetadata;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, trim: true, index: true },
    description: { type: String, required: true },
    composition: { type: String, required: true },
    benefits: { type: [String], default: [] },
    dosage: { type: String, default: "" },
    packaging: { type: String, default: "" },
    category: { type: Schema.Types.ObjectId, ref: "Category", required: true },
    images: { type: [String], default: [] },
    featured: { type: Boolean, default: false },
    seoMetadata: {
      title: { type: String, default: "" },
      description: { type: String, default: "" },
      keywords: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
