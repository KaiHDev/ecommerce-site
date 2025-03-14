"use client";

import { Button, Link } from "@mui/material";

export default function CancelPage() {
  return (
    <div className="text-center flex flex-col items-center justify-center min-h-[50vh]">
      <h1 className="text-4xl font-bold mb-4">Payment Canceled</h1>
      <p className="text-lg">
        Your payment was canceled. You can return to your cart to try again or update your details.
      </p>
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
    </div>
  );
}
