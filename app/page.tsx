import Hero from "@/components/builders/Hero";
import TokenSwap from "@/components/builders/TokenSwap";
import InfoCard from "@/components/cards/InfoCard";
import Image from "next/image";
import React from "react";
import { FaCoins, FaShieldAlt } from "react-icons/fa";

const page = () => {
  return (
    <section>
      <Hero />
      <div className="mx-auto max-w-6xl flex items-center justify-center gap-24 mt-16 mb-28">
        <div className="w-[47%] flex flex-col gap-8">
          <h1 className="text-4xl font-bold mb-4 text-primary tracking-wider">
            Effortless Token Swaps at Your Fingertips
          </h1>
          <p className="">
            Welcome to the future of decentralized finance. Swap tokens
            effortlessly across multiple blockchains without intermediaries or
            hidden fees. Our platform is designed for speed, transparency, and
            security, empowering you to take control of your digital assets.
            Whether you&apos;re an experienced trader or a DeFi newcomer, our
            user-friendly interface ensures a smooth experience every time.
            Start trading with confidence today—because your assets deserve the
            best.
          </p>
          <div className="flex items-center gap-8">
            <InfoCard
              title="Your Funds, Fully Secure"
              icon={<FaShieldAlt size={40} color="#0C0C0C" className="h-fit" />}
              content="Our platform ensures top-notch security with audited smart
                contracts and decentralized governance."
            />
            <InfoCard
              title="Trade More, Spend Less"
              icon={<FaCoins size={40} color="#0C0C0C" className="h-fit" />}
              content="Enjoy low fees for trades and liquidity provisioning without
                sacrificing speed or reliability."
            />
          </div>
        </div>
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
              width={70}
              height={70}
              alt="arbitrum"
            />
            <p>Ethereum</p>
          </div>
          <div className="border border-background_light py-6 px-10 flex flex-col items-center gap-4">
            <Image
              src="/images/arbitrum.svg"
              width={70}
              height={70}
              alt="arbitrum"
            />
            <p>Arbitrum</p>
          </div>
          <div className="border border-background_light py-6 px-10 flex flex-col items-center gap-4">
            <Image
              src="/images/optimism.svg"
              width={70}
              height={70}
              alt="optimism"
            />
            <p>Optimism</p>
          </div>
          <div className="border border-background_light py-6 px-10 flex flex-col items-center gap-4">
            <Image
              src="/images/polygon.svg"
              width={70}
              height={70}
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
