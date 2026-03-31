import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import SessionProvider from "@/components/auth/SessionProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "HayDebby - Smart Kitchen Appliances | Premium AI-Enhanced Appliances for Nigerian Homes",
  description: "Shop premium smart kitchen appliances at HayDebby. AI-enhanced blenders, microwaves, air fryers, and more for the modern Nigerian kitchen. Free shipping on orders over ₦50,000.",
  keywords: ["HayDebby", "kitchen appliances", "Nigeria", "smart kitchen", "blender", "microwave", "air fryer", "online store"],
  authors: [{ name: "HayDebby" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "HayDebby - Smart Kitchen Appliances",
    description: "Premium appliances, AI-enhanced for your modern Nigerian kitchen",
    siteName: "HayDebby",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HayDebby - Smart Kitchen Appliances",
    description: "Premium appliances, AI-enhanced for your modern Nigerian kitchen",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <SessionProvider>
          {children}
          <Toaster />
        </SessionProvider>
      </body>
    </html>
  );
}
