"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { El_Messiri } from "next/font/google";
import {
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaInstagram,
  FaChevronLeft,
  FaTooth,
  FaCoffee,
} from "react-icons/fa";

const elMessiri = El_Messiri({
  subsets: ["arabic"],
  weight: ["600", "700"],
  display: "swap",
});

const clinic = {
  name: "کلینیک تخصصی دندانپزشکی دکتر کرد",
  slogan: "همراه شما تا لبخندی دلنشین",

  phone: "01144154181",
  phoneHref: "tel:+98",

  address: "F89X+PW9, Amol, İran",
  mapHref:
    "https://www.google.com/maps/search/?api=1&query=F89X%2BPW9+Amol+Iran",

  instagram: "@dr.kord_clinic",
  instagramHref: "https://instagram.com/dr.kord_clinic",

  cafe: "کافه ما",
  cafeSub: "cafe-clinic-amol.ir",
  cafeHref: "https://www.cafe-clinic-amol.ir/",
};

const TOOTH_PATH =
  `M2680 2963 c-62 -10 -147 -39 -300 -103 -160 -66 -274 -103 -352
-115 -46 -7 -49 -28 -8 -45 59 -24 160 -7 379 64 235 77 326 94 430 78 176
-26 281 -121 338 -307 30 -99 20 -395 -28 -820 -18 -166 -75 -524 -83 -533 -3
-2 -89 49 -193 114 -103 65 -233 141 -289 169 -373 191 -627 91 -739 -290 -15
-50 -42 -184 -61 -300 -54 -327 -85 -451 -125 -493 -32 -35 -81 -29 -124 13
-85 86 -129 247 -185 685 -32 250 -61 294 -190 288 -59 -3 -82 -12 -240 -90
-96 -48 -231 -106 -300 -129 -111 -37 -139 -42 -244 -47 -131 -5 -238 9 -299
40 -60 30 -79 2 -29 -44 61 -57 169 -88 313 -88 152 0 289 34 601 151 86 33
166 59 177 59 11 0 27 -10 35 -22 8 -13 38 -139 66 -281 77 -388 118 -512 200
-601 110 -119 249 -112 325 18 42 72 63 148 115 421 63 332 92 416 173 510 56
65 127 98 222 103 150 8 283 -46 557 -224 92 -60 174 -113 183 -119 14 -9 11
-25 -25 -144 -123 -405 -236 -582 -328 -514 -97 71 -157 237 -202 553 -27 190
-41 220 -97 220 -14 0 -15 -13 -9 -95 20 -287 111 -621 201 -739 69 -90 215
-102 311 -25 102 81 201 273 279 539 15 52 29 96 30 98 1 1 90 -47 196 -108
365 -209 746 -391 1028 -490 653 -230 1271 -331 1931 -317 604 13 1090 101
1570 284 579 221 1073 570 1512 1070 102 116 103 117 210 83 107 -33 246 -39
236 -9 -2 5 -39 25 -83 44 -148 65 -233 138 -280 245 -41 89 -59 123 -69 124
-18 2 -22 -50 -9 -119 24 -130 27 -189 10 -221 -8 -16 -80 -92 -159 -169 -283
-278 -562 -480 -897 -649 -522 -264 -1069 -407 -1747 -457 -247 -18 -793 -7
-1017 20 -672 81 -1315 275 -1922 578 -252 126 -465 247 -465 263 0 5 15 86
34 182 61 305 106 655 125 968 18 306 -23 448 -170 584 -65 60 -153 108 -244
131 -55 14 -212 19 -275 8z`;

