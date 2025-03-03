"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useDropzone } from "react-dropzone";

const AddProductDialog = ({ open, onClose, fetchProducts }: any) => {
  const [product, setProduct] = useState({ name: "", price: "", sku: "" });
  const [images, setImages] = useState<File[]>([]);
  const [primaryImage, setPrimaryImage] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);

  // Handle file drop for image uploads
  const onDrop = (acceptedFiles: File[]) => {
    setImages([...images, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  // Upload images to Supabase Storage and return their URLs
  const uploadImages = async (productId: string) => {
    setUploading(true);
    let uploadedUrls: { url: string; isPrimary: boolean }[] = [];
  
    for (const file of images) {
      const filePath = `products/${productId}-${Date.now()}-${file.name}`;
  
      const { error } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, { cacheControl: "3600", upsert: false });
  
      if (error) {
        console.error("Error uploading image:", error);
      } else {
        const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
        const publicUrl = data?.publicUrl || "";
  
        uploadedUrls.push({
          url: publicUrl,
          isPrimary: primaryImage === file,
        });
      }
    }
  
    setUploading(false);
    return uploadedUrls;
  };  

  // Handle product submission
  const handleAddProduct = async () => {
    if (!product.name || !product.sku || !product.price || images.length === 0) {
      alert("Please fill all fields and add at least one image.");
      return;
    }

    // Insert product into `products` table and get its ID
    const { data: productData, error: productError } = await supabase
      .from("products")
      .insert([{ name: product.name, price: parseFloat(product.price), sku: product.sku }])
      .select("id")
      .single();

    if (productError) {
      console.error("Error adding product:", productError);
      return;
    }

    const productId = productData.id;

    // Upload images to storage
    const uploadedImages = await uploadImages(productId);
    console.log("Uploaded Images:", uploadedImages);

    if (uploadedImages.length === 0) {
      console.error("No images uploaded. Skipping database insert.");
      return;
    }

    // Insert images into `product_images` table with the correct `product_id`
    for (const img of uploadedImages) {
      const { error: imageInsertError } = await supabase.from("product_images").insert([
        {
          product_id: productId,
          image_url: img.url,
          is_primary: img.isPrimary,
        },
      ]);

      if (imageInsertError) {
        console.error("Error inserting image into database:", imageInsertError);
      }
    }

    fetchProducts();
    resetForm();
    onClose();
  };

  // Reset form fields and images after submission
  const resetForm = () => {
    setProduct({ name: "", price: "", sku: "" });
    setImages([]);
    setPrimaryImage(null);
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent className="flex flex-col space-y-4">
        <TextField
          label="Product Name"
          value={product.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          fullWidth
        />
        <TextField
          label="Price"
          type="number"
          value={product.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
          fullWidth
        />
        <TextField
          label="SKU"
          value={product.sku}
          onChange={(e) => setProduct({ ...product, sku: e.target.value })}
          fullWidth
        />

        {/* Drag & Drop File Upload */}
        <div {...getRootProps()} className="border-2 border-dashed p-4 text-center cursor-pointer">
          <input {...getInputProps()} />
          <p>Drag & drop images here, or click to select</p>
        </div>

        {/* Image Preview */}
        {images.length > 0 && (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {images.map((file, index) => (
              <div key={index} className="relative border p-2">
                <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-auto rounded" />
                <button
                  className={`absolute top-1 right-1 text-xs px-2 py-1 rounded ${
                    primaryImage === file ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
                  }`}
                  onClick={() => setPrimaryImage(file)}
                >
                  {primaryImage === file ? "Primary" : "Set Primary"}
                </button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleAddProduct} color="secondary" disabled={uploading}>
          {uploading ? "Uploading..." : "Add Product"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductDialog;
