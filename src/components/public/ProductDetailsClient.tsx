"use client";

import { useState } from "react";
import Image from "next/image";
import { Pill, FileText, Send, CheckCircle2, ChevronRight, Bookmark } from "lucide-react";
import { IProduct } from "@/models/Product";
import Modal from "@/components/ui/Modal";
import EnquiryForm from "./EnquiryForm";
import { toast } from "@/hooks/useToast";

interface IProductDetailsClientProps {
  product: IProduct;
}

export default function ProductDetailsClient({ product }: IProductDetailsClientProps) {
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const images = product.images && product.images.length > 0 ? product.images : [];
  const hasImages = images.length > 0;

  const handleDownloadBrochure = () => {
    setDownloading(true);
    toast.info("Preparing product specifications dossier...");

    setTimeout(() => {
      // Simulate file download
      const element = document.createElement("a");
      const file = new Blob([
        `Reckron Pharma Product Specification Sheet\n\n` +
        `Product Name: ${product.name}\n` +
        `Composition: ${product.composition}\n` +
        `Packaging: ${product.packaging}\n` +
        `Dosage: ${product.dosage}\n` +
        `Benefits:\n${product.benefits.map((b) => `- ${b}`).join("\n")}\n\n` +
        `Quality Compliance: WHO-GMP Certified.`
      ], { type: "text/plain" });

      element.href = URL.createObjectURL(file);
      element.download = `${product.slug}-specifications.txt`;
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);

      setDownloading(false);
      toast.success("Specification sheet downloaded successfully!");
    }, 1500);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start text-left">

      {/* 1. Left Side: Images Gallery */}
      <div className="lg:col-span-5 flex flex-col gap-4">
        {/* Main large image */}
        <div className="relative aspect-square w-full bg-slate-100 dark:bg-slate-900 border border-border rounded-3xl overflow-hidden shadow-sm flex items-center justify-center">
          {hasImages ? (
            <Image
              src={images[activeImageIdx]}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-400 dark:text-slate-600">
              <Pill className="w-16 h-16 rotate-45 text-slate-300 dark:text-slate-700" />
              <span className="text-xs uppercase font-bold tracking-wider">No Image Available</span>
            </div>
          )}
        </div>

        {/* Thumbnails row */}
        {hasImages && images.length > 1 && (
          <div className="flex items-center gap-3 overflow-x-auto py-1">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIdx(idx)}
                className={`relative w-20 h-20 rounded-xl overflow-hidden border-2 bg-slate-50 transition-all shrink-0 cursor-pointer ${activeImageIdx === idx ? "border-accent-blue scale-95" : "border-border hover:border-slate-400"
                  }`}
              >
                <Image
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* 2. Right Side: Product Details info */}
      <div className="lg:col-span-7 flex flex-col gap-6">

        {/* Title, Category & Status */}
        <div className="flex flex-col gap-2">
          <span className="text-sm font-bold text-accent-blue uppercase tracking-wider">
            {(product.category as any)?.name || "Pharmaceutical"}
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-primary dark:text-white leading-tight">
            {product.name}
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
              Active Stock Supply
            </span>
            {product.packaging && (
              <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider">
                Packaging: {product.packaging}
              </span>
            )}
          </div>
        </div>

        {/* Composition block */}
        <div className="p-5 border border-border bg-slate-50 dark:bg-slate-900 rounded-2xl flex flex-col gap-2 shadow-sm">
          <h4 className="font-extrabold text-sm text-primary dark:text-slate-200 uppercase tracking-wider">Active Chemical Composition</h4>
          <p className="text-sm text-slate-700 dark:text-slate-300 font-mono leading-relaxed">{product.composition}</p>
        </div>

        {/* Description */}
        <div className="flex flex-col gap-2">
          <h4 className="font-extrabold text-sm text-primary dark:text-slate-200 uppercase tracking-wider">Product Description</h4>
          <p className="text-sm text-muted leading-relaxed whitespace-pre-wrap">{product.description}</p>
        </div>

        {/* Dosage & Administration */}
        {product.dosage && (
          <div className="flex flex-col gap-2">
            <h4 className="font-extrabold text-sm text-primary dark:text-slate-200 uppercase tracking-wider">Dosage & Administration</h4>
            <p className="text-sm text-muted leading-relaxed bg-slate-50 dark:bg-slate-900/40 p-4 border border-border/80 rounded-2xl">{product.dosage}</p>
          </div>
        )}

        {/* Key Benefits */}
        {product.benefits && product.benefits.length > 0 && (
          <div className="flex flex-col gap-3">
            <h4 className="font-extrabold text-sm text-primary dark:text-slate-200 uppercase tracking-wider">Clinical Benefits & Indications</h4>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {product.benefits.map((benefit, idx) => (
                <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-700 dark:text-slate-300">
                  <ChevronRight className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" />
                  <span>{benefit}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 pt-6 border-t border-border/60 mt-4">
          <button
            onClick={() => setIsEnquiryOpen(true)}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-accent-blue hover:bg-primary text-white font-bold transition-all shadow-md shadow-accent-blue/15 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Send className="w-4.5 h-4.5" /> Submit Stock Enquiry
          </button>

          <button
            onClick={handleDownloadBrochure}
            disabled={downloading}
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl border border-border bg-card hover:bg-slate-50 dark:hover:bg-slate-800 text-primary dark:text-slate-200 font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <FileText className="w-4.5 h-4.5" />
            {downloading ? "Downloading..." : "Download Spec Dossier"}
          </button>
        </div>

      </div>

      {/* Enquiry Modal */}
      <Modal
        isOpen={isEnquiryOpen}
        onClose={() => setIsEnquiryOpen(false)}
        title={`Inquire about: ${product.name}`}
        size="md"
      >
        <EnquiryForm
          preselectedProduct={product.name}
          onSuccess={() => {
            setTimeout(() => setIsEnquiryOpen(false), 2000);
          }}
        />
      </Modal>

    </div>
  );
}
