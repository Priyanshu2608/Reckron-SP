import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import ToastContainer from "@/components/ui/ToastContainer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Reckron Pharma | Innovations in Global Healthcare",
    template: "%s | Reckron Pharma",
  },
  description:
    "Reckron Pharma is a premium pharmaceutical company specializing in high-quality therapeutic Products, manufacturing excellence, and global healthcare solutions.",
  keywords: ["pharmaceutical", "medicine", "healthcare", "therapeutics", "Products", "reckron"],
  authors: [{ name: "Reckron Pharma" }],
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  openGraph: {
    title: "Reckron Pharma | Innovations in Global Healthcare",
    description:
      "Reckron Pharma is a premium pharmaceutical company specializing in high-quality therapeutic Products, manufacturing excellence, and global healthcare solutions.",
    url: "/",
    siteName: "Reckron Pharma",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Reckron Pharma",
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
        <Navbar />
        <main className="flex-1 w-full flex flex-col">{children}</main>
        <Footer />
        <WhatsAppButton />
        <ToastContainer />
      </body>
    </html>
  );
}
