import React from 'react';
import { Button } from '@mui/material';

type AddProductButtonProps = {
  onClick: () => void;
};

const AddProductButton: React.FC<AddProductButtonProps> = ({ onClick }) => (
  <Button
    variant="contained"
    color="primary"
    className="bg-blue-500 hover:bg-blue-700 text-white mb-4"
    onClick={onClick}
  >
    Add Product
  </Button>
);

export default AddProductButton;
