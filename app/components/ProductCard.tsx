"use client";

import React from "react";
import { Card, CardActions, CardContent, CardMedia, Button, Typography } from "@mui/material";

type Product = {
  id: string;
  name: string;
  price: number;
  sku: string;
  primary_image_url?: string;
};

type ProductCardProps = {
  product: Product;
  onAddToBasket: (product: Product) => void;
};

const ProductCard = ({ product, onAddToBasket }: ProductCardProps) => {
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
      <CardActions>
        <Button
          size="small"
          variant="contained"
          color="primary"
          onClick={() => onAddToBasket(product)}
        >
          Add to Basket
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
