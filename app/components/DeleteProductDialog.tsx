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

const DeleteProductDialog = ({ open, onClose, selectedProduct, setProducts }: DeleteProductDialogProps) => {

  const handleDelete = async () => {
    if (!selectedProduct) return;

    // Delete product from Supabase
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', selectedProduct);

    if (error) {
      console.error('Error deleting product:', error.message);
    } else {
      console.log('Product deleted successfully');
      // Remove product from local state
      setProducts(prev => prev.filter(product => product.id !== selectedProduct));
      onClose();
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
