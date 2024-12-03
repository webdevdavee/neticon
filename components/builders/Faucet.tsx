"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaFaucet, FaExternalLinkAlt } from "react-icons/fa";

// Mock tokens for faucet
const faucetTokens = [
  {
    symbol: "ETH",
    description: "Ethereum Testnet Token",
    available: 0.5,
    requestable: 0.1,
  },
  {
    symbol: "USDC",
    description: "USD Coin Testnet Token",
    available: 1234.56,
    requestable: 100,
  },
  {
    symbol: "USDT",
    description: "Tether Testnet Token",
    available: 2345.67,
    requestable: 50,
  },
];

const Faucet: React.FC = () => {
  const [requestedTokens, setRequestedTokens] = useState<{
    [key: string]: number;
  }>({});

  const handleTokenRequest = (symbol: string) => {
    setRequestedTokens((prev) => ({
      ...prev,
      [symbol]: (prev[symbol] || 0) + 1,
    }));
  };

  return (
    <div className="container mx-auto px-6 py-12">
      <motion.div
        initial={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        className="bg-white/5 backdrop-blur-sm border border-zinc-800/50 rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="px-6 py-4 bg-zinc-900/30 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-3">
            <FaFaucet className="text-zinc-500" /> Testnet Token Faucet
          </h2>
          <div className="text-zinc-400 text-sm flex items-center gap-2">
            <span>Network:</span>
            <span className="bg-zinc-800 px-2 py-1 rounded-md">
              Sepolia Testnet
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="mb-8 bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-zinc-100 mb-4">
              Faucet Instructions
            </h3>
            <ul className="space-y-2 text-zinc-400">
              <li>1. Select the token you want to request</li>
              <li>2. Click the &quot;Request&quot; button</li>
              <li>3. Tokens will be sent to your connected wallet</li>
              <li>4. Limited to one request per token per session</li>
            </ul>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {faucetTokens.map((token) => (
              <motion.div
                key={token.symbol}
                whileHover={{ scale: 1.05 }}
                className="bg-zinc-900/30 border border-zinc-800/50 rounded-xl p-6 space-y-4"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-bold text-zinc-100">
                    {token.symbol}
                  </h3>
                  <span className="text-zinc-500 text-sm">
                    {token.description}
                  </span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Available:</span>
                    <span className="text-emerald-400">
                      {token.available.toLocaleString()} {token.symbol}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-zinc-400">Request Amount:</span>
                    <span className="text-zinc-300">
                      {token.requestable} {token.symbol}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleTokenRequest(token.symbol)}
                  className="w-full py-3 bg-accent text-background rounded-lg 
                    hover:bg-accent/80 transition-colors duration-300 
                    flex items-center justify-center gap-2"
                >
                  Request {token.symbol}
                  <FaExternalLinkAlt />
                </button>
                {requestedTokens[token.symbol] && (
                  <div className="text-center text-sm text-zinc-500 mt-2">
                    Requested {requestedTokens[token.symbol]} time(s)
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Faucet;
