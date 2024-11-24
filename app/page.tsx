import Hero from "@/components/builders/Hero";
import PriceChart from "@/components/builders/PriceChart";
import TokenSwap from "@/components/builders/TokenSwap";
import Image from "next/image";
import React from "react";

const page = () => {
  return (
    <section className="pt-6">
      <Hero />
      <div className="w-full flex items-start justify-center gap-4 my-28">
        <PriceChart />
        <TokenSwap />
      </div>
      <div className="flex flex-col gap-12 items-center justify-center mb-20">
        <h1 className="text-4xl text-center">
          We support only Ethereum and its Layer 2 blockchains.
        </h1>
        <div className="flex items-center gap-20">
          <div className="border border-background_light py-6 px-10 flex flex-col items-center gap-4">
            <Image
              src="/images/ethereum.svg"
              width={100}
              height={100}
              alt="arbitrum"
            />
            <p>Ethereum</p>
          </div>
          <div className="border border-background_light py-6 px-10 flex flex-col items-center gap-4">
            <Image
              src="/images/arbitrum.svg"
              width={100}
              height={100}
              alt="arbitrum"
            />
            <p>Arbitrum</p>
          </div>
          <div className="border border-background_light py-6 px-10 flex flex-col items-center gap-4">
            <Image
              src="/images/optimism.svg"
              width={100}
              height={100}
              alt="optimism"
            />
            <p>Optimism</p>
          </div>
          <div className="border border-background_light py-6 px-10 flex flex-col items-center gap-4">
            <Image
              src="/images/polygon.svg"
              width={100}
              height={100}
              alt="polygon"
            />
            <p>Polygon</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default page;
