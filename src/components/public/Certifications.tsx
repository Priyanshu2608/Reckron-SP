"use client";

import { Award, CheckCircle } from "lucide-react";

interface ICertification {
  name: string;
  desc: string;
}

interface ICertificationsProps {
  content: {
    items: ICertification[];
  };
}

export default function Certifications({ content }: ICertificationsProps) {
  return (
    <section className="py-16 bg-slate-50 border-t border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">

          {/* Text Left */}
          <div className="max-w-md text-left flex flex-col gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-accent-blue/10 text-accent-blue flex items-center justify-center">
              <Award className="w-5 h-5" />
            </div>
            <h3 className="font-extrabold text-2xl sm:text-3xl text-slate-900 tracking-tight">
              Quality Certifications & Safety Approvals
            </h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Our operations conform strictly to guidelines and safe Product handling standards.
            </p>
          </div>

          {/* Grid Right */}
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6 w-full">
            {content.items.map((cert, index) => (
              <div
                key={index}
                className="p-5 border border-slate-100 rounded-2xl bg-white flex items-start gap-4 hover:border-accent-blue/30 transition-colors"
              >
                <CheckCircle className="w-5 h-5 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{cert.name}</h4>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1">{cert.desc}</p>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
