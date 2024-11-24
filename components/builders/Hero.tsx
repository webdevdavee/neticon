import React from "react";
import Link from "next/link";

const Hero = () => {
  return (
    <section className="py-10 flex flex-col items-center justify-center">
      <div className="flex flex-col gap-8 items-center">
        <p>THE NEW STANDARD DECENTRALIZED EXCHANGE PLATFORM</p>
        <div className="flex flex-col gap-2 items-center justify-center">
          <h1 className="text-6xl items-center">Trade decentralized</h1>
          <h1 className="text-6xl items-center">between blockchains</h1>
        </div>
        <p className="text-gray-400">Swap all assets seamlessly</p>
      </div>
      <div className="flex items-center gap-5 mt-16">
        <Link
          href="/swap"
          className="bg-accent p-3 rounded text-background font-medium"
        >
          Swap Crypto
        </Link>
        <Link
          href="https://hazee.vercel.app/"
          target="blank"
          className="border border-white p-3 rounded font-medium"
        >
          Buy NFTs
        </Link>
      </div>
    </section>
  );
};

export default Hero;
