import { motion } from "framer-motion";
import React from "react";
import { FaWallet, FaShoppingCart, FaRocket } from "react-icons/fa";
import Link from "next/link";

const DiscoverNFTs = () => {
  return (
    <div
      className="min-h-screen bg-gradient-to-br from-black via-purple-900 to-black 
      text-white overflow-hidden relative rounded-md"
    >
      {/* Animated Background Elements */}
      <motion.div
        className="absolute top-0 left-0 w-full h-full opacity-20 
          bg-gradient-to-r from-purple-500 to-blue-500 
          animate-pulse"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.2 }}
        transition={{
          duration: 3,
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

      {/* Header */}
      <header className="relative z-10 p-6 flex justify-between items-center">
        <motion.h1
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold"
        >
          Explore our NFT marketplace
        </motion.h1>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-16 grid md:grid-cols-2 gap-12 relative z-10">
        {/* Left Side - Hero Content */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.7 }}
          className="space-y-6 self-center"
        >
          <h1 className="text-4xl font-extrabold leading-tight">
            Transform Your Digital
            <br />
            <span
              className="text-transparent bg-clip-text 
              bg-gradient-to-r from-purple-500 to-blue-500"
            >
              Asset Experience
            </span>
          </h1>
          <p className="text-lg text-gray-300 mb-8">
            Unlock the potential of digital ownership. Seamlessly navigate the
            world of blockchain-powered assets with our intuitive platform.
          </p>
          <div className="flex space-x-4">
            <Link
              href="https://hazee.vercel.app"
              target="blank"
              className="bg-purple-600 hover:bg-purple-700 
                text-white px-8 py-3 rounded-full 
                flex items-center space-x-2 transition-all duration-300 hover:scale-[1.05] hover:duration-300 hover:transition-all"
            >
              <FaRocket />
              <span>Start Exploring</span>
            </Link>
          </div>
        </motion.div>

        {/* Right Side - Animated Graphic Placeholder */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 2 }}
          className="flex items-center justify-center"
        >
          <motion.svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 400 400"
            className="w-full max-w-md h-96"
            animate={{
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "loop",
              ease: "easeInOut",
            }}
          >
            {/* Gradient Definitions */}
            <defs>
              <linearGradient
                id="nftGradient1"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#8A4FFF" stopOpacity="1" />
                <stop offset="100%" stopColor="#3CABFF" stopOpacity="1" />
              </linearGradient>
              <linearGradient
                id="nftGradient2"
                x1="0%"
                y1="0%"
                x2="100%"
                y2="100%"
              >
                <stop offset="0%" stopColor="#dafb54" stopOpacity="1" />
                <stop offset="100%" stopColor="#dafb54" stopOpacity="1" />
              </linearGradient>
            </defs>

            {/* Multiple NFT Tokens/Cards */}
            <g transform="translate(200, 200)">
              {/* First NFT Token */}
              <g transform="translate(-100, -50) rotate(-10)">
                <rect
                  x="-60"
                  y="-80"
                  width="120"
                  height="160"
                  rx="15"
                  fill="url(#nftGradient1)"
                  opacity="0.9"
                />
                <circle cx="0" cy="-130" r="20" fill="#FFFFFF" opacity="0.7" />
              </g>

              {/* Second NFT Token */}
              <g transform="translate(100, 50) rotate(10)">
                <rect
                  x="-60"
                  y="-80"
                  width="120"
                  height="160"
                  rx="15"
                  fill="url(#nftGradient2)"
                  opacity="0.9"
                />
                <circle cx="0" cy="-130" r="20" fill="#FFFFFF" opacity="0.7" />
              </g>

              {/* Connecting Elements */}
              <line
                x1="-50"
                y1="0"
                x2="50"
                y2="0"
                stroke="white"
                strokeWidth="3"
                strokeDasharray="10 5"
                opacity="0.4"
              />
            </g>
          </motion.svg>
        </motion.div>
      </main>

      {/* Features Section */}
      <section className="container mx-auto px-6 py-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="grid md:grid-cols-3 gap-8"
        >
          <div className="bg-white/10 p-8 rounded-2xl">
            <FaWallet className="mx-auto text-5xl text-purple-500 mb-4" />
            <h3 className="text-xl font-bold mb-3">Secure Assets</h3>
            <p className="text-gray-300 text-sm">
              Advanced security protocols to protect your digital investments.
            </p>
          </div>
          <div className="bg-white/10 p-8 rounded-2xl">
            <FaShoppingCart className="mx-auto text-5xl text-blue-500 mb-4" />
            <h3 className="text-xl font-bold mb-3">Seamless Trading</h3>
            <p className="text-gray-300 text-sm">
              Intuitive platform for effortless digital asset transactions.
            </p>
          </div>
          <div className="bg-white/10 p-8 rounded-2xl">
            <FaRocket className="mx-auto text-5xl text-green-500 mb-4" />
            <h3 className="text-xl font-bold mb-3">Fast Onboarding</h3>
            <p className="text-gray-300 text-sm">
              Get started quickly with our user-friendly interface.
            </p>
          </div>
        </motion.div>
      </section>
    </div>
  );
};

export default DiscoverNFTs;
