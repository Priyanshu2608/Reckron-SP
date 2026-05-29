"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pill, Mail, Phone, MapPin, Send, ArrowRight } from "lucide-react";
import { IContactInfo } from "@/models/ContactInfo";

export default function Footer() {
  const pathname = usePathname();
  const [contact, setContact] = useState<Partial<IContactInfo>>({
    email: "info@reckronpharma.com",
    phone: "+1 (555) 019-2834",
    address: "100 Innovation Way, Biotech Park, Suite 400",
    socialLinks: {
      facebook: "https://facebook.com",
      linkedin: "https://linkedin.com",
      twitter: "https://twitter",
      youtube: "https://youtube.com",
    },
  });
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Fetch latest contact details dynamically
  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch("/api/admin/contact");
        if (res.ok) {
          const data = await res.json();
          if (data && data.email) {
            setContact(data);
          }
        }
      } catch (err) {
        console.error("Failed to load footer contact info:", err);
      }
    };
    fetchContact();
  }, []);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubscribed(true);
      setNewsletterEmail("");
      setTimeout(() => setSubscribed(false), 5000);
    }
  };

  // Don't show footer on admin routes
  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return null;

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t border-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Company Brief */}
          <div className="flex flex-col gap-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-lg bg-accent-blue flex items-center justify-center text-white">
                <Pill className="w-5 h-5 rotate-45" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">
                Reckron<span className="text-accent-blue">Pharma</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mt-2">
              A family-run local pharmaceutical provider committed to making and supplying good quality medicines.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 mt-4">
              {contact.socialLinks?.facebook && (
                <a
                  href={contact.socialLinks.facebook}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-accent-blue hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>
              )}
              {contact.socialLinks?.linkedin && (
                <a
                  href={contact.socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-accent-blue hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0z" />
                  </svg>
                </a>
              )}
              {contact.socialLinks?.twitter && (
                <a
                  href={contact.socialLinks.twitter}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-accent-blue hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>
              )}
              {contact.socialLinks?.youtube && (
                <a
                  href={contact.socialLinks.youtube}
                  target="_blank"
                  rel="noreferrer"
                  className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center hover:bg-accent-blue hover:text-white transition-colors"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path d="M23.498 6.163a3.003 3.003 0 0 0-2.11-2.11C19.53 3.545 12 3.545 12 3.545s-7.53 0-9.388.508a3.003 3.003 0 0 0-2.11 2.11C0 8.017 0 12 0 12s0 3.983.502 5.837a3.003 3.003 0 0 0 2.11 2.11c1.858.507 9.388.507 9.388.507s7.53 0 9.388-.507a3.003 3.003 0 0 0 2.11-2.11C24 15.983 24 12 24 12s0-3.983-.502-5.837zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="hover:text-accent-blue transition-colors flex items-center gap-1 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /> Home
                </Link>
              </li>
              <li>
                <Link href="/products" className="hover:text-accent-blue transition-colors flex items-center gap-1 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /> Products Catalog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-accent-blue transition-colors flex items-center gap-1 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /> About Company
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-accent-blue transition-colors flex items-center gap-1 group">
                  <ArrowRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" /> Contact Details
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Contact Info</h4>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-accent-blue shrink-0 mt-0.5" />
                <span className="leading-relaxed text-slate-400">{contact.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-accent-blue shrink-0" />
                <a href={`tel:${contact.phone}`} className="hover:text-accent-blue transition-colors text-slate-400">
                  {contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-accent-blue shrink-0" />
                <a href={`mailto:${contact.email}`} className="hover:text-accent-blue transition-colors text-slate-400">
                  {contact.email}
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter section */}
          <div>
            <h4 className="font-semibold text-white mb-5 text-sm uppercase tracking-wider">Newsletter</h4>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Subscribe to stay updated with our latest Products and catalog announcements.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="Enter email..."
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 text-white border border-slate-700 text-sm focus:outline-none focus:border-accent-blue placeholder:text-slate-500"
              />
              <button
                type="submit"
                className="p-2.5 rounded-xl bg-accent-blue text-white hover:bg-blue-700 transition-colors flex items-center justify-center"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
            {subscribed && (
              <p className="text-xs text-accent-blue mt-2 font-medium">Thank you for subscribing!</p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Reckron Pharma Private Limited. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="/admin/login" className="hover:text-accent-blue transition-colors">
              Staff Dashboard
            </Link>
            <a href="#" className="hover:text-accent-blue transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-accent-blue transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
