"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import localFont from "next/font/local";
import {
  FaUserMd,
  FaSyringe,
  FaBaby,
  FaTeeth,
  FaTeethOpen,
  FaTooth,
  FaChild,
  FaSun,
  FaTools,
  FaBroom,
  FaChevronRight,
  FaTimes,
} from "react-icons/fa";

// ✅ app/fonts/ klasöründen yükleniyor
const elMessiri = localFont({
  src: [
    {
      path: "../../fonts/ElMessiri-SemiBold.ttf",
      weight: "600",
      style: "normal",
    },
    {
      path: "../../fonts/ElMessiri-Bold.ttf",
      weight: "700",
      style: "normal",
    },
  ],
  display: "swap",
});

// Hizmetler listesi
const services = [
  {
    title: "دندانپزشکی تحت بیهوشی بزرگسالان",
    icon: <FaUserMd size={22} />,
    desc: "درمان‌های دندانپزشکی برای بیمارانی که اضطراب دارند، تحت بیهوشی کامل و با نظارت پزشک متخصص انجام می‌شود.",
  },
  {
    title: "عصب‌کشی",
    icon: <FaSyringe size={22} />,
    desc: "درمان ریشه دندان با کمترین درد، برای نجات دندان‌های آسیب‌دیده و جلوگیری از کشیدن آن‌ها انجام می‌گیرد.",
  },
  {
    title: "دندانپزشکی تحت بیهوشی کودکان",
    icon: <FaBaby size={22} />,
    desc: "درمان دندان کودکان در محیطی آرام و بدون استرس، تحت بیهوشی ایمن و با نظارت کامل تیم پزشکی.",
  },
  {
    title: "پروتز",
    icon: <FaTeeth size={22} />,
    desc: "ساخت پروتز ثابت یا متحرک متناسب با دهان شما، برای بازگرداندن ظاهر طبیعی و عملکرد جویدن.",
  },
  {
    title: "ونیر کامپوزیت، لمینیت",
    icon: <FaTeethOpen size={22} />,
    desc: "پوشش‌های نازک و زیبا روی سطح دندان‌ها، برای لبخندی یکدست و درخشان در کمترین زمان.",
  },
  {
    title: "ارتودنسی",
    icon: <FaTooth size={22} />,
    desc: "اصلاح نامنظمی دندان‌ها و فک با استفاده از براکت‌های ثابت یا شفاف، متناسب با سن و نیاز شما.",
  },
  {
    title: "دندانپزشکی کودکان",
    icon: <FaChild size={22} />,
    desc: "مراقبت و درمان دندان‌های شیری و دائمی کودکان، با رویکردی دوستانه و متناسب با سن آن‌ها.",
  },
  {
    title: "بلیچینگ",
    icon: <FaSun size={22} />,
    desc: "سفید کردن حرفه‌ای دندان‌ها با مواد استاندارد و بی‌خطر، برای لبخندی روشن‌تر در یک جلسه.",
  },
  {
    title: "ایمپلنت",
    icon: <FaTools size={22} />,
    desc: "جایگزینی دندان‌های از دست‌رفته با ایمپلنت‌های با کیفیت، برای نتیجه‌ای پایدار و طبیعی.",
  },
  {
    title: "جرم‌گیری",
    icon: <FaBroom size={22} />,
    desc: "پاکسازی جرم و پلاک روی دندان‌ها، برای حفظ سلامت لثه و پیشگیری از پوسیدگی.",
  },
];

// Baloncuk bileşeni
function ServiceBubble({ service, onClose }) {
  if (!service) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-5"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-[#1F2B4D]/40 backdrop-blur-sm bubble-backdrop" />

      <div
        dir="rtl"
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-xs bubble-pop rounded-[26px] bg-white shadow-2xl px-6 pt-8 pb-6 text-center"
      >
        <div className="absolute -top-[10px] left-1/2 -translate-x-1/2 h-5 w-5 rotate-45 bg-white" />

        <button
          onClick={onClose}
          aria-label="بستن"
          className="absolute top-3 left-3 h-8 w-8 flex items-center justify-center rounded-full bg-[#EEF3FC] text-[#4366AF] hover:bg-[#E1EAFB] transition-colors"
        >
          <FaTimes size={13} />
        </button>

        <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-[#EEF5FF] to-[#DCE9FA] text-[#4366AF] shadow-inner">
          {service.image ? (
            <img
              src={service.image}
              alt={service.title}
              className="h-full w-full rounded-full object-cover"
            />
          ) : (
            <div className="scale-[1.8]">{service.icon}</div>
          )}
        </div>

        <h3
          className={`${elMessiri.className} text-lg sm:text-xl font-bold text-[#1F2B4D] mb-2 leading-snug`}
        >
          {service.title}
        </h3>

        <p className="text-sm text-gray-500 leading-relaxed">{service.desc}</p>

        <div className="mt-5 mx-auto h-[2px] w-14 bg-gradient-to-r from-transparent via-[#C4A24F] to-transparent" />
      </div>
    </div>
  );
}

