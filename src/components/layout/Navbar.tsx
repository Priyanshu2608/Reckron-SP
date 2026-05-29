"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, Pill, ShieldCheck } from "lucide-react";

const navLinks = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Don't show public navbar on admin pages
  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return null;

  return (
    <header className="sticky top-0 z-40 w-full bg-white border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            
            <span className="font-bold text-xl text-primary tracking-tight">
              Reckron<span className="text-accent-blue">SP</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-semibold transition-colors relative py-1 ${
                    isActive
                      ? "text-accent-blue"
                      : "text-slate-600 hover:text-primary"
                  }`}
                >
                  {link.name}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavBorder"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent-blue rounded-full"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              href="/admin/login"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              title="Admin Portal"
            >
              <ShieldCheck className="w-5 h-5" />
            </Link>
            <Link
              href="/contact"
              className="px-5 py-2 rounded-xl bg-primary text-white hover:bg-accent-blue hover:shadow-lg hover:shadow-accent-blue/10 transition-all font-semibold text-sm"
            >
              Enquire Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-b border-slate-100 overflow-hidden"
          >
            <div className="px-4 pt-2 pb-6 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`block px-3 py-2 rounded-xl text-base font-semibold transition-colors ${
                    pathname === link.href
                      ? "bg-slate-50 text-accent-blue"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-slate-100 flex flex-col gap-3">
                <Link
                  href="/admin/login"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors font-semibold text-sm"
                >
                  <ShieldCheck className="w-4 h-4" /> Admin Login
                </Link>
                <Link
                  href="/contact"
                  onClick={() => setIsOpen(false)}
                  className="w-full text-center px-4 py-2.5 rounded-xl bg-primary text-white hover:bg-accent-blue transition-colors font-semibold text-sm shadow-sm"
                >
                  Enquire Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
