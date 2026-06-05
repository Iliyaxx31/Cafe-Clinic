"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders");
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error("Siparişler yüklenemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(fetchOrders, 3000); // 3 saniyede bir yenile
    return () => clearInterval(interval);
  }, []);

  const updateStatus = async (orderId, status) => {
    await fetch("/api/orders", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId, status }),
    });
    fetchOrders();
  };

  const deleteOrder = async (orderId) => {
    if (confirm("آیا از حذف این سفارش مطمئن هستید؟")) {
      const res = await fetch(`/api/orders/${orderId}`, { method: "DELETE" });
      if (res.ok) fetchOrders();
    }
  };

  const getStatusText = (status) => {
    const map = {
      pending: "⏳ در انتظار",
      preparing: "👨‍🍳 آماده‌سازی",
      delivering: "🚚 در مسیر ارسال",
      completed: "✅ تحویل شده",
      cancelled: "❌ لغو شده",
    };
    return map[status] || status;
  };

  const getStatusColor = (status) => {
    const map = {
      pending: "border-yellow-400 bg-yellow-50 text-yellow-700",
      preparing: "border-purple-400 bg-purple-50 text-purple-700",
      delivering: "border-orange-400 bg-orange-50 text-orange-700",
      completed: "border-green-400 bg-green-50 text-green-700",
      cancelled: "border-red-400 bg-red-50 text-red-700",
    };
    return map[status] || "border-gray-300 bg-gray-50";
  };

  if (loading) return <div className="p-8 text-center">در حال بارگذاری...</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6" dir="rtl">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">📋 مدیریت سفارش‌ها</h1>
          <div className="flex gap-2">
            <button onClick={fetchOrders} className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600">
              🔄 بروزرسانی
            </button>
            <button onClick={() => router.push("/admin/dashboard")} className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700">
              ← بازگشت
            </button>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl p-8 text-center shadow">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-gray-500">سفارشی وجود ندارد</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order.id} className={`bg-white rounded-xl border-r-8 shadow-md p-4 ${getStatusColor(order.status)}`}>
                <div className="flex flex-wrap justify-between items-start gap-3 border-b pb-2">
                  <div>
                    <span className="font-bold text-lg">#{order.id}</span>
                    <span className="text-xs text-gray-500 mr-2">{new Date(order.createdAt).toLocaleString("fa-IR")}</span>
                  </div>
                  <select value={order.status} onChange={(e) => updateStatus(order.id, e.target.value)} className="px-3 py-1 rounded-full text-sm font-semibold border bg-white shadow-sm">
                    <option value="pending">⏳ در انتظار</option>
                    <option value="preparing">👨‍🍳 آماده‌سازی</option>
                    <option value="delivering">🚚 در مسیر ارسال</option>
                    <option value="completed">✅ تحویل شده</option>
                    <option value="cancelled">❌ لغو شده</option>
                  </select>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-bold text-gray-700">👤 مشتری</p>
                    <p>{order.customerName}</p>
                    <p className="text-sm text-gray-600">{order.customerPhone}</p>
                    <p className="text-sm text-gray-600">{order.customerAddress}</p>
                    {order.note && <p className="text-sm text-gray-500 italic mt-1">📝 {order.note}</p>}
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-bold text-gray-700">🛒 جزئیات سفارش</p>
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.quantity} × {item.name}</span>
                        <span>{item.total.toLocaleString()} تومان</span>
                      </div>
                    ))}
                    <div className="border-t mt-2 pt-1 flex justify-between font-bold">
                      <span>مجموع:</span>
                      <span>{order.total.toLocaleString()} تومان</span>
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-3">
                  <button onClick={() => deleteOrder(order.id)} className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm hover:bg-red-600">
                    🗑️ حذف سفارش
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}