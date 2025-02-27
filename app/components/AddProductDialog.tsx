import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Dialog, DialogActions, DialogContent, DialogTitle, Button, TextField } from '@mui/material';

type AddProductDialogProps = {
  open: boolean;
  onClose: () => void;
  fetchProducts: () => Promise<void>;
};

const AddProductDialog: React.FC<AddProductDialogProps> = ({ open, onClose, fetchProducts }) => {
  const [newProduct, setNewProduct] = useState({ name: '', price: '', sku: '', image_url: '', product_images: '' });

  const handleAddProduct = async () => {
    const { name, price, sku, image_url, product_images } = newProduct;
    const images = product_images ? product_images.split(',').map((img) => img.trim()) : [];

    const { error } = await supabase.from('products').insert([{ 
      name, 
      price: parseFloat(price), 
      sku, 
      image_url, 
      product_images: images 
    }]);

    if (error) console.error('Error adding product:', error);
    else {
      onClose();
      setNewProduct({ name: '', price: '', sku: '', image_url: '', product_images: '' });
      await fetchProducts();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent className="flex flex-col space-y-4">
        <TextField label="Product Name" value={newProduct.name} onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })} fullWidth />
        <TextField label="Price" type="number" value={newProduct.price} onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })} fullWidth />
        <TextField label="SKU" value={newProduct.sku} onChange={(e) => setNewProduct({ ...newProduct, sku: e.target.value })} fullWidth />
        <TextField label="Image URL" value={newProduct.image_url} onChange={(e) => setNewProduct({ ...newProduct, image_url: e.target.value })} fullWidth />
        <TextField label="Product Images (comma separated URLs)" value={newProduct.product_images} onChange={(e) => setNewProduct({ ...newProduct, product_images: e.target.value })} fullWidth />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">Cancel</Button>
        <Button onClick={handleAddProduct} color="secondary">Add Product</Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductDialog;
