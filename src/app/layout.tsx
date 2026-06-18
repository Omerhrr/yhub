import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Yahya Hub | Coworking Space, Programs & Events",
  description:
    "A vibrant space for ideas, creativity, and collaboration. We offer coworking spaces, run skill-building programs, and host events that inspire innovation across every field.",
  keywords: [
    "Yahya Hub",
    "Coworking",
    "Innovation Hub",
    "Programs",
    "Events",
    "YH Connect",
    "Abuja",
    "Nigeria",
  ],
  icons: {
    icon: "https://firebasestorage.googleapis.com/v0/b/yahyahub-e7643.firebasestorage.app/o/bookings-n-products%2Flogo%2Flogo.svg?alt=media&token=ab0d0a31-9584-43f1-bc95-2a8c66473a8c",
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
        className={`${inter.variable} font-sans antialiased bg-background text-foreground`}
      >
        {children}
        <Toaster position="bottom-right" richColors closeButton />
      </body>
    </html>
  );
}
