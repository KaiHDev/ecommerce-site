import React from 'react';
import { Button } from '@mui/material';

type AddProductButtonProps = {
  onClick: () => void;
};

const AddProductButton: React.FC<AddProductButtonProps> = ({ onClick }) => (
  <Button
    variant="contained"
    color="primary"
    className="bg-primary hover:bg-accent bg-shadow-md text-white py-2 rounded"
    onClick={onClick}
  >
    Add Product
  </Button>
);

export default AddProductButton;
