import {
  FaChartLine,
  FaWallet,
  FaSwimmingPool,
  FaUserFriends,
} from "react-icons/fa";
import StatCard from "../cards/StatCard";
import { fadeInUpVariants } from "@/constants";
import { motion } from "framer-motion";

const StatsBoard: React.FC = () => {
  const dexStats = [
    {
      icon: (
        <FaChartLine className="text-4xl opacity-80 transform transition-transform duration-300 group-hover:rotate-12" />
      ),
      title: "Total Value Locked",
      value: "$425,678,921",
      change: "+12.4%",
      bgGradient: "from-purple-500 to-indigo-600",
    },
    {
      icon: (
        <FaWallet className="text-4xl opacity-80 transform transition-transform duration-300 group-hover:rotate-12" />
      ),
      title: "24h Trading Volume",
      value: "$89,234,567",
      change: "+8.2%",
      bgGradient: "from-green-400 to-blue-500",
    },
    {
      icon: (
        <FaSwimmingPool className="text-4xl opacity-80 transform transition-transform duration-300 group-hover:rotate-12" />
      ),
      title: "Number of Pools",
      value: "347",
      change: "+3.1%",
      bgGradient: "from-pink-500 to-rose-500",
    },
    {
      icon: (
        <FaUserFriends className="text-4xl opacity-80 transform transition-transform duration-300 group-hover:rotate-12" />
      ),
      title: "Active Traders",
      value: "12,456",
      change: "+15.7%",
      bgGradient: "from-orange-400 to-amber-500",
    },
  ];

  return (
    <section>
      <div className="flex flex-col items-center justify-center gap-4 mb-12 px-40">
        <motion.h1 className="text-4xl text-center" variants={fadeInUpVariants}>
          Relied upon worldwide
        </motion.h1>
        <p className="text-gray-400 text-sm text-center">
          Neticon&apos;s ecosystem thrives on the robust Neticon Protocol, a
          trailblazer in decentralized trading. As one of the leading on-chain
          marketplace, it facilitates billions in weekly transactions,
          supporting thousands of tokens across Ethereum and 7+ other
          blockchains.
        </p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 w-full items-center justify-center">
        {dexStats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>
    </section>
  );
};

export default StatsBoard;
