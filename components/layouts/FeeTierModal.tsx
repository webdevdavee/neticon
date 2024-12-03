"use client";

import { FaTimes } from "react-icons/fa";
import Modal from "./Modal";

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
  return (
    <Modal
      isOpen={isFeeTierModalOpen}
      onClose={() => setIsFeeTierModalOpen(false)}
    >
      <div className="bg-zinc-900 rounded-2xl">
        <div className="px-6 py-4 flex justify-between items-center border-b border-zinc-800/50">
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
      </div>
    </Modal>
  );
};

export default FeeTierModal;
