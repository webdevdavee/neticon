import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const electrolize = localFont({
  src: "/fonts/Electrolize-Regular.ttf",
  variable: "--font-electrolize",
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
      <body className={`${electrolize.variable}`}>{children}</body>
    </html>
  );
}
