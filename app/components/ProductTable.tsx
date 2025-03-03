"use client";

import React, { useState } from 'react';
import { DataGrid, GridColDef, GridRowSelectionModel } from '@mui/x-data-grid';
import { Button } from '@mui/material';
import EditProductDialog from './EditProductDialog';
import DeleteBulkDialog from './DeleteBulkDialog';

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

const ProductTable = ({
  products,
  searchTerm,
  setSelectedProduct,
  setOpenDeleteDialog,
  paginationModel,
  setPaginationModel,
  fetchProducts,
}: ProductTableProps) => {
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isBulkDeleteOpen, setIsBulkDeleteOpen] = useState(false);

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
    <div style={{ height: '100%', width: '100%' }} className="bg-white rounded-md p-4">
      {/* Delete Selected Button */}
      <div className="mb-4">
        <Button
          variant="contained"
          color="secondary"
          onClick={() => setIsBulkDeleteOpen(true)}
          disabled={selectedProducts.length === 0}
        >
          Delete Selected
        </Button>
      </div>

      {/* Product Table */}
      <DataGrid
        checkboxSelection
        rows={products.filter((product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )}
        columns={columns}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 20]}
        onRowSelectionModelChange={(newSelection: GridRowSelectionModel) =>
          setSelectedProducts(newSelection as string[])
        }
      />

      {/* Edit Product Dialog */}
      <EditProductDialog
        open={openEditDialog}
        onClose={() => setOpenEditDialog(false)}
        product={editingProduct}
        fetchProducts={fetchProducts}
      />

      {/* Bulk Delete Dialog */}
      <DeleteBulkDialog
        open={isBulkDeleteOpen}
        onClose={() => setIsBulkDeleteOpen(false)}
        selectedProducts={selectedProducts}
        setProducts={() => fetchProducts()}
        clearSelection={() => setSelectedProducts([])}
      />
    </div>
  );
};

export default ProductTable;
