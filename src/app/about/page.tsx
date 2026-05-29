import Link from "next/link";
import { connectToDatabase } from "@/lib/db";
import WebsiteContent from "@/models/WebsiteContent";
import { DEFAULT_CMS } from "@/lib/cms-defaults";
import { Shield, FlaskConical, Globe, Clock, CheckCircle } from "lucide-react";

async function getAboutCms() {
  try {
    await connectToDatabase();
    const doc = await WebsiteContent.findOne({ key: "about_details" });
    if (doc) return doc.value;
  } catch (err) {
    console.error("Failed to fetch about cms details:", err);
  }
  return {
    storyTitle: "Our Story",
    storyText: "Reckron Pharma is a small, dedicated pharmaceutical business. We started with a simple goal: to make safe, reliable, and high-quality medicines accessible to our community. We focus on care, using premium certified ingredients, and keeping our operations simple and focused on quality.",
    timeline: [
      { year: "2016", title: "Business Inception", desc: "Started with a focus on quality essential medicine Products." },
      { year: "2019", title: "Expanded Range", desc: "Added essential vitamins and pain relief tablets to our catalog." },
      { year: "2022", title: "Local Trust", desc: "Partnered with local clinics and pharmacies to supply daily care medicines." },
      { year: "2026", title: "Quality First", desc: "Continued commitment to safe packaging and reliable, honest medicine supply." },
    ],
  };
}

export const revalidate = 0;

export default async function AboutPage() {
  const cms = await getAboutCms();
  const aboutBrief = (await WebsiteContent.findOne({ key: "home_about" }))?.value || DEFAULT_CMS.home_about;

  return (
    <div className="flex flex-col w-full fade-in-up">
      {/* Hero Banner */}
      <section className="bg-primary text-white py-20 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight">About Reckron Pharma</h1>
          <p className="text-slate-300 mt-4 max-w-2xl mx-auto leading-relaxed">
            Dedicated to making safe, reliable, and high-quality medicines for our community.
          </p>
        </div>
      </section>

      {/* Story & Philosophy */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Story */}
            <div className="lg:col-span-7 flex flex-col gap-6 text-left">
              <h2 className="text-3xl font-extrabold tracking-tight text-primary">
                {cms.storyTitle}
              </h2>
              <p className="text-slate-600 leading-relaxed text-base">
                {cms.storyText}
              </p>
              <p className="text-slate-600 leading-relaxed text-base">
                We believe that everyone deserves access to dependable healthcare. By remaining a small, focused business, we avoid excessive overhead and focus entirely on sourcing quality ingredients and monitoring every batch.
              </p>

              {/* Quality Standards list */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-blue shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-700">Compliant with WHO-GMP safety guidelines</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-blue shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-700">Carefully sourced premium ingredients</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-blue shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-700">Safe manufacturing and handling practices</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-accent-blue shrink-0 mt-0.5" />
                  <span className="text-sm font-medium text-slate-700">Simple, honest, and reliable supply</span>
                </div>
              </div>
            </div>

            {/* Mission/Vision Box */}
            <div className="lg:col-span-5 p-8 rounded-3xl bg-slate-50 border border-slate-100 flex flex-col gap-8 text-left">
              <div>
                <span className="font-bold text-xs uppercase tracking-wider text-accent-blue">Our Mission</span>
                <p className="text-base text-primary font-semibold mt-2 leading-relaxed">
                  "{aboutBrief.mission}"
                </p>
              </div>
              <div className="pt-6 border-t border-slate-200">
                <span className="font-bold text-xs uppercase tracking-wider text-accent-blue">Our Vision</span>
                <p className="text-base text-primary font-semibold mt-2 leading-relaxed">
                  "{aboutBrief.vision}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-20 bg-slate-50 border-t border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 flex flex-col gap-3">
            <span className="font-bold text-xs uppercase tracking-wider text-accent-blue">Timeline</span>
            <h2 className="text-3xl font-extrabold text-primary">Our Simple Journey</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {cms.timeline.map((event: any, index: number) => (
              <div key={index} className="relative p-6 bg-white border border-slate-100 rounded-2xl flex flex-col gap-3 text-left">
                <div className="absolute -top-4 right-4 bg-accent-blue text-white px-3 py-1 text-xs font-black rounded-lg shadow-sm">
                  {event.year}
                </div>
                <h3 className="font-bold text-primary text-base mt-2">{event.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{event.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-16 bg-slate-100 border-t border-slate-200 text-center">
        <div className="max-w-3xl mx-auto px-4">
          <h3 className="text-2xl font-bold text-primary">Need Product or Ordering Specifications?</h3>
          <p className="text-slate-600 text-sm mt-3">We provide batch certifications and ingredient details upon request for any of our medicines.</p>
          <div className="mt-6 flex justify-center gap-4">
            <Link href="/contact" className="px-6 py-2.5 rounded-xl bg-primary hover:bg-accent-blue text-white font-bold text-sm transition-colors shadow-sm">
              Contact Our Team
            </Link>
            <Link href="/products" className="px-6 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 bg-white text-primary font-bold text-sm transition-colors">
              Explore Products
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
