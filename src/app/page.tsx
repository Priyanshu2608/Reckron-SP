import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import WebsiteContent from "@/models/WebsiteContent";
import Testimonial from "@/models/Testimonial";
import { DEFAULT_CMS } from "@/lib/cms-defaults";

// Import sections
import HeroSection from "@/components/public/HeroSection";
import CompanyIntro from "@/components/public/CompanyIntro";
import WhyChooseUs from "@/components/public/WhyChooseUs";
import Certifications from "@/components/public/Certifications";
import StatsSection from "@/components/public/StatsSection";
import TestimonialCarousel from "@/components/public/TestimonialCarousel";
import ProductCard from "@/components/public/ProductCard";

// Dynamic content fetch helper
async function getCmsContent(key: string) {
  try {
    await connectToDatabase();
    const doc = await WebsiteContent.findOne({ key });
    return doc ? doc.value : (DEFAULT_CMS as any)[key];
  } catch (err) {
    console.error(`Mongoose content fetch error for key: ${key}`, err);
    return (DEFAULT_CMS as any)[key];
  }
}

export const revalidate = 0; // Disable static caching so admin edits reflect instantly

export default async function Home() {
  await connectToDatabase();

  // Parallel fetches
  const heroContent = await getCmsContent("home_hero");
  const aboutContent = await getCmsContent("home_about");
  const statsContent = await getCmsContent("statistics");
  const whyChooseContent = await getCmsContent("why_choose_us");
  const certificationsContent = await getCmsContent("certifications");

  // Fetch featured products
  let featuredProducts: any[] = [];
  try {
    featuredProducts = await Product.find({ featured: true })
      .populate("category", "name slug")
      .limit(3);
  } catch (err) {
    console.error("Failed to load featured products:", err);
  }

  // Fetch active testimonials
  let testimonials: any[] = [];
  try {
    testimonials = await Testimonial.find({}).limit(5);
  } catch (err) {
    console.error("Failed to load testimonials:", err);
  }

  return (
    <div className="flex flex-col w-full">
      {/* 1. Hero Section */}
      <HeroSection content={heroContent} />

      {/* 2. Company Introduction */}
      <CompanyIntro content={aboutContent} />

      {/* 3. Featured Products */}
      <section className="py-20 bg-white relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="text-left flex flex-col gap-3 max-w-2xl">
              <span className="font-bold text-xs uppercase tracking-wider text-accent-blue">
                Products
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">
                Featured Products
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Explore our leading products designed for everyday healthcare needs.
              </p>
            </div>
            <Link
              href="/products"
              className="px-6 py-2.5 rounded-xl border border-accent-blue/30 text-accent-blue hover:bg-accent-blue hover:text-white font-bold text-sm transition-all shrink-0 text-center"
            >
              View Full Catalog
            </Link>
          </div>

          {/* Cards Grid */}
          {featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <div key={product._id as string}>
                  <ProductCard product={JSON.parse(JSON.stringify(product))} />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-12 text-center rounded-3xl border border-dashed border-border bg-card">
              <p className="text-muted text-sm">No featured products found. Please add or toggle featured products in the admin panel.</p>
            </div>
          )}
        </div>
      </section>

      {/* 4. Why Choose Us */}
      <WhyChooseUs content={whyChooseContent} />

      {/* 5. Certifications */}
      <Certifications content={certificationsContent} />

      {/* 6. Stats Section */}
      <StatsSection content={statsContent} />

      {/* 7. Testimonials */}
      <TestimonialCarousel testimonials={JSON.parse(JSON.stringify(testimonials))} />

      {/* 8. CTA Banner */}
      <section className="py-20 bg-slate-50 text-slate-900 text-center relative overflow-hidden border-t border-slate-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center gap-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight">
            Partner With Reckron SP
          </h2>
          <p className="text-slate-600 max-w-2xl leading-relaxed text-base sm:text-lg">
            We collaborate with distributors, medical clinics, and pharmacies to supply quality Products securely. Contact our team today.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-accent-blue hover:bg-primary text-white font-semibold transition-all shadow-sm shadow-accent-blue/10"
            >
              Get In Touch
            </Link>
            <Link
              href="/products"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold transition-all"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
