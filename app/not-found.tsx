"use client";

import Link from "next/link";
import { Button, Container, Typography } from "@mui/material";

const NotFoundPage = () => {
  return (
    <Container 
      maxWidth="md" 
      className="text-center flex flex-col items-center justify-center min-h-[50vh]"
    >
      {/* 404 Title */}
      <Typography variant="h3" className="font-bold text-gray-800 mt-4">
        Oops! Page Not Found.
      </Typography>

      {/* Description */}
      <Typography variant="body1" className="text-gray-600 mt-2">
        The page you are looking for doesn&rsquo;t exist or has been moved.
      </Typography>

      {/* Navigation Buttons */}
      <div className="mt-6 space-x-4">
        <Link href="/">
          <Button 
            variant="contained" 
            color="primary"
            sx={{
              backgroundColor: "#1E40AF",
              "&:hover": { backgroundColor: "#F59E0B" },
            }}
          >
            Go Home
          </Button>
        </Link>
        <Link href="/shop">
          <Button variant="outlined" color="secondary">
            Visit Shop
          </Button>
        </Link>
      </div>
    </Container>
  );
};

export default NotFoundPage;
