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
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        <Navbar />
        <main className="min-h-screen bg-slate-50 bg-grid-pattern text-slate-900 relative selection:bg-blue-500/20 selection:text-blue-900">
          {children}
        </main>
      </body>
    </html>
  );
}
