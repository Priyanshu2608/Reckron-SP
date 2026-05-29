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
    <div className="flex flex-col h-full bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 overflow-hidden group">

      {/* Product Image area */}
      <div className="relative aspect-[4/3] w-full bg-slate-50 flex items-center justify-center overflow-hidden border-b border-slate-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name || "Product Product"}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-slate-400 group-hover:text-accent-blue transition-colors">
            <Pill className="w-12 h-12 rotate-45" />
            <span className="text-xs uppercase font-bold tracking-wider">Product Image</span>
          </div>
        )}

        {/* Featured Tag */}
        {product.featured && (
          <span className="absolute top-4 left-4 px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-wider rounded-lg bg-accent-blue text-white shadow-sm">
            Featured
          </span>
        )}
      </div>

      {/* Product Body */}
      <div className="p-6 flex-1 flex flex-col justify-between gap-4 text-left">
        <div className="flex flex-col gap-2">
          {/* Category */}
          <span className="text-xs font-bold text-accent-blue uppercase tracking-wider">
            {(product.category as any)?.name || "Pharmaceutical"}
          </span>
          {/* Name */}
          <h3 className="font-extrabold text-lg text-slate-900 leading-tight group-hover:text-accent-blue transition-colors">
            {product.name}
          </h3>
          {/* Composition */}
          {product.composition && (
            <p className="text-xs text-slate-500 flex items-start gap-1.5 mt-1">
              <Layers className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
              <span className="line-clamp-2">
                <span className="font-bold">Composition:</span> {product.composition}
              </span>
            </p>
          )}
        </div>

        {/* Action area */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-100 mt-2">
          {product.packaging && (
            <span className="text-xs text-slate-500 font-medium">
              {product.packaging}
            </span>
          )}
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-1.5 font-bold text-xs text-slate-900 group-hover:text-accent-blue transition-colors"
          >
            Details
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </div>

    </div>
  );
}
