"use client";

import React from "react";
import Image from "next/image";

const FeatureSection = () => {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center gap-8 px-4">
        
        {/* Image */}
        <div className="w-full md:w-1/2">
          <Image
            src="/images/product-feature.jpg"
            alt="Product Feature"
            width={600}
            height={400}
            className="rounded-lg shadow-md object-cover"
          />
        </div>

        {/* Text + Bullet Points */}
        <div className="w-full md:w-1/2">
          <h2 className="text-3xl font-bold mb-4">Why Choose Our Products?</h2>
          <p className="text-gray-600 mb-4">
            We pride ourselves on delivering top-quality products designed to meet your needs.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>Premium materials for long-lasting durability.</li>
            <li>Designed with the customer in mind for ease of use.</li>
            <li>Affordable prices without compromising quality.</li>
            <li>Fast and reliable delivery options available.</li>
          </ul>
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
