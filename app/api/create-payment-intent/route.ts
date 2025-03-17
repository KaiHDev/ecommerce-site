import { NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2025-02-24.acacia",
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log("Received request body:", body); // Debugging log

    let { amount } = body;

    if (!amount || typeof amount !== "number" || isNaN(amount) || amount <= 0) {
      console.error("Invalid amount received:", amount);
      return NextResponse.json({ error: "Invalid amount." }, { status: 400 });
    }

    amount = Math.round(amount * 100); // Convert GBP to pence

    console.log("Creating payment intent for amount (in pence):", amount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "gbp",
      payment_method_types: ["card"],
    });

    console.log("Payment Intent Created:", paymentIntent.id);

    return NextResponse.json({ clientSecret: paymentIntent.client_secret }, { status: 200 });
  } catch (error) {
    console.error("Stripe API Error:", error);
    return NextResponse.json({ error: "Failed to create payment intent.", details: error }, { status: 500 });
  }
}
