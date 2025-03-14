"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useCartStore } from "@/lib/useCartStore";
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import { Box, Typography, Button, CardActions, Container } from "@mui/material";

// Define types
type Product = {
  id: string;
  name: string;
  price: number;
  sku: string;
  primary_image_url: string;
  slug: string;
  description?: string;
};

type ProductImage = {
  image_url: string;
};

const ProductPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [images, setImages] = useState<{ original: string; thumbnail: string }[]>([]);
  const [added, setAdded] = useState(false);

  // Cart functionality
  const addToCart = useCartStore((state) => state.addToCart);
  const cartItems = useCartStore((state) => state.cartItems);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
  
      const { data, error } = await supabase
        .from("products")
        .select(`
          id, name, price, sku, slug, description,
          product_images (image_url, image_order)
        `)
        .eq("slug", slug)
        .single();
  
      if (error) {
        console.error("Error fetching product:", error.message);
        return;
      }
  
      if (data) {
        // Sort images by image_order
        const sortedImages = data.product_images.sort(
          (a: any, b: any) => a.image_order - b.image_order
        );
  
        // Assign primary image
        const primaryImage = sortedImages.length > 0 
          ? sortedImages[0].image_url 
          : "/images/Placeholder.jpg";
  
        setProduct({
          ...data,
          primary_image_url: primaryImage,
        });
  
        // Format images for the gallery component
        setImages(
          sortedImages.map((img: any) => ({
            original: img.image_url,
            thumbnail: img.image_url,
          }))
        );
      }
    };
  
    fetchProduct();
  }, [slug]);  

  // Handle Add to Cart
  const handleAddToCart = () => {
    if (!product) return;
  
    const cartProduct = {
      id: product.id,
      name: product.name,
      price: product.price,
      sku: product.sku,
      primary_image_url: product.primary_image_url || "/images/Placeholder.jpg", // Default if missing
      slug: product.slug,
    };
  
    addToCart(cartProduct);
    setAdded(true);
  
    setTimeout(() => setAdded(false), 1000);
  };  

  if (!product) {
    return;
  }

  return (
    <div className="max-w-screen-xl mx-auto">
      <Container maxWidth="xl" sx={{ padding: "40px 0"}}>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 6, justifyContent: "center" }}>
          {/* Product Image Section */}
          <Box sx={{ flex: 1, minWidth: "400px", maxWidth: "500px" }}>
            <ImageGallery
              items={images}
              showPlayButton={false}
              showFullscreenButton={false}
              showNav={true}
              thumbnailPosition="bottom"
              additionalClass="custom-gallery"
            />
          </Box>

          {/* Product Info Section */}
          <Box sx={{ flex: 1, minWidth: "350px" }}>
            <Typography variant="h4" sx={{ fontWeight: 600, marginBottom: 1 }}>
              {product.name}
            </Typography>
            {product.description && (
              <Typography variant="body1" sx={{ mb: 3 }}>
                {product.description}
              </Typography>
            )}
            <Typography variant="h5" color="primary" sx={{ fontWeight: 600 }}>
              £{product.price.toFixed(2)}
            </Typography>

            {/* Add to Cart Button */}
            <CardActions sx={{ marginTop: "20px", padding: "0" }}>
              <Button
                size="large"
                variant="contained"
                color={added ? "success" : "primary"}
                onClick={handleAddToCart}
                disabled={added}
                sx={{ width: "100%", maxWidth: "250px" }}
              >
                {added ? "Added" : "Add to Basket"}
              </Button>
            </CardActions>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default ProductPage;
