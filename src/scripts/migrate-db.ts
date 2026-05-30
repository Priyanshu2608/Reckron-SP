import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/reckron_sp";

// Import models
import Admin from "../models/Admin";
import Testimonial from "../models/Testimonial";
import WebsiteContent from "../models/WebsiteContent";
import ContactInfo from "../models/ContactInfo";

async function runMigration() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully!");

  // 1. Migrate Admin emails
  console.log("Checking Admin accounts...");
  const admins = await Admin.find({});
  for (const admin of admins) {
    if (admin.email && admin.email.includes("reckronpharma.com")) {
      const newEmail = admin.email.replace("reckronpharma.com", "reckronsp.com");
      console.log(`Updating admin email from ${admin.email} to ${newEmail}`);
      admin.email = newEmail;
      await admin.save();
    }
  }

  // 2. Migrate Testimonial texts
  console.log("Checking Testimonials...");
  const testimonials = await Testimonial.find({});
  for (const test of testimonials) {
    if (test.content && test.content.includes("Reckron Pharma")) {
      const newContent = test.content.replace(/Reckron Pharma/g, "Reckron SP");
      console.log(`Updating testimonial content for: ${test.name}`);
      test.content = newContent;
      await test.save();
    }
  }

  // 3. Migrate Contact Info details
  console.log("Checking ContactInfo coordinates...");
  const contactInfo = await ContactInfo.findOne({});
  if (contactInfo) {
    let changed = false;
    if (contactInfo.email && contactInfo.email.includes("reckronpharma.com")) {
      console.log(`Updating contact email from ${contactInfo.email} to info@reckronsp.com`);
      contactInfo.email = "info@reckronsp.com";
      changed = true;
    }
    if (contactInfo.socialLinks) {
      const sl = contactInfo.socialLinks;
      const handles = ["facebook", "linkedin", "twitter", "youtube", "instagram"] as const;
      for (const h of handles) {
        if (sl[h] && sl[h].includes("reckronpharma")) {
          const oldUrl = sl[h];
          sl[h] = oldUrl.replace("reckronpharma", "reckronsp");
          console.log(`Updating social link ${h} from ${oldUrl} to ${sl[h]}`);
          changed = true;
        }
      }
    }
    if (changed) {
      await contactInfo.save();
      console.log("Saved updated ContactInfo document.");
    }
  }

  // 4. Migrate WebsiteContent CMS values
  console.log("Checking WebsiteContent CMS logs...");
  const contents = await WebsiteContent.find({});
  for (const item of contents) {
    let strVal = JSON.stringify(item.value);
    if (strVal.includes("Reckron Pharma")) {
      console.log(`Updating CMS key: ${item.key}`);
      const updatedVal = JSON.parse(strVal.replace(/Reckron Pharma/g, "Reckron SP"));
      item.value = updatedVal;
      // Mark as modified if it's mixed/nested type in mongoose
      item.markModified("value");
      await item.save();
    }
  }

  console.log("\nDatabase Migration Completed Successfully! 🎉");
  await mongoose.disconnect();
}

runMigration().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
