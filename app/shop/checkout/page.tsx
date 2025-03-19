"use client";

import React, { useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button, TextField } from "@mui/material";
import { useCartStore } from "@/lib/useCartStore";
import { useRouter } from "next/navigation";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as string);

type CartItem = {
  id: string;
  name: string;
  price: number;
  quantity?: number;
};

export default function CheckoutPage() {
  const cartItems = useCartStore((state) => state.cartItems);
  const cartTotal = cartItems.reduce((total, item) => total + item.price * (item.quantity || 1), 0);
  const shippingCost = cartTotal > 0 ? 5.99 : 0;
  const grandTotal = cartTotal + shippingCost;

  return (
    <Elements stripe={stripePromise}>
      <CheckoutForm grandTotal={grandTotal} cartTotal={cartTotal} shippingCost={shippingCost} cartItems={cartItems} />
    </Elements>
  );
}

type CheckoutFormProps = {
  grandTotal: number;
  cartTotal: number;
  shippingCost: number;
  cartItems: CartItem[];
};

function CheckoutForm({ grandTotal, cartTotal, shippingCost, cartItems }: CheckoutFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const router = useRouter();
  const clearCart = useCartStore((state) => state.clearCart);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [cardComplete, setCardComplete] = useState(false);

  const [form, setForm] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    postcode: "",
  });

  useEffect(() => {
    if (cartItems.length === 0) return;
    if (grandTotal <= 0 || isNaN(grandTotal)) return;

    const createPaymentIntent = async () => {
      try {
        const res = await fetch("/api/create-payment-intent", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: grandTotal }),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(`API error: ${errorData.error}`);
        }

        const data = await res.json();
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error("Error creating payment intent:", error);
      }
    };

    createPaymentIntent();
  }, [grandTotal, cartItems]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !clientSecret) return;

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement)!,
        billing_details: {
          name: form.name,
          email: form.email,
          address: { line1: form.address, city: form.city, postal_code: form.postcode },
        },
      },
    });

    if (error) {
      console.error("Payment failed:", error);
      router.push("/shop/cancel");
    } else if (paymentIntent && paymentIntent.status === "succeeded") {
      clearCart();
      router.push("/shop/success");
    }
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: "16px",
        color: "#000",
        "::placeholder": { color: "#888" },
        border: "1px solid #d1d5db",
        padding: "10px 14px",
      },
      invalid: {
        color: "#fa755a",
      },
    },
    hideIcon: true,
  };

  const isFormComplete = Object.values(form).every((value) => value.trim() !== "") && cardComplete;

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 md:col-span-2">
          {(["name", "email", "address", "city", "postcode"] as const).map((field) => (
            <TextField
              key={field}
              label={field.charAt(0).toUpperCase() + field.slice(1)}
              name={field}
              type={field === "email" ? "email" : "text"}
              value={form[field]}
              onChange={handleChange}
              fullWidth
              required
              InputProps={{ style: { color: "black" } }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#d1d5db" },
                  "&:hover fieldset": { borderColor: "#6b7280" },
                  "&.Mui-focused fieldset": { borderColor: "#2563eb" },
                },
              }}
            />
          ))}

          {/* Card Element styled */}
          <div
            className="rounded border border-gray-300 p-3"
            style={{
              padding: "16px",
              borderRadius: "6px",
              border: "1px solid #d1d5db",
            }}
          >
            <CardElement
              options={cardElementOptions}
              onChange={(event) => setCardComplete(event.complete)}
            />
          </div>

          <Button
            type="submit"
            variant="contained"
            color="primary"
            className="w-full py-3 bg-blue-700 hover:bg-blue-800"
            disabled={!isFormComplete}
          >
            Pay £{grandTotal.toFixed(2)}
          </Button>
        </form>

        {/* Order Summary */}
        <div className="bg-white shadow-md border border-gray-200 rounded-lg p-6 h-fit">
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          {cartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm md:text-base mb-1">
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
