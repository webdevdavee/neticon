"use client";

import { useState } from "react";
import { BiSearchAlt2 } from "react-icons/bi";
import { FiSettings } from "react-icons/fi";
import { IoSwapVertical } from "react-icons/io5";
import { Modal } from "../layouts/Modal";
import { MdKeyboardArrowDown } from "react-icons/md";
import Button from "../ui/Button";
import TextInput from "../ui/Textinput";

const mockTokens = [
  { symbol: "ETH", name: "Ethereum", balance: "1.5", address: "0x...1" },
  { symbol: "USDT", name: "Tether", balance: "1000", address: "0x...2" },
  { symbol: "USDC", name: "USD Coin", balance: "1000", address: "0x...3" },
];

const TokenSwap = () => {
  const [showTokenModal, setShowTokenModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [activeField, setActiveField] = useState<"from" | "to" | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [fromAmount, setFromAmount] = useState("");
  const [selectedTokens, setSelectedTokens] = useState({
    from: mockTokens[0],
    to: mockTokens[1],
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
    setFromAmount(selectedTokens.from.balance);
  };

  const handleHalfAmount = () => {
    setFromAmount((Number(selectedTokens.from.balance) / 2).toString());
  };

  const filteredTokens = mockTokens.filter(
    (token) =>
      token.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
      token.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const swapTokenPositions = () => {
    setSelectedTokens((prev) => ({
      from: prev.to,
      to: prev.from,
    }));
  };

  return (
    <div className="w-full max-w-md mx-auto p-8 bg-white dark:bg-background_light rounded-xl shadow-lg">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold">Swap Tokens</h2>
        <button
          onClick={() => setShowSettingsModal(true)}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
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
              style="text-sm bg-gray-200 dark:bg-background_light px-2 py-1 rounded-md hover:opacity-80"
              onclick={handleHalfAmount}
            />
            <Button
              text="Max"
              style="text-sm bg-gray-200 dark:bg-background_light px-2 py-1 rounded-md hover:opacity-80"
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
            className="flex items-center space-x-2 bg-gray-200 dark:bg-background_light px-3 py-1 rounded-md hover:opacity-80"
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
            className="flex items-center space-x-2 bg-gray-200 dark:bg-background_light px-3 py-1 rounded-md hover:opacity-80"
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
      <Modal isOpen={showTokenModal} onClose={() => setShowTokenModal(false)}>
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Select Token</h3>
          <div className="relative">
            <TextInput
              label="none"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              customStyle="w-full px-4 py-2 pl-10 rounded-lg outline-none"
              placeholder="Search by name or paste address"
            />
            <BiSearchAlt2 className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          <div className="max-h-60 overflow-y-auto space-y-2">
            {filteredTokens.map((token) => (
              <button
                key={token.address}
                onClick={() => handleTokenSelect(token)}
                className="w-full flex items-center justify-between p-2 hover:bg-background_light rounded-md transition-colors"
              >
                <span>{token.symbol}</span>
                <span>{token.balance}</span>
              </button>
            ))}
          </div>
          <p className="text-sm">
            Can&apos;t find the token you&apos;re looking for? Try entering the
            mint address or check token list settings below.
          </p>
        </div>
      </Modal>

      {/* Settings Modal */}
      <Modal
        isOpen={showSettingsModal}
        onClose={() => setShowSettingsModal(false)}
      >
        <div className="space-y-4">
          <h3 className="text-lg font-bold">Transaction Settings</h3>
          <div>
            <label className="block text-sm font-medium mb-2">
              Slippage Tolerance
            </label>
            <div className="flex space-x-2">
              {["0.1", "0.5", "1.0"].map((value) => (
                <button
                  key={value}
                  onClick={() => setSlippage(value)}
                  className={`px-3 py-1 rounded-lg ${
                    slippage === value
                      ? "bg-accent text-background"
                      : "bg-background_light"
                  }`}
                >
                  {value}%
                </button>
              ))}
              <div className="relative flex items-center px-2 py-1 bg-background_light rounded-lg">
                <p className="mr-3">Enter custom: </p>
                <input
                  type="number"
                  value={slippage}
                  onChange={(e) => setSlippage(e.target.value)}
                  className="w-20 pr-6 bg-background_light outline-none"
                />
                <span className="absolute right-2">%</span>
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default TokenSwap;
