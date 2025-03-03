"use client";

import React from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

interface DeleteBulkDialogProps {
  open: boolean;
  onClose: () => void;
  selectedProducts: string[];
  setProducts: () => void;
  clearSelection: () => void;
}

interface ProductImage {
  id: string;
  product_id: string;
  image_url: string;
  is_primary: boolean;
  created_at: string;
}

const DeleteBulkDialog = ({
  open,
  onClose,
  selectedProducts,
  setProducts,
  clearSelection,
}: DeleteBulkDialogProps) => {

  const deleteProductWithImages = async (productId: string) => {
    // Fetch associated images
    const { data, error: fetchError } = await supabase
      .from("product_images")
      .select("*")
      .eq("product_id", productId);

    const images = data as ProductImage[] | null;

    if (fetchError) throw new Error(fetchError.message);

    // Delete image files from storage
    if (images && images.length > 0) {
      const filePaths = images.map((img) => {
        const url = new URL(img.image_url);
        const pathSegments = url.pathname.split("/");
        return `${pathSegments.slice(-2).join("/")}`;
      });

      const { error: storageError } = await supabase.storage
        .from("product-images")
        .remove(filePaths);

      if (storageError) throw new Error(storageError.message);
    }

    // Delete image records and product record
    await supabase.from("product_images").delete().eq("product_id", productId);
    await supabase.from("products").delete().eq("id", productId);
  };

  const handleBulkDelete = async () => {
    try {
      for (const productId of selectedProducts) {
        await deleteProductWithImages(productId);
      }

      setProducts();
      clearSelection();
      onClose();
      alert("Selected products deleted successfully!");
    } catch (error: any) {
      console.error("Error during bulk deletion:", error.message);
      alert(`Error during bulk deletion: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Bulk Deletion</DialogTitle>
      <DialogContent>
        Are you sure you want to delete {selectedProducts.length} selected products? This action cannot be undone.
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleBulkDelete} color="secondary">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteBulkDialog;
