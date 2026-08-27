"use client";
import Image from "next/image";
import React from "react";
import { motion } from "framer-motion";

const Header = ({ logo, coffeName }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-[95hw] overflow-hidden object-cover flex-col h-40 items-center flex justify-center gap-4 bg-gradient-to-l from-[#fdf6e7] via-[#d1eefc] to-blue-200/80"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <Image
          className="min-w-[auto] p-2 h-[auto] mt-12 object-cover text-bold"
          src={logo}
          alt="Cafe Clinik Logo"
          width={270}
          height={140}
        />
      </motion.div>

      <motion.h1 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="drop-shadow-lg text-gray-700/70 font-bold text-[20px] absolute ml-10 mt-28"
      >
        {coffeName}
      </motion.h1>
    </motion.div>
  );
};

export default Header;