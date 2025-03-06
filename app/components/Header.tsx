"use client";

import React from "react";
import Link from "next/link";
import { ShoppingCart } from "@mui/icons-material";
import { useCartStore } from "@/lib/useCartStore";

const ShopHeader = () => {
  const cartItems = useCartStore((state) => state.cartItems);
  const totalItems = cartItems.reduce(
    (total, item) => total + (item.quantity || 1),
    0
  );

  return (
    <header className="w-full bg-white shadow-md py-4 px-6 flex justify-between items-center">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold text-gray-800">
        My Store
      </Link>

      {/* Navigation + Cart */}
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

        {/* Cart Icon with Counter */}
        <Link href="/shop/cart" className="relative text-gray-600 hover:text-black">
          <ShoppingCart fontSize="large" />
          {totalItems > 0 && (
            <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
              {totalItems}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
};

export default ShopHeader;
