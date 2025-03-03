"use client";

import React from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

type DeleteProductDialogProps = {
  open: boolean;
  onClose: () => void;
  selectedProduct: string | null;
  setProducts: React.Dispatch<React.SetStateAction<any[]>>;
};

interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean;
  created_at: string;
}

const DeleteProductDialog = ({ open, onClose, selectedProduct, setProducts }: DeleteProductDialogProps) => {

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      // Fetch related product images
      const { data, error: fetchError } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", selectedProduct);
      
      const images = data as ProductImage[] | null;
    
      if (fetchError) throw new Error(`Failed to fetch product images: ${fetchError.message}`);
    
      // Delete image files from storage
      if (images && images.length > 0) {
        const filePaths = images.map((img) => {
          const url = new URL(img.image_url);
          const pathSegments = url.pathname.split("/");
          return `${pathSegments.slice(-2).join("/")}`; // Assumes path: /storage/v1/object/public/product-images/products/filename.png
        });

        const { error: storageError } = await supabase.storage
          .from("product-images")
          .remove(filePaths);

        if (storageError) throw new Error(`Failed to delete images from storage: ${storageError.message}`);
      }

      // Delete image records from `product_images` table
      const { error: deleteImagesError } = await supabase
        .from("product_images")
        .delete()
        .eq("product_id", selectedProduct);

      if (deleteImagesError) throw new Error(`Failed to delete image records: ${deleteImagesError.message}`);

      // Delete product from `products` table
      const { error: deleteProductError } = await supabase
        .from("products")
        .delete()
        .eq("id", selectedProduct);

      if (deleteProductError) throw new Error(`Failed to delete product: ${deleteProductError.message}`);

      console.log('Product and associated images deleted successfully');
      
      // Update local product state
      setProducts(prev => prev.filter(product => product.id !== selectedProduct));

      onClose();
      
    } catch (error: any) {
      console.error('Error deleting product:', error.message);
      alert(`Error deleting product: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        Are you sure you want to delete this product? This action cannot be undone.
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleDelete} color="secondary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProductDialog;
