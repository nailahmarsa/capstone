import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmsans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-dm-sans",
});

export const metadata: Metadata = {
  title: "Pojok Teduh - Find Your Quiet Spot",
  description:
    "Pojok Teduh helps you discover and share the most peaceful, low-noise spots in your urban neighborhood.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${dmsans.variable} h-full antialiased`}>
      <body className={`${dmsans.className} min-h-full flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
