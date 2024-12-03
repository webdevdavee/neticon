"use client";

import { Token } from "@/types";
import { FaCoins, FaTimes } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

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
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-zinc-900 w-96 rounded-2xl border border-zinc-800/50 shadow-2xl"
        >
          <div className="px-6 py-4 bg-zinc-900/30 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-zinc-100">
              Select Token
            </h3>
            <button
              onClick={onClose}
              className="text-zinc-500 hover:text-zinc-300"
            >
              <FaTimes />
            </button>
          </div>

          <div className="p-4 max-h-96 overflow-y-auto">
            {tokens.map((token) => (
              <button
                key={token.symbol}
                onClick={() => onSelect(token)}
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
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TokenSelectionModal;
