"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart } from "@mui/icons-material";
import { PiShoppingCartLight } from "react-icons/pi";
import { TextField, Autocomplete, Box, Typography, IconButton } from "@mui/material";
import { useCartStore } from "@/lib/useCartStore";
import { supabase } from "@/lib/supabaseClient";

const ShopHeader = () => {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.cartItems);
  const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  const [products, setProducts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);

  // Fetch Products for Search Dropdown
  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name, price, slug, product_images (image_url)")
        .limit(10);

      if (error) {
        console.error("Error fetching products:", error.message);
      } else {
        const productsWithImages = (data as any[]).map((product) => {
          const primaryImage = product.product_images?.[0]?.image_url;
          return {
            ...product,
            primary_image_url: primaryImage || "/images/Placeholder.jpg",
          };
        });
        setProducts(productsWithImages);
      }
    };

    fetchProducts();
  }, []);

  // Handle Search Input Changes
  const handleSearchChange = (event: React.SyntheticEvent<Element, Event>, value: string) => {
    setSearchTerm(value);
    const filtered = products.filter((product) =>
      product.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredProducts(filtered);
  };

  // Handle Selection & Redirect to Product Page
  const handleSelect = (_event: any, newValue: any) => {
    if (newValue && newValue.slug) {
      router.push(`/shop/product/${newValue.slug}`);
    }
  };

  return (
    <header className="w-full bg-white shadow-md py-4 px-6">
      <div className="max-w-screen-xl px-4 mx-auto flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="text-2xl font-bold text-gray-800">
          My Store
        </Link>

        {/* Search Bar with Autocomplete */}
        <div className="flex justify-center items-center flex-grow mx-6">
          <Autocomplete
            freeSolo
            options={filteredProducts}
            getOptionLabel={(option) => option.name}
            onInputChange={handleSearchChange}
            onChange={handleSelect}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search Products"
                variant="outlined"
                fullWidth
                sx={{ width: 500 }}
              />
            )}
            renderOption={(props, option) => {
              const { key, ...restProps } = props; 
              return (
                <Box
                  key={option.id}
                  component="li"
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    padding: "10px",
                    gap: 2,
                    width: "100%",
                    borderBottom: "1px solid #e0e0e0",
                    "&:last-child": { borderBottom: "none" },
                  }}
                  {...restProps}
                >
                  {/* Larger and clearer image */}
                  <img
                    src={option.primary_image_url}
                    alt={option.name}
                    className="w-16 h-16 object-contain rounded border border-gray-300"
                  />
                  <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="body1" className="font-semibold">
                      {option.name}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      £{option.price.toFixed(2)}
                    </Typography>
                  </Box>
                </Box>
              );
            }}            
          />
        </div>

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
            <PiShoppingCartLight fontSize="30px" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default ShopHeader;
