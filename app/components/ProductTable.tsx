"use client";

import React, { useState } from 'react';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import EditProductDialog from './EditProductDialog';

type Product = {
  id: string;
  name: string;
  price: number;
  sku: string;
  image_url?: string;
  product_images?: string[];
};

type ProductTableProps = {
  products: Product[];
  searchTerm: string;
  setSelectedProduct: (id: string) => void;
  setOpenDeleteDialog: (open: boolean) => void;
  paginationModel: { page: number; pageSize: number };
  setPaginationModel: (model: { page: number; pageSize: number }) => void;
  fetchProducts: () => void;
};

const ProductTable = ({ products, searchTerm, setSelectedProduct, setOpenDeleteDialog, paginationModel, setPaginationModel, fetchProducts }: ProductTableProps) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setOpenEditDialog(true);
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Product Name', flex: 1 },
    { field: 'price', headerName: 'Price', flex: 1 },
    { field: 'sku', headerName: 'SKU', flex: 1 },
    {
      field: 'actions',
      headerName: 'Actions',
      renderCell: (params) => (
        <div className="flex space-x-2">
          <Button
            variant="contained"
            color="primary"
            className="bg-blue-500 hover:bg-blue-700 text-white"
            onClick={() => handleEditClick(params.row)}
          >
            Edit
          </Button>
          <Button
            variant="contained"
            color="secondary"
            className="bg-purple-500 hover:bg-purple-700 text-white"
            onClick={() => {
              setSelectedProduct(params.row.id);
              setOpenDeleteDialog(true);
            }}
          >
            Delete
          </Button>
        </div>
      ),
      flex: 1,
    },
  ];

  return (
    <div style={{ height: 400, width: '100%' }} className="bg-white rounded-md">
      <DataGrid
        rows={products.filter((product) => product.name.toLowerCase().includes(searchTerm.toLowerCase()))}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]}
      />

      {/* Edit Product Dialog */}
      <EditProductDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        product={editingProduct}
        fetchProducts={fetchProducts}
      />
    </div>
  );
};

export default ProductTable;
