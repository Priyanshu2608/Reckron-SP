import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), ".env.local") });

const MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost:27017/reckron_pharma";

// Import models
import Admin from "../models/Admin";
import Category from "../models/Category";
import Product from "../models/Product";
import Testimonial from "../models/Testimonial";
import WebsiteContent from "../models/WebsiteContent";
import ContactInfo from "../models/ContactInfo";
import { DEFAULT_CMS } from "../lib/cms-defaults";

async function seed() {
  console.log("Connecting to MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("Connected successfully!");

  // 1. Clean Database
  console.log("Cleaning collections...");
  await Promise.all([
    Admin.deleteMany({}),
    Category.deleteMany({}),
    Product.deleteMany({}),
    Testimonial.deleteMany({}),
    WebsiteContent.deleteMany({}),
    ContactInfo.deleteMany({}),
  ]);
  console.log("Collections cleared.");

  // 2. Seed Default Admin
  console.log("Seeding default admin...");
  const passwordHash = await bcrypt.hash("password123", 10);
  const admin = await Admin.create({
    username: "admin",
    passwordHash,
    email: "admin@reckronpharma.com",
    role: "admin",
  });
  console.log(`Admin user created: username="${admin.username}", password="password123"`);

  // 3. Seed Default Categories
  console.log("Seeding categories...");
  const cardio = await Category.create({
    name: "Heart Care",
    slug: "heart-care",
    description: "Products for managing blood pressure and general cardiovascular health.",
  });

  const general = await Category.create({
    name: "General Health",
    slug: "general-health",
    description: "Everyday essential Products like pain relief and multivitamins.",
  });

  const anti = await Category.create({
    name: "Antibiotics",
    slug: "antibiotics",
    description: "Standard antibiotics for treating common bacterial infections.",
  });
  console.log(`Categories created: ${cardio.name}, ${general.name}, ${anti.name}`);

  // 4. Seed Default Products
  console.log("Seeding Products...");
  const prod1 = await Product.create({
    name: "Reckron Atorvastatin 20mg",
    slug: "reckron-atorvastatin-20mg",
    description: "Atorvastatin is a lipid-lowering medication used to help manage healthy cholesterol levels in the blood.",
    composition: "Each film-coated tablet contains: Atorvastatin Calcium IP equivalent to Atorvastatin 20 mg.",
    benefits: [
      "Helps manage and balance cholesterol levels",
      "Supports daily cardiovascular and heart health",
      "Manufactured with premium, certified safe ingredients"
    ],
    dosage: "One tablet daily, preferably in the evening, or as directed by the Physician.",
    packaging: "10 x 10 Tablets / Blister Pack",
    category: cardio._id,
    images: [],
    featured: true,
    seoMetadata: {
      title: "Reckron Atorvastatin 20mg | Heart Care",
      description: "Inquire about Reckron Atorvastatin 20mg tablets. High quality cholesterol management Product.",
      keywords: "atorvastatin, cholesterol, heart care, tablets, reckron pharma",
    },
  });

  const prod2 = await Product.create({
    name: "Reckron Paracetamol 500mg",
    slug: "reckron-paracetamol-500mg",
    description: "Paracetamol is an everyday pain reliever and fever reducer used to treat mild to moderate pain and help reduce fever.",
    composition: "Each tablet contains: Paracetamol IP 500 mg.",
    benefits: [
      "Effective relief from headaches, joint pain, and cold symptoms",
      "Helps reduce fever and body temperature quickly",
      "Safe and gentle Product suitable for regular use"
    ],
    dosage: "1 to 2 tablets every 4 to 6 hours as needed, or as directed by the Physician.",
    packaging: "10 x 15 Tablets Strip Pack",
    category: general._id,
    images: [],
    featured: true,
    seoMetadata: {
      title: "Reckron Paracetamol 500mg | Pain Relief",
      description: "Request wholesale pricing for Reckron Paracetamol 500mg tablets. Reliable pain and fever relief.",
      keywords: "paracetamol, fever reducer, pain relief, tablets, reckron pharma",
    },
  });

  const prod3 = await Product.create({
    name: "Reckron Amoxicillin 500mg",
    slug: "reckron-amoxicillin-500mg",
    description: "Amoxicillin is a common antibiotic Product prescribed to treat and relieve bacterial infections in the body.",
    composition: "Each capsule contains: Amoxicillin Trihydrate IP equivalent to Amoxicillin 500 mg.",
    benefits: [
      "Effective and reliable relief from bacterial infections",
      "Produced under strict quality-controlled conditions",
      "Trusted, standard Product for everyday health"
    ],
    dosage: "One capsule three times daily, or as directed by the Physician.",
    packaging: "10 x 10 Capsules Strip",
    category: anti._id,
    images: [],
    featured: true,
    seoMetadata: {
      title: "Reckron Amoxicillin 500mg | Antibiotic Product",
      description: "Wholesale enquiries for Reckron Amoxicillin 500mg capsules. Certified quality antibiotic supply.",
      keywords: "amoxicillin, antibiotics, capsules, bacterial infection, reckron",
    },
  });
  console.log(`Products created: ${prod1.name}, ${prod2.name}, ${prod3.name}`);

  // 5. Seed CMS Content Defaults
  console.log("Seeding Website CMS Content...");
  await Promise.all([
    WebsiteContent.create({ key: "home_hero", value: DEFAULT_CMS.home_hero }),
    WebsiteContent.create({ key: "home_about", value: DEFAULT_CMS.home_about }),
    WebsiteContent.create({ key: "statistics", value: DEFAULT_CMS.statistics }),
    WebsiteContent.create({ key: "why_choose_us", value: DEFAULT_CMS.why_choose_us }),
    WebsiteContent.create({ key: "certifications", value: DEFAULT_CMS.certifications }),
  ]);
  console.log("Website CMS content seeded.");

  // 6. Seed Testimonials
  console.log("Seeding testimonials...");
  await Testimonial.create([
    {
      name: "Dr. Catherine Mercer",
      role: "Family Physician",
      company: "Mercer Medical Clinic",
      content: "Reckron Pharma has been our trusted supplier of essential medicines for over 5 years. Their consistency, safe packaging, and helpful customer support are excellent.",
      rating: 5,
    },
    {
      name: "Dr. Amit Roy",
      role: "Pharmacist & Owner",
      company: "Roy Family Pharmacy",
      content: "Reckron's everyday Products like paracetamol and multivitamins are top-notch. Our customers trust them, and the pricing is very reasonable for a local business.",
      rating: 5,
    },
  ]);
  console.log("Testimonials seeded.");

  // 7. Seed Contact Info
  console.log("Seeding contact details...");
  await ContactInfo.create({
    email: "info@reckronpharma.com",
    phone: "+1 (555) 019-2834",
    address: "Plot 42, Industrial Area Phase 1, Reckron House",
    whatsappNumber: "+15550192834",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345086153!2d-122.39575828468114!3d37.778007979759714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085807d9f7831d1%3A0xc3fa109ba4a2ff4!2sSan%20Francisco%20Biotech%20Inc!5e0!3m2!1sen!2sus!4v1622244265492!5m2!1sen!2sus",
    socialLinks: {
      facebook: "https://facebook.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter",
      youtube: "https://youtube",
      instagram: "https://instagram",
    },
  });
  console.log("Contact details seeded successfully.");

  console.log("\nDatabase Seeding Completed Successfully! 🌱");
  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error("Database seeding failed:", err);
  process.exit(1);
});
