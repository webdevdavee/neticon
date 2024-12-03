import React from "react";
import Image from "next/image";
import Modal from "./Modal";
import Link from "next/link";
import { FaTimes } from "react-icons/fa";

type WalletConnectModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConnect: (wallet: string) => void;
};

const WalletConnectModal: React.FC<WalletConnectModalProps> = ({
  isOpen,
  onClose,
  onConnect,
}) => {
  const wallets = [
    {
      name: "MetaMask",
      icon: "/metamask-fox.svg",
      available: true,
    },
    {
      name: "WalletConnect",
      icon: "/walletconnect.svg",
      available: false,
    },
    {
      name: "Coinbase Wallet",
      icon: "/coinbase-coin.svg",
      available: false,
    },
  ];

  const handleWalletConnect = (wallet: string) => {
    onConnect(wallet);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="bg-zinc-900 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 flex justify-between items-center border-b border-zinc-800/50">
          <h2 className="text-xl font-semibold text-zinc-100">
            Connect Wallet
          </h2>
          <button
            onClick={onClose}
            className="text-zinc-500 hover:text-zinc-300"
          >
            <FaTimes />
          </button>
        </div>
        <div className="p-6">
          <p className="text-zinc-400 text-sm mb-4">
            Select a wallet to connect to Neticon
          </p>
          <div className="space-y-4">
            {wallets.map((wallet) => (
              <button
                key={wallet.name}
                onClick={() =>
                  wallet.available && handleWalletConnect(wallet.name)
                }
                disabled={!wallet.available}
                className={`
                  w-full flex items-center justify-between 
                  px-4 py-3 
                  rounded-lg 
                  border 
                  transition-all duration-300
                  ${
                    wallet.available
                      ? "border-zinc-800/50 hover:bg-zinc-800/30 cursor-pointer"
                      : "border-zinc-800/30 opacity-50 cursor-not-allowed"
                  }
                `}
              >
                <div className="flex items-center gap-4">
                  <Image
                    src={wallet.icon}
                    alt={`${wallet.name} logo`}
                    width={32}
                    height={32}
                    className="w-8 h-8"
                  />
                  <span
                    className={`
                    text-sm font-medium 
                    ${wallet.available ? "text-zinc-200" : "text-zinc-500"}
                  `}
                  >
                    {wallet.name}
                  </span>
                </div>
                {wallet.available ? (
                  <span className="text-emerald-400 text-xs">Available</span>
                ) : (
                  <span className="text-zinc-500 text-xs">Coming Soon</span>
                )}
              </button>
            ))}
          </div>
          <div className="mt-6 text-center">
            <p className="text-xs text-zinc-500">
              By connecting a wallet, you agree to our{" "}
              <Link href="#" className="text-accent hover:underline">
                Terms of Service
              </Link>
            </p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WalletConnectModal;
