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

// Fiyat string'ini direkt topluma uygun tam sayıya çevirir.
// Nokta varsa sadece öncesi sayılır, sonrası tamamen atılır (ondalık yok):
// "85.000" -> 85, "100" -> 100. Yani 85.000 + 100 = 185.
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
  const [cart, setCart] = useState({}); // { itemId: quantity }
  const isRtl = lang === "fa";
  const t = LABELS[lang];

  const visibleCategories =
    activeCat === "all"
      ? data.categories
      : data.categories.filter((c) => c.id === activeCat);

  const allItemsById = useMemo(() => {
    const map = {};
    data.categories.forEach((cat) =>
      cat.items.forEach((item) => (map[item.id] = item))
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
      className="min-h-screen bg-slate-950 text-slate-100 pb-10"
    >
      {/* Header */}
      <div className="max-w-2xl mx-auto flex items-center justify-between gap-4 px-5 pt-7 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-2xl font-bold uppercase tracking-wide text-slate-100">
            {data.cafeName}
          </h1>
          <p className="mt-1 text-xs font-semibold p-2 uppercase tracking-wide text-sky-400">
            {t.sub}
          </p>
        </div>
        <button
          onClick={() => setLang(lang === "tr" ? "fa" : "tr")}
          className="shrink-0 rounded-lg border border-slate-600 px-4 py-2.5 text-sm font-semibold text-sky-300 transition-colors hover:bg-sky-400 hover:text-slate-900 hover:border-sky-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-sky-400 focus-visible:outline-offset-2"
        >
          {t.lang}
        </button>
      </div>

      {/* Sabit üst blok: toplam + kategori sekmeleri — kaydırırken hep ekranda kalır */}
      <div className="sticky top-0 z-20 bg-slate-950/95 backdrop-blur border-b border-slate-800">
        <div className="max-w-2xl mx-auto px-5 pt-3 pb-1">
          {totalCount === 0 ? (
            <p className="text-sm text-slate-500 py-2">{t.empty}</p>
          ) : (
            <div className="flex items-center justify-between gap-4 rounded-xl border border-sky-400/40 bg-sky-400/10 px-4 py-2.5">
              <div>
                <p className="text-[11px] uppercase tracking-wide text-sky-300/80">
                  {totalCount} {t.items} · {t.total}
                </p>
                <p className="text-2xl font-extrabold tabular-nums text-sky-300 leading-tight">
                  {totalPrice.toLocaleString("tr-TR")} {CURRENCY}
                </p>
              </div>
              <button
                onClick={clearCart}
                className="shrink-0 rounded-lg border border-sky-400/60 px-3 py-2 text-sm font-semibold text-sky-300 transition-colors hover:bg-sky-400 hover:text-slate-900"
              >
                {t.clear}
              </button>
            </div>
          )}
        </div>

        <nav className="max-w-2xl mx-auto flex gap-2 overflow-x-auto px-5 py-3 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setActiveCat("all")}
            className={
              "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors " +
              (activeCat === "all"
                ? "border-sky-400 bg-sky-400 text-slate-900"
                : "border-slate-700 bg-slate-800/70 text-slate-400 hover:border-slate-500 hover:text-slate-100")
            }
          >
            {t.all}
          </button>
          {data.categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={
                "shrink-0 whitespace-nowrap rounded-full border px-4 py-2 text-sm font-semibold transition-colors " +
                (activeCat === cat.id
                  ? "border-sky-400 bg-sky-400 text-slate-900"
                  : "border-slate-700 bg-slate-800/70 text-slate-400 hover:border-slate-500 hover:text-slate-100")
              }
            >
              {cat.name[lang] || cat.name.fa || cat.name.tr}
            </button>
          ))}
        </nav>
      </div>

      {/* İçerik */}
      <main className="max-w-2xl mx-auto px-5">
        {visibleCategories.map((cat) => {
          const catName = cat.name[lang] || cat.name.fa || cat.name.tr;
          return (
            <section
              key={cat.id}
              className="mt-4 rounded-2xl border border-slate-700/60 bg-slate-800/60 backdrop-blur-sm px-4 pb-2 pt-1"
            >
              <h2 className="mt-4 mb-1.5 text-base font-semibold uppercase tracking-wide text-sky-300">
                {catName}
              </h2>
              <ul className="list-none m-0 p-0">
                {cat.items.map((item) => {
                  const itemName =
                    item.name[lang] || item.name.fa || item.name.tr;
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
                          "w-full flex items-center gap-2.5 border-b border-slate-700/60 py-3.5 text-lg last:border-b-0 sm:text-xl transition-colors " +
                          (isRtl ? "text-right " : "text-left ") +
                          (isEmpty
                            ? "opacity-40 cursor-not-allowed"
                            : "active:bg-slate-700/40 " +
                              (selected ? "bg-slate-700/30" : ""))
                        }
                      >
                        {/* Miktar rozeti */}
                        <span
                          className={
                            "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors " +
                            (selected
                              ? "bg-slate-100 text-slate-900"
                              : "bg-transparent text-transparent")
                          }
                        >
                          {qty > 0 ? qty : ""}
                        </span>

                        <span className="font-semibold flex-1 truncate text-slate-100">
                          {itemName}
                        </span>

                        <span className="min-w-[14px] flex-1 border-b-2 border-dotted border-slate-700" />

                        <span
                          className={
                            "whitespace-nowrap font-bold tabular-nums " +
                            (isEmpty
                              ? "text-slate-500 font-medium"
                              : "text-sky-300")
                          }
                        >
                          {isEmpty ? displayPrice : `${displayPrice} ${CURRENCY}`}
                        </span>

                        {/* Azaltma butonu, sadece seçiliyken görünür */}
                        {selected && (
                          <span
                            role="button"
                            tabIndex={0}
                            onClick={(e) => removeOne(item.id, e)}
                            className="ml-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-slate-500 text-sky-300 text-lg font-bold hover:bg-slate-700"
                          >
                            −
                          </span>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </main>
    </div>
  );
}