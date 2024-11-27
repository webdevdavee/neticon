import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";

const SpaceGrotesk = localFont({
  src: "/fonts/SpaceGrotesk-VariableFont_wght.ttf",
  variable: "--font-SpaceGrotesk",
  weight: "100 200 300 400 500 600 700 800 900",
});

export const metadata: Metadata = {
  title: "Neticon | Swap Crypto Effortlessly",
  description: "Swap Crypto Effortlessly",
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
        <div className="wrapper">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
