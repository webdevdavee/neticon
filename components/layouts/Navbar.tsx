"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import {
  FaWallet,
  FaExchangeAlt,
  FaLayerGroup,
  FaPaintBrush,
  FaFaucet,
  FaCoins,
} from "react-icons/fa";

import WalletConnectModal from "./WalletConnectModal";

const Navbar = () => {
  const [isWalletModalOpen, setIsWalletModalOpen] = React.useState(false);

  const handleConnectWallet = (wallet: string) => {
    console.log(`Connecting with ${wallet}`);
  };

  return (
    <>
      <section className="w-full sticky top-0 z-[45]">
        <div className="bg-white/5 backdrop-blur-sm border-b border-zinc-800/50 shadow-lg">
          <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <Image
                src="/neticon.svg"
                width={30}
                height={30}
                alt="Neticon Logo"
                className="transition-transform hover:rotate-12"
              />
              <span className="text-lg font-semibold text-zinc-100">
                Neticon
              </span>
            </Link>

            {/* Navigation Links */}
            <ul className="flex items-center gap-8">
              <NavLink href="/swap" icon={<FaExchangeAlt />} label="Swap" />
              <NavLink
                href="/pools"
                icon={<FaLayerGroup />}
                label="Liquidity"
              />
              <NavLink href="/staking" icon={<FaCoins />} label="Staking" />
              <NavLink href="/faucet" icon={<FaFaucet />} label="Faucet" />
              <NavLink
                href="https://hazee.vercel.app/"
                icon={<FaPaintBrush />}
                label="NFTs"
                external
              />
            </ul>

            {/* Connect Wallet Button */}
            <button
              onClick={() => setIsWalletModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 text-sm font-semibold bg-accent text-background rounded-md hover:bg-accent transition-colors duration-300 group shadow-lg hover:shadow-accent/50"
            >
              <FaWallet className="group-hover:rotate-12 transition-transform" />
              Connect Wallet
            </button>
          </nav>
        </div>
      </section>

      <WalletConnectModal
        isOpen={isWalletModalOpen}
        onClose={() => setIsWalletModalOpen(false)}
        onConnect={handleConnectWallet}
      />
    </>
  );
};

// Component for navigation links
const NavLink: React.FC<{
  href: string;
  icon: React.ReactNode;
  label: string;
  external?: boolean;
}> = ({ href, icon, label, external = false }) => {
  const pathname = usePathname();
  const isActive = pathname === href;

  return (
    <li>
      <Link
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={`flex items-center gap-2 transition-colors                      
          duration-300 group text-sm                     
          ${isActive ? "text-accent" : "text-zinc-400 hover:text-zinc-100"}`}
      >
        <span
          className={`           
            ${
              isActive ? "text-accent" : "group-hover:text-accent text-zinc-500"
            }           
            transition-colors`}
        >
          {icon}
        </span>
        {label}
        {isActive && <div className="h-1 w-1 bg-accent rounded-full ml-2" />}
      </Link>
    </li>
  );
};

export default Navbar;
