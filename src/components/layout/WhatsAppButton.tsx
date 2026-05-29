"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { MessageSquare } from "lucide-react";

export default function WhatsAppButton() {
  const pathname = usePathname();
  const [whatsappNumber, setWhatsappNumber] = useState("+15550192834");

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await fetch("/api/admin/contact");
        if (res.ok) {
          const data = await res.json();
          if (data && data.whatsappNumber) {
            // Strip any non-digit characters except "+"
            const cleanNumber = data.whatsappNumber.replace(/[^\d+]/g, "");
            setWhatsappNumber(cleanNumber);
          }
        }
      } catch (err) {
        console.error("WhatsApp button contact fetch failed:", err);
      }
    };
    fetchContact();
  }, []);

  const isAdmin = pathname.startsWith("/admin");
  if (isAdmin) return null;

  const whatsappUrl = `https://wa.me/${whatsappNumber.replace("+", "")}?text=Hello%20Reckron%20Pharma,%20I%20have%20an%20enquiry%20regarding%20your%20products.`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noreferrer"
      className="fixed bottom-6 right-6 z-40 p-4 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg hover:shadow-emerald-500/30 hover:scale-110 transition-all duration-300 flex items-center justify-center cursor-pointer group"
      aria-label="Chat on WhatsApp"
    >
      {/* Icon */}
      <svg
        className="w-6 h-6 fill-current"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.455L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.863-9.755.002-2.607-1.012-5.059-2.859-6.907C16.628 2.097 14.18 1.082 11.578 1.08c-5.441 0-9.867 4.371-9.87 9.76-.001 1.77.462 3.5 1.342 5.025l-.993 3.626 3.73-.977zm12.333-6.98c-.27-.136-1.602-.79-1.84-.877-.24-.087-.414-.13-.589.135-.175.267-.678.851-.83 1.019-.153.168-.306.188-.576.05-2.7-.134-4.52-1.001-5.744-3.1-.301-.515-.301-.826-.06-1.096.217-.244.48-.56.72-.84.24-.28.32-.48.48-.8.16-.32.08-.6-.04-.84-.12-.24-.414-1.019-.589-1.44-.17-.414-.356-.356-.49-.362-.127-.006-.273-.007-.42-.007-.147 0-.385.055-.589.274-.204.22-.779.76-.779 1.85 0 1.09.79 2.145.9 2.293.11.15 1.554 2.37 3.766 3.325.526.227.937.362 1.258.463.528.167 1.008.143 1.388.086.424-.063 1.602-.656 1.83-1.288.229-.633.229-1.176.16-1.287-.068-.11-.247-.197-.517-.332z" />
      </svg>
      {/* Tooltip */}
      <span className="absolute right-16 bg-slate-900 text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-md">
        Chat with us
      </span>
    </a>
  );
}
