"use client";

import React, { useState, useMemo } from "react";
import { FaCoins, FaTimes, FaSearch } from "react-icons/fa";
import { Token } from "@/types";
import Modal from "./Modal";

type Props = {
  tokens: Token[];
  isOpen: boolean;
  onClose: () => void;
  onSelect: (token: Token) => void;
  selectedToken: Token | null;
};

const TokenSelectionModal: React.FC<Props> = ({
  tokens,
  isOpen,
  onClose,
  onSelect,
  selectedToken,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTokens = useMemo(() => {
    if (!searchQuery) return tokens;

    const lowercaseQuery = searchQuery.toLowerCase();
    return tokens.filter(
      (token) =>
        token.symbol.toLowerCase().includes(lowercaseQuery) ||
        token.amount.toString().includes(lowercaseQuery)
    );
  }, [tokens, searchQuery]);

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-zinc-900 rounded-2xl">
        <div className="px-6 py-4 flex justify-between items-center border-b border-zinc-800/50">
          <h3 className="text-xl font-semibold text-zinc-100">Select Token</h3>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300"
          >
            <FaTimes />
          </button>
        </div>

        {/* Search Bar */}
        <div className="px-4 py-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tokens"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-800 text-zinc-200 rounded-lg py-2 px-10 outline-none"
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
          </div>
        </div>

        <div className="p-4 max-h-96 overflow-y-auto">
          {filteredTokens.length > 0 ? (
            filteredTokens.map((token) => (
              <button
                key={token.symbol}
                onClick={() => {
                  onSelect(token);
                  onClose();
                }}
                className={`
                  w-full flex items-center justify-between p-3 rounded-lg mb-2 
                  ${
                    selectedToken === token
                      ? "bg-accent/20"
                      : "hover:bg-zinc-800"
                  }
                  transition-colors
                `}
              >
                <div className="flex items-center">
                  <FaCoins className="mr-3 text-zinc-500" />
                  <div className="text-left">
                    <p className="text-zinc-200 font-medium">{token.symbol}</p>
                    <p className="text-xs text-zinc-500">{token.symbol}</p>
                  </div>
                </div>
                <span className="text-zinc-400">{token.amount.toFixed(4)}</span>
              </button>
            ))
          ) : (
            <p className="text-center text-zinc-500">No tokens found</p>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default TokenSelectionModal;
