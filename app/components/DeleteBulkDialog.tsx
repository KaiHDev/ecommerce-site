'use client';

import React from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

interface DeleteBulkDialogProps {
  open: boolean;
  onClose: () => void;
  selectedProducts: string[];
  fetchProducts: () => void;
  clearSelection: () => void;
}

const DeleteBulkDialog = ({
  open,
  onClose,
  selectedProducts,
  fetchProducts,
  clearSelection,
}: DeleteBulkDialogProps) => {

  const deleteProductWithImages = async (productId: string) => {
    // Fetch associated images
    const { data: images } = await supabase
      .from('product_images')
      .select('image_url')
      .eq('product_id', productId);

    // Delete images from storage
    if (images && images.length > 0) {
      const paths = images.map(img => img.image_url.split('/').slice(-2).join('/'));
      await supabase.storage.from('product-images').remove(paths);
    }

    // Delete images records from DB
    await supabase.from('product_images').delete().eq('product_id', productId);

    // Delete product from DB
    await supabase.from('products').delete().eq('id', productId);
  };

  const handleBulkDelete = async () => {
    try {
      for (const productId of selectedProducts) {
        await deleteProductWithImages(productId);
      }
      fetchProducts();
      clearSelection();
      onClose();
    } catch (error: any) {
      console.error('Bulk deletion error:', error.message);
      alert(`Bulk deletion error: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Bulk Deletion</DialogTitle>
      <DialogContent>
        Are you sure you want to delete {selectedProducts.length} selected products? This action cannot be undone.
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleBulkDelete} color="secondary">Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteBulkDialog;