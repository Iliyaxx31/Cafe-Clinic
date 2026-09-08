"use client";

import { useState, useMemo } from "react";
import data from "./data.json";

const CURRENCY = "₺";

const LABELS = {
  tr: {
    lang: "فارسی",
    all: "Tümü",
    sub: "Personel Sipariş Panosu",
    total: "Toplam",
    items: "ürün",
    clear: "Temizle",
    empty: "Toplamak için ürüne dokun",
  },
  fa: {
    lang: "Türkçe",
    all: "همه",
    sub: "پنل سفارش کارکنان",
    total: "جمع",
    items: "قلم",
    clear: "پاک کردن",
    empty: "برای جمع زدن روی کالا بزن",
  },
};

function parsePrice(price) {
  if (price === undefined || price === null) return 0;
  const str = String(price).trim();
  if (!str) return 0;
  const beforeDot = str.split(".")[0].replace(/[^\d]/g, "");
  if (!beforeDot) return 0;
  return parseInt(beforeDot, 10);
}

function formatDisplayPrice(price) {
  const str = String(price ?? "").trim();
  if (str === "" || str === "0") return "—";
  return str;
}

export default function StaffMenuPage() {
  const [lang, setLang] = useState("tr");
  const [activeCat, setActiveCat] = useState("all");
  const [cart, setCart] = useState({});
  const [secretClicks, setSecretClicks] = useState(0);
  const [discoMode, setDiscoMode] = useState(false);
  const isRtl = lang === "fa";
  const t = LABELS[lang];

  const handleSecretTap = () => {
    setSecretClicks((n) => {
      const next = n + 1;
      if (next >= 5) {
        setDiscoMode(true);
        setTimeout(() => setDiscoMode(false), 4000);
        return 0;
      }
      return next;
    });
  };

  const visibleCategories = useMemo(() => {
    if (activeCat === "all") {
      return data.categories || [];
    }
    return data.categories?.filter((c) => c.id === activeCat) || [];
  }, [activeCat]);

  const allItemsById = useMemo(() => {
    const map = {};
    data.categories?.forEach((cat) =>
      cat.items?.forEach((item) => (map[item.id] = item))
    );
    return map;
  }, []);

  const { totalCount, totalPrice } = useMemo(() => {
    let count = 0;
    let price = 0;
    for (const [id, qty] of Object.entries(cart)) {
      if (qty <= 0) continue;
      count += qty;
      price += parsePrice(allItemsById[id]?.price) * qty;
    }
    return { totalCount: count, totalPrice: price };
  }, [cart, allItemsById]);

  const addOne = (item) => {
    if (parsePrice(item.price) <= 0) return;
    setCart((prev) => ({ ...prev, [item.id]: (prev[item.id] || 0) + 1 }));
  };

  const removeOne = (itemId, e) => {
    e.stopPropagation();
    setCart((prev) => {
      const next = { ...prev };
      const qty = (next[itemId] || 0) - 1;
      if (qty <= 0) delete next[itemId];
      else next[itemId] = qty;
      return next;
    });
  };

  const clearCart = () => setCart({});

  return (
    <div
      dir={isRtl ? "rtl" : "ltr"}
      className={
        "relative min-h-screen bg-[#0b0014] text-pink-50 pb-10 overflow-x-hidden " +
        (discoMode ? "animate-disco" : "")
      }
    >
      {/* Arkaplan */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-pink-600/25 blur-3xl animate-blob-a" />
        <div className="absolute top-1/3 -right-24 h-80 w-80 rounded-full bg-fuchsia-500/20 blur-3xl animate-blob-b" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-lime-400/10 blur-3xl animate-blob-c" />
      </div>

      <span
        className="pointer-events-none fixed bottom-1 left-1 z-50 select-none text-[8px] font-bold text-[#2f1452]"
        aria-hidden="true"
      >
        جانه من
      </span>

      {/* Header */}
      <div className="relative max-w-2xl mx-auto flex items-center justify-between gap-4 px-5 pt-7 pb-4 border-b border-pink-500/25">
        <div>
          <h1
            onClick={handleSecretTap}
            className="cursor-default text-2xl font-black uppercase tracking-wide text-pink-300 animate-neon-flicker"
          >
            {data.cafeName || "CAFE"}
          </h1>
          <p className="mt-1 text-xs font-bold uppercase tracking-widest text-lime-300">
            {t.sub}
          </p>
        </div>
        <button
          onClick={() => setLang(lang === "tr" ? "fa" : "tr")}
          className="shrink-0 rounded-lg border border-pink-400 px-4 py-2.5 text-sm font-bold text-pink-300 transition-all hover:bg-pink-500 hover:text-[#0b0014] hover:scale-105 active:scale-95"
        >
          {t.lang}
        </button>
      </div>

      {/* Sabit üst blok */}
      <div className="sticky top-0 z-20 bg-[#0b0014]/95 backdrop-blur border-b border-pink-500/25">
        <div className="max-w-2xl mx-auto px-5 pt-3 pb-1">
          {totalCount === 0 ? (
            <p className="text-sm text-pink-200/40 py-2">{t.empty}</p>
          ) : (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-pink-400/60 bg-pink-500/10 px-4 py-2.5 animate-pop-in">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-lime-300">
                  {totalCount} {t.items} · {t.total}
                </p>
                <p
                  key={totalPrice}
                  className="text-2xl font-black tabular-nums text-pink-300 leading-tight animate-price-bump [text-shadow:0_0_16px_rgba(244,114,182,0.6)]"
                >
                  {totalPrice.toLocaleString("tr-TR")} {CURRENCY}
                </p>
              </div>
              <button
                onClick={clearCart}
                className="shrink-0 rounded-lg border border-pink-400/70 px-3 py-2 text-sm font-bold text-pink-300 transition-all hover:bg-pink-500 hover:text-[#0b0014] hover:rotate-3"
              >
                {t.clear}
              </button>
            </div>
          )}
        </div>

        {/* Kategori butonları - PC UYUMLU, TAŞMA YOK */}
        <div className="max-w-2xl mx-auto px-5 py-3">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setActiveCat("all")}
              className={
                "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition-all hover:-translate-y-0.5 " +
                (activeCat === "all"
                  ? "border-pink-400 bg-pink-500 text-[#0b0014]"
                  : "border-pink-500/25 bg-[#1a0a2c] text-pink-200/60 hover:border-pink-400/60 hover:text-pink-100")
              }
            >
              {t.all}
            </button>
            {data.categories && data.categories.length > 0 ? (
              data.categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCat(cat.id)}
                  className={
                    "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-bold transition-all hover:-translate-y-0.5 " +
                    (activeCat === cat.id
                      ? "border-pink-400 bg-pink-500 text-[#0b0014]"
                      : "border-pink-500/25 bg-[#1a0a2c] text-pink-200/60 hover:border-pink-400/60 hover:text-pink-100")
                  }
                >
                  {cat.name?.[lang] || cat.name?.fa || cat.name?.tr || cat.id}
                </button>
              ))
            ) : (
              <p className="text-pink-200/40 text-sm py-2">Kategori bulunamadı</p>
            )}
          </div>
        </div>
      </div>

      {/* İçerik */}
      <main className="relative max-w-2xl mx-auto px-5">
        {visibleCategories && visibleCategories.length > 0 ? (
          visibleCategories.map((cat) => {
            const catName = cat.name?.[lang] || cat.name?.fa || cat.name?.tr || cat.id;
            return (
              <section
                key={cat.id}
                className="mt-4 rounded-2xl border border-pink-500/25 bg-[#170a28] px-4 pb-2 pt-1"
              >
                <h2 className="mt-4 mb-1.5 text-base font-black uppercase tracking-widest text-lime-300">
                  {catName}
                </h2>
                <ul className="list-none m-0 p-0">
                  {cat.items && cat.items.length > 0 ? (
                    cat.items.map((item) => {
                      const itemName =
                        item.name?.[lang] || item.name?.fa || item.name?.tr || item.id;
                      const displayPrice = formatDisplayPrice(item.price);
                      const isEmpty = displayPrice === "—";
                      const qty = cart[item.id] || 0;
                      const selected = qty > 0;

                      return (
                        <li key={item.id}>
                          <button
                            type="button"
                            disabled={isEmpty}
                            onClick={() => addOne(item)}
                            className={
                              "w-full flex items-center gap-2.5 border-b border-pink-500/15 py-3.5 text-lg last:border-b-0 sm:text-xl transition-all duration-150 " +
                              (isRtl ? "text-right " : "text-left ") +
                              (isEmpty
                                ? "opacity-30 cursor-not-allowed"
                                : "active:scale-[0.98] active:bg-pink-500/10 " +
                                  (selected
                                    ? "bg-pink-500/10 border-l-2 border-l-pink-400"
                                    : ""))
                            }
                          >
                            <span
                              key={qty}
                              className={
                                "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-black transition-colors " +
                                (selected
                                  ? "bg-lime-300 text-[#0b0014] animate-pop-in"
                                  : "bg-transparent text-transparent")
                              }
                            >
                              {qty > 0 ? qty : ""}
                            </span>

                            <span className="font-bold flex-1 truncate text-pink-50">
                              {itemName}
                            </span>

                            <span className="min-w-[14px] flex-1 border-b-2 border-dotted border-pink-500/20" />

                            <span
                              className={
                                "whitespace-nowrap font-black tabular-nums " +
                                (isEmpty
                                  ? "text-pink-200/30 font-medium"
                                  : "text-pink-300")
                              }
                            >
                              {isEmpty ? displayPrice : `${displayPrice} ${CURRENCY}`}
                            </span>

                            {selected && (
                              <span
                                role="button"
                                tabIndex={0}
                                onClick={(e) => removeOne(item.id, e)}
                                className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-pink-400/70 text-pink-300 text-lg font-black transition-transform hover:bg-pink-500/20 hover:scale-110 active:scale-90"
                              >
                                −
                              </span>
                            )}
                          </button>
                        </li>
                      );
                    })
                  ) : (
                    <p className="text-pink-200/40 text-sm py-4">Bu kategoride ürün yok</p>
                  )}
                </ul>
              </section>
            );
          })
        ) : (
          <p className="text-center text-pink-200/40 py-10">Hiç kategori bulunamadı</p>
        )}
      </main>

      <style jsx global>{`
        @keyframes blob-a {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(40px, 60px) scale(1.15);
          }
        }
        @keyframes blob-b {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(-50px, 30px) scale(1.2);
          }
        }
        @keyframes blob-c {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          50% {
            transform: translate(30px, -40px) scale(0.9);
          }
        }
        @keyframes neon-flicker {
          0%,
          19%,
          21%,
          23%,
          54%,
          56%,
          100% {
            text-shadow: 0 0 6px rgba(244, 114, 182, 0.9),
              0 0 18px rgba(244, 114, 182, 0.6), 0 0 32px rgba(244, 114, 182, 0.4);
            opacity: 1;
          }
          20%,
          22%,
          55% {
            text-shadow: none;
            opacity: 0.6;
          }
        }
        @keyframes pop-in {
          0% {
            transform: scale(0.6);
            opacity: 0;
          }
          60% {
            transform: scale(1.08);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }
        @keyframes price-bump {
          0% {
            transform: scale(1.25);
          }
          100% {
            transform: scale(1);
          }
        }
        .animate-blob-a {
          animation: blob-a 9s ease-in-out infinite;
        }
        .animate-blob-b {
          animation: blob-b 11s ease-in-out infinite;
        }
        .animate-blob-c {
          animation: blob-c 8s ease-in-out infinite;
        }
        @keyframes disco {
          0% {
            filter: hue-rotate(0deg) saturate(1.6);
          }
          100% {
            filter: hue-rotate(360deg) saturate(1.6);
          }
        }
        .animate-disco {
          animation: disco 0.6s linear infinite;
        }
        .animate-neon-flicker {
          animation: neon-flicker 4s linear infinite;
        }
        .animate-pop-in {
          animation: pop-in 0.35s ease-out;
        }
        .animate-price-bump {
          animation: price-bump 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}