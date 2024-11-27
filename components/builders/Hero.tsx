"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import FloatingIllustrations from "./FloatingIllustrations";

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden py-32">
      <FloatingIllustrations />
      <motion.div
        className="flex flex-col gap-8 items-center text-center z-10 relative"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <motion.p
          className="text-sm tracking-wider"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          EXPERIENCE TRUSTLESS TRADING
        </motion.p>
        <div className="flex flex-col gap-2 items-center justify-center">
          <motion.h1
            className="text-4xl sm:text-6xl font-bold text-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Cross-Chain Transactions
          </motion.h1>
          <motion.h1
            className="text-4xl sm:text-6xl font-bold text-shadow-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            Made Easy
          </motion.h1>
        </div>
        <motion.p
          className="text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          Effortless Asset Swaps Across Networks
        </motion.p>
      </motion.div>
      <motion.div
        className="flex items-center justify-center gap-5 mt-16 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
      >
        <Link
          href="/swap"
          className="bg-accent p-3 rounded text-background font-medium hover:bg-accent/90 transition-colors"
        >
          Swap Crypto
        </Link>
        <Link
          href="https://hazee.vercel.app/"
          target="_blank"
          rel="noopener noreferrer"
          className="border border-white p-3 rounded font-medium hover:bg-white/10 transition-colors"
        >
          Buy NFTs
        </Link>
      </motion.div>
      <style jsx global>{`
        .text-shadow-lg {
          text-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        }
      `}</style>
    </section>
  );
};

export default Hero;
