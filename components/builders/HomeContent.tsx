"use client";

import Image from "next/image";
import React from "react";
import TokenSwap from "./TokenSwap";
import { FaCoins, FaShieldAlt } from "react-icons/fa";
import InfoCard from "../cards/InfoCard";
import { motion } from "framer-motion";
import StatsBoard from "./StatsBoard";
import { fadeInUpVariants } from "@/constants";
import DiscoverNFTs from "./DiscoverNFTs";

const HomeContent = () => {
  return (
    <section className="flex flex-col gap-40 py-16">
      <motion.div
        className="mx-auto max-w-6xl flex items-center justify-center gap-24 "
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUpVariants}
      >
        <div className="w-[47%] flex flex-col gap-8">
          <motion.h1
            className="text-4xl font-bold text-primary tracking-wider"
            variants={fadeInUpVariants}
          >
            Effortless Token Swaps at Your Fingertips
          </motion.h1>
          <motion.p variants={fadeInUpVariants}>
            Welcome to the future of decentralized finance. Swap tokens
            effortlessly across multiple blockchains without intermediaries or
            hidden fees. Our platform is designed for speed, transparency, and
            security, empowering you to take control of your digital assets.
            Whether you&apos;re an experienced trader or a DeFi newcomer, our
            user-friendly interface ensures a smooth experience every time.
            Start trading with confidence today—because your assets deserve the
            best.
          </motion.p>
          <motion.div
            className="flex items-center gap-8"
            variants={fadeInUpVariants}
          >
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
          </motion.div>
        </div>
        <motion.div variants={fadeInUpVariants}>
          <TokenSwap />
        </motion.div>
      </motion.div>
      <motion.div
        variants={fadeInUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <DiscoverNFTs />
      </motion.div>
      <motion.div
        variants={fadeInUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <StatsBoard />
      </motion.div>
      <motion.div
        className="flex flex-col gap-12 items-center justify-center"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        variants={fadeInUpVariants}
      >
        <motion.h1 className="text-4xl text-center" variants={fadeInUpVariants}>
          We support only Ethereum and its Layer 2 blockchains.
        </motion.h1>
        <motion.div
          className="flex items-center gap-20"
          variants={fadeInUpVariants}
        >
          {[
            { src: "/images/ethereum.svg", alt: "ethereum", name: "Ethereum" },
            { src: "/images/arbitrum.svg", alt: "arbitrum", name: "Arbitrum" },
            { src: "/images/optimism.svg", alt: "optimism", name: "Optimism" },
            { src: "/images/polygon.svg", alt: "polygon", name: "Polygon" },
          ].map((chain, index) => (
            <motion.div
              key={chain.name}
              className="border border-background_light py-6 px-10 flex flex-col items-center gap-4"
              variants={fadeInUpVariants}
              custom={index}
              transition={{ delay: index * 0.1 }}
            >
              <Image src={chain.src} width={70} height={70} alt={chain.alt} />
              <p>{chain.name}</p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
};

export default HomeContent;
