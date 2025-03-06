"use client";

import React from "react";
import { CircularProgress } from "@mui/material";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <CircularProgress size={60} thickness={5} color="primary" />
    </div>
  );
};

export default LoadingSpinner;
