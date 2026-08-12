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
  const [justAdded, setJustAdded] = useState(false); // sepete eklenince buton zıplasın
  const [burst, setBurst] = useState(0); // tıklayınca patlama efekti (key olarak kullanılıyor)
  const [heartBeat, setHeartBeat] = useState(0); // arada bir buhar kalbe dönüşsün
  const [isHeartMoment, setIsHeartMoment] = useState(false);
  const router = useRouter();

  const audioRef = useRef(null); // Bildirim sesi için
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

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

  // Sepete ürün eklendiğinde butonu kısa süreliğine zıplat
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
    setBurst((b) => b + 1);
    const hasActiveOrder = await checkExistingOrder();
    if (!hasActiveOrder) {
      setShowCart(true);
    }
  };

  useEffect(() => {
    if (heartBeat === 0) return;
    setIsHeartMoment(true);
    const t = setTimeout(() => setIsHeartMoment(false), 2200);
    return () => clearTimeout(t);
  }, [heartBeat]);

  // Arada bir (12-20 sn arası rastgele) buhar birkaç saniyeliğine kalp şekline dönüşsün
  useEffect(() => {
    let timeoutId;
    const schedule = () => {
      const delay = 12000 + Math.random() * 8000;
      timeoutId = setTimeout(() => {
        setHeartBeat((n) => n + 1);
        schedule();
      }, delay);
    };
    schedule();
    return () => clearTimeout(timeoutId);
  }, []);

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

      {/* Sepet butonu — buhar tüten kağıt bardak, sayaç kahve çekirdeği şeklinde */}
      <div className="fixed bottom-5 left-5 z-50 flex items-end gap-2">
        <button
          onClick={handleCartClick}
          aria-label="سبد خرید"
          className={`coffee-cup-btn relative flex items-center justify-center w-16 h-16 rounded-full
            bg-gradient-to-br from-[#8a5a34] via-[#6f4527] to-[#4a2c17]
            border-2 border-[#d9b382]/50 shadow-lg shadow-black/40
            transition-transform duration-300 hover:scale-110 active:scale-95
            ${justAdded ? "cup-jiggle" : ""}`}
        >
          {/* tıklama patlaması — çekirdek ve damlacıklar her yöne fırlar */}
          {burst > 0 && (
            <span key={burst} className="absolute inset-0 pointer-events-none">
              {[...Array(7)].map((_, i) => {
                const angle = (360 / 7) * i + Math.random() * 20;
                const dist = 34 + Math.random() * 14;
                const tx = Math.cos((angle * Math.PI) / 180) * dist;
                const ty = Math.sin((angle * Math.PI) / 180) * dist;
                const isBean = i % 2 === 0;
                return (
                  <span
                    key={i}
                    className="burst-particle absolute top-1/2 left-1/2"
                    style={{ "--tx": `${tx}px`, "--ty": `${ty}px`, animationDelay: `${i * 0.02}s` }}
                  >
                    {isBean ? (
                      <svg width="10" height="8" viewBox="0 0 24 18">
                        <ellipse cx="12" cy="9" rx="11" ry="8" fill="#4a2c17" transform="rotate(-12 12 9)" />
                        <path d="M12 2.5 Q8.5 9 12 15.5" stroke="#e8dcc8" strokeWidth="1.6" fill="none" strokeLinecap="round" />
                      </svg>
                    ) : (
                      <span className="block w-1.5 h-1.5 rounded-full bg-[#d9b382]" />
                    )}
                  </span>
                );
              })}
            </span>
          )}

          {/* buhar — arada bir sürpriz olarak kalbe dönüşür */}
          <svg
            className="absolute -top-4 left-1/2 -translate-x-1/2 w-9 h-7 pointer-events-none"
            viewBox="0 0 40 30"
            fill="none"
          >
            {isHeartMoment ? (
              <path
                className="steam-heart"
                d="M20 26 C10 18 8 10 14 7 C17 5.3 20 7 20 10 C20 7 23 5.3 26 7 C32 10 30 18 20 26 Z"
                fill="#e8a0a8"
              />
            ) : (
              <>
                <path className="steam steam-1" d="M8 28 C3 20 13 16 8 6" stroke="#e8dcc8" strokeWidth="2.2" strokeLinecap="round" />
                <path className="steam steam-2" d="M20 28 C15 20 25 15 20 4" stroke="#e8dcc8" strokeWidth="2.2" strokeLinecap="round" />
                <path className="steam steam-3" d="M32 28 C27 20 37 16 32 6" stroke="#e8dcc8" strokeWidth="2.2" strokeLinecap="round" />
              </>
            )}
          </svg>

          {/* kağıt bardak ikonu */}
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
            <rect x="4" y="3.5" width="16" height="2.6" rx="1.3" fill="#e8dcc8" />
            <path d="M5.3 7.2 L18.7 7.2 L17.1 19.5 C15.2 21 8.8 21 6.9 19.5 Z" fill="#f6e7d8" stroke="#3a2313" strokeWidth="0.4" />
            <rect x="5.6" y="10.4" width="12.8" height="4" fill="#8a5a34" opacity="0.9" />
          </svg>

          {/* çekirdek şeklinde sayaç */}
          {cartCount > 0 && (
            <span key={cartCount} className="bean-pop absolute -top-1.5 -right-1.5">
              <svg width="24" height="18" viewBox="0 0 24 18">
                <ellipse cx="12" cy="9" rx="11" ry="8" fill="#c0392b" stroke="white" strokeWidth="1" transform="rotate(-12 12 9)" />
                <path d="M12 2.5 Q8.5 9 12 15.5" stroke="#f6e7d8" strokeWidth="1.4" fill="none" strokeLinecap="round" />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white">
                {cartCount}
              </span>
            </span>
          )}
        </button>

        {/* sepete eklenince kısa süreli beliren etiket */}
        <span
          className={`order-tag whitespace-nowrap rounded-full bg-[#3a2313]/90 text-[#f6e7d8] text-xs font-semibold px-3 py-2 shadow-md transition-all duration-300 ${
            justAdded ? "order-tag-show" : "order-tag-hide"
          }`}
        >
          سبد شما: {cartCount} مورد
        </span>
      </div>

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

      <style jsx global>{`
        @keyframes steam-rise {
          0% {
            transform: translateY(0) scaleY(0.6);
            opacity: 0;
          }
          25% {
            opacity: 0.9;
          }
          80% {
            opacity: 0.15;
          }
          100% {
            transform: translateY(-9px) scaleY(1.15);
            opacity: 0;
          }
        }
        .steam {
          transform-origin: bottom center;
          animation: steam-rise 2.2s ease-in-out infinite;
        }
        .steam-1 {
          animation-delay: 0s;
        }
        .steam-2 {
          animation-delay: 0.5s;
        }
        .steam-3 {
          animation-delay: 1s;
        }

        @keyframes cup-jiggle {
          0% {
            transform: rotate(0deg) scale(1);
          }
          20% {
            transform: rotate(-9deg) scale(1.08);
          }
          40% {
            transform: rotate(8deg) scale(1.05);
          }
          60% {
            transform: rotate(-5deg) scale(1.03);
          }
          80% {
            transform: rotate(3deg) scale(1.01);
          }
          100% {
            transform: rotate(0deg) scale(1);
          }
        }
        .cup-jiggle {
          animation: cup-jiggle 0.55s ease-in-out;
        }

        @keyframes bean-pop {
          0% {
            transform: scale(0.3);
            opacity: 0;
          }
          60% {
            transform: scale(1.25);
            opacity: 1;
          }
          100% {
            transform: scale(1);
          }
        }
        .bean-pop {
          animation: bean-pop 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .order-tag {
          opacity: 0;
          transform: translateX(-8px) scale(0.9);
        }
        .order-tag-show {
          opacity: 1;
          transform: translateX(0) scale(1);
        }
        .order-tag-hide {
          opacity: 0;
          transform: translateX(-8px) scale(0.9);
        }

        @keyframes burst-out {
          0% {
            transform: translate(-50%, -50%) scale(0.4);
            opacity: 1;
          }
          100% {
            transform: translate(calc(-50% + var(--tx)), calc(-50% + var(--ty))) scale(1);
            opacity: 0;
          }
        }
        .burst-particle {
          animation: burst-out 0.65s ease-out forwards;
        }

        @keyframes steam-heart-pulse {
          0% {
            transform: scale(0.5) translateY(6px);
            opacity: 0;
          }
          25% {
            transform: scale(1.1) translateY(0);
            opacity: 1;
          }
          75% {
            transform: scale(1) translateY(-4px);
            opacity: 0.9;
          }
          100% {
            transform: scale(0.7) translateY(-14px);
            opacity: 0;
          }
        }
        .steam-heart {
          transform-origin: center;
          animation: steam-heart-pulse 2.2s ease-in-out;
        }
      `}</style>
    </>
  );
}