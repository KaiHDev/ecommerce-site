"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ProductCard from "./components/ProductCard";
import HeroSection from "./components/HeroSection";
import FeatureSection from "./components/FeatureSection";
import TestimonialsSection from "./components/TestimonialsSection";

type ProductImage = {
  image_url: string;
  image_order: number;
};

type Product = {
  id: string;
  name: string;
  price: number;
  sku: string;
  slug: string;
  product_images: ProductImage[];
};

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id, name, price, sku, slug, description,
          product_images(image_url, image_order)
        `)
        .order("created_at", { ascending: false })
        .limit(4);
  
      if (error) {
        console.error("Error fetching products:", error.message);
        return;
      }
      
      const productsWithPrimaryImages = data.map((product: Product) => {
        const sortedImages = [...product.product_images].sort(
          (a, b) => a.image_order - b.image_order
        );
      
        return {
          ...product,
          primary_image_url: sortedImages[0]?.image_url || "/images/Placeholder.jpg",
        };
      });
  
      setProducts(productsWithPrimaryImages);
    };
  
    fetchProducts();
  }, []);  

  return (
    <div className="relative">
      <HeroSection />
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 py-10">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
      <FeatureSection />
      <TestimonialsSection />
    </div>
  );
};

export default HomePage;