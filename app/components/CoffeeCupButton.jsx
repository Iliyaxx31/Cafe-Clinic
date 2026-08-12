"use client";
import { useState, useEffect } from "react";

export default function CoffeeCupButton({ 
  cartCount, 
  onClick, 
  justAdded, 
  burst, 
  heartBeat,
  isHeartMoment 
}) {
  const [heartBeatState, setHeartBeatState] = useState(0);
  const [isHeart, setIsHeart] = useState(false);

  useEffect(() => {
    if (heartBeat === 0) return;
    setIsHeart(true);
    const t = setTimeout(() => setIsHeart(false), 2200);
    return () => clearTimeout(t);
  }, [heartBeat]);

  // Arada bir (12-20 sn arası rastgele) buhar kalbe dönüşsün
  useEffect(() => {
    let timeoutId;
    const schedule = () => {
      const delay = 12000 + Math.random() * 8000;
      timeoutId = setTimeout(() => {
        setHeartBeatState((n) => n + 1);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <div className="fixed bottom-5 left-5 z-50 flex items-end gap-2">
      <button
        onClick={onClick}
        aria-label="سبد خرید"
        className={`coffee-cup-btn relative flex items-center justify-center w-16 h-16 rounded-full
          bg-gradient-to-br from-[#8a5a34] via-[#6f4527] to-[#4a2c17]
          border-2 border-[#d9b382]/50 shadow-lg shadow-black/40
          transition-transform duration-300 hover:scale-110 active:scale-95
          ${justAdded ? "cup-jiggle" : ""}`}
      >
        {/* tıklama patlaması */}
        {burst > 0 && (
          <span key={burst} className="absolute inset-0 pointer-events-none">
            {[...Array(7)].map((_, i) => {
              const angle = (360 / 7) * i + Math.random() * 20;
              const dist = 34 + Math.random() * 14;
              const tx = Math.cos((angle * Math.PI) / 180) * dist;
              const ty = Math.sin((angle * Math.PI) / 180) * dist;
              const isBean = i % 2 === 0;
              return (
                <span
                  key={i}
                  className="burst-particle absolute top-1/2 left-1/2"
                  style={{ 
                    "--tx": `${tx}px`, 
                    "--ty": `${ty}px`, 
                    animationDelay: `${i * 0.02}s` 
                  }}
                >
                  {isBean ? (
                    <svg width="10" height="8" viewBox="0 0 24 18">
                      <ellipse cx="12" cy="9" rx="11" ry="8" fill="#4a2c17" transform="rotate(-12 12 9)" />
                      <path d="M12 2.5 Q8.5 9 12 15.5" stroke="#e8dcc8" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                    </svg>
                  ) : (
                    <span className="block w-1.5 h-1.5 rounded-full bg-[#d9b382]" />
                  )}
                </span>
              );
            })}
          </span>
        )}

        {/* buhar */}
        <svg
          className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-7 pointer-events-none"
          viewBox="0 0 40 30"
          fill="none"
        >
          {isHeart ? (
            <path
              className="steam-heart"
              d="M20 26 C10 18 8 10 14 7 C17 5.3 20 7 20 10 C20 7 23 5.3 26 7 C32 10 30 18 20 26 Z"
              fill="#e8a0a8"
            />
          ) : (
            <>
              <path className="steam steam-1" d="M8 28 C3 20 13 16 8 6" stroke="#e8dcc8" strokeWidth="2.2" strokeLinecap="round" />
              <path className="steam steam-2" d="M20 28 C15 20 25 15 20 4" stroke="#e8dcc8" strokeWidth="2.2" strokeLinecap="round" />
              <path className="steam steam-3" d="M32 28 C27 20 37 16 32 6" stroke="#e8dcc8" strokeWidth="2.2" strokeLinecap="round" />
            </>
          )}
        </svg>

        {/* kağıt bardak */}
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="3.5" width="16" height="2.6" rx="1.3" fill="#e8dcc8" />
          <path d="M5.3 7.2 L18.7 7.2 L17.1 19.5 C15.2 21 8.8 21 6.9 19.5 Z" fill="#f6e7d8" stroke="#3a2313" strokeWidth="0.4" />
          <rect x="5.6" y="10.4" width="12.8" height="4" fill="#8a5a34" opacity="0.9" />
        </svg>

        {/* çekirdek sayaç */}
        {cartCount > 0 && (
          <span key={cartCount} className="bean-pop absolute -top-1.5 -right-1.5">
            <svg width="24" height="18" viewBox="0 0 24 18">
              <ellipse cx="12" cy="9" rx="11" ry="8" fill="#c0392b" stroke="white" strokeWidth="1" transform="rotate(-12 12 9)" />
              <path d="M12 2.5 Q8.5 9 12 15.5" stroke="#f6e7d8" strokeWidth="1.4" fill="none" strokeLinecap="round" />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
              {cartCount}
            </span>
          </span>
        )}
      </button>

      <span
        className={`order-tag whitespace-nowrap rounded-full bg-[#3a2313]/90 text-[#f6e7d8] text-xs font-semibold px-3 py-2 shadow-md transition-all duration-300 ${
          justAdded ? "order-tag-show" : "order-tag-hide"
        }`}
      >
        سبد شما: {cartCount} مورد
      </span>

      <style jsx global>{`
        @keyframes steam-rise {
          0% { transform: translateY(0) scaleY(0.6); opacity: 0; }
          25% { opacity: 0.9; }
          80% { opacity: 0.15; }
          100% { transform: translateY(-9px) scaleY(1.15); opacity: 0; }
        }
        .steam {
          transform-origin: bottom center;
          animation: steam-rise 2.2s ease-in-out infinite;
        }
        .steam-1 { animation-delay: 0s; }
        .steam-2 { animation-delay: 0.5s; }
        .steam-3 { animation-delay: 1s; }

        @keyframes cup-jiggle {
          0% { transform: rotate(0deg) scale(1); }
          20% { transform: rotate(-9deg) scale(1.08); }
          40% { transform: rotate(8deg) scale(1.05); }
          60% { transform: rotate(-5deg) scale(1.03); }
          80% { transform: rotate(3deg) scale(1.01); }
          100% { transform: rotate(0deg) scale(1); }
        }
        .cup-jiggle { animation: cup-jiggle 0.55s ease-in-out; }

        @keyframes bean-pop {
          0% { transform: scale(0.3); opacity: 0; }
          60% { transform: scale(1.25); opacity: 1; }
          100% { transform: scale(1); }
        }
        .bean-pop { animation: bean-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1); }

        .order-tag { opacity: 0; transform: translateX(-8px) scale(0.9); }
        .order-tag-show { opacity: 1; transform: translateX(0) scale(1); }
        .order-tag-hide { opacity: 0; transform: translateX(-8px) scale(0.9); }

        @keyframes burst-out {
          0% { transform: translate(-50%, -50%) scale(0.4); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1); opacity: 0; }
        }
        .burst-particle { animation: burst-out 0.65s ease-out forwards; }

        @keyframes steam-heart-pulse {
          0% { transform: scale(0.5) translateY(6px); opacity: 0; }
          25% { transform: scale(1.1) translateY(0); opacity: 1; }
          75% { transform: scale(1) translateY(-4px); opacity: 0.9; }
          100% { transform: scale(0.7) translateY(-14px); opacity: 0; }
        }
        .steam-heart { transform-origin: center; animation: steam-heart-pulse 2.2s ease-in-out; }
      `}</style>
    </div>
  );
}