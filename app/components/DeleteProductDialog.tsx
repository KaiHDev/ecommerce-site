'use client';

import React from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button } from '@mui/material';

type DeleteProductDialogProps = {
  open: boolean;
  onClose: () => void;
  selectedProduct: string | null;
  fetchProducts: () => void;
};

const DeleteProductDialog = ({
  open,
  onClose,
  selectedProduct,
  fetchProducts,
}: DeleteProductDialogProps) => {

  const handleDelete = async () => {
    if (!selectedProduct) return;

    try {
      // Fetch related images
      const { data: images } = await supabase
        .from('product_images')
        .select('image_url')
        .eq('product_id', selectedProduct);

      // Delete images from storage
      if (images && images.length > 0) {
        const paths = images.map(img => img.image_url.split('/').slice(-2).join('/'));
        await supabase.storage.from('product-images').remove(paths);
      }

      // Delete image records from database
      await supabase.from('product_images').delete().eq('product_id', selectedProduct);

      // Delete product from database
      await supabase.from('products').delete().eq('id', selectedProduct);

      fetchProducts();
      onClose();
    } catch (error: any) {
      console.error('Error deleting product:', error.message);
      alert(`Deletion error: ${error.message}`);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        Are you sure you want to delete this product? This action cannot be undone.
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={handleDelete} color="secondary">Delete</Button>
      </DialogActions>
    </Dialog>
  );
};

export default DeleteProductDialog;
