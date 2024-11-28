import React from "react";
import { motion } from "framer-motion";
import { FaRocket } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";

const DiscoverNFTs = () => {
  return (
    <div className="min-h-screen bg-background_light text-white overflow-hidden relative">
      {/* Layered Background with Artistic Elements */}
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1440 810"
          preserveAspectRatio="xMinYMin slice"
          className="absolute w-full h-full"
        >
          <defs>
            <linearGradient
              id="artBackground"
              x1="0%"
              y1="0%"
              x2="100%"
              y2="100%"
            >
              <stop offset="0%" stopColor="rgba(39, 39, 42, 0.3)" />
              <stop offset="100%" stopColor="rgba(24, 24, 27, 0.6)" />
            </linearGradient>
          </defs>
          <path
            d="M0,288L48,272C96,256,192,224,288,197.3C384,171,480,149,576,165.3C672,181,768,235,864,261.3C960,288,1056,288,1152,266.7C1248,245,1344,203,1392,181.3L1440,160L1440,0L1392,0C1344,0,1248,0,1152,0C1056,0,960,0,864,0C768,0,672,0,576,0C480,0,384,0,288,0C192,0,96,0,48,0L0,0Z"
            fill="url(#artBackground)"
          />
        </svg>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-6 py-16 relative z-10 grid md:grid-cols-2 gap-12 min-h-screen items-center">
        {/* Left Content */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-8"
        >
          <div className="overflow-hidden">
            <motion.h1
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="text-5xl font-bold mb-6 text-zinc-100"
            >
              Digital Art <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-400 to-zinc-600">
                Reimagined
              </span>
            </motion.h1>
          </div>

          <p className="text-zinc-400 text-lg mb-8 leading-relaxed">
            Transform your digital art experience with our cutting-edge NFT
            platform. Discover, collect, and trade unique digital masterpieces
            that push the boundaries of creativity and blockchain technology.
          </p>

          <div className="flex space-x-6">
            <Link
              href="#"
              className="group flex items-center gap-3 px-8 py-3 bg-zinc-700 hover:bg-accent rounded-full text-white hover:text-background_light transition-all duration-300 hover:scale-105 shadow-lg hover:shadow-xl"
            >
              <FaRocket className="text-zinc-300 transition-colors duration-300 group-hover:text-background_light" />
              <span>Explore Collection</span>
            </Link>
          </div>
        </motion.div>

        {/* Right Content - Artistic NFT Representation */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="flex items-center justify-center"
        >
          <motion.div
            className="w-full max-w-md aspect-square relative"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.02, 1],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          >
            {/* First layer - back */}
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-900 rounded-3xl shadow-2xl transform -rotate-6" />

            {/* Second layer - middle */}
            <div className="absolute inset-0 bg-gradient-to-tr from-zinc-600 to-zinc-800 rounded-3xl shadow-2xl transform rotate-6" />

            {/* Third layer - front */}
            <div className="absolute inset-4 bg-gradient-to-bl from-zinc-500 to-zinc-900 rounded-2xl shadow-2xl opacity-80" />

            {/* Images with staggered positioning */}
            <Image
              className="absolute top-0 left-0 w-full h-full object-cover rounded-3xl opacity-80 transform -rotate-3 origin-center"
              src="/images/nftshowcase (1).webp"
              fill
              alt="NFT Showcase 1"
            />
            <Image
              className="absolute top-2 left-2 w-full h-full object-cover rounded-3xl opacity-70 transform rotate-3 origin-center"
              src="/images/nftshowcase (2).webp"
              fill
              alt="NFT Showcase 2"
            />
            <Image
              className="absolute top-4 left-4 w-full h-full object-cover rounded-3xl opacity-100 transform -rotate-2 origin-center"
              src="/images/nftshowcase (3).webp"
              fill
              alt="NFT Showcase 3"
            />
          </motion.div>
        </motion.div>
      </div>

      {/* Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-zinc-700 to-accent opacity-50" />
    </div>
  );
};

export default DiscoverNFTs;
