"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { PiShoppingCartLight, PiListBold, PiXBold } from "react-icons/pi";
import { TextField, Autocomplete, Box, Typography } from "@mui/material";
import { useCartStore } from "@/lib/useCartStore";
import { supabase } from "@/lib/supabaseClient";
import Image from "next/image";
import { Product } from "../types/Product";

const ShopHeader = () => {
  const router = useRouter();
  const cartItems = useCartStore((state) => state.cartItems);
  const totalItems = cartItems.reduce((total, item) => total + (item.quantity || 1), 0);

  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id, name, price, slug, sku, product_images (image_url, image_order)
        `)
        .limit(10);
  
      if (error) {
        console.error("Error fetching products:", error.message);
      } else if (data) {
        const productsWithImages: Product[] = data.map((product) => ({
          ...product,
          product_images: product.product_images || [],
          primary_image_url:
            product.product_images?.[0]?.image_url || "/images/Placeholder.jpg",
        }));
  
        setProducts(productsWithImages);
      }
    };
  
    fetchProducts();
  }, []);  

  const handleSearchChange = (_event: React.SyntheticEvent, value: string | Product | null) => {
    if (typeof value === "string") {
      const filtered = products.filter((product) =>
        product.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredProducts(filtered);
    } else {
      setFilteredProducts(products);
    }
  };

  const handleSelect = (
    _event: React.SyntheticEvent,
    newValue: string | Product | null
  ) => {
    if (newValue && typeof newValue === "object" && "slug" in newValue) {
      router.push(`/shop/product/${newValue.slug}`);
      setMenuOpen(false);
    }
  };

  return (
    <header className="w-full bg-white shadow-md py-4 px-6">
      <div className="max-w-screen-xl px-4 mx-auto flex justify-between items-center">
        <Link href="/" className="text-2xl font-bold text-gray-800">
          My Store
        </Link>

        {/* Desktop Search */}
        <div className="hidden lg:flex justify-center items-center flex-grow mx-6">
          <Autocomplete
            freeSolo
            options={filteredProducts}
            getOptionLabel={(option) => (typeof option === "string" ? option : option.name)}
            onInputChange={handleSearchChange}
            onChange={handleSelect}
            renderInput={(params) => (
              <TextField {...params} label="Search Products" variant="outlined" fullWidth sx={{ width: 500 }} />
            )}
            renderOption={(props, option) => {
              return (
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
              );
            }}                        
          />
        </div>

        {/* Desktop Nav + Cart */}
        <div className="hidden lg:flex items-center space-x-6">
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
          <Link href="/shop/cart" className="relative text-gray-600 hover:text-black">
            <PiShoppingCartLight fontSize="30px" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <div className="flex lg:hidden items-center space-x-4">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-gray-800 focus:outline-none"
            aria-label="Toggle menu"
          >
            {menuOpen ? <PiXBold fontSize="32px" /> : <PiListBold fontSize="32px" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown */}
      {menuOpen && (
        <div className="lg:hidden bg-white shadow-md p-4 space-y-6">
          <div>
            <Autocomplete
              freeSolo
              options={filteredProducts}
              getOptionLabel={(option) => (typeof option === "string" ? option : option.name)}
              onInputChange={handleSearchChange}
              onChange={handleSelect}
              renderInput={(params) => (
                <TextField {...params} label="Search Products" variant="outlined" fullWidth />
              )}
              renderOption={(props, option) => {
                const { key, ...restProps } = props;
                return (
                  <Box
                    key={key}
                    component="li"
                    {...restProps}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      padding: "10px",
                      gap: 2,
                      width: "100%",
                      borderBottom: "1px solid #e0e0e0",
                      "&:last-child": { borderBottom: "none" },
                    }}
                  >
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
                );
              }}
            />
          </div>

          <nav className="flex flex-col space-y-4">
            <Link href="/shop" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-black">
              Shop
            </Link>
            <Link href="/about" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-black">
              About
            </Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="text-gray-700 hover:text-black">
              Contact
            </Link>
            <Link href="/shop/cart" onClick={() => setMenuOpen(false)} className="relative text-gray-700 hover:text-black flex items-center gap-2">
              <PiShoppingCartLight fontSize="26px" />
              Cart
              {totalItems > 0 && (
                <span className="bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 ml-1">
                  {totalItems}
                </span>
              )}
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};

export default ShopHeader;
