import LiquidityPools from "@/components/builders/LiquidityPools";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Neticon liquidity pool",
  description: "Swap Crypto Effortlessly",
};

const page = () => {
  return (
    <section className="min-h-screen">
      <LiquidityPools />
    </section>
  );
};

export default page;
