"use client";
import { CiCoffeeCup, CiGlass } from "react-icons/ci";
import { RiDrinks2Line } from "react-icons/ri";
import { TbMilkshake } from "react-icons/tb";
import { SiGitea } from "react-icons/si";
import { FaHamburger, FaCookie , FaBreadSlice, FaPizzaSlice } from "react-icons/fa";
import Kategori from "./Kategori";
import { SiBuymeacoffee } from "react-icons/si";
import { BiSolidBowlHot } from "react-icons/bi";


// Varsayılan icon listesi (sırayla gider)
const defaultIcons = [
  CiCoffeeCup,
  RiDrinks2Line,
  TbMilkshake,
  SiGitea,
 SiBuymeacoffee ,
];
console.log("NEW DEPLOY ACTIVE");

// Farsça isimlere göre icon eşlemesi
const specialIcons = {
  همبرگر: FaHamburger, // Hamburger
  ساندویچ: FaBreadSlice, // Sandviç
  تست: FaBreadSlice, // Tost
  پیتزا: FaPizzaSlice, // Pizza
  برگر: FaHamburger, // Burger
 "نوشیدنی گرم":  BiSolidBowlHot ,
  "ملک شیک": TbMilkshake, // Milkshake (farklı)
  "کیک و کوکی":FaCookie
};

const Navbar = ({ onSelectCategory, activeIndex, categories }) => {
  return (
    <>
      {categories.map((cat, idx) => {
        let IconComponent = defaultIcons[idx % defaultIcons.length];

        if (specialIcons[cat.name]) {
          IconComponent = specialIcons[cat.name];
        }

        return (
          <div key={cat.id}>
            <Kategori
              Icon={IconComponent}
              size={55}
              text={cat.name}
              isActive={activeIndex === idx}
              onClick={() => onSelectCategory(idx)}
            />
          </div>
        );
      })}
    </>
  );
};

export default Navbar;
