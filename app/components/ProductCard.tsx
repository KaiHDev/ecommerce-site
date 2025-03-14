"use client";

import React, { useState } from "react";
import { useCartStore } from "@/lib/useCartStore";
import Link from "next/link";

type Product = {
  id: string;
  name: string;
  price: number;
  sku: string;
  primary_image_url?: string;
  slug?: string;
  description?: string;
};

const ProductCard = ({ product }: { product: Product }) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000);
  };

  // Shorten description to about 50 characters
  const shortDescription = product.description
    ? product.description.length > 50
      ? `${product.description.slice(0, 50)}...`
      : product.description
    : "";

  return (
    <div className="shadow-md rounded-lg border border-gray-200 flex flex-col">
      {/* Product Image */}
      <div className="mt-5 ml-5 mr-5 flex justify-center items-center bg-gray-100 rounded-t-lg overflow-hidden">
        <img
          src={product.primary_image_url || "/images/Placeholder.jpg"}
          alt={product.name}
          className="w-full h-full object-contain"
        />
      </div>

      {/* Product Info */}
      <div className="text-center p-4 space-y-2 flex-grow">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <p className="text-gray-800 font-bold text-xl">£{product.price.toFixed(2)}</p>

        {shortDescription && (
          <p className="text-gray-600 text-sm">{shortDescription}</p>
        )}
      </div>

      {/* Buttons */}
      <div className="flex flex-col gap-2 px-4 pb-4">
        <Link href={`/shop/product/${product.slug}`} passHref className="w-full">
          <button className="w-full border border-primary text-primary py-2 rounded-md hover:bg-primary hover:text-white transition">
            View Product
          </button>
        </Link>
        <button
          onClick={handleAddToCart}
          disabled={added}
          className={`w-full py-2 rounded-md transition ${
            added ? "bg-yellow-600 text-white" : "bg-primary text-white hover:bg-accent"
          }`}
        >
          {added ? "Added" : "Add to Basket"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
