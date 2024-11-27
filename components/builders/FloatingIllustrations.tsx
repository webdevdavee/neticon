import React from "react";
import { motion } from "framer-motion";

const FloatingIllustrations = () => {
  const shapes = [
    { type: "circle", size: 40, color: "bg-blue-500", x: "10%", y: "20%" },
    { type: "square", size: 30, color: "bg-green-500", x: "80%", y: "60%" },
    { type: "triangle", size: 50, color: "bg-yellow-500", x: "70%", y: "20%" },
    { type: "circle", size: 25, color: "bg-purple-500", x: "30%", y: "70%" },
    { type: "square", size: 35, color: "bg-pink-500", x: "20%", y: "40%" },
    { type: "circle", size: 20, color: "bg-red-500", x: "90%", y: "30%" },
    { type: "triangle", size: 40, color: "bg-indigo-500", x: "60%", y: "80%" },
    { type: "square", size: 45, color: "bg-teal-500", x: "40%", y: "10%" },
    { type: "circle", size: 30, color: "bg-orange-500", x: "15%", y: "90%" },
    { type: "triangle", size: 35, color: "bg-cyan-500", x: "85%", y: "50%" },
  ];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {shapes.map((shape, index) => (
        <motion.div
          key={index}
          className={`absolute ${shape.color} opacity-20`}
          style={{
            width: shape.size,
            height: shape.size,
            left: shape.x,
            top: shape.y,
            borderRadius:
              shape.type === "circle"
                ? "50%"
                : shape.type === "triangle"
                ? "0"
                : "4px",
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, 15, 0],
            rotate: [0, 360],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15 + index * 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        >
          {shape.type === "triangle" && (
            <div
              className="w-0 h-0 border-l-[25px] border-r-[25px] border-b-[50px] border-l-transparent border-r-transparent"
              style={{
                borderBottomColor: "currentColor",
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingIllustrations;
