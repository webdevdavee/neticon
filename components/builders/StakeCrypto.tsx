"use client";

import React, { useState } from "react";
import {
  FaCoins,
  FaLock,
  FaChartLine,
  FaWater,
  FaHandHoldingUsd,
} from "react-icons/fa";
import { motion } from "framer-motion";

// Define types for Liquidity Pools
interface LiquidityPool {
  poolId: string;
  tokens: string[];
  totalLiquidity: number;
  apy: number;
  volumeDay: number;
  rewardToken: string;
}

// Define types for User's Staked Tokens
interface StakedToken {
  poolId: string;
  tokens: string[];
  stakedAmount: number;
  startDate: string;
  endDate: string;
  earnedRewards: number;
  claimableRewards: number;
}

// Define types for User's LP Tokens
interface UserLPToken {
  poolId: string;
  tokens: string[];
  stakedAmount: number;
  unstakedAmount: number;
  pendingRewards: number;
}

// Available Liquidity Pools
const availablePools: LiquidityPool[] = [
  {
    poolId: "ETH-USDC",
    tokens: ["ETH", "USDC"],
    totalLiquidity: 5000000,
    apy: 18.5,
    volumeDay: 2500000,
    rewardToken: "REWARD",
  },
  {
    poolId: "LINK-ETH",
    tokens: ["LINK", "ETH"],
    totalLiquidity: 2500000,
    apy: 22.3,
    volumeDay: 1200000,
    rewardToken: "REWARD",
  },
  {
    poolId: "USDC-USDT",
    tokens: ["USDC", "USDT"],
    totalLiquidity: 7500000,
    apy: 15.7,
    volumeDay: 3500000,
    rewardToken: "REWARD",
  },
];

// User's Staked Tokens
const stakedTokens: StakedToken[] = [
  {
    poolId: "ETH-USDC",
    tokens: ["ETH", "USDC"],
    stakedAmount: 1250,
    startDate: "2024-01-15",
    endDate: "2024-07-15",
    earnedRewards: 87.5,
    claimableRewards: 37.5,
  },
  {
    poolId: "LINK-ETH",
    tokens: ["LINK", "ETH"],
    stakedAmount: 500,
    startDate: "2024-02-01",
    endDate: "2024-08-01",
    earnedRewards: 52.3,
    claimableRewards: 22.3,
  },
];

// User's LP Tokens
const userLPTokens: UserLPToken[] = [
  {
    poolId: "ETH-USDC",
    tokens: ["ETH", "USDC"],
    stakedAmount: 1250,
    unstakedAmount: 250,
    pendingRewards: 37.5,
  },
  {
    poolId: "LINK-ETH",
    tokens: ["LINK", "ETH"],
    stakedAmount: 500,
    unstakedAmount: 100,
    pendingRewards: 22.3,
  },
];

