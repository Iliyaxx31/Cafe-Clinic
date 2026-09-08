"use client";

import Produc from "./Produc";
import elektrikData from "@/json/power.json";

export default function PowerOutageModal({
  prices,
  getQuantity,
  updateCart,
  onClose,
}) {
  const allNoPowerItems = elektrikData.categories.flatMap(
    (category) => category.items
  );

  return (
    <div
      className="fixed inset-0 z-50 bg-blue-200/60 backdrop-blur-xs overflow-auto"
      dir="rtl"
    >
      {/* Üst bar */}
      <div className="sticky top-0 z-10 bg-amber-500 text-white px-4 py-3 flex items-center justify-between shadow-lg">
        <h1 className="font-bold text-lg flex items-center gap-2">
          ⚡ نوشیدنی‌های قابل تهیه در قطعی برق
        </h1>

        <button
          onClick={onClose}
          className="bg-white/20 hover:bg-white/30 rounded-full w-9 h-9 flex items-center justify-center text-xl transition-colors"
        >
          ✕
        </button>
      </div>

      <main className="p-4 min-h-screen">
        {allNoPowerItems.length === 0 ? (
          <div className="text-center py-16 text-slate-600 font-medium">
            در حال حاضر نوشیدنی قابل تهیه‌ای موجود نیست
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
            {allNoPowerItems.map((item) => (
              <Produc
                key={item.id}
                img={item.img}
                title={item.name}
                text={item.description}
                price={prices[item.id] || "0"}
                initialQuantity={getQuantity(item.id)}
                onQuantityChange={(newQuantity) =>
                  updateCart(
                    item,
                    prices[item.id] || "0",
                    newQuantity
                  )
                }
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}