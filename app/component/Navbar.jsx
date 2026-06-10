"use client";
import { CiCoffeeCup, CiGlass } from "react-icons/ci";
import { RiDrinks2Line } from "react-icons/ri";
import { TbMilkshake } from "react-icons/tb";
import { SiGitea } from "react-icons/si";
import { FaHamburger, FaBreadSlice, FaPizzaSlice } from "react-icons/fa";
import Kategori from "./Kategori";

// Varsayılan icon listesi (sırayla gider)
const defaultIcons = [
  CiCoffeeCup,
  RiDrinks2Line,
  TbMilkshake,
  SiGitea,
  CiGlass,
];

// Farsça isimlere göre icon eşlemesi
const specialIcons = {
  همبرگر: FaHamburger, // Hamburger
  ساندویچ: FaBreadSlice, // Sandviç
  تست: FaBreadSlice, // Tost
  پیتزا: FaPizzaSlice, // Pizza
  برگر: FaHamburger, // Burger

  "ملک شیک": TbMilkshake, // Milkshake (farklı)
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
