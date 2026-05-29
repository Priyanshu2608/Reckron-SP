"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "@/hooks/useToast";

interface IImageUploadProps {
  value: string[];
  onChange: (urls: string[]) => void;
}

export default function ImageUpload({ value, onChange }: IImageUploadProps) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    toast.info("Uploading image...");

    try {
      const file = files[0];
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const result = await res.json();

      if (res.ok && result.url) {
        onChange([...value, result.url]);
        toast.success("Image uploaded successfully!");
      } else {
        toast.error(result.error || "Failed to upload image");
      }
    } catch (err) {
      console.error("Image upload request failed:", err);
      toast.error("Upload error. Check file size/format.");
    } finally {
      setUploading(false);
      // Reset input value to allow uploading same file again if needed
      e.target.value = "";
    }
  };

  const removeImage = (urlToRemove: string) => {
    onChange(value.filter((url) => url !== urlToRemove));
  };

  return (
    <div className="space-y-3 text-left">
      <label className="text-[10px] font-bold text-slate-500 uppercase">Product Product Images</label>

      {/* Grid of uploaded images + upload button */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {value.map((url, idx) => (
          <div
            key={idx}
            className="relative aspect-square rounded overflow-hidden border border-slate-200 bg-slate-50"
          >
            <Image src={url} alt={`Upload ${idx + 1}`} fill className="object-cover" />

            {/* Delete button overlay */}
            <button
              type="button"
              onClick={() => removeImage(url)}
              className="absolute top-2 right-2 p-1 rounded bg-black/75 hover:bg-black text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}

        {/* Upload box trigger */}
        <label className="relative aspect-square rounded border border-dashed border-slate-300 hover:border-black bg-slate-50 hover:bg-slate-100 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={uploading}
            className="hidden"
          />
          {uploading ? (
            <>
              <Loader2 className="w-6 h-6 text-black animate-spin" />
              <span className="text-[10px] text-slate-400 font-bold uppercase">Uploading...</span>
            </>
          ) : (
            <>
              <Upload className="w-5 h-5 text-slate-400" />
              <span className="text-[10px] text-slate-400 font-bold uppercase">Upload Image</span>
            </>
          )}
        </label>
      </div>
    </div>
  );
}
