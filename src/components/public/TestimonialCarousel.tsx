"use client";

import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { ITestimonial } from "@/models/Testimonial";

interface ITestimonialCarouselProps {
  testimonials: ITestimonial[];
}

const DEFAULT_TESTIMONIALS = [
  {
    name: "Dr. Catherine Mercer",
    role: "Chief Medical Officer",
    company: "Metro General Hospital",
    content: "Reckron SP has been a trusted supplier of vital Products for our health network for over 5 years. Their batch-to-batch consistency and strict compliance documentation are impeccable.",
    rating: 5,
    avatar: "",
  },
  {
    name: "Dr. Amit Roy",
    role: "Director of Product R&D",
    company: "Biochem Labs UK",
    content: "The stability and bioavailability indices of Reckron's cardiovascular range are outstanding. Their technical dossiers are extremely thorough, which is a rare standard.",
    rating: 5,
    avatar: "",
  },
  {
    name: "Sarah Jenkins",
    role: "Pharmacy Chain Director",
    company: "Apex Meds Group",
    content: "Excellent packaging standards, prompt delivery notifications, and highly responsive support. Their product enquiry portal has streamlined our procurement operations immensely.",
    rating: 5,
    avatar: "",
  },
];

export default function TestimonialCarousel({ testimonials }: ITestimonialCarouselProps) {
  const list = testimonials.length > 0 ? testimonials : (DEFAULT_TESTIMONIALS as any[]);
  const [index, setIndex] = useState(0);

  const prevSlide = () => {
    setIndex((prev) => (prev === 0 ? list.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setIndex((prev) => (prev === list.length - 1 ? 0 : prev + 1));
  };

  // Auto-play interval
  useEffect(() => {
    const timer = setInterval(nextSlide, 8000);
    return () => clearInterval(timer);
  }, [list.length]);

  return (
    <section className="py-20 bg-white border-t border-b border-slate-100 overflow-hidden relative">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">

        {/* Quote Icon */}
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-blue/10 text-accent-blue mb-6">
          <Quote className="w-5 h-5 fill-current" />
        </div>

        {/* Content Slider */}
        <div className="relative min-h-[280px] sm:min-h-[240px] w-full flex items-center justify-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
              className="flex flex-col items-center gap-4 w-full"
            >
              {/* Star Rating */}
              <div className="flex items-center gap-1">
                {Array.from({ length: list[index].rating }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                ))}
              </div>

              {/* Message text */}
              <p className="text-lg sm:text-xl font-medium text-slate-800 italic leading-relaxed max-w-3xl">
                "{list[index].content}"
              </p>

              {/* Author Info */}
              <div className="mt-4">
                <h4 className="font-bold text-slate-900 text-base">
                  {list[index].name}
                </h4>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">
                  {list[index].role} — <span className="text-accent-blue">{list[index].company}</span>
                </p>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sliders Controllers */}
        <div className="flex items-center justify-center gap-6 mt-8">
          <button
            onClick={prevSlide}
            className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-sm hover:scale-105 transition-all"
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          {/* Indicator dots */}
          <div className="flex items-center gap-2">
            {list.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`w-2.5 h-2.5 rounded-full transition-all ${index === i ? "bg-accent-blue w-6" : "bg-slate-300"
                  }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>

          <button
            onClick={nextSlide}
            className="p-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-800 shadow-sm hover:scale-105 transition-all"
            aria-label="Next testimonial"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

      </div>
    </section>
  );
}
