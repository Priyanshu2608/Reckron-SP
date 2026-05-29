import mongoose, { Schema, Document, Model } from "mongoose";

export interface IEnquiry extends Document {
  fullName: string;
  companyName?: string;
  email: string;
  phoneNumber?: string;
  city?: string;
  country?: string;
  product: string; // The product name/brand selected
  productId?: mongoose.Types.ObjectId; // Optional link to database product
  message: string;
  status: "pending" | "reviewed" | "resolved";
  createdAt: Date;
  updatedAt: Date;
}

const EnquirySchema = new Schema<IEnquiry>(
  {
    fullName: { type: String, required: true, trim: true },
    companyName: { type: String, default: "" },
    email: { type: String, required: true, trim: true },
    phoneNumber: { type: String, default: "" },
    city: { type: String, default: "" },
    country: { type: String, default: "" },
    product: { type: String, required: true, trim: true },
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: false },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: ["pending", "reviewed", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const Enquiry: Model<IEnquiry> =
  mongoose.models.Enquiry || mongoose.model<IEnquiry>("Enquiry", EnquirySchema);

export default Enquiry;