const TEXT_PATH =
  `M1263 2896 c-135 -44 -225 -146 -267 -302 -37 -135 -30 -402 15 -644
25 -128 94 -409 111 -445 16 -36 57 -55 118 -55 46 0 50 2 50 23 0 13 -22 119
-49 236 -77 328 -86 391 -86 596 0 142 4 192 17 235 24 78 72 146 125 176 40
24 52 26 121 22 81 -5 133 -23 347 -122 55 -25 136 -55 180 -67 107 -28 266
-30 350 -5 68 20 115 50 115 73 0 13 -15 14 -107 8 -122 -8 -233 4 -320 35
-54 19 -130 59 -300 159 -109 64 -173 84 -283 88 -62 2 -110 -2 -137 -11z
M4302 2637 c-9 -11 -12 -98 -10 -348 l3 -334 219 -3 c264 -3 308 5 372 72 58
61 67 102 62 292 -4 174 -13 208 -75 266 -59 56 -88 62 -334 66 -188 3 -227 1
-237 -11z m407 -133 c65 -26 71 -43 71 -210 l0 -146 -34 -34 -35 -35 -123 3
-123 3 -3 205 c-1 112 0 210 2 217 8 20 195 17 245 -3z M5892 2642 c-9 -7 -12
-83 -10 -348 l3 -339 80 0 80 0 0 345 0 345 -70 3 c-38 1 -76 -2 -83 -6z
M6274 2642 c-22 -14 -214 -319 -214 -339 0 -11 41 -83 90 -159 141 -216 116
-194 220 -194 52 0 90 4 90 10 0 5 -52 84 -115 176 -63 91 -112 171 -108 177
4 6 55 81 114 166 59 85 105 159 103 163 -6 10 -165 10 -180 0z M7953 2644
c-9 -4 -13 -33 -13 -95 l0 -89 -121 0 c-66 0 -141 -5 -166 -11 -96 -25 -148
-119 -142 -257 5 -97 36 -163 98 -207 l43 -30 214 -3 214 -3 -2 348 -3 348
-55 2 c-30 1 -61 -1 -67 -3z m-15 -441 l-3 -128 -100 0 c-120 1 -157 16 -175
71 -20 59 -7 123 29 156 30 27 35 28 141 28 l111 0 -3 -127z M1378 2495 c-51
-34 -88 -116 -101 -218 -12 -99 7 -257 47 -382 24 -76 62 -152 71 -143 2 2 -5
49 -17 103 -15 71 -21 138 -22 230 -1 147 12 207 65 289 36 57 47 109 29 131
-17 21 -30 19 -72 -10z M5139 2508 c-20 -5 -52 -25 -70 -44 l-34 -35 0 -237 0
-237 70 0 70 0 5 196 c4 143 9 200 18 212 10 11 34 17 80 19 l67 3 3 59 c2 41
-1 62 -10 67 -17 12 -154 9 -199 -3z M6627 2506 c-58 -16 -104 -57 -118 -106
-7 -21 -10 -97 -7 -185 3 -135 5 -154 26 -187 40 -64 85 -78 251 -78 172 0
221 10 260 56 38 42 43 81 39 266 l-3 147 -30 31 c-54 57 -77 64 -230 67 -95
2 -155 -2 -188 -11z m287 -147 c25 -20 26 -24 26 -124 0 -100 -1 -104 -26
-124 -23 -18 -41 -21 -128 -21 -90 0 -105 3 -124 21 -21 19 -22 28 -20 132 3
108 4 112 28 124 15 8 64 13 121 13 82 0 100 -3 123 -21z M7283 2510 c-45 -10
-81 -36 -104 -73 -18 -30 -19 -49 -17 -257 l3 -225 73 -3 72 -3 0 194 c0 235
0 235 100 239 l65 3 3 59 c2 41 -1 62 -10 67 -16 11 -141 10 -185 -1z M5324
2087 c-3 -8 -4 -41 -2 -73 l3 -59 75 0 75 0 0 70 0 70 -73 3 c-55 2 -74 0 -78
-11z M4950 1440 l0 -50 -59 0 c-77 0 -106 -12 -131 -52 -24 -39 -27 -122 -6
-172 23 -56 48 -66 158 -66 l98 0 0 195 0 195 -30 0 c-29 0 -30 -1 -30 -50z
m0 -195 l0 -75 -53 0 c-70 0 -92 16 -92 68 0 60 25 82 92 82 l53 0 0 -75z
M6180 1295 l0 -195 35 0 35 0 0 195 0 195 -35 0 -35 0 0 -195z M6730 1295 l0
-195 35 0 35 0 0 195 0 195 -35 0 -35 0 0 -195z M6850 1460 c0 -28 3 -30 35
-30 32 0 35 2 35 30 0 28 -3 30 -35 30 -32 0 -35 -2 -35 -30z M7270 1460 c0
-28 3 -30 35 -30 32 0 35 2 35 30 0 28 -3 30 -35 30 -32 0 -35 -2 -35 -30z
M5720 1430 c0 -33 -3 -40 -20 -40 -16 0 -20 -7 -20 -35 0 -28 4 -35 20 -35 19
0 20 -7 20 -100 0 -113 5 -120 79 -120 40 0 41 1 41 35 0 32 -2 35 -30 35
l-31 0 3 73 c3 70 4 72 31 75 24 3 27 8 27 38 0 31 -2 34 -30 34 -28 0 -30 2
-30 40 0 38 -2 40 -30 40 -28 0 -30 -2 -30 -40z M5157 1380 c-23 -4 -52 -20
-70 -38 -27 -27 -31 -40 -35 -94 -6 -114 37 -148 186 -148 l72 0 0 35 0 35
-83 0 c-77 0 -107 9 -107 32 0 4 47 8 105 8 l105 0 0 56 c0 48 -4 59 -29 85
-16 16 -38 29 -48 29 -10 0 -27 2 -38 4 -11 2 -37 1 -58 -4z m102 -74 c24 -25
2 -36 -70 -36 -56 0 -69 3 -69 15 0 38 106 54 139 21z M5395 1374 c-13 -13
-15 -37 -13 -143 l3 -126 32 -3 32 -3 3 113 3 113 40 3 c69 5 79 -11 83 -127
l4 -101 29 0 29 0 0 105 c0 122 -12 157 -61 174 -50 17 -164 14 -184 -5z
M5898 1384 c-5 -4 -8 -20 -8 -36 l0 -28 80 0 c65 0 82 -3 87 -16 9 -24 -15
-34 -84 -34 -60 0 -63 -1 -79 -32 -11 -20 -14 -45 -11 -70 9 -64 16 -68 139
-68 l110 0 -4 120 c-4 156 -10 164 -136 168 -48 2 -90 0 -94 -4z m162 -199 c0
-23 -3 -25 -47 -25 -56 0 -78 11 -70 34 5 12 20 16 62 16 52 0 55 -1 55 -25z
M6536 1380 c-62 -12 -86 -47 -86 -127 0 -112 43 -153 164 -153 l66 0 0 35 0
35 -68 0 c-81 0 -102 15 -102 73 0 58 26 77 105 77 l65 0 0 35 0 35 -52 -1
c-29 -1 -71 -5 -92 -9z M6857 1383 c-4 -3 -7 -69 -7 -145 l0 -138 35 0 35 0 0
145 0 145 -28 0 c-16 0 -32 -3 -35 -7z M6975 1374 c-13 -13 -15 -37 -13 -143
l3 -126 32 -3 32 -3 3 113 3 113 40 3 c69 5 79 -11 83 -127 l4 -101 29 0 29 0
0 105 c0 122 -12 157 -61 174 -50 17 -164 14 -184 -5z M7277 1383 c-4 -3 -7
-69 -7 -145 l0 -138 35 0 35 0 0 145 0 145 -28 0 c-16 0 -32 -3 -35 -7z M7476
1380 c-62 -12 -86 -47 -86 -127 0 -112 43 -153 164 -153 l66 0 0 35 0 35 -68
0 c-81 0 -102 15 -102 73 0 58 26 77 105 77 l65 0 0 35 0 35 -52 -1 c-29 -1
-71 -5 -92 -9z`;

