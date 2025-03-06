"use client";

import React, { useState } from "react";
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from "@mui/material";
import { useCartStore } from "@/lib/useCartStore";

type Product = {
  id: string;
  name: string;
  price: number;
  sku: string;
  primary_image_url?: string;
};

// Define ProductCardProps type with onAddToBasket
type ProductCardProps = {
  product: Product;
  onAddToBasket: (product: Product) => void;
};

const ProductCard = ({ product }: ProductCardProps) => {
  const addToCart = useCartStore((state) => state.addToCart);
  const [added, setAdded] = useState(false);

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1000); // Reset after 1 seconds
  };

  return (
    <Card className="w-full h-full flex flex-col">
      {product.primary_image_url && (
        <CardMedia
          component="img"
          height="200"
          image={product.primary_image_url}
          alt={product.name}
        />
      )}
      <CardContent className="flex-grow">
        <Typography gutterBottom variant="h6" component="div">
          {product.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          SKU: {product.sku}
        </Typography>
        <Typography variant="h6" color="text.primary" className="mt-2">
          £{product.price.toFixed(2)}
        </Typography>
      </CardContent>
      <CardActions className="flex flex-col items-start">
        <Button
          size="small"
          variant="contained"
          color={added ? "success" : "primary"}
          onClick={handleAddToCart}
          disabled={added}
        >
          {added ? "Added" : "Add to Basket"}
        </Button>
        {added && (
          <Typography variant="caption" color="success.main" className="mt-1">
            Product added to cart!
          </Typography>
        )}
      </CardActions>
    </Card>
  );
};

export default ProductCard;
