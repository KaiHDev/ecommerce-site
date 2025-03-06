"use client";

import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";
import { useDropzone } from "react-dropzone";

const EditProductDialog = ({ open, onClose, product, fetchProducts }: any) => {
  const [updatedProduct, setUpdatedProduct] = useState(product || { name: "", price: "", sku: "" });
  const [existingImages, setExistingImages] = useState<{ id: string; image_url: string; is_primary: boolean }[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [primaryImage, setPrimaryImage] = useState<string | null>(null); // Tracks the primary image URL
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (product) {
      setUpdatedProduct(product);
      fetchExistingImages(product.id);
    }
    setNewImages([]); // Clear new images when editing a product
  }, [product, open]);

  // Fetch existing images from the product_images table
  const fetchExistingImages = async (productId: string) => {
    console.log("Fetching images for product ID:", productId);

    const { data, error } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId);

    if (error) {
      console.error("Error fetching images:", error);
    } else {
      console.log("Fetched images:", data);
      setExistingImages(data || []);

      // Check if there's a primary image
      const primary = data.find((img) => img.is_primary);
      setPrimaryImage(primary ? primary.image_url : null); // Set the first primary or null if no primary
    }
  };

  // Handle file drop for new image uploads
  const onDrop = (acceptedFiles: File[]) => {
    setNewImages([...newImages, ...acceptedFiles]);
  };

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: true,
  });

  // Upload new images to Supabase Storage and return their URLs
  const uploadImages = async (productId: string) => {
    setUploading(true);
    let uploadedUrls: { url: string; isPrimary: boolean }[] = [];

    for (const file of newImages) {
      const filePath = `products/${Date.now()}-${file.name}`;
      const { error } = await supabase.storage.from("product-images").upload(filePath, file);

      if (!error) {
        const { data } = supabase.storage.from("product-images").getPublicUrl(filePath);
        uploadedUrls.push({
          url: data.publicUrl,
          isPrimary: primaryImage === file.name, // Set as primary if selected
        });
      }
    }

    setUploading(false);
    return uploadedUrls;
  };

  // Handle product update
  const handleUpdateProduct = async () => {
    if (!updatedProduct.name || !updatedProduct.sku || !updatedProduct.price) {
      alert("Please fill in all required fields.");
      return;
    }

    try {
      // Update product details
      await supabase
        .from("products")
        .update({ ...updatedProduct })
        .eq("id", product.id);

      // Upload new images and associate them with the product
      const uploadedImages = await uploadImages(product.id);

      for (const img of uploadedImages) {
        await supabase.from("product_images").insert([
          {
            product_id: product.id,
            image_url: img.url,
            is_primary: img.isPrimary,
          },
        ]);
      }

      // Re-fetch the images to ensure the primary image is updated in the UI
      fetchExistingImages(product.id);

      // Clear the newImages state to reset the uploaded images section
      setNewImages([]);
      fetchProducts();
      onClose();
    } catch (error) {
      console.error("Error during product update:", error);
    }
  };

  // Handle delete image
  const handleDeleteImage = async (imageId: string, imageUrl: string) => {
    try {
      // Delete the image from Supabase Storage
      const filePath = imageUrl.split("/storage/v1/object/public/")[1];
      const { error: storageError } = await supabase.storage
        .from("product-images")
        .remove([filePath]);

      if (storageError) {
        console.error("Error deleting image from storage:", storageError);
        return;
      }

      // Delete the image record from the database
      const { error: dbError } = await supabase
        .from("product_images")
        .delete()
        .eq("id", imageId);

      if (dbError) {
        console.error("Error deleting image from database:", dbError);
        return;
      }

      // Update the state to remove the deleted image from the UI
      setExistingImages(existingImages.filter((img) => img.id !== imageId));
    } catch (error) {
      console.error("Error during image deletion:", error);
    }
  };

  // Set the primary image
  const handleSetPrimary = async (img: any) => {
    try {
      // 1. Unset all other images to not be primary
      const { error: unsetError } = await supabase
        .from("product_images")
        .update({ is_primary: false }) // Unset primary for all images
        .eq("product_id", product.id);

      if (unsetError) {
        console.error("Error unsetting primary image:", unsetError);
        return;
      }

      // 2. Set the selected image to be primary
      const { error: setError } = await supabase
        .from("product_images")
        .update({ is_primary: true }) // Set primary for the selected image
        .eq("id", img.id); // Correctly reference the image by `id`

      if (setError) {
        console.error("Error setting primary image:", setError);
        return;
      }

      // 3. Update the state with the new primary image URL
      setPrimaryImage(img.image_url); // Ensure UI updates immediately
    } catch (error) {
      console.error("Error during image primary set:", error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent className="flex flex-col space-y-4">
        <TextField
          label="Product Name"
          value={updatedProduct.name}
          onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })}
          fullWidth
        />
        <TextField
          label="Price"
          type="number"
          value={updatedProduct.price}
          onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: e.target.value })}
          fullWidth
        />
        <TextField
          label="SKU"
          value={updatedProduct.sku}
          onChange={(e) => setUpdatedProduct({ ...updatedProduct, sku: e.target.value })}
          fullWidth
        />

        {/* Existing Images */}
        <h3 className="text-lg font-semibold mt-2">Existing Images</h3>
        <div className="mt-2 grid grid-cols-3 gap-2">
          {existingImages.map((img) => (
            <div key={img.id} className="relative border p-2">
              <img src={img.image_url} alt="Existing" className="w-full h-auto rounded" />
              <button
                className={`absolute top-1 right-1 text-xs px-2 py-1 rounded ${
                  primaryImage === img.image_url ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
                }`}
                onClick={() => handleSetPrimary(img)}
              >
                {primaryImage === img.image_url ? "Primary" : "Set Primary"}
              </button>
              {/* Delete Button */}
              <button
                className="absolute bottom-1 right-1 text-xs px-2 py-1 rounded bg-red-500 text-white"
                onClick={() => handleDeleteImage(img.id, img.image_url)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        {/* Drag & Drop New Image Upload */}
        <h3 className="text-lg font-semibold mt-2">Upload New Images</h3>
        <div {...getRootProps()} className="border-2 border-dashed p-4 text-center cursor-pointer">
          <input {...getInputProps()} />
          <p>Drag & drop new images here, or click to select</p>
        </div>

        {/* New Images Preview */}
        {newImages.length > 0 && (
          <div className="mt-2 grid grid-cols-3 gap-2">
            {newImages.map((file, index) => (
              <div key={index} className="relative border p-2">
                <img src={URL.createObjectURL(file)} alt="Preview" className="w-full h-auto rounded" />
                <button
                  className={`absolute top-1 right-1 text-xs px-2 py-1 rounded ${
                    primaryImage === file.name ? "bg-blue-500 text-white" : "bg-gray-300 text-black"
                  }`}
                  onClick={() => setPrimaryImage(file.name)}
                >
                  {primaryImage === file.name ? "Primary" : "Set Primary"}
                </button>
              </div>
            ))}
          </div>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleUpdateProduct} color="secondary">Save Changes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductDialog;
