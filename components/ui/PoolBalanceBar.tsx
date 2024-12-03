import React from "react";

interface PoolBalanceBarProps {
  token1: { symbol: string; amount: number };
  token2: { symbol: string; amount: number };
}

const PoolBalanceBar: React.FC<PoolBalanceBarProps> = ({ token1, token2 }) => {
  // Calculate total and percentages
  const total = token1.amount + token2.amount;
  const token1Percentage = (token1.amount / total) * 100;
  const token2Percentage = (token2.amount / total) * 100;

  return (
    <div className="w-full mb-4">
      <div className="flex justify-between text-xs text-zinc-500 mb-2">
        <span>{token1.symbol} Balance</span>
        <span>{token2.symbol} Balance</span>
      </div>
      <div className="w-full h-4 bg-zinc-800 rounded-full overflow-hidden flex">
        <div
          className="bg-accent h-full"
          style={{ width: `${token1Percentage}%` }}
        />
        <div
          className="bg-emerald-500 h-full"
          style={{ width: `${token2Percentage}%` }}
        />
      </div>
      <div className="flex justify-between text-xs text-zinc-400 mt-2">
        <span>
          {token1.amount.toFixed(2)} {token1.symbol}
        </span>
        <span>
          {token2.amount.toFixed(2)} {token2.symbol}
        </span>
      </div>
    </div>
  );
};

export default PoolBalanceBar;
