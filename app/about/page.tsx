"use client";

import React from "react";
import HeroSectionSmall from "../components/HeroSectionSmall";
import FeatureSection from "../components/FeatureSection";

const AboutUsPage = () => {
  return (
    <div>
      <HeroSectionSmall title="About Us" />
      <div className="max-w-screen-xl mx-auto px-4 p-6">
        <p className="text-lg text-center">
          Welcome to our e-commerce store! We are passionate about providing the best products
          online with excellent customer service. Our team is dedicated to ensuring you have the best
          shopping experience possible. Stay tuned as we continue to bring you new and exciting products.
        </p>
        <h2 className="text-2xl font-semibold mt-10 text-center">Our Mission</h2>
        <p className="text-lg mt-2 text-center">
          Our mission is to bring high-quality products to people around the world, while ensuring
          the best prices and the most convenient shopping experience. We aim to build a long-lasting
          relationship with our customers and provide unmatched service and support.
        </p>
        <FeatureSection />
      </div>
    </div>
  );
};

export default AboutUsPage;
