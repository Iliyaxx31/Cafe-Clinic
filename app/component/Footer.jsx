import Image from "next/image";
import React from "react";
import { FaPhoneAlt, FaCoffee } from "react-icons/fa";
import { IoLocationSharp } from "react-icons/io5";
import { MdAccessTime } from "react-icons/md";

const Footer = ({ number, store, adres, logo }) => {
  return (
    <footer className= " relative overflow-hidden bg-[#3b3e46]">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-20 bg-cyan-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-5 py-4 flex items-center justify-between gap-4">

        <div className="flex items-center gap-3 shrink-0">
          <div className="relative">
            
 <div className="bg-white/10 rounded-lg p-1">
<div className="w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-cyan-500/10">
  <Image
    src={logo || "/logo.png"}
    alt="logo"
    width={44}
    height={44}
    className="w-full h-full object-contain"
  />
</div>
</div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <FaCoffee className="text-cyan-400 text-[10px]" />
              <span className="text-white font-semibold text-[12px] tracking-wide">Cafe Clinic</span>
            </div>
            <p className="text-cyan-400/50 text-[8px] tracking-widest uppercase">Coffee & Drinks</p>
          </div>
        </div>

        <div className="hidden md:block w-px self-stretch bg-gradient-to-b from-transparent via-white/10 to-transparent" />

        <div className="flex flex-col gap-1.5 items-end">
          <div className="flex items-center gap-2">
            <MdAccessTime className="text-cyan-400/70 text-xs shrink-0" />
            <span className="text-slate-400 font-bold text-xs">{store}</span>
          </div>
          <div className="flex items-center gap-2">
            <IoLocationSharp className="text-cyan-400/70 text-xs shrink-0" />
            <span className="text-slate-400 mt-1 text-xs">{adres}</span>
          </div>
          <div className="flex items-center gap-2">
            <FaPhoneAlt className="text-cyan-300  text-[10px] shrink-0" />
            <span className="text-cyan-300 text-xs mt-1 font-black">{number}</span>
          </div>
        </div>

      </div>

      <div className="border-t border-white/5 py-2 text-center">
        <p className="text-slate-600 text-[10px]  tracking-widest uppercase">
          © Cafe Clinic &nbsp;·&nbsp; تمامی حقوق محفوظ است
        </p>
      </div>
    </footer>
  );
};

export default Footer;