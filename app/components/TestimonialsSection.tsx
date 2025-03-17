"use client";

import React from "react";
import { Star } from "@mui/icons-material";

const testimonials = [
  {
    name: "Alice",
    review: "Fantastic service and amazing product quality. Highly recommend!",
    rating: 5,
  },
  {
    name: "Bob",
    review: "Quick delivery and the product was exactly as described.",
    rating: 4,
  },
  {
    name: "Charlie",
    review: "Great experience overall. Will definitely shop again.",
    rating: 5,
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-12 bg-gray-100">
      <h2 className="text-3xl font-bold text-center mb-8">What Our Customers Say</h2>
      <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((testimonial, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center"
          >
            <div className="flex mb-4">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <Star key={i} className="text-yellow-500" />
              ))}
            </div>
            <p className="italic mb-4">&quot;{testimonial.review}&quot;</p>
            <p className="font-semibold">- {testimonial.name}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default TestimonialsSection;
