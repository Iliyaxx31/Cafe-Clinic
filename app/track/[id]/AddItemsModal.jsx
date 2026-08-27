"use client";
import { useState, useEffect, useMemo } from "react";

export default function AddItemsModal({ orderId, onClose, onSuccess }) {
  const [data, setData] = useState(null);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [extraCart, setExtraCart] = useState({}); // { itemId: qty }
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    fetch("/api/menu")
      .then((res) => res.json())
      .then((result) => {
        setData(result.data);
        setPrices(result.prices);
      })
      .catch((err) => console.error("Menü yüklenemedi:", err))
      .finally(() => setLoading(false));
  }, []);

  const allItemsById = useMemo(() => {
    const map = {};
    data?.categories?.forEach((cat) =>
      cat.items?.forEach((item) => (map[item.id] = item))
    );
    return map;
  }, [data]);

  const { totalCount, totalPrice } = useMemo(() => {
    let count = 0;
    let price = 0;
    for (const [id, qty] of Object.entries(extraCart)) {
      if (qty <= 0) continue;
      count += qty;
      price += (parseFloat(prices[id]) || 0) * qty;
    }
    return { totalCount: count, totalPrice: price };
  }, [extraCart, prices]);

  const changeQty = (itemId, delta) => {
    setExtraCart((prev) => {
      const next = { ...prev };
      const qty = (next[itemId] || 0) + delta;
      if (qty <= 0) delete next[itemId];
      else next[itemId] = qty;
      return next;
    });
  };

  const handleSubmit = async () => {
    if (totalCount === 0) return;
    setSubmitting(true);
    setErrorMsg("");

    const newItems = Object.entries(extraCart).map(([id, qty]) => {
      const item = allItemsById[id];
      const price = parseFloat(prices[id]) || 0;
      return {
        id: item.id,
        name: item.name,
        quantity: qty,
        price,
      };
    });

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newItems }),
      });

      if (res.ok) {
        const result = await res.json();
        onSuccess(result.order);
        onClose();
      } else {
        const err = await res.json();
        setErrorMsg(err.error || "خطا در افزودن سفارش");
      }
    } catch (err) {
      console.error(err);
      setErrorMsg("خطا در ارتباط با سرور");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-6">در حال بارگذاری منو...</div>
      </div>
    );
  }

  if (!data) return null;

  const filteredItems = data.categories[selectedIndex]?.items || [];

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      dir="rtl"
    >
      <div className="bg-white rounded-2xl w-full max-w-md max-h-[85vh] flex flex-col shadow-xl">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-lg font-bold text-slate-700">➕ افزودن به سفارش</h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="flex overflow-auto border-b px-2 py-2 gap-2 shrink-0">
          {data.categories.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => setSelectedIndex(idx)}
              className={`shrink-0 whitespace-nowrap rounded-full px-3 py-1.5 text-sm font-bold ${
                selectedIndex === idx
                  ? "bg-blue-600 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>

        <div className="overflow-auto flex-1 p-3 space-y-2">
          {filteredItems.map((item) => {
            const qty = extraCart[item.id] || 0;
            const price = prices[item.id] || "0";
            return (
              <div
                key={item.id}
                className="flex items-center justify-between bg-slate-50 rounded-xl p-3 border border-slate-200"
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-700">{item.name}</p>
                  <p className="text-sm text-slate-500">
                    {Number(price).toLocaleString()} تومان
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => changeQty(item.id, -1)}
                    disabled={qty === 0}
                    className="w-8 h-8 bg-slate-200 rounded-full disabled:opacity-40"
                  >
                    -
                  </button>
                  <span className="w-6 text-center font-bold">{qty}</span>
                  <button
                    onClick={() => changeQty(item.id, 1)}
                    className="w-8 h-8 bg-blue-600 text-white rounded-full"
                  >
                    +
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="border-t p-4">
          {errorMsg && (
            <p className="text-red-600 text-sm mb-3 text-center">{errorMsg}</p>
          )}
          {totalCount > 0 && (
            <div className="flex justify-between mb-3 font-bold text-slate-700">
              <span>{totalCount} قلم</span>
              <span className="text-blue-600">
                {totalPrice.toLocaleString()} تومان
              </span>
            </div>
          )}
          <button
            onClick={handleSubmit}
            disabled={totalCount === 0 || submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold disabled:opacity-50"
          >
            {submitting ? "در حال ارسال..." : "افزودن به سفارش"}
          </button>
        </div>
      </div>
    </div>
  );
}