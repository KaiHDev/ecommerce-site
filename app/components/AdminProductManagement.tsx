'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AdminGuard from '../admin/AdminGuard';
import AddProductDialog from './AddProductDialog';
import DeleteProductDialog from './DeleteProductDialog';
import ProductTable from './ProductTable';
import SearchBar from './SearchBar';
import AddProductButton from './AddProductButton';

type Product = {
  id: string;
  name: string;
  price: number;
  sku: string;
  slug: string;
  primary_image_url?: string;
  images?: {
    id: string;
    image_url: string;
    image_order: number;
  }[];
};

const AdminProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

  // Fetch products with associated images
  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select(`
        id, name, price, sku, slug, description,
        product_images (id, image_url, image_order)
      `)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error.message);
      return;
    }

    const formattedProducts = (data || []).map((product) => {
      const sortedImages = (product.product_images || []).sort(
        (a, b) => a.image_order - b.image_order
      );

      return {
        ...product,
        primary_image_url: sortedImages.length > 0 ? sortedImages[0].image_url : '',
        images: sortedImages,
      };
    });

    setProducts(formattedProducts);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <AdminGuard>
      <div className="max-w-screen-xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6">Product Management</h1>

        {/* Add Product Button */}
        <AddProductButton onClick={() => setOpenAddDialog(true)} />

        {/* Search Bar */}
        <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

        {/* Product Table */}
        <ProductTable
          products={products}
          searchTerm={searchTerm}
          setSelectedProduct={setSelectedProduct}
          setOpenDeleteDialog={setOpenDeleteDialog}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          fetchProducts={fetchProducts}
        />

        {/* Add Product Dialog */}
        <AddProductDialog
          open={openAddDialog}
          onClose={() => setOpenAddDialog(false)}
          fetchProducts={fetchProducts}
        />

        {/* Delete Product Dialog */}
        <DeleteProductDialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          selectedProduct={selectedProduct}
          fetchProducts={fetchProducts}
        />
      </div>
    </AdminGuard>
  );
};

export default AdminProductManagement;
