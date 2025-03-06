"use client";

import React from "react";
import { Button, IconButton } from "@mui/material";
import { Add, Remove, Close } from "@mui/icons-material"; // Added Close icon
import { useCartStore } from "@/lib/useCartStore";

export default function CartPage() {
  const cartItems = useCartStore((state) => state.cartItems);
  const increaseQuantity = useCartStore((state) => state.increaseQuantity);
  const decreaseQuantity = useCartStore((state) => state.decreaseQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart); // Function to remove items

  const getTotal = () =>
    cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0);

  return (
    <div className="max-w-4xl mx-auto p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>

      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-6">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between gap-4 bg-gray-800 p-4 rounded-md"
            >
              {/* Product Thumbnail */}
              <div className="flex items-center gap-4">
                {item.primary_image_url ? (
                  <img
                    src={item.primary_image_url}
                    alt={item.name}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                ) : (
                  <div className="w-16 h-16 bg-gray-700 rounded-md" />
                )}
                <div>
                  <p className="font-semibold">{item.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => decreaseQuantity(item.id)}
                    >
                      <Remove fontSize="small" />
                    </IconButton>
                    <span>{item.quantity || 1}</span>
                    <IconButton
                      size="small"
                      color="primary"
                      onClick={() => increaseQuantity(item.id)}
                    >
                      <Add fontSize="small" />
                    </IconButton>
                  </div>
                </div>
              </div>

              {/* Remove Item Button */}
              <IconButton
                size="small"
                color="secondary"
                onClick={() => removeFromCart(item.id)}
              >
                <Close fontSize="small" />
              </IconButton>

              {/* Product Total Price */}
              <div className="font-medium">
                £{(item.price * (item.quantity || 1)).toFixed(2)}
              </div>
            </div>
          ))}

          {/* Cart Total */}
          <div className="flex justify-between font-bold text-lg mt-6">
            <span>Total:</span>
            <span>£{getTotal().toFixed(2)}</span>
          </div>

          {/* Checkout Button */}
          <Button
            variant="contained"
            color="primary"
            href="/shop/checkout"
            className="mt-4"
          >
            Proceed to Checkout
          </Button>
        </div>
      )}
    </div>
  );
}
