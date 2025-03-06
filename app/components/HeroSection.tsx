"use client";

import React from "react";
import { Button } from "@mui/material";
import Link from "next/link";

const HeroSection = () => {
  return (
    <section className="relative w-full h-[80vh] bg-cover bg-center flex items-center justify-center text-center text-white"
      style={{ backgroundImage: "url('/images/hero-background.jpg')" }}>
      
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      <div className="relative z-10 max-w-3xl px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to Our Store
        </h1>
        <p className="text-lg md:text-2xl mb-8">
          Discover the latest products and exclusive offers just for you.
        </p>

        <div className="flex justify-center space-x-4">
          <Link href="/shop">
            <Button variant="contained" color="primary" size="large">
              Shop Now
            </Button>
          </Link>
          <Link href="/about">
            <Button variant="outlined" color="inherit" size="large">
              Learn More
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