const LiquidityMining: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "pools" | "my-tokens" | "staked-tokens"
  >("pools");

  // Calculate Overview Metrics
  const totalLiquidity = availablePools.reduce(
    (sum, pool) => sum + pool.totalLiquidity,
    0
  );
  const averageApy =
    availablePools.reduce((sum, pool) => sum + pool.apy, 0) /
    availablePools.length;
  const totalClaimableRewards = stakedTokens.reduce(
    (sum, token) => sum + token.claimableRewards,
    0
  );

  // Claim Rewards Function
  const handleClaimRewards = (poolId: string) => {
    // In a real application, this would interact with a blockchain contract
    console.log(`Claiming rewards for ${poolId}`);
    // Add actual reward claiming logic here
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="bg-white/5 backdrop-blur-sm border border-zinc-800/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-900/30 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-zinc-100">
            Liquidity Mining
          </h2>
          <div className="flex bg-zinc-900/50 rounded-lg">
            <button
              onClick={() => setActiveTab("pools")}
              className={`px-4 py-2 flex items-center gap-2 transition-colors rounded-lg ${
                activeTab === "pools"
                  ? "bg-accent text-background"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              <FaWater /> Pools
            </button>
            <button
              onClick={() => setActiveTab("my-tokens")}
              className={`px-4 py-2 flex items-center gap-2 transition-colors rounded-lg ${
                activeTab === "my-tokens"
                  ? "bg-accent text-background"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              <FaCoins /> My LP Tokens
            </button>
            <button
              onClick={() => setActiveTab("staked-tokens")}
              className={`px-4 py-2 flex items-center gap-2 transition-colors rounded-lg ${
                activeTab === "staked-tokens"
                  ? "bg-accent text-background"
                  : "text-zinc-400 hover:text-zinc-100"
              }`}
            >
              <FaLock /> Staked Tokens
            </button>
          </div>
        </div>

        {/* Overview Section */}
        <div className="grid grid-cols-4 gap-4 p-6 bg-zinc-900/10">
          <div className="bg-zinc-900/30 rounded-lg p-4 text-center">
            <FaWater className="mx-auto mb-2 text-zinc-400" size={24} />
            <p className="text-zinc-300 text-sm">Total Liquidity</p>
            <h3 className="text-emerald-400 font-bold text-lg">
              ${totalLiquidity.toLocaleString()}
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
            <p className="text-zinc-300 text-sm">Total Pools</p>
            <h3 className="text-emerald-400 font-bold text-lg">
              {availablePools.length}
            </h3>
          </div>
          <div className="bg-zinc-900/30 rounded-lg p-4 text-center">
            <FaHandHoldingUsd
              className="mx-auto mb-2 text-zinc-400"
              size={24}
            />
            <p className="text-zinc-300 text-sm">Claimable Rewards</p>
            <h3 className="text-emerald-400 font-bold text-lg">
              ${totalClaimableRewards.toLocaleString()}
            </h3>
          </div>
        </div>

        {/* Liquidity Pools / LP Tokens / Staked Tokens Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-zinc-900/10 border-b border-zinc-700/30">
              <tr>
                {(activeTab === "pools"
                  ? [
                      "Pool",
                      "Tokens",
                      "Total Liquidity",
                      "Daily Volume",
                      "APY",
                      "Actions",
                    ]
                  : activeTab === "my-tokens"
                  ? [
                      "Pool",
                      "Tokens",
                      "Staked Amount",
                      "Unstaked Amount",
                      "Pending Rewards",
                      "Actions",
                    ]
                  : [
                      "Pool",
                      "Tokens",
                      "Staked Amount",
                      "Start Date",
                      "End Date",
                      "Earned Rewards",
                      "Claimable Rewards",
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
              {(activeTab === "pools"
                ? availablePools
                : activeTab === "my-tokens"
                ? userLPTokens
                : stakedTokens
              ).map((item, index) => (
                <motion.tr
                  key={`${
                    (item as LiquidityPool | StakedToken | UserLPToken).poolId
                  }-${index}`}
                  initial={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="border-b border-zinc-800/30 hover:bg-zinc-900/10 transition-colors duration-200"
                >
                  {activeTab === "pools" ? (
                    // Pools Tab Rows
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                        {(item as LiquidityPool).poolId}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-300">
                        {(item as LiquidityPool).tokens.join(" - ")}
                      </td>
                      <td className="px-6 py-4 text-sm text-emerald-400">
                        $
                        {(
                          item as LiquidityPool
                        ).totalLiquidity.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-300">
                        ${(item as LiquidityPool).volumeDay.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-emerald-400">
                        {(item as LiquidityPool).apy}%
                      </td>
                      <td className="px-6 py-4">
                        <button className="bg-accent text-background px-3 py-1 rounded text-xs hover:opacity-80 transition-opacity">
                          Add Liquidity
                        </button>
                      </td>
                    </>
                  ) : activeTab === "my-tokens" ? (
                    // My LP Tokens Tab Rows
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                        {(item as UserLPToken).poolId}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-300">
                        {(item as UserLPToken).tokens.join(" - ")}
                      </td>
                      <td className="px-6 py-4 text-sm text-emerald-400">
                        {(item as UserLPToken).stakedAmount.toLocaleString()} LP
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-300">
                        {(item as UserLPToken).unstakedAmount.toLocaleString()}{" "}
                        LP
                      </td>
                      <td className="px-6 py-4 text-sm text-emerald-400">
                        ${(item as UserLPToken).pendingRewards.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <button className="bg-accent text-background px-3 py-1 rounded text-xs hover:opacity-80 transition-opacity">
                          Stake
                        </button>
                        <button className="bg-zinc-700 text-zinc-300 px-3 py-1 rounded text-xs hover:opacity-80 transition-opacity">
                          Withdraw
                        </button>
                      </td>
                    </>
                  ) : (
                    // Staked Tokens Tab Rows
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                        {(item as StakedToken).poolId}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-300">
                        {(item as StakedToken).tokens.join(" - ")}
                      </td>
                      <td className="px-6 py-4 text-sm text-emerald-400">
                        {(item as StakedToken).stakedAmount.toLocaleString()} LP
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-300">
                        {(item as StakedToken).startDate}
                      </td>
                      <td className="px-6 py-4 text-sm text-zinc-300">
                        {(item as StakedToken).endDate}
                      </td>
                      <td className="px-6 py-4 text-sm text-emerald-400">
                        ${(item as StakedToken).earnedRewards.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-sm text-emerald-400">
                        $
                        {(
                          item as StakedToken
                        ).claimableRewards.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 space-x-2">
                        <button
                          onClick={() =>
                            handleClaimRewards((item as StakedToken).poolId)
                          }
                          className="bg-accent text-background px-3 py-1 rounded text-xs hover:opacity-80 transition-opacity"
                        >
                          Claim Rewards
                        </button>
                      </td>
                    </>
                  )}
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default LiquidityMining;
