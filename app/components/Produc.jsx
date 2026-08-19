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
    <div className="group bg-gradient-to-t backdrop-blur-lg to-slate-400/25 from-gray-700/80 shadow-[0_0_9px_slate] rounded-2xl p-1.5 sm:p-2 hover:-translate-y-2 duration-300 border border-white/10 h-full flex flex-col">
      {/* Resim: kart genişliğinin neredeyse tamamını kaplasın diye kare oran + minimum çerçeve boşluğu */}
      <div className="relative w-full aspect-square overflow-hidden rounded-xl">
        <Image
          src={img}
          alt={title}
          fill
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>

      <h1 className="font-[family-name:var(--font-rubik)] font-medium mt-1.5 px-1 text-slate-100/90 line-clamp-1 tracking-tight text-[clamp(0.95rem,3.6vw,1.25rem)]">
        {title}
      </h1>

      <p className="text-slate-300 px-1 line-clamp-2 min-h-[30px] mt-0.5 leading-snug font-bold text-[clamp(0.65rem,2.4vw,0.8rem)]">
        {text}
      </p>

      <div className="relative my-0.5">
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 flex items-center">
          <div className="w-full border-t border-slate-700/90"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-slate-700/90 px-1 text-slate-400 rounded-full text-[8px]">•</span>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 px-1 py-1.5 mt-auto">
        <span className="font-[family-name:var(--font-rubik)] font-semibold text-blue-300 tracking-wide text-[clamp(0.95rem,3.2vw,1.25rem)] whitespace-nowrap shrink-0">
          {formattedPrice}
        </span>

        <div className="flex items-center gap-[clamp(0.2rem,0.6vw,0.4rem)] shrink-0">
          <button
            onClick={increase}
            aria-label="Arttır"
            className="shrink-0 aspect-square w-6 h-6 bg-gray-100/90 hover:scale-105 active:scale-90 duration-200 text-black rounded-full transition flex items-center justify-center text-sm"
          >
            <BsPlus size="1em" />
          </button>
          <span className="text-center text-red-100 font-bold text-sm shrink-0 min-w-[1rem]">
            {quantity}
          </span>
          <button
            onClick={decrease}
            aria-label="Azalt"
            className="shrink-0 aspect-square w-6 h-6 bg-white hover:bg-slate-200 active:scale-90 text-gray-700 rounded-full transition flex items-center justify-center text-sm"
          >
            <BsDash size="1em" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Produc;