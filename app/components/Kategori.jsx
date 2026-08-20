"use client";
import React from "react";
import { motion } from "framer-motion";

const Kategori = ({ Icon, text, size, isActive, onClick }) => {
  return (
    <motion.div 
      whileHover={{ scale: 1.05, y: -3 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="flex flex-col items-center py-0.5 backdrop-grayscale"
    >
      <div className="h-[50px] flex items-center">
        <Icon
          size={size}
          onClick={onClick}
          className={`mt-0.5 cursor-pointer hover:shadow-blue-400/50-[9px] p-2 w-20 h-16 shadow-2xs rounded-2xl duration-500 transition-all text-gray-900/85 hover:scale-90 ${
            isActive ? "bg-blue-400/50" : ""
          }`}
        />
      </div>
      <motion.span 
        initial={{ opacity: 0.8 }}
        animate={{ opacity: isActive ? 1 : 0.8 }}
        className="p-1 lg:text-[17px] lg:mt-2 text-shadow-lg text-center w-28 font-black text-gray-700/90"
      >
        {text}
      </motion.span>
    </motion.div>
  );
};

export default Kategori;