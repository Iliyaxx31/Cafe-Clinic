"use client";
import Image from "next/image";

export default function IntroScreen({ onStart }) {
  return (
    <div
      onClick={onStart}
      className="fixed inset-0 z-[100] flex items-center justify-center 
                 bg-gradient-to-br from-slate-300 via-blue-200 to-slate-400
                 cursor-pointer overflow-hidden"
    >
      {/* Dev arka plan daireleri */}
      <div className="absolute w-[500px] h-[500px] rounded-full 
                       border-2 border-slate-400/60 
                       animate-[spin_20s_linear_infinite]" />
      <div className="absolute w-[400px] h-[400px] rounded-full 
                       border-2 border-blue-400/50 
                       animate-[spin_15s_linear_infinite_reverse]" />
      <div className="absolute w-[300px] h-[300px] rounded-full 
                       border-2 border-dashed border-slate-500/40 
                       animate-[spin_25s_linear_infinite]" />

      {/* Orbit noktaları */}
      <div className="absolute w-[500px] h-[500px] animate-[spin_20s_linear_infinite]">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 
                         bg-blue-500 rounded-full shadow-md" />
      </div>
      <div className="absolute w-[400px] h-[400px] animate-[spin_15s_linear_infinite_reverse]">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2.5 h-2.5 
                         bg-slate-600 rounded-full shadow-md" />
      </div>

      {/* Köşelerde dolgu şekiller (gri-mavi) */}
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full 
                       bg-slate-500/30 blur-3xl" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full 
                       bg-blue-400/30 blur-3xl" />

      {/* Merkez içerik */}
      <div className="relative z-10 flex flex-col items-center">

        {/* Logo kutusu - gri/mavi temalı */}
        <div className="bg-slate-100/90 rounded-full p-6 shadow-xl mb-8
                         ring-4 ring-blue-300/60 backdrop-blur-sm">
          <Image width={120} height={100} alt="Logom" src="/logo.png" />
        </div>

        {/* CTA buton - mavi-gri gradyan */}
        <div className="relative group">
          <div className="absolute inset-0 rounded-full bg-blue-500/50 
                           blur-xl animate-pulse scale-110" />
          
          <div className="relative bg-gradient-to-r from-slate-600 to-blue-600
                           px-10 py-4 rounded-full 
                           shadow-[0_4px_25px_rgba(71,85,105,0.5)]
                           border border-blue-400/40
                           flex items-center gap-3
                           transition-transform duration-300 active:scale-95">
            <span className="text-white font-bold text-base">
              برای ورود به منو لمس کنید
            </span>
            <div className="w-8 h-8 rounded-full bg-white/20 
                             flex items-center justify-center
                             text-white">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} 
                      d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </div>
          </div>
        </div>

        {/* Alt göstergeler */}
        <div className="flex gap-1.5 mt-7">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse [animation-delay:0.2s]" />
          <span className="w-1.5 h-1.5 rounded-full bg-slate-500 animate-pulse [animation-delay:0.4s]" />
        </div>
      </div>
    </div>
  );
}