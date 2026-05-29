"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Pill, ShieldAlert, Loader2, Lock } from "lucide-react";
import { toast } from "@/hooks/useToast";

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async (data: any) => {
    setLoading(true);
    setErrorMsg("");
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Login successful! Welcome to the admin dashboard.");
        // Redirect to dashboard
        router.push("/admin/dashboard");
        router.refresh();
      } else {
        setErrorMsg(result.error || "Invalid username or password");
        toast.error(result.error || "Authentication failed");
      }
    } catch (err) {
      console.error("Login submission error:", err);
      setErrorMsg("Network error. Please check your database connection.");
      toast.error("Network error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 min-h-screen flex items-center justify-center bg-slate-100 px-4">

      {/* Login Card */}
      <div className="w-full max-w-sm p-8 rounded bg-white border border-slate-200 text-left">
        
        {/* Logo / Header */}
        <div className="flex flex-col items-center gap-2 text-center mb-8">
          <div className="w-10 h-10 rounded bg-black flex items-center justify-center text-white">
            <Pill className="w-5 h-5 rotate-45" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 tracking-tight">Reckron Staff Desk</h2>
          <p className="text-slate-500 text-[10px] uppercase tracking-wider font-semibold">Authorized Admin Access Only</p>
        </div>

        {/* Global Error Banner */}
        {errorMsg && (
          <div className="p-3 mb-6 rounded border border-rose-200 bg-rose-50 text-rose-700 text-xs font-semibold flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Username */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Username</label>
            <input
              type="text"
              required
              placeholder="Enter admin username"
              {...register("username", { required: "Username is required" })}
              className={`px-3 py-2 rounded border bg-white text-slate-900 text-sm focus:outline-none focus:border-black focus:ring-0 ${
                errors.username ? "border-rose-500" : "border-slate-200"
              }`}
            />
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold text-slate-500 uppercase">Password</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              {...register("password", { required: "Password is required" })}
              className={`px-3 py-2 rounded border bg-white text-slate-900 text-sm focus:outline-none focus:border-black focus:ring-0 ${
                errors.password ? "border-rose-500" : "border-slate-200"
              }`}
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded bg-black hover:bg-slate-800 text-white font-bold text-sm cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="w-4.5 h-4.5 animate-spin" /> Authenticating...
              </>
            ) : (
              <>
                <Lock className="w-4 h-4" /> Unlock Dashboard
              </>
            )}
          </button>

        </form>

        {/* Footer info */}
        <div className="text-center mt-6 pt-5 border-t border-slate-100">
          <a href="/" className="text-xs text-slate-500 hover:text-black transition-colors">
            Return to Client Website
          </a>
        </div>

      </div>
    </div>
  );
}
