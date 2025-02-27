"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

type EditProductDialogProps = {
  open: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    price: number;
    sku: string;
    image_url?: string;
    product_images?: string[];
  } | null;
  fetchProducts: () => void;
};

const EditProductDialog = ({ open, onClose, product, fetchProducts }: EditProductDialogProps) => {
  const [updatedProduct, setUpdatedProduct] = useState(product);

  useEffect(() => {
    if (product) setUpdatedProduct(product);
  }, [product]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUpdatedProduct((prev) => prev ? { ...prev, [name]: value } : null);
  };

  const handleSaveChanges = async () => {
    if (!updatedProduct) return;
  
    const { data, error } = await supabase
      .from("products")
      .update({
        name: updatedProduct.name,
        price: parseFloat(updatedProduct.price.toString()),
        sku: updatedProduct.sku,
        image_url: updatedProduct.image_url,
        product_images: updatedProduct.product_images ? updatedProduct.product_images.map(img => img.trim()) : [],
      })
      .eq("id", updatedProduct.id)
      .select();
  
    if (error) {
      console.error("Error updating product:", error);
    } else {
      console.log("Updated product:", data);
      fetchProducts(); // Refresh product list
      onClose();
    }
  };  

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent className="flex flex-col space-y-4">
        <TextField label="Product Name" name="name" value={updatedProduct?.name || ''} onChange={handleInputChange} fullWidth />
        <TextField label="Price" type="number" name="price" value={updatedProduct?.price || ''} onChange={handleInputChange} fullWidth />
        <TextField label="SKU" name="sku" value={updatedProduct?.sku || ''} onChange={handleInputChange} fullWidth />
        <TextField label="Image URL" name="image_url" value={updatedProduct?.image_url || ''} onChange={handleInputChange} fullWidth />
        <TextField
          label="Product Images (comma-separated URLs)"
          name="product_images"
          value={updatedProduct?.product_images?.join(', ') || ''}
          onChange={handleInputChange}
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleSaveChanges} color="secondary">Save Changes</Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductDialog;
