"use client";

import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { Button, TextField } from "@mui/material";
import { useCartStore } from "@/lib/useCartStore";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string
);

export default function CheckoutPage() {
  const cartItems = useCartStore((state) => state.cartItems);

  const cartTotal = cartItems.reduce(
    (total, item) => total + item.price * (item.quantity || 1),
    0
  );
  const shippingCost = cartTotal > 0 ? 5.99 : 0;
  const grandTotal = cartTotal + shippingCost;

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm
        grandTotal={grandTotal}
        cartTotal={cartTotal}
        shippingCost={shippingCost}
        cartItems={cartItems}
      />
    </Elements>
  );
}

type CheckoutFormProps = {
  grandTotal: number;
  cartTotal: number;
  shippingCost: number;
  cartItems: any[];
};

function CheckoutForm({
  grandTotal,
  cartTotal,
  shippingCost,
  cartItems,
}: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postcode: "",
  });

  useEffect(() => {
    const createPaymentIntent = async () => {
      const res = await fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: grandTotal }),
      });
      const data = await res.json();
      setClientSecret(data.clientSecret);
    };
  
    createPaymentIntent();
  }, [grandTotal]);  

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: elements.getElement(CardElement)!,
          billing_details: {
            name: form.name,
            email: form.email,
            address: {
              line1: form.address,
              city: form.city,
              postal_code: form.postcode,
            },
          },
        },
      }
    );

    if (error) {
      console.error("Payment failed:", error);
      router.push("/shop/cancel");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      clearCart();
      router.push("/shop/success");
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="space-y-4 md:col-span-2">
          {["name", "email", "address", "city", "postcode"].map((field) => (
            <TextField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              name={field}
              type={field === "email" ? "email" : "text"}
              value={form[field as keyof typeof form]}
              onChange={handleChange}
              fullWidth
              required
              InputLabelProps={{ style: { color: "black" } }}
              InputProps={{ style: { color: "black" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "black" },
                  "&:hover fieldset": { borderColor: "black" },
                  "&.Mui-focused fieldset": { borderColor: "black" },
                },
              }}
            />
          ))}

          <div className="p-4 rounded-md">
            <CardElement />
          </div>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="mt-4"
          >
            Pay £{grandTotal.toFixed(2)}
          </Button>
        </form>

        <div className="p-4 rounded-md h-fit">
          <h2 className="text-2xl font-semibold mb-4">Order Summary</h2>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between text-sm md:text-base"
            >
              <span>
                {item.name} (x{item.quantity || 1})
              </span>
              <span>£{(item.price * (item.quantity || 1)).toFixed(2)}</span>
            </div>
          ))}
          <div className="flex justify-between font-medium mt-4">
            <span>Subtotal:</span>
            <span>£{cartTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Shipping:</span>
            <span>£{shippingCost.toFixed(2)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg mt-2">
            <span>Total:</span>
            <span>£{grandTotal.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
