"use client";

import { motion, AnimatePresence } from "framer-motion";
import { FaTimes } from "react-icons/fa";

type Props = {
  isFeeTierModalOpen: boolean;
  setIsFeeTierModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  FEE_TIERS: {
    value: number;
    label: string;
  }[];
  setSelectedFeeTier: React.Dispatch<
    React.SetStateAction<{
      value: number;
      label: string;
    }>
  >;
  selectedFeeTier: {
    value: number;
    label: string;
  };
};

const FeeTierModal: React.FC<Props> = ({
  isFeeTierModalOpen,
  setIsFeeTierModalOpen,
  FEE_TIERS,
  setSelectedFeeTier,
  selectedFeeTier,
}) => {
  if (!isFeeTierModalOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
        onClick={() => setIsFeeTierModalOpen(false)}
      >
        <motion.div
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
          className="bg-zinc-900 w-96 rounded-2xl border border-zinc-800/50 shadow-2xl"
        >
          <div className="px-6 py-4 bg-zinc-900/30 flex justify-between items-center">
            <h3 className="text-xl font-semibold text-zinc-100">
              Select Fee Tier
            </h3>
            <button
              onClick={() => setIsFeeTierModalOpen(false)}
              className="text-zinc-500 hover:text-zinc-300"
            >
              <FaTimes />
            </button>
          </div>

          <div className="p-4 space-y-2">
            {FEE_TIERS.map((tier) => (
              <button
                key={tier.value}
                onClick={() => {
                  setSelectedFeeTier(tier);
                  setIsFeeTierModalOpen(false);
                }}
                className={`
                  w-full flex items-center justify-between p-3 rounded-lg 
                  ${
                    selectedFeeTier.value === tier.value
                      ? "bg-accent/20"
                      : "hover:bg-zinc-800"
                  }
                  transition-colors
                `}
              >
                <div>
                  <p className="text-zinc-200 font-medium">{tier.label}</p>
                </div>
                <span className="text-zinc-400">{tier.value}%</span>
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default FeeTierModal;
