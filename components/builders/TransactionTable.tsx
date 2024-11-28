import React from "react";
import { FaExchangeAlt, FaCopy } from "react-icons/fa";
import { motion } from "framer-motion";
import { Transaction } from "@/types";
import { copyToClipboard, truncateAddress } from "@/libs/utils";

// Mock data
const mockTransactions: Transaction[] = [
  {
    id: "1",
    time: "2024-02-15 14:30:45",
    type: { from: "ETH", to: "USDC" },
    usdAmount: 1245.67,
    tokenAmount1: 0.5,
    tokenAmount2: 1234.56,
    walletAddress: "0x1234...5678",
  },
  {
    id: "2",
    time: "2024-02-16 09:15:22",
    type: { from: "BTC", to: "USDT" },
    usdAmount: 2345.89,
    tokenAmount1: 0.1,
    tokenAmount2: 2345.67,
    walletAddress: "0x8765...4321",
  },
];

const TransactionTable: React.FC = () => {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-zinc-800/50 rounded-2xl shadow-2xl overflow-hidden">
      <div className="px-6 py-4 bg-zinc-900/30">
        <h2 className="text-xl font-semibold text-zinc-100">
          Transaction History
        </h2>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-zinc-900/10 border-b border-zinc-700/30">
            <tr>
              {[
                "Time",
                "Type",
                "USD Amount",
                "Token Amount",
                "Tokens",
                "Wallet",
              ].map((header) => (
                <th
                  key={header}
                  className="px-6 py-4 text-left text-xs font-medium text-zinc-400 uppercase tracking-wider"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {mockTransactions.map((transaction, index) => (
              <motion.tr
                key={transaction.id}
                initial={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ delay: index * 0.1 }}
                className="border-b border-zinc-800/30 hover:bg-zinc-900/10 transition-colors duration-200"
              >
                {/* Time Column */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-zinc-300">
                  {transaction.time}
                </td>

                {/* Type Column */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <FaExchangeAlt className="mr-2 text-zinc-500" />
                    <span className="text-sm font-medium text-zinc-200">
                      {transaction.type.from} → {transaction.type.to}
                    </span>
                  </div>
                </td>

                {/* USD Amount Column */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-emerald-400">
                  ${transaction.usdAmount.toLocaleString()}
                </td>

                {/* Token Amounts Column */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-sm text-zinc-300">
                      {transaction.tokenAmount1} {transaction.type.from}
                    </span>
                    <span className="text-sm text-zinc-500">
                      {transaction.tokenAmount2} {transaction.type.to}
                    </span>
                  </div>
                </td>

                {/* Tokens Column */}
                <td className="px-6 py-4 text-sm text-zinc-400">
                  {transaction.type.from}, {transaction.type.to}
                </td>

                {/* Wallet Address Column */}
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <span className="text-sm text-zinc-300 mr-2">
                      {truncateAddress(transaction.walletAddress)}
                    </span>
                    <button
                      onClick={() => copyToClipboard(transaction.walletAddress)}
                      className="text-zinc-500 hover:text-zinc-300 transition-colors"
                      aria-label="Copy wallet address"
                    >
                      <FaCopy />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TransactionTable;
