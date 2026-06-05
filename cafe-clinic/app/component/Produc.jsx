"use client";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import { BsPlus, BsDash } from "react-icons/bs";

const Produc = ({ img, text, title, price, onQuantityChange, initialQuantity = 0 }) => {
  const formattedPrice = price.toString().includes("000")
    ? price
    : `${price}.000`;
  
  const [quantity, setQuantity] = useState(initialQuantity);

  useEffect(() => {
    setQuantity(initialQuantity);
  }, [initialQuantity]);

  const increase = () => {
    const newQ = quantity + 1;
    setQuantity(newQ);
    if (onQuantityChange) onQuantityChange(newQ);
  };

  const decrease = () => {
    if (quantity > 0) {
      const newQ = quantity - 1;
      setQuantity(newQ);
      if (onQuantityChange) onQuantityChange(newQ);
    }
  };

  return (
    <div className="group bg-gradient-to-t backdrop-blur-lg lg:w-42 to-slate-400/60 from-gray-700/80 shadow-[0_0_9px_slate] rounded-2xl p-3 hover:-translate-y-2 duration-300   border border-white/10 h-full flex flex-col">
      <div className="relative overflow-hidden rounded-xl">
        <Image
          src={img}
          alt={title}
          width={170}
          height={10}
          className="rounded-xl  mb-1 h-auto object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
      </div>

      <h1 className="text-lg mt-1 font-bold text-slate-100/90 line-clamp-1 tracking-tight">
        {title}
      </h1>

      <p className="text-slate-300 text-xs line-clamp-2 min-h-[35px] mt-1 leading-relaxed font-bold">
        {text}
      </p>

      <div className="relative my-1">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center">
          <div className="w-full border-t border-slate-600/90"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-slate-700/90 px-1 text-slate-400 rounded-full text-[8px]">•</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 mt-auto pt-1">
        <span className="text-blue-300 font-bold text-m tracking-wide">
          {formattedPrice}
        </span>
        
        <div className="flex items-center gap-1">
          <button
            onClick={decrease}
            className="w-6 h-6 bg-white hover:bg-slate-600 text-gray rounded-full transition flex items-center justify-center text-xs"
          >
            <BsDash size={14} />
          </button>
          <span className="w-5 text-center text-red-100 font-bold text-sm">
            {quantity}
          </span>
          <button
            onClick={increase}
            className="w-6 h-6 bg-gray-100/90 hover:scale-110 duration-300 text-black rounded-full transition flex items-center justify-center text-xs"
          >
            <BsPlus size={14} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Produc;