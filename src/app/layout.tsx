import type { Metadata } from "next";
import { Geist, Geist_Mono, Montserrat } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Toaster } from "sonner";

// Define Montserrat with all the weights you might need
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Patriot Auto Sales - Buy Cars",
  description: "The trusted platform for buying quality used vehicles",
  icons: {
    icon: [
      { url: "/Screenshot__357_-removebg-preview.png", sizes: "any" },
      { url: "/Screenshot__357_-removebg-preview.png", type: "image/png" },
    ],
    apple: { url: "/apple-icon.png", type: "image/png" },
  },
  manifest: "/site.webmanifest",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="icon"
          href="/Screenshot__357_-removebg-preview.png"
          sizes="any"
        />
        <link rel="apple-touch-icon" href="/apple-icon.png" />
      </head>
      <body className={`${montserrat.variable} font-montserrat antialiased`}>
        <Toaster richColors position="top-center" />
        {children}

        {/* Tawk.to Live Chat Script */}
      </body>
    </html>
  );
}
