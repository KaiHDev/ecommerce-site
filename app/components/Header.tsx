"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart } from "@mui/icons-material";

const Header = () => {
  return (
    <header className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
      
      {/* Logo on the left */}
      <Link href="/" className="text-2xl font-bold text-gray-800">
        My Store
      </Link>

      {/* Navigation + Cart aligned to the right */}
      <div className="flex items-center space-x-6">
        <nav className="flex space-x-6">
          <Link href="/shop" className="text-gray-600 hover:text-black">
            Shop
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-black">
            About
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-black">
            Contact
          </Link>
        </nav>

        {/* Cart Icon */}
        <Link href="/cart" className="text-gray-600 hover:text-black relative">
          <ShoppingCart fontSize="large" />
          {/* Optional cart count badge */}
          {/* <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1">
            3
          </span> */}
        </Link>
      </div>
    </header>
  );
};

export default Header;
