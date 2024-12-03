"use client";

import { useState } from "react";
import { FiSettings } from "react-icons/fi";
import { IoSwapVertical } from "react-icons/io5";
import { FaTimes } from "react-icons/fa";
import TokenSelectionModal from "../layouts/TokenSelectionModal";
import Modal from "../layouts/Modal";
import { MdKeyboardArrowDown } from "react-icons/md";
import Button from "../ui/Button";
import TextInput from "../ui/Textinput";
import { Token } from "@/types";

const mockTokens: Token[] = [
  { symbol: "ETH", amount: 1.5, address: "0x...342" },
  { symbol: "USDT", amount: 1000, address: "0x...564" },
  { symbol: "USDC", amount: 1000, address: "0x...097" },
];

const TokenSwap = ({
  initialFromToken,
  initialToToken,
}: {
  initialFromToken?: (typeof mockTokens)[0];
  initialToToken?: (typeof mockTokens)[0];
}) => {
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeField, setActiveField] = useState<"from" | "to" | null>(null);
  const [slippage, setSlippage] = useState("0.5");
  const [fromAmount, setFromAmount] = useState("");
  const [selectedTokens, setSelectedTokens] = useState({
    from: initialFromToken || mockTokens[0],
    to: initialToToken || mockTokens[1],
  });

  const handleTokenSelect = (token: (typeof mockTokens)[0]) => {
    if (activeField) {
      setSelectedTokens((prev) => ({
        ...prev,
        [activeField]: token,
      }));
      setShowTokenModal(false);
    }
  };

  const handleMaxAmount = () => {
    setFromAmount(selectedTokens.from.amount.toString());
  };

  const handleHalfAmount = () => {
    setFromAmount((selectedTokens.from.amount / 2).toString());
  };

  const swapTokenPositions = () => {
    setSelectedTokens((prev) => ({
      from: prev.to,
      to: prev.from,
    }));
  };

  return (
    <div className="w-full max-w-md h-fit p-8 bg-background_light rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Swap Tokens</h2>
        <button
          onClick={() => setShowSettingsModal(true)}
          className="p-2 hover:bg-background rounded-full transition-colors"
        >
          <FiSettings className="w-5 h-5" />
        </button>
      </div>

      {/* From Token */}
      <div className="bg-lighter p-4 rounded-lg mb-2">
        <div className="flex justify-between mb-5">
          <span className="text-sm">From</span>
          <div className="space-x-2">
            <Button
              text="50%"
              style="text-sm bg-background_light px-2 py-1 rounded-md hover:opacity-80"
              onclick={handleHalfAmount}
            />
            <Button
              text="Max"
              style="text-sm bg-background_light px-2 py-1 rounded-md hover:opacity-80"
              onclick={handleMaxAmount}
            />
          </div>
        </div>
        <div className="flex items-center">
          <TextInput
            label="none"
            type="number"
            value={fromAmount}
            onChange={(e) => setFromAmount(e.target.value)}
            customStyle="w-full bg-transparent outline-none"
            placeholder="0.0"
          />
          <button
            onClick={() => {
              setActiveField("from");
              setShowTokenModal(true);
            }}
            className="flex items-center space-x-2 bg-background_light px-3 py-1 rounded-md hover:opacity-80"
          >
            <span>{selectedTokens.from.symbol}</span>
            <MdKeyboardArrowDown />
          </button>
        </div>
      </div>

      {/* Swap Button */}
      <div className="flex justify-center -my-2 z-10">
        <button
          onClick={swapTokenPositions}
          className="bg-accent border border-gray-200 p-2 rounded-full hover:shadow-md transition-all"
        >
          <IoSwapVertical className="w-5 h-5" color="#151515" />
        </button>
      </div>

      {/* To Token */}
      <div className="bg-lighter p-4 rounded-lg">
        <span className="text-sm mb-2 block">To</span>
        <div className="flex items-center">
          <TextInput
            label="none"
            type="number"
            customStyle="w-full bg-transparent outline-none"
            placeholder="0.0"
            readOnly
          />
          <button
            onClick={() => {
              setActiveField("to");
              setShowTokenModal(true);
            }}
            className="flex items-center space-x-2 bg-background_light px-3 py-1 rounded-md hover:opacity-80"
          >
            <span>{selectedTokens.to.symbol}</span>
            <MdKeyboardArrowDown />
          </button>
        </div>
      </div>

      {/* Swap Button */}
      <button className="w-full bg-accent text-background_light font-bold py-3 rounded-lg mt-4 transition-colors">
        Swap
      </button>

      {/* Token Selection Modal */}
      <TokenSelectionModal
        tokens={mockTokens}
        isOpen={showTokenModal}
        onClose={() => setShowTokenModal(false)}
        onSelect={handleTokenSelect}
        selectedToken={
          activeField === "from" ? selectedTokens.from : selectedTokens.to
        }
      />

      {/* Settings Modal */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      >
        <div className="bg-zinc-900 rounded-2xl">
          <div className="px-6 py-4 flex justify-between items-center border-b border-zinc-800/50">
            <h3 className="text-xl font-semibold text-zinc-100">
              Transaction Settings
            </h3>
            <button
              onClick={() => setShowSettingsModal(false)}
              className="text-zinc-500 hover:text-zinc-300"
            >
              <FaTimes />
            </button>
          </div>

          <div className="p-6 space-y-4">
            <div>
              <label className="block text-zinc-300 text-sm font-medium mb-2">
                Slippage Tolerance
              </label>
              <div className="flex space-x-2">
                {["0.1", "0.5", "1.0"].map((value) => (
                  <button
                    key={value}
                    onClick={() => setSlippage(value)}
                    className={`
                      px-3 py-2 rounded-lg transition-colors
                      ${
                        slippage === value
                          ? "bg-accent text-background_light"
                          : "bg-zinc-800 text-zinc-500 hover:bg-zinc-700"
                      }
                    `}
                  >
                    {value}%
                  </button>
                ))}
                <div className="relative flex items-center px-3 py-2 bg-zinc-800 rounded-lg">
                  <input
                    type="number"
                    value={slippage}
                    onChange={(e) => setSlippage(e.target.value)}
                    className="w-20 bg-transparent text-zinc-200 outline-none"
                  />
                  <span className="text-zinc-500 ml-2">%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TokenSwap;
