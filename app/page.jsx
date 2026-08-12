"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Produc from "./components/Produc";
import Image from "next/image";
import Footer from "./components/Footer";
import Cart from "./components/Cart";

import { BsCartFill } from "react-icons/bs";
import IntroScreen from "./components/IntroScreen";

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [data, setData] = useState(null);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [notice, setNotice] = useState(null);
  const [showNotice, setShowNotice] = useState(false);
  const [started, setStarted] = useState(false); // Giriş ekranı geçildi mi?
  const [isFullscreen, setIsFullscreen] = useState(false);
  const router = useRouter();

  const audioRef = useRef(null); // Bildirim sesi için

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  useEffect(() => {
    if (showNotice && audioRef.current) {
      audioRef.current.play().catch(() =>
        console.log("Ses çalınamadı")
      );
    }
  }, [showNotice]);

  const handleStart = () => {
    if (audioRef.current) {
      const audio = audioRef.current;
      audio.muted = true;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            audio.pause();
            audio.currentTime = 0;
            audio.muted = false;
          })
          .catch(() => {
            audio.muted = false;
          });
      } else {
        audio.muted = false;
      }
    }

    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }

    setStarted(true);

    if (notice) {
      setTimeout(() => {
        setShowNotice(true);
      }, 2000);
    }
  };

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
    } catch (error) {
      console.error("Veri yüklenemedi:", error);
    } finally {
      setLoading(false);
    }

    try {
      const noticeRes = await fetch("/api/notice");
      if (noticeRes.ok) {
        const noticeData = await noticeRes.json();
        if (noticeData.active && noticeData.text) {
          setNotice(noticeData);
        }
      }
    } catch (error) {
      console.error("Notice yüklenemedi:", error);
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

  const goFullscreen = () => {
    if (!document.fullscreenElement) {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch(() => {});
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
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
      {!started && <IntroScreen onStart={handleStart} />}

      <Header logo="/logo.png" icon="/deneme.png" />

      <nav className="flex border-b border-white/40 sticky top-0 z-30 overflow-auto bg-[#dee5ed]/90 backdrop-blur-xs md:justify-center py-3 shadow-lg whitespace-nowrap">
        <Navbar
          onSelectCategory={setSelectedIndex}
          activeIndex={selectedIndex}
          categories={data.categories}
        />
      </nav>

      <main className="p-4 min-h-screen bg-blue-200/60 backdrop-blur-xs">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-7xl mx-auto">
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

      <button onClick={goFullscreen} className="fixed bottom-5 right-5 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110">
        {isFullscreen ? "⤓" : "⛶"}
      </button>

      <button
        onClick={handleCartClick}
        className="fixed bottom-5 left-5 bg-rose-600/70 backdrop-blur-md hover:bg-blue-700 text-white px-5 py-3 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110 flex items-center gap-2"
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
            <h2 className="text-xl font-bold mb-4">📢 اطلاعیه</h2>
            <p className="text-gray-700 mb-6">{notice.text}</p>
            <button
              onClick={() => setShowNotice(false)}
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
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

      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      <footer className="bg-blue-300/50 border-t-4 rounded-lg border-gray-400/70">
        <Footer
          number="0شماره: 1144154182"
          store="ساعت کاری: از صبح ۸ تا شب ۱۲"
          adres="آدرس:. خیابان ۱۷ شهریور. کوچه بنیاد شهید . بن بست پامچال . ساختمان دکتر شهره . طبقه همکف"
        />
      </footer>
    </>
  );
}