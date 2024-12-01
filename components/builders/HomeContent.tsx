"use client";

import Image from "next/image";
import React from "react";
import TokenSwap from "./TokenSwap";
import { FaCoins, FaShieldAlt } from "react-icons/fa";
import InfoCard from "../cards/InfoCard";
import { motion } from "framer-motion";
import StatsBoard from "./StatsBoard";
import { fadeInUpVariants, supportedChains } from "@/constants";
import DiscoverNFTs from "./DiscoverNFTs";
import TransactionTable from "./TransactionTable";

const HomeContent = () => {
  return (
    <section className="flex flex-col gap-28 py-16">
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
            Effortless Token Swaps on Ethereum
          </motion.h1>
          <motion.p variants={fadeInUpVariants}>
            Welcome to the future of decentralized finance. Swap tokens
            seamlessly within the Ethereum ecosystem without intermediaries or
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

      <div className="bg-white/5 backdrop-blur-sm border border-zinc-800/50 rounded-md shadow-2xl overflow-hidden">
        <div className="px-6 py-12 bg-zinc-900/30">
          <motion.h1
            className="text-xl font-semibold text-zinc-100 text-center"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            variants={fadeInUpVariants}
            custom={0}
          >
            We support only Ethereum and its Layer 2 blockchains.
          </motion.h1>
        </div>

        <div className="grid grid-cols-4 gap-4 p-6">
          {supportedChains.map((chain, index) => (
            <motion.div
              key={chain.name}
              className="flex flex-col items-center justify-center 
                        border border-zinc-800/30 
                        rounded-lg 
                        py-6 
                        hover:bg-zinc-900/10 
                        transition-colors 
                        duration-200"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.3 }}
              variants={fadeInUpVariants}
              custom={index + 1}
            >
              <div className="mb-4">
                <Image
                  src={chain.src}
                  width={70}
                  height={70}
                  alt={chain.alt}
                  className="grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
              <p className="text-sm text-zinc-300 font-medium">{chain.name}</p>
            </motion.div>
          ))}
        </div>
      </div>

      <motion.div
        variants={fadeInUpVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <TransactionTable />
      </motion.div>
    </section>
  );
};

export default HomeContent;
