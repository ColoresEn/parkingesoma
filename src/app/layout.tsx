import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Providers from "./Providers";
import Navbar from "@/components/navbar/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";
import { DM_Sans, Space_Grotesk } from "next/font/google";
import { TProvider } from "@/providers/toast-provider";

const display = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});
const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-body",
});

export const metadata: Metadata = {
  title: "Murals & Criptos",
  description: "Street art, places and the crypto market in one independent journal.",
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body className={`${display.variable} ${body.variable}`}>
        <Providers>
          <Suspense
            fallback={
              <header className="site-header">
                <div className="site-nav">
                  <Link className="brand-lockup" href="/">
                    <span className="brand-name">Murals &amp; Criptos</span>
                  </Link>
                </div>
              </header>
            }
          >
             <Navbar />
          </Suspense>
         
          <TProvider />
          <Suspense
            fallback={
              <main className="page-frame section-page">
                <p className="empty-state" role="status">Loading the latest from the street...</p>
              </main>
            }
          >
            {children}
          </Suspense>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
