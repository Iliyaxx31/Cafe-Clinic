import Image from "next/image";
import React from "react";
import data from "../json/data.json";
import { Section } from "lucide-react";

const Header = ({ logo, coffeName }) => {
  const cafeName = data?.cafeName || "Spna Cafe";

  return (
    <div className="w-screen object-cover flex-col h-40 items-center flex justify-center gap-4  bg-gradient-to-l from-[#fdf6e7] via-[#d1eefc] to-[#b3e0ff]">
      <Image
        className="min-w-[auto] h-[auto] mt-10 object-cover text-bold"
        src={logo}
        alt="Cafe Clinik Logo"
        width={270}
        height={140}
      />

      <h1 className=" drop-shadow-lg text-gray-700/70 font-bold text-[20px] absolute ml-10  mt-28">
        {coffeName}
      </h1>
    </div>
  );
};

export default Header;
