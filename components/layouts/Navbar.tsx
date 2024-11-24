import React from "react";
import Button from "../ui/Button";
import Link from "next/link";

const Navbar = () => {
  return (
    <section className="w-full p-3 sticky top-0 z-[45]">
      <nav className="flex items-center justify-between">
        <h2>Neticon</h2>
        <ul className="flex items-center gap-8">
          <Link href="/swap" className="text-lg">
            Swap
          </Link>
          <Link href="/liquidity-pool" className="text-lg">
            Liquidty
          </Link>
          <Link
            href="https://hazee.vercel.app/"
            target="blank"
            className="text-lg"
          >
            NFTs
          </Link>
        </ul>
        <Button
          text="Connect wallet"
          style="rounded-md font-semibold bg-accent text-background py-2 px-6"
        />
      </nav>
    </section>
  );
};

export default Navbar;
