"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "./components/Header";
import Navbar from "./components/Navbar";
import Produc from "./components/Produc";
import Image from "next/image";
import Footer from "./components/Footer";
import Cart from "./components/Cart";
import IntroScreen from "./components/IntroScreen";
import CoffeeCupButton from "./components/CoffeeCupButton";
import NoticeModal from "./components/NoticeModal";

// سلام ب مناسبت شروع به کار سایتمون ، امروز هر سفارش شامل ۱۰ درصد تخفیف میشه :) ❤️

/*
 ! ADRESler
 
 */
export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [data, setData] = useState(null);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [started, setStarted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [justAdded, setJustAdded] = useState(false);
  const [burst, setBurst] = useState(0);
  const [maintenance, setMaintenance] = useState(null);
  const router = useRouter();
  const audioRef = useRef(null);

  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  useEffect(() => {
    fetch("/api/settings")
      .then((res) => res.json())
      .then((data) => setMaintenance(data))
      .catch(() => setMaintenance({ maintenanceMode: false }));
  }, []);

  useEffect(() => {
    if (maintenance && !maintenance.maintenanceMode) {
      fetchData();
    }
  }, [maintenance]);

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => document.removeEventListener("fullscreenchange", handleFsChange);
  }, []);

  useEffect(() => {
    if (cartCount === 0) return;
    setJustAdded(true);
    const t = setTimeout(() => setJustAdded(false), 500);
    return () => clearTimeout(t);
  }, [cartCount]);

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
    setBurst((b) => b + 1);
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

  // Ayarlar henüz yüklenmedi
  if (maintenance === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-200/60">
        <Image width={325} height={300} alt="Logom" src={"/logo.png"} />
      </div>
    );
  }

  // Bakım modu aktif
  if (maintenance.maintenanceMode) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-6 text-center"
        dir="rtl"
      >
        <Image
          width={200}
          height={180}
          alt="Logo"
          src={"/logo.png"}
          className="mb-6"
        />
        <div className="text-6xl mb-4">🛠️</div>
        <h1 className="text-2xl font-bold text-slate-700 mb-3">
          سایت موقتاً در دسترس نیست
        </h1>
        <p className="text-slate-500 max-w-md">
          {maintenance.maintenanceMessage ||
            "متأسفانه به دلیل مشکل فنی، سایت موقتاً در دسترس نیست. لطفاً چند دقیقه دیگر مراجعه کنید."}
        </p>
      </div>
    );
  }

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

      <CoffeeCupButton
        cartCount={cartCount}
        onClick={handleCartClick}
        justAdded={justAdded}
        burst={burst}
      />

      <NoticeModal
        trigger={started}
        onShow={() => audioRef.current?.play().catch(() => console.log("Ses çalınamadı"))}
      />

      {showCart && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Cart cart={cart} setCart={setCart} onClose={() => setShowCart(false)} />
        </div>
      )}

      <audio ref={audioRef} src="/notification.mp3" preload="auto" />

      <footer className="bg-blue-300/50 border-t-4 rounded-lg border-gray-400/70">
        <Footer
          number="شماره:01144154182"
          store="ساعت کاری: از صبح ۸ تا شب 8"
          adres="آدرس: آمل کوچه بنیادشهید بن بست
پامچال ساختمان دکتر شهره
طبقه همکف"
        />
      </footer>
    </>
  );
}