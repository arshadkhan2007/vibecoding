import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "ImpactBridge - Real Problems. Real People. Real Impact.",
  description: "Discover verified community problems and support fundraisers that solve them.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-[#07090e] text-slate-100 antialiased`}>
        <Navbar />
        <main className="min-h-screen bg-[#07090e] bg-grid-pattern text-slate-100 relative selection:bg-cyan-500/30 selection:text-cyan-200">
          {children}
        </main>
      </body>
    </html>
  );
}
