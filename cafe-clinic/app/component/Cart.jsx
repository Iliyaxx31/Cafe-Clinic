"use client";
import { useState } from "react";

export default function Cart({ cart, setCart, onClose }) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [note, setNote] = useState("");
  const [ordering, setOrdering] = useState(false);

  const cartTotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const removeItem = (itemId) => {
    setCart(cart.filter((i) => i.id !== itemId));
  };

  const updateQuantity = (itemId, newQuantity) => {
    if (newQuantity < 1) {
      removeItem(itemId);
      return;
    }
    setCart(cart.map((i) => (i.id === itemId ? { ...i, quantity: newQuantity } : i)));
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^09[0-9]{9}$/; // 09 ile başlayan 11 rakam
    return phoneRegex.test(phone);
  };

  const placeOrder = async () => {
    if (!customerName.trim()) {
      alert("لطفا نام خود را وارد کنید");
      return;
    }
    if (!validatePhone(customerPhone)) {
      alert("شماره تماس باید با 09 شروع شود و 11 رقم باشد");
      return;
    }
    if (!customerAddress.trim() || customerAddress.trim().length < 5) {
      alert("لطفا آدرس کامل خود را وارد کنید (حداقل ۵ کاراکتر)");
      return;
    }
    if (cart.length === 0) {
      alert("سبد خرید خالی است");
      return;
    }

    setOrdering(true);

    const res = await fetch("/api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart.map((i) => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          price: i.price,
          total: i.price * i.quantity,
        })),
        total: cartTotal,
        customerName,
        customerPhone,
        customerAddress,
        note: note.trim() || null,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      const trackingUrl = `${window.location.origin}/track/${data.orderId}`;
      alert(`سفارش شما ثبت شد!\nشماره پیگیری: ${data.orderId}`);
      window.location.href = trackingUrl;
      setCart([]);
      onClose();
    } else {
      alert("خطا در ثبت سفارش. لطفا دوباره تلاش کنید.");
    }
    setOrdering(false);
  };

  if (cart.length === 0) {
    return (
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 max-w-md w-full shadow-xl border border-slate-200">
        <div className="text-center">
          <div className="text-6xl mb-3">🛒</div>
          <h2 className="text-xl font-bold text-slate-700 mb-2">سبد خرید خالی است</h2>
          <p className="text-slate-500 text-sm">برای سفارش، محصول مورد نظر را انتخاب کنید</p>
          <button
            onClick={onClose}
            className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-full transition"
          >
            بستن
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 max-w-md w-full max-h-[90vh] overflow-auto shadow-xl border border-slate-200">
      <div className="flex justify-between items-center border-b border-slate-200 pb-3 mb-4">
        <h2 className="text-xl font-bold text-slate-700">🛒 سبد خرید</h2>
        <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl transition">
          ✕
        </button>
      </div>

      <div className="space-y-3 max-h-60 overflow-auto mb-4">
        {cart.map((item) => (
          <div key={item.id} className="flex justify-between items-center bg-slate-50 rounded-xl p-2 border border-slate-200">
            <div className="flex-1">
              <p className="font-semibold text-slate-700">{item.name}</p>
              <p className="text-sm text-slate-500">{item.price.toLocaleString()} تومان</p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                className="w-7 h-7 bg-slate-200 text-slate-700 rounded-full hover:bg-slate-300 transition"
              >
                -
              </button>
              <span className="w-8 text-center text-slate-700 font-bold">{item.quantity}</span>
              <button
                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                className="w-7 h-7 bg-slate-200 text-slate-700 rounded-full hover:bg-slate-300 transition"
              >
                +
              </button>
              <button onClick={() => removeItem(item.id)} className="text-red-400 ml-2 hover:text-red-600 transition">
                🗑️
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t border-slate-200 pt-3 mb-4">
        <div className="flex justify-between font-bold text-lg">
          <span className="text-slate-700">مجموع:</span>
          <span className="text-blue-600">{cartTotal.toLocaleString()} تومان</span>
        </div>
      </div>

      <div className="space-y-3">
        <input
          type="text"
          placeholder="نام و نام خانوادگی *"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-700 placeholder-slate-400"
        />
        <input
          type="tel"
          placeholder="شماره تماس (11 رقم، مثل 09123456789) *"
          value={customerPhone}
          onChange={(e) => setCustomerPhone(e.target.value)}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-700 placeholder-slate-400"
        />
        <textarea
          placeholder="آدرس کامل * (حداقل ۵ کاراکتر)"
          value={customerAddress}
          onChange={(e) => setCustomerAddress(e.target.value)}
          rows="2"
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-700 placeholder-slate-400"
        />
        <textarea
          placeholder="توضیحات اضافه (اختیاری)"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows="2"
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-700 placeholder-slate-400"
        />
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={placeOrder}
          disabled={ordering}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition disabled:opacity-50"
        >
          {ordering ? "در حال ثبت..." : "✅ ثبت سفارش"}
        </button>
        <button
          onClick={onClose}
          className="flex-1 bg-slate-500 hover:bg-slate-600 text-white py-3 rounded-xl font-bold transition"
        >
          انصراف
        </button>
      </div>
    </div>
  );
}