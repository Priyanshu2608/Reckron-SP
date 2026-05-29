import mongoose, { Schema, Document, Model } from "mongoose";

export interface IWebsiteContent extends Document {
  key: string; // e.g. "home_hero", "about_details", "statistics"
  value: any; // Dynamic content dictionary
  createdAt: Date;
  updatedAt: Date;
}

const WebsiteContentSchema = new Schema<IWebsiteContent>(
  {
    key: { type: String, required: true, unique: true, index: true },
    value: { type: Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

const WebsiteContent: Model<IWebsiteContent> =
  mongoose.models.WebsiteContent ||
  mongoose.model<IWebsiteContent>("WebsiteContent", WebsiteContentSchema);

export default WebsiteContent;