function AnimatedClinicLogo({
  width = 400,
  height = 80,
  color = "#1F2B4D",
  drawDuration = 1500,
  className = "",
  onDone,
}) {
  const strokeRef = useRef(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const path = strokeRef.current;
    if (!path) return;

    const length = path.getTotalLength();
    path.style.strokeDasharray = String(length);
    path.style.strokeDashoffset = String(length);
    path.getBoundingClientRect();
    path.style.transition = `stroke-dashoffset ${drawDuration}ms cubic-bezier(0.65,0,0.35,1)`;

    const raf = requestAnimationFrame(() => {
      path.style.strokeDashoffset = "0";
    });

    const t = setTimeout(() => {
      setDrawn(true);
      onDone && onDone();
    }, drawDuration);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t);
    };
  }, [drawDuration]);

  return (
    <svg
      viewBox="0 0 985 298"
      width={width}
      height={height}
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <g transform="translate(0,298) scale(0.1,-0.1)">
        <path
          ref={strokeRef}
          d={TOOTH_PATH}
          fill="none"
          stroke={color}
          strokeWidth="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={TOOTH_PATH}
          fill={color}
          style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.35s ease" }}
        />
        <path
          d={TEXT_PATH}
          fill={color}
          style={{ opacity: drawn ? 1 : 0, transition: "opacity 0.5s ease 0.1s" }}
        />
      </g>
    </svg>
  );
}

