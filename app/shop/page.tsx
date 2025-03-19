"use client";

import React, { useState, useEffect } from "react";
import {
  Pagination,
  TextField,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Button,
} from "@mui/material";
import { useCartStore } from "@/lib/useCartStore";
import { supabase } from "@/lib/supabaseClient";
import Link from "next/link";
import Image from "next/image";

type Product = {
  id: string;
  name: string;
  price: number;
  sku: string;
  primary_image_url: string;
  slug: string;
};

const ShopPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [page, setPage] = useState<number>(1);
  const [pageSize] = useState<number>(8);
  const [priceFilter, setPriceFilter] = useState<"low" | "high" | "">("");

  const [addedState, setAddedState] = useState<{ [key: string]: boolean }>({});

  const addToCart = useCartStore((state) => state.addToCart);

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase
        .from("products")
        .select(`id, name, price, sku, slug, product_images(image_url, image_order)`);

      if (error) {
        console.error(error.message);
      } else if (data) {
        const productsWithPrimaryImage: Product[] = data.map((product) => {
          const sortedImages = product.product_images
            ?.sort((a: { image_order: number }, b: { image_order: number }) => a.image_order - b.image_order)
            .map((img: { image_url: string }) => img.image_url);

          return {
            ...product,
            primary_image_url: sortedImages?.[0] || "/images/Placeholder.jpg",
            slug: product.slug || product.name.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, ""),
          };
        });

        setProducts(productsWithPrimaryImage);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (priceFilter) {
      filtered = filtered.sort((a, b) => (priceFilter === "low" ? a.price - b.price : b.price - a.price));
    }

    setFilteredProducts(filtered);
  }, [searchTerm, priceFilter, products]);

  const handlePageChange = (_event: React.ChangeEvent<unknown>, value: number) => setPage(value);

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    setAddedState((prevState) => ({ ...prevState, [product.id]: true }));

    setTimeout(() => {
      setAddedState((prevState) => ({ ...prevState, [product.id]: false }));
    }, 1500);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-10">
      <div className="flex flex-col md:flex-row justify-between mb-6 gap-4">
        <TextField
          label="Search Products"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="md:max-w-sm"
        />
        <FormControl className="w-full md:w-64">
          <InputLabel>Price Filter</InputLabel>
          <Select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value as "low" | "high" | "")}
            label="Price Filter"
          >
            <MenuItem value="low">Low to High</MenuItem>
            <MenuItem value="high">High to Low</MenuItem>
          </Select>
        </FormControl>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts
          .slice((page - 1) * pageSize, page * pageSize)
          .map((product) => {
            const added = addedState[product.id] || false;

            return (
              // Inside the .map() return of your ShopPage:
              <div
                key={product.id}
                className="bg-white border border-gray-200 shadow-md rounded-lg p-4 flex flex-col items-center"
              >
                <div className="w-full h-64 flex justify-center items-center bg-gray-100 rounded-lg overflow-hidden">
                  <Image
                    src={product.primary_image_url}
                    alt={product.name}
                    width={200}
                    height={200}
                    className="w-full h-full object-contain"
                  />
                </div>

                <h3 className="text-lg font-semibold mt-3">{product.name}</h3>
                <p className="text-xl font-bold text-gray-800 mt-2">£{product.price.toFixed(2)}</p>

                <div className="w-full flex flex-col items-center space-y-2 mt-4">
                  <Link href={`/shop/product/${product.slug}`} passHref className="w-full">
                    <button className="w-full border border-primary text-primary py-2 rounded-md hover:bg-primary hover:text-white transition">
                      View Product
                    </button>
                  </Link>
                  <button
                    onClick={() => handleAddToCart(product)}
                    disabled={addedState[product.id]}
                    className={`w-full py-2 rounded-md transition ${
                      addedState[product.id]
                        ? "bg-yellow-600 text-white"
                        : "bg-primary text-white hover:bg-accent"
                    }`}
                  >
                    {addedState[product.id] ? "Added" : "Add to Basket"}
                  </button>
                </div>
              </div>
            );
          })}
      </div>

      <div className="flex justify-center mt-10">
        <Pagination
          count={Math.ceil(filteredProducts.length / pageSize)}
          page={page}
          onChange={handlePageChange}
        />
      </div>
    </div>
  );
};

export default ShopPage;
