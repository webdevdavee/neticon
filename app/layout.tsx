import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layouts/Navbar";

const SpaceGrotesk = localFont({
  src: "/fonts/SpaceGrotesk-VariableFont_wght.ttf",
  variable: "--font-SpaceGrotesk",
  weight: "100 200 300 400 500 600 700 800 900",
});

export const metadata: Metadata = {
  title: "Swap Neticon",
  description: "Swap Neticon",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${SpaceGrotesk.variable}`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
