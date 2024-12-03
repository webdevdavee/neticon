"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  FaWater,
  FaCoins,
  FaPlus,
  FaArrowDown,
  FaChartLine,
} from "react-icons/fa";

import { Token } from "@/types";
import TokenSelectionModal from "../layouts/TokenSelectionModal";
import FeeTierModal from "../layouts/FeeTierModal";

// Fee Tiers typical in DEXs
const FEE_TIERS = [
  { value: 0.01, label: "0.01% - Stable Pairs" },
  { value: 0.05, label: "0.05% - Low Volatility" },
  { value: 0.3, label: "0.3% - Standard" },
  { value: 1, label: "1% - Exotic Pairs" },
];

// Mock token list (would be replaced with actual token data)
const mockTokens: Token[] = [
  { symbol: "ETH", amount: 2.5 },
  { symbol: "USDC", amount: 5678.9 },
  { symbol: "USDT", amount: 4321.56 },
  { symbol: "DAI", amount: 3456.78 },
];

const AddLiquidityPool: React.FC = () => {
  const [selectedTokenA, setSelectedTokenA] = useState<Token | null>(null);
  const [selectedTokenB, setSelectedTokenB] = useState<Token | null>(null);
  const [tokenAAmount, setTokenAAmount] = useState<string>("");
  const [tokenBAmount, setTokenBAmount] = useState<string>("");
  const [selectedFeeTier, setSelectedFeeTier] = useState(FEE_TIERS[2]); // Default to 0.3%
  const [priceRangeType, setPriceRangeType] = useState<"full" | "custom">(
    "full"
  );
  const [minPrice, setMinPrice] = useState<string>("");
  const [maxPrice, setMaxPrice] = useState<string>("");

  const [isTokenAModalOpen, setIsTokenAModalOpen] = useState(false);
  const [isTokenBModalOpen, setIsTokenBModalOpen] = useState(false);
  const [isFeeTierModalOpen, setIsFeeTierModalOpen] = useState(false);

  // Available tokens filtering logic
  const availableTokensA = useMemo(
    () => mockTokens.filter((token) => token !== selectedTokenB),
    [selectedTokenB]
  );

  const availableTokensB = useMemo(
    () => mockTokens.filter((token) => token !== selectedTokenA),
    [selectedTokenA]
  );

  // Validate liquidity deposit
  const canDeposit = useMemo(() => {
    const hasValidTokens = selectedTokenA && selectedTokenB;
    const hasValidAmounts =
      parseFloat(tokenAAmount) > 0 && parseFloat(tokenBAmount) > 0;
    const hasValidPriceRange =
      priceRangeType === "full" ||
      (parseFloat(minPrice) > 0 && parseFloat(maxPrice) > parseFloat(minPrice));

    return hasValidTokens && hasValidAmounts && hasValidPriceRange;
  }, [
    selectedTokenA,
    selectedTokenB,
    tokenAAmount,
    tokenBAmount,
    priceRangeType,
    minPrice,
    maxPrice,
  ]);

  // Handle deposit submission
  //   const handleDeposit = () => {
  //     if (!canDeposit) {
  //       alert("Please check your token selections, amounts, and price range");
  //       return;
  //     }

  //     // Simulated deposit logic
  //     console.log("Depositing Liquidity", {
  //       tokenA: {
  //         symbol: selectedTokenA?.symbol,
  //         amount: parseFloat(tokenAAmount),
  //       },
  //       tokenB: {
  //         symbol: selectedTokenB?.symbol,
  //         amount: parseFloat(tokenBAmount),
  //       },
  //       feeTier: selectedFeeTier,
  //       priceRange:
  //         priceRangeType === "full" ? "Full Range" : `${minPrice} - ${maxPrice}`,
  //     });
  //   };

  //   // Token selection handler
  //   const handleTokenSelect = (token: Token, isTokenA: boolean) => {
  //     if (isTokenA) {
  //       setSelectedTokenA(token);
  //       setIsTokenAModalOpen(false);
  //     } else {
  //       setSelectedTokenB(token);
  //       setIsTokenBModalOpen(false);
  //     }
  //   };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white/5 backdrop-blur-sm border border-zinc-800/50 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 bg-zinc-900/30 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-zinc-100 flex items-center">
            <FaWater className="mr-3 text-zinc-400" />
            Add Liquidity
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsFeeTierModalOpen(true)}
              className="bg-accent/20 text-accent px-4 py-2 rounded-lg 
              flex items-center hover:bg-accent/40 transition-colors"
            >
              <FaChartLine className="mr-2" />
              Fee Tier: {selectedFeeTier.label}
            </button>
            <Link
              href="/pools"
              className="bg-zinc-800 text-zinc-300 px-4 py-2 rounded-lg 
              flex items-center hover:bg-zinc-700 transition-colors"
            >
              Back to Pools
            </Link>
          </div>
        </div>

        {/* Liquidity Input Section */}
        <div className="p-6 space-y-4">
          {/* First Token Input */}
          <div className="bg-zinc-900/30 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setIsTokenAModalOpen(true)}
                className="flex items-center bg-zinc-800 rounded-lg px-3 py-2 hover:bg-zinc-700 transition-colors"
              >
                <FaCoins className="mr-2 text-zinc-500" />
                {selectedTokenA ? (
                  <span className="text-zinc-200">{selectedTokenA.symbol}</span>
                ) : (
                  <span className="text-zinc-500">Select Token</span>
                )}
                <FaArrowDown className="ml-2 text-zinc-500" />
              </button>
              <div className="flex flex-col items-end">
                <input
                  type="number"
                  placeholder="0.0"
                  value={tokenAAmount}
                  onChange={(e) => setTokenAAmount(e.target.value)}
                  className="bg-transparent text-right text-zinc-200 w-full outline-none text-2xl"
                />
                <p className="text-zinc-500 text-sm">
                  amount:{" "}
                  {selectedTokenA ? selectedTokenA.amount.toFixed(4) : "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Plus Icon */}
          <div className="flex justify-center">
            <div className="bg-zinc-900/30 p-2 rounded-full">
              <FaPlus className="text-zinc-500" />
            </div>
          </div>

          {/* Second Token Input */}
          <div className="bg-zinc-900/30 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <button
                onClick={() => setIsTokenBModalOpen(true)}
                className="flex items-center bg-zinc-800 rounded-lg px-3 py-2 hover:bg-zinc-700 transition-colors"
              >
                <FaCoins className="mr-2 text-zinc-500" />
                {selectedTokenB ? (
                  <span className="text-zinc-200">{selectedTokenB.symbol}</span>
                ) : (
                  <span className="text-zinc-500">Select Token</span>
                )}
                <FaArrowDown className="ml-2 text-zinc-500" />
              </button>
              <div className="flex flex-col items-end">
                <input
                  type="number"
                  placeholder="0.0"
                  value={tokenBAmount}
                  onChange={(e) => setTokenBAmount(e.target.value)}
                  className="bg-transparent text-right text-zinc-200 w-full outline-none text-2xl"
                />
                <p className="text-zinc-500 text-sm">
                  Balance:{" "}
                  {selectedTokenB ? selectedTokenB.amount.toFixed(4) : "-"}
                </p>
              </div>
            </div>
          </div>

          {/* Price Range Section */}
          <div className="bg-zinc-900/30 rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-center">
              <h3 className="text-zinc-300 font-semibold">Price Range</h3>
              <div className="flex space-x-2">
                <button
                  onClick={() => setPriceRangeType("full")}
                  className={`
                    px-3 py-1 rounded-lg transition-colors
                    ${
                      priceRangeType === "full"
                        ? "bg-accent text-background_light"
                        : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700"
                    }
                  `}
                >
                  Full Range
                </button>
                <button
                  onClick={() => setPriceRangeType("custom")}
                  className={`
                    px-3 py-1 rounded-lg transition-colors
                    ${
                      priceRangeType === "custom"
                        ? "bg-accent text-background_light"
                        : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700"
                    }
                  `}
                >
                  Custom Range
                </button>
              </div>
            </div>

            {priceRangeType === "custom" && (
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="bg-zinc-800 rounded-lg p-3">
                  <label className="text-zinc-500 text-xs mb-1 block">
                    Minimum Price
                  </label>
                  <input
                    type="number"
                    placeholder="Min Price"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    className="bg-transparent text-zinc-200 w-full outline-none"
                  />
                </div>
                <div className="bg-zinc-800 rounded-lg p-3">
                  <label className="text-zinc-500 text-xs mb-1 block">
                    Maximum Price
                  </label>
                  <input
                    type="number"
                    placeholder="Max Price"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    className="bg-transparent text-zinc-200 w-full outline-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Deposit Button */}
          <button
            onClick={() => {
              /* Deposit logic */
            }}
            disabled={!canDeposit}
            className={`
              w-full py-4 rounded-lg transition-colors flex items-center justify-center
              ${
                canDeposit
                  ? "bg-accent text-background_light hover:bg-accent/80"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"
              }
            `}
          >
            <FaPlus className="mr-2" />
            {!selectedTokenA || !selectedTokenB
              ? "Select Tokens"
              : "Add Liquidity"}
          </button>
        </div>
      </div>

      {/* Modals */}
      <TokenSelectionModal
        tokens={availableTokensA}
        isOpen={isTokenAModalOpen}
        onClose={() => setIsTokenAModalOpen(false)}
        onSelect={(token) => setSelectedTokenA(token)}
        selectedToken={selectedTokenA}
      />
      <TokenSelectionModal
        tokens={availableTokensB}
        isOpen={isTokenBModalOpen}
        onClose={() => setIsTokenBModalOpen(false)}
        onSelect={(token) => setSelectedTokenB(token)}
        selectedToken={selectedTokenB}
      />
      <FeeTierModal
        isFeeTierModalOpen={isFeeTierModalOpen}
        setIsFeeTierModalOpen={setIsFeeTierModalOpen}
        FEE_TIERS={FEE_TIERS}
        setSelectedFeeTier={setSelectedFeeTier}
        selectedFeeTier={selectedFeeTier}
      />
    </div>
  );
};

export default AddLiquidityPool;
