"use client";

import { motion } from "framer-motion";

interface IStatItem {
  count: string;
  label: string;
}

interface IStatsProps {
  content: {
    items: IStatItem[];
  };
}

export default function StatsSection({ content }: IStatsProps) {
  return (
    <section className="relative py-16 bg-white border-t border-b border-slate-100 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-100">
          {content.items.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col items-center justify-center p-4 first:pt-4 pt-8 lg:pt-4"
            >
              <span className="text-3xl sm:text-4xl lg:text-5xl font-black text-accent-blue">
                {stat.count}
              </span>
              <span className="text-xs sm:text-sm font-semibold text-slate-500 mt-2 uppercase tracking-wider">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
