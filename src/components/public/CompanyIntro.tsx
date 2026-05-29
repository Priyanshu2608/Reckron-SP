"use client";

import Link from "next/link";
import { ArrowRight, Eye, Target } from "lucide-react";

interface ICompanyIntroProps {
  content: {
    tag: string;
    title: string;
    description: string;
    mission: string;
    vision: string;
    experienceYears: number;
  };
}

export default function CompanyIntro({ content }: ICompanyIntroProps) {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

          {/* Left Grid: Experience Counter & Mission/Vision Cards */}
          <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6">

            {/* Experience Box */}
            <div className="p-8 rounded-2xl bg-slate-900 text-white shadow-sm flex flex-col justify-center relative overflow-hidden">
              <span className="text-6xl font-black tracking-tight">{content.experienceYears}+</span>
              <span className="font-semibold text-lg mt-2 text-slate-100">Years of Care</span>
              <p className="text-sm text-slate-300 mt-2">
                Making safe, reliable, and high-quality medicines for our customers.
              </p>
            </div>

            {/* Mission & Vision Box */}
            <div className="flex flex-col gap-6">

              {/* Mission */}
              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center shrink-0">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-primary mb-1">Our Mission</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{content.mission}</p>
                </div>
              </div>

              {/* Vision */}
              <div className="p-6 rounded-2xl border border-slate-100 bg-slate-50 shadow-sm flex items-start gap-4 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center shrink-0">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-primary mb-1">Our Vision</h4>
                  <p className="text-xs text-slate-600 leading-relaxed">{content.vision}</p>
                </div>
              </div>

            </div>
          </div>

          {/* Right Grid: Introduction Prose */}
          <div className="lg:col-span-7 flex flex-col gap-6 text-left">
            <span className="font-bold text-xs uppercase tracking-wider text-accent-blue">
              {content.tag}
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-primary leading-tight">
              {content.title}
            </h2>
            <p className="text-slate-600 leading-relaxed text-base">
              {content.description}
            </p>
            <p className="text-slate-600 leading-relaxed text-base">
              We focus on what matters most: producing dependable Products using high-quality ingredients. As a small business, we pride ourselves on being accessible, honest, and completely committed to safety and care in everything we make.
            </p>

            <div className="mt-4">
              <Link
                href="/about"
                className="inline-flex items-center gap-2 font-bold text-sm text-accent-blue hover:text-primary transition-colors group"
              >
                Read our story
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
