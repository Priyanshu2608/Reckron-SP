"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pill, Mail, Phone, MapPin, Send, ArrowRight, Loader2 } from "lucide-react";
import { IContactInfo } from "@/models/ContactInfo";

export default function Footer() {
  const pathname = usePathname();
  const [contact, setContact] = useState<Partial<IContactInfo>>({
    email: "info@reckronsp.com",
    phone: "+1 (555) 019-2834w",
    address: "100 Innovation Way, Biotech Park, Suite 400"
  });
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [newsletterSubmitting, setNewsletterSubmitting] = useState(false);
  const [newsletterMsg, setNewsletterMsg] = useState("");

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

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubmitting(true);
    setNewsletterMsg("");
    try {
      const res = await fetch("/api/public/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newsletterEmail }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setSubscribed(true);
        setNewsletterEmail("");
        setNewsletterMsg(data.message || "Thank you for subscribing!");
        setTimeout(() => {
          setSubscribed(false);
          setNewsletterMsg("");
        }, 5000);
      } else {
        setNewsletterMsg(data.error || "Failed to subscribe. Please try again.");
      }
    } catch (err) {
      console.error("Newsletter subscription failed:", err);
      setNewsletterMsg("Network error. Please try again.");
    } finally {
      setNewsletterSubmitting(false);
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
              <span className="font-bold text-lg text-white tracking-tight">
                Reckron<span className="text-accent-blue">SP</span>
              </span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mt-2">
              A pharmaceutical provider committed to making and supplying good quality medicines.
            </p>
            {/* Social Icons */}
           
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
                disabled={newsletterSubmitting}
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-800 text-white border border-slate-700 text-sm focus:outline-none focus:border-accent-blue placeholder:text-slate-500 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={newsletterSubmitting}
                className="p-2.5 rounded-xl bg-accent-blue text-white hover:bg-blue-700 transition-colors flex items-center justify-center disabled:opacity-50"
              >
                {newsletterSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </button>
            </form>
            {newsletterMsg && (
              <p className={`text-xs mt-2 font-medium ${subscribed ? "text-accent-blue" : "text-rose-500"}`}>
                {newsletterMsg}
              </p>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} Reckron SP Private Limited. All rights reserved.</p>
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
