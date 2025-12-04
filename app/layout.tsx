import type { Metadata } from 'next'
import { EB_Garamond, Space_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  variable: "--font-heading",
  display: "swap",
});

const spaceMono = Space_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "v0 App",
  description: "Created with v0",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${spaceMono.variable} ${ebGaramond.variable} font-sans antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  );
}
