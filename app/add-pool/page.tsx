import AddLiquidityPool from "@/components/builders/AddPool";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Create a liquidity pool on Neticon",
  description: "Swap Crypto Effortlessly",
};

const page = () => {
  return (
    <section className="min-h-screen">
      <AddLiquidityPool />
    </section>
  );
};

export default page;
