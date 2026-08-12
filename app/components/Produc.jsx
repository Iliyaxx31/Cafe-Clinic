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
    <div className="group bg-gradient-to-t backdrop-blur-lg lg:w-38 to-slate-400/25 from-gray-700/80 shadow-[0_0_9px_slate] rounded-2xl p-[clamp(0.5rem,1.5vw,1.5rem)] hover:-translate-y-2 duration-300 border border-white/10 h-full flex flex-col">
      <div className="relative overflow-hidden rounded-xl p-[clamp(0.2rem,0.8vw,0.75rem)]">
        <Image
          src={img}
          alt={title}
          width={170}
          height={30}
          className="rounded-2xl w-full lg:w-[90vw] lg:p-0.5 lg:h-52 object-cover group-hover:scale-105 transition-transform duration-500 h-44"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
      </div>

      <h1 className="font-[family-name:var(--font-rubik)] font-medium mt-1 ml-3 lg:mb-1.5 text-slate-100/90 line-clamp-1 tracking-tight text-[clamp(1rem,4vw,1.8rem)]">
        {title}
      </h1>

      <p className="text-slate-300 ml-3 lg:text-[15px] line-clamp-2 min-h-[35px] mt-1 leading-relaxed font-bold text-[clamp(0.7rem,2.6vw,1rem)]">
        {text}
      </p>

      <div className="relative my-1">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center">
          <div className="w-full border-t border-slate-700/90"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-slate-700/90 px-1 text-slate-400 rounded-full text-[8px]">•</span>
        </div>
      </div>

 <div className="flex items-center justify-between gap-2 ml-2 lg:py-3 md:py-3 md:px-0.5 mt-auto pt-1">
  <span className="font-[family-name:var(--font-rubik)] font-semibold text-blue-300 tracking-wide text-[clamp(0.95rem,3.7vw,1.50rem)] whitespace-nowrap shrink-0">
    {formattedPrice}
  </span>

  <div className="flex items-center gap-[clamp(0.15rem,0.6vw,0.35rem)] shrink-0">
   
    <button
      onClick={increase}
      aria-label="Arttır"
      className="shrink-0 aspect-square w-[clamp(1.20rem,5.0vw,1.3rem)] min-w-[20px] min-h-[20px] bg-gray-100/90 hover:scale-105 active:scale-90 duration-200 text-black rounded-full transition flex items-center justify-center text-[clamp(0.7rem,2.8vw,0.9rem)]"
    >
      <BsPlus size="1em" />
    </button>
    <span className="text-center text-red-100 font-bold text-[clamp(0.75rem,2.6vw,0.9rem)] shrink-0 min-w-[0.9rem]">
      {quantity}
    </span>

 <button
      onClick={decrease}
      aria-label="Azalt"
      className="shrink-0 mr-3 aspect-square w-[clamp(1.20rem,5.0vw,1.3rem)] min-w-[20px] min-h-[20px] bg-white hover:bg-slate-200 active:scale-90 text-gray-700 rounded-full transition flex items-center justify-center text-[clamp(0.6rem,2.5vw,0.8rem)]"
    >
      <BsDash size="1em" />
    </button>
  </div>
</div>
    </div>
  );
};

export default Produc;