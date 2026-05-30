import { connectToDatabase } from "@/lib/db";
import ContactInfo from "@/models/ContactInfo";
import EnquiryForm from "@/components/public/EnquiryForm";
import { Mail, Phone, MapPin, Globe, ExternalLink } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Reckron SP for safe and high-quality medicines.",
};

async function getContactInfo() {
  try {
    await connectToDatabase();
    const contact = await ContactInfo.findOne({});
    if (contact) return contact;
  } catch (err) {
    console.error("Failed to load contact info for contact page:", err);
  }
  return {
    email: "info@reckronsp.com",
    phone: "+1 (555) 019-2834",
    address: "Plot 42, Industrial Area Phase 1, Reckron House",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3151.8354345086153!2d-122.39575828468114!3d37.778007979759714!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085807d9f7831d1%3A0xc3fa109ba4a2ff4!2sSan%20Francisco%20Biotech%20Inc!5e0!3m2!1sen!2sus!4v1622244265492!5m2!1sen!2sus",
  };
}

export const revalidate = 0;

export default async function ContactPage() {
  const contact = await getContactInfo();

  return (
    <div className="flex-1 w-full bg-slate-50 py-12 fade-in-up">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Header */}
        <div className="text-left mb-10">
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary">
            Get In Touch
          </h1>
          <p className="text-slate-600 text-sm max-w-xl leading-relaxed mt-2">
            For product availability, packaging sizes, or general enquiries, send us a message or call our team.
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Contact Cards & Map */}
          <div className="lg:col-span-5 flex flex-col gap-6 text-left">
            
            {/* Card Address */}
            <div className="p-6 bg-card border border-slate-200 rounded-3xl shadow-sm flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-primary uppercase tracking-wider">Office Headquarters</h4>
                <p className="text-sm text-slate-600 leading-relaxed mt-2">{contact.address}</p>
              </div>
            </div>

            {/* Card Phone & Email */}
            <div className="p-6 bg-card border border-slate-200 rounded-3xl shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-primary uppercase tracking-wider">Call Support</h4>
                  <a href={`tel:${contact.phone}`} className="text-sm text-slate-600 hover:text-accent-blue transition-colors mt-2 block font-semibold">
                    {contact.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-primary uppercase tracking-wider">Email Inquiry</h4>
                  <a href={`mailto:${contact.email}`} className="text-sm text-slate-600 hover:text-accent-blue transition-colors mt-2 block font-semibold truncate max-w-[150px] sm:max-w-none">
                    {contact.email}
                  </a>
                </div>
              </div>
            </div>

            {/* Google Map Iframe */}
            {contact.mapEmbedUrl && (
              <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden border border-slate-200 shadow-sm relative">
                <iframe
                  src={contact.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  title="Office Map Location"
                />
              </div>
            )}

          </div>

          {/* Right Column: Enquiry Form Card */}
          <div className="lg:col-span-7 bg-card border border-slate-200 rounded-3xl p-6 sm:p-10 shadow-sm">
            <h3 className="font-extrabold text-xl text-primary mb-6">
              Send an Enquiry
            </h3>
            <EnquiryForm />
          </div>

        </div>

      </div>
    </div>
  );
}
