import mongoose, { Schema, Document, Model } from "mongoose";

export interface ITestimonial extends Document {
  name: string;
  role?: string;
  company?: string;
  content: string;
  rating: number;
  avatar?: string;
  createdAt: Date;
  updatedAt: Date;
}

const TestimonialSchema = new Schema<ITestimonial>(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, default: "" },
    company: { type: String, default: "" },
    content: { type: String, required: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    avatar: { type: String, default: "" },
  },
  { timestamps: true }
);

const Testimonial: Model<ITestimonial> =
  mongoose.models.Testimonial || mongoose.model<ITestimonial>("Testimonial", TestimonialSchema);

export default Testimonial;
