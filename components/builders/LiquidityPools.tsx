"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FaWater,
  FaCoins,
  FaPercentage,
  FaChartLine,
  FaPlus,
  FaWallet,
  FaExchangeAlt,
  FaTimes,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

import { formatCurrency, calculatePoolShare } from "@/libs/utils";
import { DepositAmounts, LiquidityPool, Token } from "@/types";

// Mock Liquidity Pool Data
const mockLiquidityPools: LiquidityPool[] = [
  {
    id: "1",
    pair: "ETH/USDC",
    totalValueLocked: 1245678.89,
    apr: 12.45,
    volume24h: 345678.23,
    myLiquidity: 5678.9,
    tokens: {
      token1: { symbol: "ETH", amount: 25.67 },
      token2: { symbol: "USDC", amount: 45678.9 },
    },
  },
  {
    id: "2",
    pair: "USDT/DAI",
    totalValueLocked: 987654.56,
    apr: 8.75,
    volume24h: 234567.12,
    myLiquidity: 3456.78,
    tokens: {
      token1: { symbol: "USDT", amount: 45678.9 },
      token2: { symbol: "DAI", amount: 45678.9 },
    },
  },
];

const LiquidityPools: React.FC = () => {
  const [selectedPool, setSelectedPool] = useState<string | null>(null);
  const [depositAmount, setDepositAmount] = useState<DepositAmounts>({});

  // Find selected pool details
  const getSelectedPoolDetails = (): LiquidityPool | undefined => {
    return mockLiquidityPools.find((pool) => pool.id === selectedPool);
  };

  // Handle deposit amount changes
  const handleDepositChange = (
    poolId: string,
    token: keyof Pick<Token, "symbol" | "amount">,
    value: string
  ) => {
    setDepositAmount((prev) => ({
      ...prev,
      [poolId]: {
        ...prev[poolId],
        [token]: parseFloat(value) || 0,
      },
    }));
  };

  // Validate deposit
  const canDeposit = (poolId: string): boolean => {
    const amounts = depositAmount[poolId];
    return amounts && amounts.token1 > 0 && amounts.token2 > 0;
  };

  // Handle deposit submission
  const handleDeposit = (poolId: string) => {
    if (!canDeposit(poolId)) {
      alert("Please enter amounts for both tokens");
      return;
    }

    const depositData = depositAmount[poolId];
    const pool = mockLiquidityPools.find((p) => p.id === poolId);

    if (!pool) return;

    // Simulated deposit logic
    console.log(`Depositing to pool ${poolId}`, {
      token1: {
        symbol: pool.tokens.token1.symbol,
        amount: depositData.token1,
      },
      token2: {
        symbol: pool.tokens.token2.symbol,
        amount: depositData.token2,
      },
      poolShare: calculatePoolShare(
        depositData.token1 * depositData.token2,
        pool.totalValueLocked
      ),
    });

    // Reset deposit amount
    setDepositAmount((prev) => ({
      ...prev,
      [poolId]: { token1: 0, token2: 0 },
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex">
        {/* Main Pools Table */}
        <div className="w-full bg-white/5 backdrop-blur-sm border border-zinc-800/50 rounded-2xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-6 py-4 bg-zinc-900/30 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-zinc-100 flex items-center">
              <FaWater className="mr-3 text-zinc-400" />
              Liquidity Pools
            </h2>
            <Link
              href="/add-pool"
              className="bg-accent/20 text-accent px-4 py-2 rounded-lg 
              flex items-center hover:bg-accent/40 transition-colors"
            >
              <FaPlus className="mr-2" /> Add Liquidity
            </Link>
          </div>

          {/* Pools Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-900/10 border-b border-zinc-700/30">
                <tr>
                  {[
                    "Pair",
                    "Total Value Locked",
                    "APR",
                    "24h Volume",
                    "My Liquidity",
                    "Tokens",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {mockLiquidityPools.map((pool, index) => (
                  <motion.tr
                    key={pool.id}
                    initial={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`border-b border-zinc-800/30 
                      ${
                        selectedPool === pool.id
                          ? "bg-accent/10"
                          : "hover:bg-zinc-900/10"
                      } 
                      transition-colors duration-200 cursor-pointer`}
                    onClick={() =>
                      setSelectedPool(selectedPool === pool.id ? null : pool.id)
                    }
                  >
                    {/* Pair Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FaCoins className="mr-2 text-zinc-500" />
                        <span className="text-sm font-medium text-zinc-200">
                          {pool.pair}
                        </span>
                      </div>
                    </td>

                    {/* Total Value Locked Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-400">
                      {formatCurrency(pool.totalValueLocked)}
                    </td>

                    {/* APR Column */}
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <FaPercentage className="mr-1 text-zinc-500" />
                        <span className="text-sm text-zinc-300">
                          {pool.apr.toFixed(2)}%
                        </span>
                      </div>
                    </td>

                    {/* 24h Volume Column */}
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                      <div className="flex items-center">
                        <FaChartLine className="mr-2 text-zinc-500" />
                        {formatCurrency(pool.volume24h)}
                      </div>
                    </td>

                    {/* My Liquidity Column */}
                    <td className="px-6 py-4 text-sm text-zinc-400">
                      {formatCurrency(pool.myLiquidity)}
                    </td>

                    {/* Tokens Column */}
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm text-zinc-300">
                          {pool.tokens.token1.amount.toFixed(2)}{" "}
                          {pool.tokens.token1.symbol}
                        </span>
                        <span className="text-sm text-zinc-500">
                          {pool.tokens.token2.amount.toFixed(2)}{" "}
                          {pool.tokens.token2.symbol}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Side Panel for Pool Details */}
        <AnimatePresence>
          {selectedPool && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="hidden lg:block w-1/4 ml-4 bg-zinc-900/10 rounded-2xl p-6 border border-zinc-700/30"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold text-zinc-300">
                  Pool Details
                </h3>
                <button
                  onClick={() => setSelectedPool(null)}
                  className="text-zinc-500 hover:text-zinc-300"
                >
                  <FaTimes />
                </button>
              </div>

              {/* Deposit Section */}
              <div className="space-y-4">
                <div className="flex items-center bg-zinc-900/30 rounded-lg p-3">
                  <FaWallet className="mr-3 text-zinc-500" />
                  <input
                    type="number"
                    placeholder={`${
                      getSelectedPoolDetails()?.tokens.token1.symbol
                    } Amount`}
                    className="bg-transparent text-zinc-200 w-full outline-none"
                    value={
                      depositAmount[getSelectedPoolDetails()?.id || ""]
                        ?.token1 || ""
                    }
                    onChange={(e) =>
                      handleDepositChange(
                        getSelectedPoolDetails()?.id || "",
                        "amount",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="flex items-center bg-zinc-900/30 rounded-lg p-3">
                  <FaWallet className="mr-3 text-zinc-500" />
                  <input
                    type="number"
                    placeholder={`${
                      getSelectedPoolDetails()?.tokens.token2.symbol
                    } Amount`}
                    className="bg-transparent text-zinc-200 w-full outline-none"
                    value={
                      depositAmount[getSelectedPoolDetails()?.id || ""]
                        ?.token2 || ""
                    }
                    onChange={(e) =>
                      handleDepositChange(
                        getSelectedPoolDetails()?.id || "",
                        "amount",
                        e.target.value
                      )
                    }
                  />
                </div>

                <button
                  onClick={() =>
                    handleDeposit(getSelectedPoolDetails()?.id || "")
                  }
                  disabled={!canDeposit(getSelectedPoolDetails()?.id || "")}
                  className={`w-full py-3 rounded-lg transition-colors flex items-center justify-center
                    ${
                      canDeposit(getSelectedPoolDetails()?.id || "")
                        ? "bg-accent text-white hover:bg-accent/80"
                        : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
                    }`}
                >
                  <FaPlus className="mr-2" /> Deposit Liquidity
                </button>

                <div className="text-sm space-y-2">
                  <p className="text-zinc-400 mb-2">Pool Details:</p>
                  <p className="text-zinc-500">
                    <FaExchangeAlt className="inline mr-2" />
                    Pair: {getSelectedPoolDetails()?.pair}
                  </p>
                  <p className="text-zinc-500">
                    <FaPercentage className="inline mr-2" />
                    Current APR: {getSelectedPoolDetails()?.apr}%
                  </p>
                  <p className="text-zinc-500">
                    <FaWater className="inline mr-2" />
                    My Current Liquidity:{" "}
                    {formatCurrency(getSelectedPoolDetails()?.myLiquidity || 0)}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default LiquidityPools;
