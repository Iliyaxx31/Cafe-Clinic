"use client";

import { useState, useEffect, useMemo } from "react";

export default function NoticeModal({ trigger, onShow }) {
  const [notice, setNotice] = useState(null);
  const [showNotice, setShowNotice] = useState(false);
  const [closing, setClosing] = useState(false);

  // Confetti parçacıkları için sabit rastgele değerler (her render'da değişmesin)
  const confetti = useMemo(() => {
    const colors = ["#e0942f", "#3b82f6", "#ec4899", "#22c55e", "#f43f5e", "#a855f7"];
    return Array.from({ length: 16 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.4,
      duration: 0.9 + Math.random() * 0.6,
      color: colors[i % colors.length],
      rotate: Math.random() * 360,
      drift: (Math.random() - 0.5) * 80,
    }));
  }, []);

  useEffect(() => {
    const fetchNotice = async () => {
      try {
        const noticeRes = await fetch("/api/notice");
        if (noticeRes.ok) {
          const noticeData = await noticeRes.json();
          if (noticeData.active && noticeData.text) {
            setNotice(noticeData);
          }
        }
      } catch (error) {
        console.error("Notice yüklenemedi:", error);
      }
    };

    fetchNotice();
  }, []);

  useEffect(() => {
    if (trigger && notice) {
      const timer = setTimeout(() => {
        setShowNotice(true);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [trigger, notice]);

  useEffect(() => {
    if (showNotice && onShow) {
      onShow();
    }
  }, [showNotice, onShow]);

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setShowNotice(false);
      setClosing(false);
    }, 280);
  };

  if (!showNotice || !notice) return null;

  return (
    <div className={`nm-backdrop ${closing ? "nm-backdrop-out" : "nm-backdrop-in"}`}>
      {/* Confetti patlaması */}
      <div className="nm-confetti-layer">
        {confetti.map((c) => (
          <span
            key={c.id}
            className="nm-confetti-piece"
            style={{
              left: `${c.left}%`,
              backgroundColor: c.color,
              animationDelay: `${c.delay}s`,
              animationDuration: `${c.duration}s`,
              "--drift": `${c.drift}px`,
              "--rotate": `${c.rotate}deg`,
            }}
          />
        ))}
      </div>

      <div className={`nm-frame ${closing ? "nm-card-out" : "nm-card-in"}`}>
        <div className="nm-border-spin" />

        <div className="nm-card" dir="rtl">
          <button onClick={handleClose} className="nm-close" aria-label="Kapat">
            ✕
          </button>

          {/* Kahve fincanı SVG + yükselen buhar */}
          <div className="nm-cup-wrap">
            <svg className="nm-steam" viewBox="0 0 60 40" width="60" height="40">
              <path className="nm-steam-path steam-1" d="M20 38 C 15 28, 25 22, 20 12" />
              <path className="nm-steam-path steam-2" d="M30 38 C 25 26, 35 20, 30 8" />
              <path className="nm-steam-path steam-3" d="M40 38 C 35 28, 45 22, 40 12" />
            </svg>

            <svg viewBox="0 0 64 56" width="64" height="56" className="nm-cup">
              <path
                d="M10 20 h34 v20 a17 17 0 0 1 -17 17 h0 a17 17 0 0 1 -17 -17 Z"
                fill="#fff"
                stroke="#b8641a"
                strokeWidth="2.5"
              />
              <path
                d="M44 24 h6 a7 7 0 0 1 0 14 h-6"
                fill="none"
                stroke="#b8641a"
                strokeWidth="2.5"
              />
              <ellipse cx="27" cy="20" rx="17" ry="3.5" fill="#8a4a1c" />
              <ellipse cx="27" cy="9" rx="15" ry="3" fill="#e0942f" opacity="0.35" />
            </svg>
          </div>

          <h2 className="nm-title">
            <span className="nm-title-icon">📣</span> اطلاعیه
          </h2>

          <p className="nm-text">{notice.text}</p>

          <button onClick={handleClose} className="nm-btn">
            متوجه شدم
          </button>
        </div>
      </div>

      <style jsx>{`
        .nm-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(18, 12, 8, 0.65);
          backdrop-filter: blur(7px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 50;
          padding: 1rem;
          overflow: hidden;
        }
        .nm-backdrop-in {
          animation: nmFade 0.3s ease-out both;
        }
        .nm-backdrop-out {
          animation: nmFadeOut 0.28s ease-in both;
        }
        @keyframes nmFade {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes nmFadeOut {
          from { opacity: 1; }
          to { opacity: 0; }
        }

        /* --- Confetti --- */
        .nm-confetti-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .nm-confetti-piece {
          position: absolute;
          top: 40%;
          width: 8px;
          height: 8px;
          border-radius: 2px;
          opacity: 0;
          animation-name: nmConfettiFall;
          animation-timing-function: ease-out;
          animation-fill-mode: forwards;
        }
        @keyframes nmConfettiFall {
          0% {
            opacity: 1;
            transform: translate(0, 0) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: translate(var(--drift), 220px) rotate(var(--rotate));
          }
        }

        /* --- Kart giriş/çıkış --- */
        .nm-frame {
          position: relative;
          max-width: 24rem;
          width: 100%;
          border-radius: 1.75rem;
          padding: 3px;
        }
        .nm-card-in {
          animation: nmPop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .nm-card-out {
          animation: nmPopOut 0.28s ease-in both;
        }
        @keyframes nmPop {
          0% {
            opacity: 0;
            transform: scale(0.7) rotate(-3deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }
        @keyframes nmPopOut {
          0% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
          100% {
            opacity: 0;
            transform: scale(0.8) rotate(3deg);
          }
        }

        /* --- Dönen ışıklı kenarlık --- */
        .nm-border-spin {
          position: absolute;
          inset: 0;
          border-radius: 1.75rem;
          background: conic-gradient(
            from 0deg,
            #e0942f,
            #3b82f6,
            #ec4899,
            #e0942f
          );
          animation: nmSpin 4s linear infinite;
          filter: blur(1px);
        }
        @keyframes nmSpin {
          to {
            transform: rotate(360deg);
          }
        }

        .nm-card {
          position: relative;
          background: linear-gradient(160deg, #fffaf3 0%, #fff 65%);
          border-radius: 1.6rem;
          padding: 1.75rem 1.5rem 1.75rem;
          text-align: center;
          z-index: 1;
        }

        .nm-close {
          position: absolute;
          top: 0.75rem;
          left: 0.75rem;
          width: 1.75rem;
          height: 1.75rem;
          border-radius: 9999px;
          background: rgba(0, 0, 0, 0.06);
          color: #6b5c4f;
          font-size: 0.8rem;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .nm-close:hover {
          transform: rotate(90deg);
          background: rgba(0, 0, 0, 0.12);
        }

        /* --- Fincan + buhar --- */
        .nm-cup-wrap {
          position: relative;
          width: 64px;
          height: 70px;
          margin: 0 auto 0.5rem;
        }
        .nm-cup {
          position: relative;
          z-index: 1;
          filter: drop-shadow(0 6px 10px rgba(184, 100, 26, 0.25));
          animation: nmCupSettle 0.6s ease-out 0.1s both;
        }
        @keyframes nmCupSettle {
          from {
            opacity: 0;
            transform: translateY(10px) scale(0.85);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .nm-steam {
          position: absolute;
          top: -28px;
          left: 2px;
        }
        .nm-steam-path {
          fill: none;
          stroke: #c9c0b6;
          stroke-width: 2.2;
          stroke-linecap: round;
          opacity: 0;
          stroke-dasharray: 40;
          stroke-dashoffset: 40;
          animation: nmSteamRise 2.6s ease-in-out infinite;
        }
        .steam-1 { animation-delay: 0.2s; }
        .steam-2 { animation-delay: 0.9s; }
        .steam-3 { animation-delay: 1.6s; }
        @keyframes nmSteamRise {
          0% {
            opacity: 0;
            stroke-dashoffset: 40;
            transform: translateY(6px);
          }
          25% {
            opacity: 0.6;
          }
          70% {
            opacity: 0.35;
          }
          100% {
            opacity: 0;
            stroke-dashoffset: 0;
            transform: translateY(-8px);
          }
        }

        .nm-title {
          font-size: 1.2rem;
          font-weight: 800;
          margin-bottom: 0.65rem;
          color: #7a4416;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.4rem;
          animation: nmFadeUp 0.5s ease-out 0.2s both;
        }
        .nm-title-icon {
          display: inline-block;
          animation: nmWiggle 1.6s ease-in-out infinite;
        }
        @keyframes nmWiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-12deg); }
          75% { transform: rotate(12deg); }
        }

        .nm-text {
          color: #4b4038;
          line-height: 1.9;
          margin-bottom: 1.5rem;
          font-size: 0.95rem;
          animation: nmFadeUp 0.5s ease-out 0.3s both;
        }
        @keyframes nmFadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .nm-btn {
          position: relative;
          overflow: hidden;
          background: linear-gradient(90deg, #e0942f, #b8641a);
          color: white;
          padding: 0.65rem 2.25rem;
          border-radius: 9999px;
          font-weight: 700;
          box-shadow: 0 10px 22px -6px rgba(184, 100, 26, 0.55);
          transition: transform 0.15s ease, box-shadow 0.15s ease;
          animation: nmFadeUp 0.5s ease-out 0.4s both;
        }
        .nm-btn:hover {
          transform: translateY(-2px) scale(1.04);
          box-shadow: 0 14px 26px -6px rgba(184, 100, 26, 0.65);
        }
        .nm-btn:active {
          transform: scale(0.96);
        }
      `}</style>
    </div>
  );
}