export default function ServicesPage() {
  const [active, setActive] = useState(null);

  useEffect(() => {
    document.body.style.overflow = active ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [active]);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <main
      dir="rtl"
      className={`${elMessiri.className} relative min-h-screen overflow-hidden bg-[#d0dced]`}
    >
      {/* Background shapes */}
      <div className="absolute -right-40 -top-40 h-[520px] w-[620px] rounded-[45%] bg-white" />
      <div className="absolute -bottom-48 -left-32 h-[420px] w-[420px] rounded-full bg-[#DDE9FA]" />

      <section className="relative z-10 mx-auto flex w-full max-w-2xl flex-col items-center px-4 sm:px-6 pt-10 sm:pt-14 pb-20">
        {/* Back link */}
        <Link
          href="/kartvizitMevaredQR"
          className="self-start flex items-center gap-1.5 text-xs sm:text-sm text-[#4366AF] font-medium mb-6 sm:mb-8 hover:text-[#1F2B4D] transition-colors reveal r0"
        >
          <FaChevronRight size={11} />
          صفحه اصلی
        </Link>

        {/* Title */}
        <h1 className="reveal r1 text-3xl sm:text-4xl md:text-5xl font-bold text-[#1F2B4D] text-center tracking-tight">
          خدمات مجموعه ما
        </h1>

        <div className="reveal r2 mt-4 flex items-center justify-center gap-3">
          <span className="h-[2px] w-10 sm:w-14 bg-gradient-to-l from-[#C4A24F] to-[#C4A24F]/20" />
          <FaTooth className="text-[#C4A24F]" size={16} />
          <span className="h-[2px] w-10 sm:w-14 bg-gradient-to-r from-[#C4A24F] to-[#C4A24F]/20" />
        </div>

        {/* Services grid */}
        <div className="mt-10 sm:mt-12 grid w-full grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
          {services.map((s, i) => (
            <button
              key={s.title}
              onClick={() => setActive(s)}
              className={`reveal card-reveal rounded-[20px] border border-[#E7EDF7] bg-white/90 backdrop-blur-sm px-3 py-5 sm:py-6 flex flex-col items-center text-center gap-3 shadow-sm hover:shadow-lg hover:-translate-y-1 hover:border-[#C4A24F] active:scale-[0.97] transition-all duration-300 cursor-pointer`}
              style={{ animationDelay: `${0.15 + i * 0.07}s` }}
            >
              <div className="flex h-12 w-12 sm:h-14 sm:w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#EEF5FF] to-[#DCE9FA] text-[#4366AF] shadow-inner">
                {s.icon}
              </div>
              <h3 className="text-xs sm:text-sm font-semibold text-[#1F2B4D] leading-snug">
                {s.title}
              </h3>
            </button>
          ))}
        </div>
      </section>

      <ServiceBubble service={active} onClose={() => setActive(null)} />

      <style jsx>{`
        @keyframes rise {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .reveal {
          opacity: 0;
          animation: rise 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .r0 {
          animation-delay: 0.05s;
        }
        .r1 {
          animation-delay: 0.15s;
        }
        .r2 {
          animation-delay: 0.28s;
        }
        .card-reveal {
          animation-duration: 0.55s;
        }
        @media (prefers-reduced-motion: reduce) {
          .reveal {
            animation: none;
            opacity: 1;
            transform: none;
          }
        }
      `}</style>

      <style jsx global>{`
        @keyframes bubble-backdrop-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .bubble-backdrop {
          animation: bubble-backdrop-in 0.25s ease forwards;
        }
        @keyframes bubble-pop-in {
          0% {
            opacity: 0;
            transform: scale(0.85) translateY(10px);
          }
          60% {
            opacity: 1;
            transform: scale(1.03) translateY(0);
          }
          100% {
            transform: scale(1) translateY(0);
          }
        }
        .bubble-pop {
          animation: bubble-pop-in 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)
            forwards;
        }
      `}</style>
    </main>
  );
}