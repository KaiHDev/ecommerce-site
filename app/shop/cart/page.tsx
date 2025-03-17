"use client";

import React from "react";
import { Button, IconButton } from "@mui/material";
import { Add, Remove, Close } from "@mui/icons-material";
import { useCartStore } from "@/lib/useCartStore";
import Image from "next/image";

export default function CartPage() {
  const cartItems = useCartStore((state) => state.cartItems);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const getTotal = () =>
    cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0);

  return (
    <div className="max-w-screen-lg mx-auto px-4 py-10 flex flex-col">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p className="text-gray-500 text-lg text-center">Your cart is empty.</p>
      ) : (
        <div className="bg-white shadow-md border border-gray-200 rounded-lg p-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center gap-6 py-4 border-gray-200 last:border-b-0"
            >
              {/* Product Thumbnail */}
              <div className="w-20 h-20 border border-gray-300 rounded-md flex justify-center items-center bg-gray-100">
                <Image
                  src={item.primary_image_url || "/images/Placeholder.jpg"}
                  alt={item.name}
                  width={200}
                  height={200}
                  className="w-full h-full object-contain rounded-md"
                />
              </div>

              {/* Product Details & Quantity Controls */}
              <div className="flex-1">
                <p className="font-semibold text-lg">{item.name}</p>
                <div className="flex items-center gap-2 mt-2">
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => decreaseQuantity(item.id)}
                  >
                    <Remove fontSize="small" />
                  </IconButton>
                  <span className="text-lg font-medium">{item.quantity || 1}</span>
                  <IconButton
                    size="small"
                    color="primary"
                    onClick={() => increaseQuantity(item.id)}
                  >
                    <Add fontSize="small" />
                  </IconButton>
                </div>
              </div>

              {/* Product Price */}
              <div className="font-medium text-lg">
                £{(item.price * (item.quantity || 1)).toFixed(2)}
              </div>

              {/* Remove Item Button (Now Aligned Properly) */}
              <IconButton
                size="small"
                color="error"
                onClick={() => removeFromCart(item.id)}
                className="ml-4"
              >
                <Close fontSize="small" />
              </IconButton>
            </div>
          ))}

          {/* Cart Total */}
          <div className="flex justify-between font-bold text-xl mt-6 border-t border-gray-300 pt-4">
            <span>Total:</span>
            <span>£{getTotal().toFixed(2)}</span>
          </div>

          {/* Checkout Button */}
          <div className="mt-6 flex justify-end">
            <Button
              variant="contained"
              color="primary"
              href="/shop/checkout"
              className="w-full sm:w-auto px-6 py-2"
            >
              Proceed to Checkout
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}