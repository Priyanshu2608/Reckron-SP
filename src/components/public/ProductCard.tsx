"use client";

import Link from "next/link";
import Image from "next/image";
import { Pill, ArrowRight, Layers } from "lucide-react";
import { IProduct } from "@/models/Product";

interface IProductCardProps {
  product: Partial<IProduct>;
}

export default function ProductCard({ product }: IProductCardProps) {
  // Use first image or a local fallback SVG/icon
  const hasImage = product.images && product.images.length > 0;
  const imageUrl = hasImage ? product.images![0] : null;

  return (
    <Link href={`/products/${product.slug}`} className="block h-full group select-none">
      <div className="flex flex-col h-full bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-slate-100/70 hover:-translate-y-1.5 transition-all duration-300 overflow-hidden">

        {/* Product Image area */}
        <div className="relative aspect-[16/10] w-full bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-100">
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={product.name || "Product Specifications"}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-103 transition-transform duration-700 ease-out"
              loading="lazy"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-accent-blue transition-all duration-300">
              <Pill className="w-10 h-10 rotate-45" />
              <span className="text-[10px] uppercase font-bold tracking-wider">Product Image</span>
            </div>
          )}

          {/* Featured Tag */}
          {product.featured && (
            <span className="absolute top-4 left-4 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider rounded-lg bg-accent-blue text-white shadow-sm z-10">
              Featured
            </span>
          )}
        </div>

        {/* Product Body */}
        <div className="p-6 flex-1 flex flex-col justify-between gap-4 text-left">
          <div className="flex flex-col gap-2">
            {/* Category */}
            <span className="text-[10px] font-extrabold text-accent-blue uppercase tracking-widest">
              {(product.category as any)?.name || "Pharmaceutical"}
            </span>
            {/* Name */}
            <h3 className="font-extrabold text-lg text-slate-900 leading-snug group-hover:text-accent-blue transition-colors duration-250">
              {product.name}
            </h3>
            {/* Composition */}
            {product.composition && (
              <div className="text-xs text-slate-500 flex items-start gap-1.5 mt-1 bg-slate-50/50 p-2.5 rounded-xl border border-slate-100/50">
                <Layers className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                <span className="line-clamp-2 leading-relaxed">
                  <span className="font-bold text-slate-700">Composition:</span> {product.composition}
                </span>
              </div>
            )}
          </div>

          {/* Action area */}
          <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
            {product.packaging ? (
              <span className="text-xs text-slate-400 font-medium tracking-wide">
                {product.packaging}
              </span>
            ) : (
              <span className="text-xs text-slate-300 font-medium">Standard Pack</span>
            )}
            <span className="inline-flex items-center gap-1 font-bold text-xs text-slate-900 group-hover:text-accent-blue transition-colors duration-250">
              Details
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-250" />
            </span>
          </div>
        </div>

      </div>
    </Link>
  );
}
