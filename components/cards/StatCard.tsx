"use client";

import React from "react";
import { motion } from "framer-motion";

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  bgColor: string;
  index?: number;
}> = ({ icon, title, value, change, bgColor, index = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.1,
      }}
      className={`
        ${bgColor} 
        border border-lighter 
        rounded-2xl 
        p-6 
        backdrop-blur-sm 
        hover:bg-zinc-800/70 
        transition-all 
        duration-300 
        transform 
        hover:-translate-y-2 
        shadow-xl
      `}
    >
      <div className="flex justify-between items-center mb-4">
        {icon}
        <span className="text-xs text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full">
          {change}
        </span>
      </div>
      <div>
        <h3 className="text-zinc-400 text-sm mb-2">{title}</h3>
        <div className="text-3xl font-bold text-zinc-100">{value}</div>
      </div>
    </motion.div>
  );
};

export default StatCard;
