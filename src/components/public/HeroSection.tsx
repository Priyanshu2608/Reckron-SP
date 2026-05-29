"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Pill, Award, Shield } from "lucide-react";

interface IHeroProps {
  content: {
    title: string;
    subtitle: string;
    primaryBtnText: string;
    secondaryBtnText: string;
  };
}

export default function HeroSection({ content }: IHeroProps) {
  return (
    <section className="relative overflow-hidden min-block-size-[80dvh] flex items-center bg-white pt-10 pb-16 border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Hero Left Content */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-primary leading-tight"
            >
              {content.title}
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg text-muted leading-relaxed max-w-2xl"
            >
              {content.subtitle}
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center gap-4 mt-2"
            >
              <Link
                href="/products"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-accent-blue hover:bg-primary text-white font-semibold transition-all flex items-center justify-center gap-2 group shadow-sm shadow-accent-blue/10"
              >
                {content.primaryBtnText}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/about"
                className="w-full sm:w-auto px-8 py-3.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 text-primary font-semibold transition-all flex items-center justify-center gap-2"
              >
                {content.secondaryBtnText}
              </Link>
            </motion.div>

            {/* Features Row */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-8 mt-4"
            >
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-accent-blue shrink-0">
                  <Shield className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-700">WHO-GMP Compliant</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-accent-blue shrink-0">
                  <Award className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-700">Quality Tested</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-slate-50 border border-slate-100 flex items-center justify-center text-accent-blue shrink-0">
                  <Pill className="w-4 h-4" />
                </div>
                <span className="text-xs font-semibold text-slate-700">Safe Ingredients</span>
              </div>
            </motion.div>
          </div>

          {/* Hero Right Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 flex items-center justify-center w-full"
          >
            <div className="relative w-full aspect-[816/306] max-w-md  border-slate-100  hover:scale-[1.02] transition-transform duration-300">
              <Image
                src="/reckron-logo.png"
                alt="Reckron SP - Excellence in Pharmaceutical"
                fill
                className="object-cover"
                priority
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
