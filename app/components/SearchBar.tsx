import React, { FC } from 'react';
import { TextField } from '@mui/material';

type SearchBarProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const SearchBar: FC<SearchBarProps> = ({ value, onChange }) => {
  return (
    <TextField
      label="Search Products"
      variant="outlined"
      value={value}
      onChange={onChange}
      fullWidth
      margin="normal"
      className="bg-white rounded-md"
    />
  );
};

export default SearchBar;
