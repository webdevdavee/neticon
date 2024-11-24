import PriceChart from "@/components/builders/PriceChart";
import TokenSwap from "@/components/builders/TokenSwap";
import React from "react";

const page = () => {
  return (
    <section className="mt-20">
      <div className="w-full flex items-start justify-center gap-4">
        <PriceChart />
        <TokenSwap />
      </div>
    </section>
  );
};

export default page;
