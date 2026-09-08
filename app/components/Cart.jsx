"use client";
import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";

const SECRET_KEY = process.env.NEXT_PUBLIC_STORAGE_SECRET || "cafe-clinic-secret-key-2025";

const encrypt = (text) => {
  if (!text) return "";
  try {
    return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
  } catch {
    return text;
  }
};

const decrypt = (ciphertext) => {
  if (!ciphertext) return "";
  try {
    const bytes = CryptoJS.AES.decrypt(ciphertext, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch {
    return ciphertext;
  }
};

export default function Cart({ cart, setCart, onClose }) {
  const [customerName, setCustomerName] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerAddress, setCustomerAddress] = useState("");
  const [note, setNote] = useState("");
  const [ordering, setOrdering] = useState(false);
  const [saveInfo, setSaveInfo] = useState(true); // ✅ Varsayılan olarak kaydet

  useEffect(() => {
    try {
      const savedName = localStorage.getItem('customerName');
      const savedPhone = localStorage.getItem('customerPhone');
      const savedAddress = localStorage.getItem('customerAddress');
      
      if (savedName) {
        const decoded = decrypt(savedName);
        if (decoded && decoded.trim().length > 0) setCustomerName(decoded);
      }
      if (savedPhone) {
        const decoded = decrypt(savedPhone);
        if (decoded && /^09[0-9]{9}$/.test(decoded)) setCustomerPhone(decoded);
      }
      if (savedAddress) {
        const decoded = decrypt(savedAddress);
        if (decoded && decoded.trim().length >= 5) setCustomerAddress(decoded);
      }
    } catch (error) {
      console.log("localStorage okuma hatası:", error);
    }
  }, []);

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
    const phoneRegex = /^09[0-9]{9}$/;
    return phoneRegex.test(phone);
  };

  const clearSavedData = () => {
    try {
      localStorage.removeItem('customerName');
      localStorage.removeItem('customerPhone');
      localStorage.removeItem('customerAddress');
      setCustomerName("");
      setCustomerPhone("");
      setCustomerAddress("");
    } catch (error) {
      console.log("Temizleme hatası:", error);
    }
  };

  const placeOrder = async () => {
    const name = customerName.trim();
    const phone = customerPhone.trim();
    const address = customerAddress.trim();

    if (!name) {
      alert("لطفا نام خود را وارد کنید");
      return;
    }
    if (!validatePhone(phone)) {
      alert("شماره تماس باید با 09 شروع شود و 11 رقم باشد");
      return;
    }
    if (!address || address.length < 5) {
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
        customerName: name,
        customerPhone: phone,
        customerAddress: address,
        note: note.trim() || null,
      }),
    });

    if (res.ok) {
      const data = await res.json();
      
      if (saveInfo) {
        try {
          localStorage.setItem('customerName', encrypt(name));
          localStorage.setItem('customerPhone', encrypt(phone));
          localStorage.setItem('customerAddress', encrypt(address));
        } catch (error) {
          console.log("localStorage yazma hatası:", error);
        }
      }
      
      localStorage.setItem('lastOrderId', data.orderId);
      
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

  const handleNameChange = (e) => {
    const value = e.target.value;
    setCustomerName(value);
    if (saveInfo) {
      try {
        localStorage.setItem('customerName', encrypt(value));
      } catch (error) {
        console.log("localStorage yazma hatası:", error);
      }
    }
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value;
    setCustomerPhone(value);
    if (saveInfo) {
      try {
        localStorage.setItem('customerPhone', encrypt(value));
      } catch (error) {
        console.log("localStorage yazma hatası:", error);
      }
    }
  };

  const handleAddressChange = (e) => {
    const value = e.target.value;
    setCustomerAddress(value);
    if (saveInfo) {
      try {
        localStorage.setItem('customerAddress', encrypt(value));
      } catch (error) {
        console.log("localStorage yazma hatası:", error);
      }
    }
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
          onChange={handleNameChange}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-700 placeholder-slate-400"
        />
        <input
          type="tel"
          placeholder="شماره تماس (11 رقم، مثل 09123456789) *"
          value={customerPhone}
          onChange={handlePhoneChange}
          className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-slate-700 placeholder-slate-400"
        />
        <textarea
          placeholder="آدرس کامل * (حداقل ۵ کاراکتر)"
          value={customerAddress}
          onChange={handleAddressChange}
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

      {/* ✅ Checkbox + Güvenlik Yazısı + Sil Butonu */}
      <div className="mt-4 pt-3 border-t border-slate-200">
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 text-sm text-slate-600 cursor-pointer">
            <input
              type="checkbox"
              checked={saveInfo}
              onChange={(e) => setSaveInfo(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
            />
            اطلاعات من در این دستگاه ذخیره شود
          </label>
          <span className="text-[11px] text-green-600">اطلاعات شما امن است</span>
        </div>
        <button
          onClick={clearSavedData}
          className="mt-3 text-sm text-red-500 hover:text-red-700 transition"
        >
          حذف اطلاعات ذخیره شده
        </button>
      </div>

      <div className="flex gap-2 mt-4">
        <button
          onClick={placeOrder}
          disabled={ordering}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-bold transition disabled:opacity-50"
        >
          {ordering ? "در حال ثبت..." : "ثبت سفارش"}
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