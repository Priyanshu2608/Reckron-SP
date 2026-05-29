import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISocialLinks {
  facebook?: string;
  linkedin?: string;
  twitter?: string;
  youtube?: string;
  instagram?: string;
}

export interface IContactInfo extends Document {
  email: string;
  phone: string;
  address: string;
  whatsappNumber?: string;
  mapEmbedUrl?: string;
  socialLinks: ISocialLinks;
  createdAt: Date;
  updatedAt: Date;
}

const ContactInfoSchema = new Schema<IContactInfo>(
  {
    email: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    address: { type: String, required: true },
    whatsappNumber: { type: String, default: "" },
    mapEmbedUrl: { type: String, default: "" },
    socialLinks: {
      facebook: { type: String, default: "" },
      linkedin: { type: String, default: "" },
      twitter: { type: String, default: "" },
      youtube: { type: String, default: "" },
      instagram: { type: String, default: "" },
    },
  },
  { timestamps: true }
);

const ContactInfo: Model<IContactInfo> =
  mongoose.models.ContactInfo ||
  mongoose.model<IContactInfo>("ContactInfo", ContactInfoSchema);

export default ContactInfo;
