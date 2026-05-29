"use client";

import { useToast, IToast } from "@/hooks/useToast";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, AlertCircle, Info, X } from "lucide-react";

export default function ToastContainer() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map((t) => (
          <ToastItem key={t.id} toast={t} onClose={() => dismiss(t.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
}

function ToastItem({ toast, onClose }: { toast: IToast; onClose: () => void }) {
  const isSuccess = toast.type === "success";
  const isError = toast.type === "error";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 15, scale: 0.95 }}
      transition={{ duration: 0.25, ease: "easeOut" }}
      className="pointer-events-auto flex items-start gap-3 p-4 rounded-xl shadow-lg border glass"
      style={{
        borderColor: isSuccess
          ? "rgba(16, 185, 129, 0.4)"
          : isError
          ? "rgba(239, 68, 68, 0.4)"
          : "rgba(59, 130, 246, 0.4)",
      }}
    >
      <div className="mt-0.5">
        {isSuccess && <CheckCircle className="w-5 h-5 text-emerald-500" />}
        {isError && <AlertCircle className="w-5 h-5 text-rose-500" />}
        {!isSuccess && !isError && <Info className="w-5 h-5 text-blue-500" />}
      </div>

      <div className="flex-1 text-sm font-medium text-slate-800 dark:text-slate-200">
        {toast.message}
      </div>

      <button
        onClick={onClose}
        className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
