"use client";

import React, { useState } from "react";
import { FaCoins, FaLock, FaUnlock, FaChartLine } from "react-icons/fa";
import { motion } from "framer-motion";

// Define types for tokens
interface AvailableToken {
  token: string;
  balance: number;
  stakableAmount: number;
  apy: number;
}

interface StakedToken {
  token: string;
  stakedAmount: number;
  earned: number;
  startDate: string;
  lockPeriod: string;
}

// Available Tokens for Staking
const availableTokens: AvailableToken[] = [
  {
    token: "ETH",
    balance: 10.5,
    stakableAmount: 8.0,
    apy: 7.5,
  },
  {
    token: "USDC",
    balance: 15000,
    stakableAmount: 10000,
    apy: 12.3,
  },
  {
    token: "LINK",
    balance: 250,
    stakableAmount: 200,
    apy: 9.8,
  },
];

// Currently Staked Tokens
const stakedTokens: StakedToken[] = [
  {
    token: "ETH",
    stakedAmount: 2.5,
    earned: 0.175,
    startDate: "2024-01-15",
    lockPeriod: "3 months",
  },
  {
    token: "USDC",
    stakedAmount: 5000,
    earned: 51.25,
    startDate: "2024-02-01",
    lockPeriod: "6 months",
  },
];

const Staking: React.FC = () => {
  const [activeTab, setActiveTab] = useState<"stake" | "unstake">("stake");

  // Calculate Overview Metrics
  const totalStaked = stakedTokens.reduce(
    (sum, token) => sum + token.stakedAmount,
    0
  );
  const averageApy =
    availableTokens.reduce((sum, token) => sum + token.apy, 0) /
    availableTokens.length;
  const totalEarned = stakedTokens.reduce(
    (sum, token) => sum + token.earned,
    0
  );

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="bg-white/5 backdrop-blur-sm border border-zinc-800/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-900/30 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-zinc-100">Token Staking</h2>
          <div className="flex bg-zinc-900/50 rounded-lg">
            <button
              onClick={() => setActiveTab("stake")}
              className={`px-4 py-2 flex items-center gap-2 transition-colors rounded-lg ${
                activeTab === "stake"
                  ? "bg-accent text-background"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              <FaLock /> Stake
            </button>
            <button
              onClick={() => setActiveTab("unstake")}
              className={`px-4 py-2 flex items-center gap-2 transition-colors rounded-lg ${
                activeTab === "unstake"
                  ? "bg-accent text-background"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              <FaUnlock /> Unstake
            </button>
          </div>
        </div>

        {/* Overview Section */}
        <div className="grid grid-cols-4 gap-4 p-6 bg-zinc-900/10">
          <div className="bg-zinc-900/30 rounded-lg p-4 text-center">
            <FaCoins className="mx-auto mb-2 text-zinc-400" size={24} />
            <p className="text-zinc-300 text-sm">Total Value Staked</p>
            <h3 className="text-emerald-400 font-bold text-lg">
              ${totalStaked.toLocaleString()}
            </h3>
          </div>
          <div className="bg-zinc-900/30 rounded-lg p-4 text-center">
            <FaChartLine className="mx-auto mb-2 text-zinc-400" size={24} />
            <p className="text-zinc-300 text-sm">Average APY</p>
            <h3 className="text-emerald-400 font-bold text-lg">
              {averageApy.toFixed(1)}%
            </h3>
          </div>
          <div className="bg-zinc-900/30 rounded-lg p-4 text-center">
            <FaLock className="mx-auto mb-2 text-zinc-400" size={24} />
            <p className="text-zinc-300 text-sm">Tokens Available</p>
            <h3 className="text-emerald-400 font-bold text-lg">
              {availableTokens.length}
            </h3>
          </div>
          <div className="bg-zinc-900/30 rounded-lg p-4 text-center">
            <FaUnlock className="mx-auto mb-2 text-zinc-400" size={24} />
            <p className="text-zinc-300 text-sm">Total Earned</p>
            <h3 className="text-emerald-400 font-bold text-lg">
              ${totalEarned.toLocaleString()}
            </h3>
          </div>
        </div>

        {/* Staking Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-900/10 border-b border-zinc-700/30">
              <tr>
                {(activeTab === "stake"
                  ? [
                      "Token",
                      "Available Balance",
                      "APY",
                      "Stakable Amount",
                      "Actions",
                    ]
                  : [
                      "Token",
                      "Staked Amount",
                      "Earned",
                      "Start Date",
                      "Lock Period",
                      "Actions",
                    ]
                ).map((header) => (
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
              {(activeTab === "stake" ? availableTokens : stakedTokens).map(
                (token, index) => (
                  <motion.tr
                    key={`${token.token}-${index}`}
                    initial={{ opacity: 0, translateY: 20 }}
                    animate={{ opacity: 1, translateY: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-zinc-800/30 hover:bg-zinc-900/10 transition-colors duration-200"
                  >
                    {activeTab === "stake" ? (
                      // Stake Tab Rows
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                          {(token as AvailableToken).token}
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-300">
                          {(token as AvailableToken).balance}{" "}
                          {(token as AvailableToken).token}
                        </td>
                        <td className="px-6 py-4 text-sm text-emerald-400">
                          {(token as AvailableToken).apy}%
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-300">
                          {(token as AvailableToken).stakableAmount}{" "}
                          {(token as AvailableToken).token}
                        </td>
                        <td className="px-6 py-4">
                          <button className="bg-accent text-background px-3 py-1 rounded text-xs hover:opacity-80 transition-opacity">
                            Stake
                          </button>
                        </td>
                      </>
                    ) : (
                      // Unstake Tab Rows
                      <>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                          {(token as StakedToken).token}
                        </td>
                        <td className="px-6 py-4 text-sm text-emerald-400">
                          {(token as StakedToken).stakedAmount}{" "}
                          {(token as StakedToken).token}
                        </td>
                        <td className="px-6 py-4 text-sm text-emerald-400">
                          ${(token as StakedToken).earned.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-300">
                          {(token as StakedToken).startDate}
                        </td>
                        <td className="px-6 py-4 text-sm text-zinc-300">
                          {(token as StakedToken).lockPeriod}
                        </td>
                        <td className="px-6 py-4">
                          <button className="bg-accent text-background px-3 py-1 rounded text-xs hover:opacity-80 transition-opacity">
                            Unstake
                          </button>
                        </td>
                      </>
                    )}
                  </motion.tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Staking;
