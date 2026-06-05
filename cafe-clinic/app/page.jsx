"use client";
import { useState, useEffect } from "react";
import Header from "./component/Header";
import Navbar from "./component/Navbar";
import Produc from "./component/Produc";
import Image from "next/image";
import Footer from "./component/Footer";
import Cart from "./component/Cart";
import { BsCartFill } from "react-icons/bs";
import { AiFillWarning, AiOutlineAlert } from "react-icons/ai";
import { IoWarningOutline } from "react-icons/io5";
import { MdOutlineReportProblem } from "react-icons/md";

export default function Home() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [data, setData] = useState(null);
  const [prices, setPrices] = useState({});
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);

  useEffect(() => {
    fetchData();
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
    } catch (error) {
      console.error("Veri yüklenemedi:", error);
    } finally {
      setLoading(false);
    }
  };

  const goFullscreen = () => {
    if (document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen();
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

      <nav className="flex border-b border-white/40 sticky top-0 z-30 overflow-auto bg-[#dee5ed]/90 backdrop-blur-xs md:justify-center py-3 shadow-lg whitespace-nowrap">
        <Navbar
          onSelectCategory={setSelectedIndex}
          activeIndex={selectedIndex}
          categories={data.categories}
        />
      </nav>

{/* Uyarı - Sepet sadece uzaktan sipariş için */}
<div className="bg-[#dee5ed]/90 items-center  h-10 justify-between lg:justify-center lg:gap-4  border-gray-700/30  p-2 flex w-screen">
 < MdOutlineReportProblem className=" mt-2 ml-2 opacity-90 text-red-700 text-[24px]"/>
  <p className="text-center mt-2 text-gray-800/60 font-bold">
  برای سفارش <span className="underline text-black">حضوری،</span> لطفا با کارکنان کافه صحبت کنید
  </p>
 < MdOutlineReportProblem className=" mt-3 ml-2 opacity-90 text-red-700 text-[24px]"/>

</div>

      <main className="p-4 min-h-screen bg-[#dee5ed]/90 backdrop-blur-xs">
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
        ⛶
      </button>

      <button
        onClick={() => setShowCart(true)}
        className="fixed bottom-5 left-5 bg-gradient-to-l to-gray-300 from-blue-400 backdrop-blur-md hover:bg-blue-700 text-white px-5 py-3 rounded-full shadow-lg z-50 transition-all duration-300 hover:scale-110 flex items-center gap-2"
      >
        <BsCartFill size={22} />
        <span className="font-bold text-sm ">سبد خرید</span>
        {cart.length > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-md">
            {cart.reduce((sum, i) => sum + i.quantity, 0)}
          </span>
        )}
      </button>

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