'use client';

import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, IconButton } from '@mui/material';
import { useDropzone } from 'react-dropzone';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import CloseIcon from '@mui/icons-material/Close';
import Image from "next/image";

type ImagePreview = {
  id: string;
  image_url: string;
  image_order: number;
};

type AddProductDialogProps = {
  open: boolean;
  onClose: () => void;
  fetchProducts: () => Promise<void>;
};

const AddProductDialog: React.FC<AddProductDialogProps> = ({ open, onClose, fetchProducts }) => {
  const [product, setProduct] = useState({ name: '', price: '', sku: '', description: '' });
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<ImagePreview[]>([]);
  const [uploading, setUploading] = useState(false);

  const [errors, setErrors] = useState({
    name: '',
    price: '',
    sku: '',
    description: '',
    images: '',
  });

  useEffect(() => {
    if (!open) {
      resetForm();
    }
  }, [open]);

  const resetForm = () => {
    setProduct({ name: '', price: '', sku: '', description: '' });
    setImages([]);
    setImagePreviews([]);
    setErrors({ name: '', price: '', sku: '', description: '', images: '' });
  };

  const validateFields = () => {
    const newErrors = {
      name: product.name ? '' : 'Please enter a product name.',
      price: product.price ? '' : 'Please enter a price.',
      sku: product.sku ? '' : 'Please enter a SKU.',
      description: product.description ? '' : 'Please enter a description.',
      images: images.length > 0 ? '' : 'Please add at least one image.',
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some(Boolean);
  };

  const onDrop = (acceptedFiles: File[]) => {
    const newEntries = acceptedFiles.map((file, idx) => ({
      id: `new-${Date.now()}-${idx}`,
      image_url: URL.createObjectURL(file),
      image_order: imagePreviews.length + idx + 1,
    }));

    setImages([...images, ...acceptedFiles]);
    setImagePreviews([...imagePreviews, ...newEntries]);
    setErrors((prev) => ({ ...prev, images: '' }));
  };

  const { getRootProps, getInputProps } = useDropzone({ onDrop, accept: { 'image/*': [] } });

  const handleRemoveImage = (id: string) => {
    setImages(images.filter((_, idx) => imagePreviews[idx].id !== id));
    setImagePreviews(imagePreviews.filter((img) => img.id !== id));
  };

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const reordered = Array.from(imagePreviews);
    const [moved] = reordered.splice(result.source.index, 1);
    reordered.splice(result.destination.index, 0, moved);
    setImagePreviews(reordered.map((img, idx) => ({ ...img, image_order: idx + 1 })));
  };

  const handleAddProduct = async () => {
    if (!validateFields()) return;

    setUploading(true);

    try {
      const baseSlug = product.name.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, '');
      let slug = baseSlug, count = 1;
      while (true) {
        const { data: existing } = await supabase.from('products').select('id').eq('slug', slug);
        if (!existing || existing.length === 0) break;
        slug = `${baseSlug}-${count++}`;
      }

      const { data: newProduct, error: productError } = await supabase
        .from('products')
        .insert({
          name: product.name,
          price: parseFloat(product.price),
          sku: product.sku,
          description: product.description,
          slug,
        })
        .select('id')
        .single();

      if (productError || !newProduct) {
        throw new Error(productError?.message || 'Product creation failed.');
      }

      const uploadedImages = [];
      for (const [idx, file] of images.entries()) {
        const filePath = `products/${newProduct.id}-${Date.now()}-${file.name}`;
        const { error } = await supabase.storage.from('product-images').upload(filePath, file);
        if (error) {
          console.error('Upload error:', error.message);
          continue;
        }
        const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
        uploadedImages.push({
          product_id: newProduct.id,
          image_url: data.publicUrl,
          image_order: imagePreviews[idx].image_order,
        });
      }

      await supabase.from('product_images').insert(uploadedImages);

      fetchProducts();
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error adding product:', error);
      alert(`Error: ${error instanceof Error ? error.message : "An unknown error occurred."}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add New Product</DialogTitle>
      <DialogContent className="flex flex-col space-y-4">
        <TextField
          label="Product Name"
          value={product.name}
          error={Boolean(errors.name)}
          helperText={errors.name}
          onChange={(e) => setProduct({ ...product, name: e.target.value })}
          fullWidth
        />
        <TextField
          label="Price"
          type="number"
          value={product.price}
          error={Boolean(errors.price)}
          helperText={errors.price}
          onChange={(e) => setProduct({ ...product, price: e.target.value })}
          fullWidth
        />
        <TextField
          label="SKU"
          value={product.sku}
          error={Boolean(errors.sku)}
          helperText={errors.sku}
          onChange={(e) => setProduct({ ...product, sku: e.target.value })}
          fullWidth
        />
        <TextField
          label="Description"
          multiline
          minRows={4}
          value={product.description}
          error={Boolean(errors.description)}
          helperText={errors.description}
          onChange={(e) => setProduct({ ...product, description: e.target.value })}
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
              <div ref={provided.innerRef} {...provided.droppableProps} className="mt-2 grid grid-cols-3 gap-4">
                {imagePreviews.map((img, index) => (
                  <Draggable key={img.id} draggableId={img.id} index={index}>
                    {(provided) => (
                      <div 
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="relative border p-2 rounded shadow overflow-hidden"
                      >
                        <Image
                          src={img.image_url}
                          alt={`Preview ${index}`}
                          width={200}
                          height={200}
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
          }}
          className="text-white">
            Cancel
        </Button>
        <Button 
          onClick={handleAddProduct} 
          disabled={uploading} 
          variant="contained"
          sx={{
            backgroundColor: "#1E40AF",
            "&:hover": {
              backgroundColor: "#F59E0B",
            },
          }}>
          {uploading ? 'Uploading...' : 'Add Product'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddProductDialog;