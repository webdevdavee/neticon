import TokenSwap from "@/components/builders/TokenSwap";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Swap crypto on Neticon",
  description: "Swap Crypto Effortlessly",
};

const page = () => {
  return (
    <section className="my-10 min-h-screen">
      <div className="w-full flex items-center justify-center gap-4 mb-28">
        <TokenSwap />
      </div>
    </section>
  );
};

export default page;
