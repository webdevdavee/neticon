"use client";
"use client";

import React, { useState } from "react";
import {
  FaPlus,
  FaCoins,
  FaWallet,
  FaExchangeAlt,
  FaPercentage,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useToast } from "@/context/ToastProvider";

interface NewPoolData {
  token1: string;
  token2: string;
  initialLiquidity1: number;
  initialLiquidity2: number;
  initialApr: number;
}

const AddPool: React.FC = () => {
  const { addToast } = useToast();
  const [poolData, setPoolData] = useState<NewPoolData>({
    token1: "",
    token2: "",
    initialLiquidity1: 0,
    initialLiquidity2: 0,
    initialApr: 0,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof NewPoolData
  ) => {
    setPoolData({
      ...poolData,
      [field]: e.target.value,
    });
  };

  const validatePoolData = (): boolean => {
    const { token1, token2, initialLiquidity1, initialLiquidity2, initialApr } =
      poolData;

    if (!token1 || !token2) {
      addToast("Token symbols are required", "error");
      return false;
    }

    if (token1 === token2) {
      addToast("Tokens must be different", "error");
      return false;
    }

    if (initialLiquidity1 <= 0 || initialLiquidity2 <= 0) {
      addToast("Initial liquidity must be greater than zero", "error");
      return false;
    }

    if (initialApr < 0 || initialApr > 100) {
      addToast("APR must be between 0 and 100", "error");
      return false;
    }

    return true;
  };

  const handleCreatePool = () => {
    if (validatePoolData()) {
      // Simulated pool creation logic
      console.log("Creating pool:", poolData);
      addToast(
        `${poolData.token1}/${poolData.token2} pool created successfully!`,
        "success"
      );
      // Reset form or navigate
      setPoolData({
        token1: "",
        token2: "",
        initialLiquidity1: 0,
        initialLiquidity2: 0,
        initialApr: 0,
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white/5 backdrop-blur-sm border border-zinc-800/50 rounded-2xl shadow-2xl p-8"
      >
        <h2 className="text-2xl font-bold mb-6 text-zinc-100 flex items-center">
          <FaExchangeAlt className="mr-3 text-zinc-400" /> Create New Liquidity
          Pool
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="flex items-center bg-zinc-900/30 rounded-lg p-3">
              <FaCoins className="mr-3 text-zinc-500" />
              <input
                type="text"
                placeholder="First Token Symbol (e.g., ETH)"
                value={poolData.token1}
                onChange={(e) => handleInputChange(e, "token1")}
                className="bg-transparent text-zinc-200 w-full outline-none"
              />
            </div>

            <div className="flex items-center bg-zinc-900/30 rounded-lg p-3">
              <FaCoins className="mr-3 text-zinc-500" />
              <input
                type="text"
                placeholder="Second Token Symbol (e.g., USDC)"
                value={poolData.token2}
                onChange={(e) => handleInputChange(e, "token2")}
                className="bg-transparent text-zinc-200 w-full outline-none"
              />
            </div>

            <div className="flex items-center bg-zinc-900/30 rounded-lg p-3">
              <FaWallet className="mr-3 text-zinc-500" />
              <input
                type="number"
                placeholder={`Initial ${poolData.token1 || "Token1"} Liquidity`}
                value={poolData.initialLiquidity1 || ""}
                onChange={(e) => handleInputChange(e, "initialLiquidity1")}
                className="bg-transparent text-zinc-200 w-full outline-none"
              />
            </div>

            <div className="flex items-center bg-zinc-900/30 rounded-lg p-3">
              <FaWallet className="mr-3 text-zinc-500" />
              <input
                type="number"
                placeholder={`Initial ${poolData.token2 || "Token2"} Liquidity`}
                value={poolData.initialLiquidity2 || ""}
                onChange={(e) => handleInputChange(e, "initialLiquidity2")}
                className="bg-transparent text-zinc-200 w-full outline-none"
              />
            </div>

            <div className="flex items-center bg-zinc-900/30 rounded-lg p-3">
              <FaPercentage className="mr-3 text-zinc-500" />
              <input
                type="number"
                placeholder="Initial APR (%)"
                value={poolData.initialApr || ""}
                onChange={(e) => handleInputChange(e, "initialApr")}
                className="bg-transparent text-zinc-200 w-full outline-none"
              />
            </div>
          </div>

          <div className="space-y-4 bg-zinc-900/20 p-6 rounded-lg">
            <h3 className="text-xl font-semibold text-zinc-300 mb-4">
              Pool Creation Guidelines
            </h3>
            <ul className="text-zinc-500 space-y-2">
              <li>✓ Tokens must be different</li>
              <li>✓ Initial liquidity required for both tokens</li>
              <li>✓ APR must be a valid percentage</li>
              <li>✓ Verify token availability and compatibility</li>
            </ul>
          </div>
        </div>

        <button
          onClick={handleCreatePool}
          className="w-full mt-6 bg-emerald-600 text-white py-3 rounded-lg 
          hover:bg-emerald-700 transition-colors flex items-center justify-center"
        >
          <FaPlus className="mr-2" /> Create Liquidity Pool
        </button>
      </motion.div>
    </div>
  );
};

export default AddPool;
