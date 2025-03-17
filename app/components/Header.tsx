"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PiShoppingCartLight } from "react-icons/pi";
import { TextField, Autocomplete, Box, Typography, AutocompleteChangeReason } from "@mui/material";
import { useCartStore } from "@/lib/useCartStore";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";

// Define Product Type
type Product = {
  id: string;
  name: string;
  price: number;
  slug: string;
  primary_image_url?: string;
};

const ShopHeader = () => {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.cartItems);
  const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");

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
        // Ensure each product has a primary image or fallback
        const productsWithImages = (data as any[]).map((product) => ({
          id: product.id,
          name: product.name,
          price: product.price,
          slug: product.slug,
          primary_image_url: product.product_images?.[0]?.image_url || "/images/Placeholder.jpg",
        }));
        setProducts(productsWithImages);
      }
    };

    fetchProducts();
  }, []);

  // Handle Search Input Changes (Handles Both Strings & Products)
  const handleSearchChange = (_event: React.SyntheticEvent, value: string | Product | null) => {
    if (typeof value === "string") {
      setSearchTerm(value);
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setSearchTerm("");
      setFilteredProducts(products);
    }
  };

  // Handle Selection & Redirect to Product Page
  const handleSelect = (
    _event: React.SyntheticEvent,
    newValue: string | Product | null,
    _reason: AutocompleteChangeReason
  ) => {
    if (newValue && typeof newValue === "object" && "slug" in newValue) {
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
            getOptionLabel={(option) => (typeof option === "string" ? option : option.name)}
            onInputChange={handleSearchChange}
            onChange={handleSelect}
            renderInput={(params) => (
              <TextField {...params} label="Search Products" variant="outlined" fullWidth sx={{ width: 500 }} />
            )}
            renderOption={(props, option) => (
              <Box
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
                {...props}
              >
                {/* Product Image */}
                <Image
                  src={option.primary_image_url ?? "/images/Placeholder.jpg"}
                  alt={option.name}
                  width={64}
                  height={64}
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
            )}
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
