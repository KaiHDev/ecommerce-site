"use client";

import React from "react";
import { Button } from "@mui/material";
import Link from "next/link";

const HeroSection = () => {
  return (
      <section
        className="relative w-full h-[50vh] flex items-center justify-center text-center text-white bg-cover bg-center"
        style={{ 
          backgroundImage: "url('/images/Fashion-image-background.jpg')", 
          backgroundPosition: "center top 20%"
        }}
      >
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-3xl px-6">
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          Welcome to Our Store
        </h1>
        <p className="text-lg md:text-2xl mb-8">
          Discover the latest products and exclusive offers just for you.
        </p>

        <div className="flex justify-center space-x-4">
          <Link href="/shop">
            <Button variant="contained" className="bg-primary hover:bg-accent" size="large">
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
