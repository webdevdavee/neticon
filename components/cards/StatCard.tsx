"use client";

import React from "react";
import { motion } from "framer-motion";

const StatCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  bgGradient: string;
}> = ({ icon: Icon, title, value, change, bgGradient }) => {
  return (
    <motion.div
      className={`
        relative overflow-hidden rounded-2xl p-6 
        bg-gradient-to-br ${bgGradient} 
        text-white shadow-2xl cursor-pointer
        transform transition-all duration-300
      `}
      initial={{ scale: 1, opacity: 0.8 }}
      style={{
        perspective: "1000px",
        transformStyle: "preserve-3d",
      }}
    >
      {/* Subtle background pattern */}
      <div
        className="
          absolute inset-0 
          opacity-10 
          bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] 
          from-white/20 via-transparent to-transparent
        "
      />

      {/* Card Content */}
      <div className="relative z-10 flex flex-col space-y-4">
        <div className="flex justify-between items-center">
          {Icon}
          <motion.span
            className="text-sm font-medium bg-white/20 px-2 py-1 rounded-full"
            initial={{ opacity: 0.7 }}
            whileHover={{ scale: 1.1, opacity: 1 }}
          >
            {change}
          </motion.span>
        </div>

        <div>
          <h3 className="text-lg font-semibold opacity-80 mb-2">{title}</h3>
          <motion.div
            className="text-3xl font-bold"
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            {value}
          </motion.div>
        </div>
      </div>

      {/* Hover effect layer */}
      <motion.div
        className="
          absolute inset-0 
          bg-white/10 
          opacity-0 
          pointer-events-none
        "
        initial={{ opacity: 0 }}
        transition={{ duration: 0.1 }}
      />
    </motion.div>
  );
};

export default StatCard;
