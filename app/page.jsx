"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "./component/Header";
import Navbar from "./component/Navbar";
import Produc from "./component/Produc";
import Image from "next/image";
import Footer from "./component/Footer";
import Cart from "./component/Cart";
import { BsCartFill } from "react-icons/bs";
import { MdOutlineReportProblem } from "react-icons/md";

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [data, setData] = useState(null);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [notice, setNotice] = useState(null);
  const [showNotice, setShowNotice] = useState(false);
  const router = useRouter();
  
  // Müzik için
  const audioRef = useRef(null);

  useEffect(() => {
    fetchData();
    
    // Müziği otomatik başlat
    if (audioRef.current) {
      audioRef.current.volume = 0.3; // Ses seviyesi %30
      audioRef.current.play().catch(e => console.log("Otomatik oynatma engellendi"));
    }
  }, []);

  const updateCart = (item, price, newQuantity) => {
    const priceNum = parseFloat(price) || 0;
    if (newQuantity === 0) {
      setCart((prev) => prev.filter((i) => i.id !== item.id));
    } else {
      setCart((prev) => {
        const existing = prev.find((i) => i.id === item.id);
        if (existing) {
          return prev.map((i) =>
            i.id === item.id ? { ...i, quantity: newQuantity } : i
          );
        } else {
          return [...prev, { id: item.id, name: item.name, price: priceNum, quantity: newQuantity }];
        }
      });
    }
  };

  const getQuantity = (itemId) => {
    const item = cart.find((i) => i.id === itemId);
    return item ? item.quantity : 0;
  };

  const fetchData = async () => {
    try {
      const res = await fetch("/api/menu");
      if (res.ok) {
        const result = await res.json();
        setData(result.data);
        setPrices(result.prices);
      }
      const noticeRes = await fetch("/api/notice");
      if (noticeRes.ok) {
        const noticeData = await noticeRes.json();
        if (noticeData.active && noticeData.text) {
          setNotice(noticeData);
          setShowNotice(true);
        }
      }
    } catch (error) {
      console.error("Veri yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  const checkExistingOrder = async () => {
    const lastOrderId = localStorage.getItem('lastOrderId');
    if (lastOrderId) {
      try {
        const res = await fetch(`/api/orders/${lastOrderId}`);
        if (res.ok) {
          const order = await res.json();
          if (order.status !== 'completed' && order.status !== 'cancelled') {
            router.push(`/track/${lastOrderId}`);
            return true;
          }
        }
      } catch (err) {
        console.error("Sipariş kontrol hatası:", err);
      }
    }
    return false;
  };

  const handleCartClick = async () => {
    const hasActiveOrder = await checkExistingOrder();
    if (!hasActiveOrder) {
      setShowCart(true);
    }
  };



  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-200/60">
        <Image width={325} height={300} alt="Logom" src={"/logo.png"} />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-200/60">
        <div className="text-red-600">Menü yüklenemedi!</div>
      </div>
    );
  }

  const filteredItems = data.categories[selectedIndex]?.items || [];

  return (
    <>
      <Header logo="/logo.png" icon="/deneme.png" />

      <nav className="flex border-b bg-slate-200 border-white/40 sticky top-0 z-30 overflow-auto  backdrop-blur-3xl md:justify-center py-3 shadow-lg whitespace-nowrap">
        <Navbar
          onSelectCategory={setSelectedIndex}
          activeIndex={selectedIndex}
          categories={data.categories}
        />
      </nav>

      <main className="p-4 min-h-screen  bg-gradient-to-l from-[#fdf6e7] via-[#d1eefc] to-[#7b8f9d] backdrop-blur-xs">
        <div className="grid grid-cols-2 lg:grid-cols-4
                                              cursor-pointer   md:grid-cols-4 gap-4 max-w-7xl mx-auto">
          {filteredItems.map((item) => (
            <Produc
              key={item.id}
              img={item.img}
              title={item.name}
              text={item.description}
              price={prices[item.id] || "0"}
              initialQuantity={getQuantity(item.id)}
              onQuantityChange={(newQuantity) => updateCart(item, prices[item.id] || "0", newQuantity)}
            />
          ))}
        </div>
      </main>

  
      <button
        onClick={handleCartClick}
        className="fixed bottom-5 left-5 bg-gradient-to-l to-gray-300 from-blue-400 backdrop-blur-md hover:bg-blue-700 text-white px-5 py-3 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110 flex items-center gap-2"
      >
        <BsCartFill size={22} />
        <span className="font-bold text-sm">سبد خرید</span>
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
            {cart.reduce((sum, i) => sum + i.quantity, 0)}
          </span>
        )}
      </button>

      {showNotice && notice && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-xl text-center" dir="rtl">
            <h2 className="text-xl font-bold mb-4"> سلام</h2>
            <p className="text-gray-700 mb-6">{notice.text}</p>
            <button
              onClick={() => setShowNotice(false)}
              className="bg-blue-300 text-white px-6 py-2 rounded-full hover:bg-blue-600"
            >
              متوجه شدم
            </button>
          </div>
        </div>
      )}

      {showCart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Cart cart={cart} setCart={setCart} onClose={() => setShowCart(false)} />
        </div>
      )}


      <footer className="bg-blue-300/50 border-t-4 rounded-lg border-gray-600/70">
        <Footer
          number="شماره: ۰۹۰۱۷۸۳۱۲۹۸"
          store="ساعت کاری: از صبح ۸ تا شب ۱۲"
          adres="آدرس: خیابان آداکنت، کوچه آداکنت، بلوک ۱۸"
        />
      </footer>
    </>
  );
}