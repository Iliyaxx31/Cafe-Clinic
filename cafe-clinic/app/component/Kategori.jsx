"use client";
import React from "react";

const Kategori = ({ Icon, text, size, isActive, onClick }) => {
  return (
    <div className="flex flex-col items-center py-1">
      <div className="h-[50px] flex items-center">
        <Icon
          size={size}
          onClick={onClick}
          className={`mt-1 cursor-pointer hover:shadow-blue-400/50-[9px] p-2 w-20 h-16 shadow-2xs rounded-2xl duration-500 transition-all text-gray-900/85 hover:scale-90 ${
            isActive ? "bg-blue-400/50" : ""
          }`}
        />
      </div>
      <span className="p-1 mt-1 text-shadow-lg text-center w-28 font-black text-gray-700/90">
        {text}
      </span>
    </div>
  );
};

export default Kategori;
