import {
  FaChartLine,
  FaWallet,
  FaSwimmingPool,
  FaUserFriends,
} from "react-icons/fa";
import StatCard from "../cards/StatCard";
import { motion } from "framer-motion";

const StatsBoard: React.FC = () => {
  const dexStats = [
    {
      icon: <FaChartLine className="text-4xl text-zinc-400 opacity-80" />,
      title: "Total Value Locked",
      value: "$425,678,921",
      change: "+12.4%",
      bgColor: "bg-zinc-800/50",
    },
    {
      icon: <FaWallet className="text-4xl text-zinc-400 opacity-80" />,
      title: "24h Trading Volume",
      value: "$89,234,567",
      change: "+8.2%",
      bgColor: "bg-zinc-800/50",
    },
    {
      icon: <FaSwimmingPool className="text-4xl text-zinc-400 opacity-80" />,
      title: "Number of Pools",
      value: "347",
      change: "+3.1%",
      bgColor: "bg-zinc-800/50",
    },
    {
      icon: <FaUserFriends className="text-4xl text-zinc-400 opacity-80" />,
      title: "Active Traders",
      value: "12,456",
      change: "+15.7%",
      bgColor: "bg-zinc-800/50",
    },
  ];

  return (
    <section className="bg-background_light text-white py-16 rounded-md">
      <div className="container mx-auto px-6">
        <div className="flex flex-col items-center justify-center gap-4 mb-12">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-4xl text-center text-zinc-100"
          >
            Relied upon worldwide
          </motion.h1>
          <p className="text-zinc-400 text-sm text-center max-w-3xl">
            Neticon&apos;s ecosystem thrives on the robust Neticon Protocol, a
            trailblazer in decentralized trading. As one of the leading on-chain
            marketplace, it facilitates billions in weekly transactions,
            supporting thousands of tokens across Ethereum and 7+ other
            blockchains.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {dexStats.map((stat, index) => (
            <StatCard key={stat.title} {...stat} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsBoard;
