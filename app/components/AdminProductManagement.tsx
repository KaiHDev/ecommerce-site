"use client";

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AdminGuard from '../admin/AdminGuard';
import AddProductDialog from './AddProductDialog';
import DeleteProductDialog from './DeleteProductDialog';
import ProductTable from './ProductTable';
import SearchBar from './SearchBar';
import AddProductButton from './AddProductButton';

// Type definition for products
type Product = {
  id: string;
  name: string;
  price: number;
  sku: string;
  image_url?: string;
  product_images?: string[];
};

const AdminProductManagement = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<string | null>(null);
  const [paginationModel, setPaginationModel] = useState({ page: 0, pageSize: 5 });

  // Fetch products from Supabase
  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*');
    if (error) console.error('Error fetching products:', error);
    else setProducts(data || []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <AdminGuard>
      <div className="p-4 bg-gray-900 text-white min-h-screen">
        <h1 className="text-3xl font-bold mb-6">Admin Product Management</h1>

        {/* Button to open Add Product Dialog */}
        <AddProductButton onClick={() => setOpenAddDialog(true)} />

        {/* Search Bar Component */}
        <SearchBar value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />

        {/* Product Table Component */}
        <ProductTable
          products={products}
          searchTerm={searchTerm}
          setSelectedProduct={setSelectedProduct}
          setOpenDeleteDialog={setOpenDeleteDialog}
          paginationModel={paginationModel}
          setPaginationModel={setPaginationModel}
          fetchProducts={fetchProducts}
        />
        
        {/* Add Product Dialog Component */}
        <AddProductDialog
          open={openAddDialog}
          onClose={() => setOpenAddDialog(false)}
          fetchProducts={fetchProducts}
        />

        {/* Delete Product Dialog Component */}
        <DeleteProductDialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
          selectedProduct={selectedProduct}
          setProducts={setProducts}
        />
      </div>
    </AdminGuard>
  );
};

export default AdminProductManagement;
