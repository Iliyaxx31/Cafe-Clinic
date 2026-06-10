"use client";
import { useState, useEffect } from "react";
import { useParams } from "next/navigation";

export default function TrackOrder() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (res.ok) {
        const data = await res.json();
        setOrder(data);
      }
    } catch (err) {
      console.error("Sipariş yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Her 5 saniyede bir sipariş durumunu kontrol et
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, [id]);

  const getStatusText = (status) => {
    const map = {
      pending: "⏳ در انتظار تأیید",
      preparing: "👨‍🍳 در حال آماده‌سازی",
      delivering: "🚚 در مسیر ارسال",
      completed: "✅ تحویل شده",
      cancelled: "❌ لغو شده",
    };
    return map[status] || status;
  };

  const getStatusStep = (status) => {
    const steps = ["pending", "preparing", "delivering", "completed"];
    if (status === "cancelled") return -1;
    return steps.indexOf(status);
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">در حال بارگذاری...</div>;
  }

  if (!order) {
    return <div className="min-h-screen flex items-center justify-center">سفارش یافت نشد</div>;
  }

  const currentStep = getStatusStep(order.status);
  const isCancelled = order.status === "cancelled";
  const steps = ["ثبت سفارش", "آماده‌سازی", "ارسال", "تحویل"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 p-4" dir="rtl">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-2xl font-bold text-center text-slate-700 mb-4">📦 پیگیری سفارش</h1>
        <p className="text-center text-gray-500 mb-2">شماره سفارش</p>
        <p className="text-center text-3xl font-bold text-blue-600 mb-6">#{order.id}</p>

        {isCancelled ? (
          <div className="bg-red-100 border border-red-400 rounded-xl p-4 text-center mb-6">
            <p className="text-red-700 font-bold">❌ سفارش لغو شده است</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between mb-2">
              {steps.map((label, idx) => (
                <div key={idx} className="text-center flex-1">
                  <div
                    className={`w-10 h-10 mx-auto rounded-full flex items-center justify-center font-bold transition-all ${
                      currentStep >= idx ? "bg-blue-600 text-white shadow" : "bg-gray-300 text-gray-500"
                    }`}
                  >
                    {currentStep > idx ? "✓" : idx + 1}
                  </div>
                  <p className="text-xs mt-2 font-medium">{label}</p>
                </div>
              ))}
            </div>
            <div className="relative h-2 bg-gray-200 rounded-full mt-2">
              <div
                className="absolute h-2 bg-blue-600 rounded-full transition-all duration-500"
                style={{ width: `${currentStep >= 0 ? (currentStep / (steps.length - 1)) * 100 : 0}%` }}
              ></div>
            </div>
            <p className="text-center mt-4 font-bold text-blue-600 text-lg">{getStatusText(order.status)}</p>
          </>
        )}

        <div className="border-t mt-6 pt-4">
          <h3 className="font-bold text-slate-700 mb-2">جزئیات سفارش</h3>
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between py-1 text-sm">
              <span>
                {item.quantity} × {item.name}
              </span>
              <span>{item.total.toLocaleString()} تومان</span>
            </div>
          ))}
          <div className="flex justify-between pt-2 font-bold">
            <span>مجموع:</span>
            <span className="text-blue-600">{order.total.toLocaleString()} تومان</span>
          </div>
        </div>

        {order.note && (
          <div className="mt-4 p-3 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600">📝 یادداشت مشتری:</p>
            <p className="text-sm">{order.note}</p>
          </div>
        )}

        <div className="mt-6 text-center text-xs text-gray-500">
          <p>📞 برای اطلاعات بیشتر با کافه تماس بگیرید</p>
          <p className="mt-1">۰۹۰۱۷۸۳۱۲۹۸</p>
        </div>

        <div className="mt-4 text-center">
          <button
            onClick={fetchOrder}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-1 rounded-full text-sm transition"
          >
            🔄 بروزرسانی دستی
          </button>
        </div>
      </div>
    </div>
  );
}