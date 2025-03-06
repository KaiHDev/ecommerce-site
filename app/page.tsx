"use client";

import React, { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import ProductCard from "./components/ProductCard";
import LoadingSpinner from "./components/LoadingSpinner";
import HeroSection from "./components/HeroSection";
import Footer from "./components/Footer";
import FeatureSection from "./components/FeatureSection";
import TestimonialsSection from "./components/TestimonialsSection";

type Product = {
  id: string;
  name: string;
  price: number;
  sku: string;
  image_url?: string;
};

const HomePage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("products")
        .select(`
          id,
          name,
          price,
          sku,
          product_images (
            image_url,
            is_primary
          )
        `)
        .limit(4);
  
      if (error) {
        console.error("Error fetching products:", error.message);
      } else {
        const productsWithPrimaryImage = (data as any[]).map((product) => {
          const primaryImage = product.product_images?.find(
            (img: any) => img.is_primary
          );
          return {
            id: product.id,
            name: product.name,
            price: product.price,
            sku: product.sku,
            primary_image_url: primaryImage?.image_url || "",
          };
        });
  
        setProducts(productsWithPrimaryImage);
      }
      setLoading(false);
    };
  
    fetchProducts();
  }, []);  

  const handleAddToBasket = (product: Product) => {
    console.log("Added to basket:", product);
    // TODO: Integrate with your basket/cart system here
  };

  return (
    <div className="relative">
      {loading && <LoadingSpinner />}
      <HeroSection />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToBasket={handleAddToBasket}
          />
        ))}
      </div>
      <FeatureSection />
      <TestimonialsSection />
    </div>
  );
};

export default HomePage;