function Card({ icon, title, sub, href, external }) {
  return (
    <a
      href={href}
      target={external ? "_blank" : undefined}
      rel={external ? "noopener noreferrer" : undefined}
      className="group flex items-center gap-3 sm:gap-4 rounded-[18px] sm:rounded-[22px] border border-[#E7EDF7] bg-white/95 backdrop-blur-sm px-3 sm:px-5 py-3 sm:py-4 shadow-sm hover:shadow-lg hover:border-[#C4A24F] hover:scale-[1.02] transition-all duration-300"
    >
      <FaChevronLeft className="text-gray-300 group-hover:text-[#C4A24F] group-hover:translate-x-1 transition-all" size={14} />

      <div className="flex-1 text-center">
        <h3 className="font-semibold text-sm sm:text-base text-[#1F2B4D] group-hover:text-[#C4A24F] transition-colors">
          {title}
        </h3>
        <p className="mt-1 text-xs sm:text-sm text-gray-400 group-hover:text-gray-500 transition-colors">
          {sub}
        </p>
      </div>

      <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-[#EEF3FC] text-[#4366AF] group-hover:bg-[#C4A24F] group-hover:text-white transition-all duration-300">
        {icon}
      </div>
    </a>
  );
}

export default function Page() {
  return (
    <main
      dir="rtl"
      className="relative flex min-h-screen flex-col items-center justify-between bg-gradient-to-b from-[#d0dced] to-[#e3e8ef]"
    >
      {/* Ana içerik - ortada */}
      <div className="flex-1 flex items-center justify-center w-full">
        <section className="relative z-10 mx-auto flex w-full max-w-md lg:max-w-2xl flex-col items-center px-4 sm:px-8 py-8 sm:py-12">
          {/* Logo */}
          <div className="flex flex-col items-center">
            <div className="mt-2 mb-8 sm:mb-10">
              <AnimatedClinicLogo 
                width={Math.min(280, typeof window !== 'undefined' && window.innerWidth < 640 ? 200 : 280)} 
                height={66} 
                drawDuration={1300}
              />
            </div>
          </div>

          {/* Başlık */}
          <h1
            style={{ animationDelay: "1.4s" }}
            className={`${elMessiri.className} animate-fade-up text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2B4D] text-center tracking-tight leading-tight`}
          >
            کلینیک تخصصی دندانپزشکی{" "}
            <span className="text-[#C4A24F] drop-shadow-md relative inline-block">
              دکتر کرد
              <span className="absolute -bottom-1 left-0 w-full h-[3px] bg-gradient-to-r from-transparent via-[#C4A24F] to-transparent rounded-full"></span>
            </span>
          </h1>

          {/* Diş Animasyonu */}
          <div
            style={{ animationDelay: "1.55s" }}
            className="animate-fade-up mt-6 sm:mt-8 flex items-center w-full justify-center px-4"
          >
            <div className="h-[2px] flex-1 max-w-[80px] sm:max-w-[120px] lg:max-w-[160px] bg-gradient-to-l from-[#C4A24F] to-[#C4A24F]/20" />

            <div className="mx-4 sm:mx-6 flex h-20 w-20 sm:h-28 sm:w-28 lg:h-32 lg:w-32 items-center justify-center rounded-full bg-gradient-to-br from-[#EEF5FF] to-[#DCE9FA] shadow-xl flex-shrink-0 relative group cursor-default">
              <div className="absolute inset-0 rounded-full bg-[#C4A24F]/10 animate-pulse" />
              <div className="absolute inset-0 rounded-full border-2 border-[#C4A24F]/20 animate-spin-slow" />
              <div className="absolute inset-1 rounded-full border border-[#C4A24F]/10 animate-spin-slow-reverse" />

              <svg
                viewBox="0 0 100 100"
                className="relative z-10 w-11 h-11 sm:w-16 sm:h-16 lg:w-[72px] lg:h-[72px] animate-tooth-breathe"
              >
                <path
                  d="M50 8
                     C68 8 82 20 82 38
                     C82 52 76 62 72 76
                     C70 84 64 92 58 92
                     C53 92 52 80 50 72
                     C48 80 47 92 42 92
                     C36 92 30 84 28 76
                     C24 62 18 52 18 38
                     C18 20 32 8 50 8 Z"
                  fill="#a3a8aa"
                  stroke="#DCE6F5"
                  strokeWidth="2"
                />
                <path
                  d="M50 14 C50 40 50 66 50 86"
                  stroke="#E7EEF8"
                  strokeWidth="2"
                  fill="none"
                  strokeLinecap="round"
                />
                <ellipse
                  cx="37"
                  cy="26"
                  rx="7"
                  ry="11"
                  fill="#FFFFFF"
                  className="animate-tooth-shine"
                  transform="rotate(-20 37 26)"
                />
                <path
                  d="M40 46 Q50 54 60 46"
                  stroke="#4366AF"
                  strokeWidth="3"
                  strokeLinecap="round"
                  fill="none"
                />
                <circle cx="40" cy="34" r="2.8" fill="#1F2B4D" />
                <circle cx="60" cy="34" r="2.8" fill="#1F2B4D" />
              </svg>

              <span className="absolute -top-1 -right-1 text-[10px] animate-ping opacity-60">✨</span>
              <span className="absolute -bottom-1 -left-1 text-[10px] animate-ping opacity-60 delay-300">✨</span>
            </div>

            <div className="h-[2px] flex-1 max-w-[80px] sm:max-w-[120px] lg:max-w-[160px] bg-gradient-to-r from-[#C4A24F] to-[#C4A24F]/20" />
          </div>

          {/* Linkler */}
          <div className="mt-8 sm:mt-10 flex w-full max-w-lg flex-col gap-3 sm:gap-4">
            <div className="animate-fade-up" style={{ animationDelay: "1.7s" }}>
              <Link
                href="/kartvizitMevaredQR/merhaba"
                className="flex items-center gap-3 sm:gap-4 rounded-[18px] sm:rounded-[22px] border-2 border-[#C4A24F] bg-gradient-to-r from-[#C4A24F]/10 to-white/90 px-3 sm:px-5 py-3 sm:py-4 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-300 group"
              >
                <FaChevronLeft className="text-[#C4A24F] group-hover:translate-x-1 transition-transform" size={14} />

                <div className="flex-1 text-center">
                  <h3 className="font-semibold text-md sm:text-base text-[#1F2B4D] group-hover:text-[#C4A24F] transition-colors">
                    خدمات ما
                  </h3>
                  <p className="mt-1 text-sm sm:text-md text-[#C4A24F]/70">
                    مشاهده همه خدمات تخصصی
                  </p>
                </div>

                <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl bg-[#C4A24F] text-white shadow-md group-hover:shadow-lg transition-all">
                  <FaTooth size={18} />
                </div>
              </Link>
            </div>

            <div className="animate-fade-up" style={{ animationDelay: "1.8s" }}>
              <Card
                title={clinic.cafe}
                sub={clinic.cafeSub}
                href={clinic.cafeHref}
                icon={<FaCoffee size={16} />}
                external
              />
            </div>

            <div className="animate-fade-up" style={{ animationDelay: "1.9s" }}>
              <Card
                title="تماس بگیرید"
                sub={clinic.phone}
                href={clinic.phoneHref}
                icon={<FaPhoneAlt size={16} />}
              />
            </div>

            <div className="animate-fade-up" style={{ animationDelay: "2.0s" }}>
              <Card
                title="نمایش مسیر"
                sub={clinic.address}
                href={clinic.mapHref}
                icon={<FaMapMarkerAlt size={16} />}
              />
            </div>

            <div className="animate-fade-up" style={{ animationDelay: "2.1s" }}>
              <Card
                title="دنبال کردن در اینستاگرام"
                sub={clinic.instagram}
                href={clinic.instagramHref}
                icon={<FaInstagram size={16} />}
                external
              />
            </div>
          </div>
        </section>
      </div>

      {/* Pembe Dalgalı Alt Çerçeve - Slogan ile birlikte */}
      <div
        className="relative w-full bg-gradient-to-r from-[#f9a993] via-[#f8b49f] to-[#f9a993] z-0 mt-auto"
        style={{
          borderTopLeftRadius: "45% 100%",
          borderTopRightRadius: "45% 100%",
          paddingTop: "2rem",
          paddingBottom: "1.5rem",
        }}
      >
        {/* Dekoratif küçük diş ikonu */}
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 text-white/30 text-2xl">
          ✦
        </div>
        
        <div className="text-center px-4">
          <p 
            className={`${elMessiri.className} text-white/95 text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold tracking-wider drop-shadow-sm`}
            style={{
              textShadow: "0 2px 15px rgba(0,0,0,0.08)"
            }}
          >
            {clinic.slogan}
          </p>
          {/* Dekoratif alt çizgi */}
          <div className="mt-2 flex justify-center items-center gap-2">
            <div className="h-[1px] w-8 bg-white/30"></div>
            <span className="text-white/40 text-xs">✦</span>
            <div className="h-[1px] w-8 bg-white/30"></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); }
          50% { transform: translateY(-6px) scale(1.05); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        @keyframes ping {
          0%, 100% { opacity: 0; transform: scale(0.5); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes tooth-breathe {
          0%, 100% { transform: translateY(0px) rotate(0deg) scale(1); }
          25% { transform: translateY(-4px) rotate(-4deg) scale(1.03); }
          50% { transform: translateY(-6px) rotate(0deg) scale(1.06); }
          75% { transform: translateY(-4px) rotate(4deg) scale(1.03); }
        }
        @keyframes tooth-shine {
          0%, 100% { opacity: 0.9; }
          50% { opacity: 0.4; }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
        .animate-spin-slow-reverse {
          animation: spin-slow-reverse 6s linear infinite;
        }
        .animate-ping {
          animation: ping 2s ease-in-out infinite;
        }
        .animate-tooth-breathe {
          animation: tooth-breathe 3.5s ease-in-out infinite;
          transform-origin: center bottom;
        }
        .animate-tooth-shine {
          animation: tooth-shine 2.2s ease-in-out infinite;
        }
        .delay-300 {
          animation-delay: 300ms;
        }
        @keyframes fade-up {
          0% { opacity: 0; transform: translateY(16px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up {
          opacity: 0;
          animation: fade-up 0.5s ease-out forwards;
        }
      `}</style>
    </main>
  );
}