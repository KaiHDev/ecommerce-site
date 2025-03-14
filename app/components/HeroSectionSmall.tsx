"use client";

import React from "react";

const HeroSectionSmall = ({ title }: { title: string }) => {
  return (
    <section
      className="relative w-full h-[40vh] flex items-center justify-center text-center text-white bg-cover bg-center"
      style={{ backgroundImage: "url('/images/HeroSection.jpg')" }}
    >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-3xl px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          {title}
        </h1>
      </div>
    </section>
  );
};

export default HeroSectionSmall;
