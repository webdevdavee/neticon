"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaExchangeAlt, FaPaintBrush } from "react-icons/fa";
import FloatingIllustrations from "./FloatingIllustrations";

const Hero = () => {
  return (
    <section className="relative min-h-screen overflow-hidden py-32">
      <FloatingIllustrations />
      <div className="bg-white/5 backdrop-blur-sm border border-zinc-800/50 rounded-2xl shadow-2xl overflow-hidden absolute inset-x-8 inset-y-8 opacity-10 z-0" />

      <motion.div
        className="container mx-auto px-6 relative z-10"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="flex flex-col gap-8 items-center text-center">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-2 bg-zinc-900/30 text-zinc-300 rounded-full text-xs tracking-wider"
          >
            EXPERIENCE TRUSTLESS TRADING
          </motion.div>

          <div className="flex flex-col gap-2 items-center justify-center">
            <motion.h1
              className="text-4xl sm:text-6xl font-bold text-zinc-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              Effortless Ethereum Trading
            </motion.h1>
            <motion.h1
              className="text-4xl sm:text-6xl font-bold text-accent"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              Made Easy
            </motion.h1>
          </div>

          <motion.p
            className="text-zinc-400 max-w-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Trade Assets Seamlessly Within the Ethereum Ecosystem
          </motion.p>
        </div>

        <motion.div
          className="flex items-center justify-center gap-5 mt-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <Link
            href="/swap"
            className="flex items-center gap-2 px-6 py-3 bg-accent text-background rounded-lg 
                       hover:bg-accent transition-colors duration-300 
                       group shadow-lg hover:shadow-accent/50"
          >
            <FaExchangeAlt className="group-hover:rotate-180 transition-transform" />
            Swap Crypto
          </Link>
          <Link
            href="https://hazee.vercel.app/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-6 py-3 border border-zinc-700 text-zinc-300 
                       rounded-lg hover:bg-zinc-900/10 transition-colors duration-300 
                       group hover:border-zinc-600"
          >
            <FaPaintBrush className="group-hover:scale-110 transition-transform" />
            Buy NFTs
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
};

export default Hero;
