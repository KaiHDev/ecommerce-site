'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import CloseIcon from '@mui/icons-material/Close';

type ImageType = {
  id: string;
  image_url: string;
  image_order: number;
};

const EditProductDialog = ({ open, onClose, product, fetchProducts }: any) => {
  const [updatedProduct, setUpdatedProduct] = useState({ name: '', price: '', sku: '', description: '' });
  const [existingImages, setExistingImages] = useState<ImageType[]>([]);
  const [newImages, setNewImages] = useState<File[]>([]);
  const [deletedImages, setDeletedImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const [errors, setErrors] = useState({
    name: '',
    price: '',
    sku: '',
    description: '',
    images: '',
  });

  useEffect(() => {
    if (product && open) {
      console.log('Product data on edit:', product);
      setUpdatedProduct({
        name: product.name,
        price: product.price,
        sku: product.sku,
        description: product.description || '',
      });
      fetchExistingImages(product.id);
      setNewImages([]);
      setDeletedImages([]);
      setErrors({ name: '', price: '', sku: '', description: '', images: '' });
    }
  }, [product, open]);

  const fetchExistingImages = async (productId: string) => {
    const { data } = await supabase
      .from('product_images')
      .select('*')
      .eq('product_id', productId)
      .order('image_order', { ascending: true });
    setExistingImages(data || []);
  };

  const validateFields = () => {
    const newErrors = {
      name: updatedProduct.name ? '' : 'Please enter a product name.',
      price: updatedProduct.price ? '' : 'Please enter a price.',
      sku: updatedProduct.sku ? '' : 'Please enter a SKU.',
      description: updatedProduct.description ? '' : 'Please enter a description.',
      images: existingImages.length > 0 ? '' : 'Please add at least one image.',
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const onDrop = (acceptedFiles: File[]) => {
    const newEntries = acceptedFiles.map((file, idx) => ({
      id: `new-${Date.now()}-${idx}`,
      image_url: URL.createObjectURL(file),
      image_order: existingImages.length + idx + 1,
    }));

    setNewImages([...newImages, ...acceptedFiles]);
    setExistingImages([...existingImages, ...newEntries]);
    setErrors(prev => ({ ...prev, images: '' }));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'image/*': [] } });

  const handleRemoveImage = (id: string) => {
    if (!id.startsWith('new-')) setDeletedImages([...deletedImages, id]);
    setExistingImages(existingImages.filter(img => img.id !== id));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(existingImages);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setExistingImages(reordered.map((img, idx) => ({ ...img, image_order: idx + 1 })));
  };

  const handleUpdateProduct = async () => {
    if (!validateFields()) return;
    setUploading(true);

    try {
      // Update product details
      await supabase.from('products').update({
        name: updatedProduct.name,
        price: parseFloat(updatedProduct.price),
        sku: updatedProduct.sku,
        description: updatedProduct.description,
      }).eq('id', product.id);

      // Delete removed images
      if (deletedImages.length) {
        await supabase.from('product_images').delete().in('id', deletedImages);
      }

      // Update existing image orders
      for (const img of existingImages.filter(img => !img.id.startsWith('new-'))) {
        await supabase.from('product_images').update({ image_order: img.image_order }).eq('id', img.id);
      }

      // Upload new images & insert records
      for (const [idx, file] of newImages.entries()) {
        const filePath = `products/${product.id}-${Date.now()}-${file.name}`;
        const { error } = await supabase.storage.from('product-images').upload(filePath, file);
        if (error) {
          console.error('Upload error:', error.message);
          continue;
        }
        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
        await supabase.from('product_images').insert({
          product_id: product.id,
          image_url: data.publicUrl,
          image_order: existingImages.find(img => img.id.startsWith('new-'))!.image_order + idx,
        });
      }

      fetchProducts();
      onClose();
    } catch (error: any) {
      alert(`Error updating product: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>Edit Product</DialogTitle>
      <DialogContent className="space-y-4">
        <TextField label="Product Name" value={updatedProduct.name}
          error={Boolean(errors.name)} helperText={errors.name}
          onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })} fullWidth />

        <TextField label="Price" type="number" value={updatedProduct.price}
          error={Boolean(errors.price)} helperText={errors.price}
          onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: e.target.value })} fullWidth />

        <TextField label="SKU" value={updatedProduct.sku}
          error={Boolean(errors.sku)} helperText={errors.sku}
          onChange={(e) => setUpdatedProduct({ ...updatedProduct, sku: e.target.value })} fullWidth />

        <TextField
          label="Description"
          multiline
          minRows={4}
          value={updatedProduct.description}
          error={Boolean(errors.description)}
          helperText={errors.description}
          onChange={(e) => setUpdatedProduct({ ...updatedProduct, description: e.target.value })}
          fullWidth
        />

        <div {...getRootProps()} className="border-2 border-dashed p-4 text-center cursor-pointer">
          <input {...getInputProps()} />
          <p>Drag & drop images or click to select</p>
          {errors.images && <p className="text-red-500 text-sm mt-2">{errors.images}</p>}
        </div>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="images" direction="horizontal">
            {(provided) => (
              <div ref={provided.innerRef} {...provided.droppableProps} className="grid grid-cols-3 gap-4">
                {existingImages.map((img, index) => (
                  <Draggable key={img.id} draggableId={img.id} index={index}>
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="relative border p-2 rounded shadow overflow-hidden"
                      >
                        <img
                          src={img.image_url}
                          alt={`Image ${index}`}
                          className="w-full h-auto rounded"
                        />

                        <IconButton
                          size="small"
                          style={{ position: 'absolute', top: 4, right: 4, backgroundColor: 'rgba(255,0,0,0.8)', color: 'white' }}
                          onClick={() => handleRemoveImage(img.id)}
                        >
                          <CloseIcon fontSize="small" />
                        </IconButton>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose}
          variant="contained"
          sx={{
            backgroundColor: "#EF4444",
            "&:hover": {
              backgroundColor: "#DC2626",
            },
          }}>
          Cancel
        </Button>
        <Button 
          onClick={handleUpdateProduct} 
          disabled={uploading}
          variant="contained"
          sx={{
            backgroundColor: "#1E40AF",
            "&:hover": {
              backgroundColor: "#F59E0B",
            },
          }}>
          {uploading ? 'Saving...' : 'Save Changes'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default EditProductDialog;
