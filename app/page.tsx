'use client'; // Ensures the component is rendered on the client side

import { useEffect, useState } from 'react'; // Import React hooks for managing state and side effects
import { supabase } from '@/lib/supabaseClient'; // Import the configured Supabase client instance

// Define TypeScript type for product images
type ProductImage = {
  id: string; // Unique ID of the image
  image_url: string; // URL of the image
  alt_text: string; // Alt text for accessibility
  order: number; // Order in which the image should be displayed
};

// Define TypeScript type for products
type Product = {
  id: string; // Unique ID of the product
  name: string; // Name of the product
  price: number; // Price of the product
  sku: string; // Stock Keeping Unit code
  images: ProductImage[]; // Array of associated product images
};

const HomePage = () => {
  // State to store products fetched from Supabase
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    // Define an async function to fetch products with related images
    const fetchProducts = async () => {
      // Fetch data from the 'products' table, including related 'product_images'
      const { data, error } = await supabase
        .from('products')
        .select(`
          id, 
          name, 
          price, 
          sku,
          product_images (
            id, 
            image_url, 
            alt_text, 
            "order"
          )
        `);

      // Handle any errors during the fetch operation
      if (error) {
        console.error('Error fetching products:', error);
      } else {
        // Transform data to match the 'Product' type
        const transformedProducts = (data as any[]).map((product) => ({
          ...product, // Spread the original product properties
          images: product.product_images, // Map 'product_images' to the expected 'images' field
        }));
        console.log("Fetched products:", data);
        // Update state with the correctly typed product array
        setProducts(transformedProducts as Product[]);
      }
    };

    // Call the fetch function when the component mounts
    fetchProducts();
  }, []); // Empty dependency array ensures this runs only once on component mount

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Products</h1>
      
      {/* Grid layout for displaying products */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        
        {/* Iterate over products and display each one */}
        {products.map((product) => (
          <div key={product.id} className="border rounded p-4">
            
            {/* Display product name, price, and SKU */}
            <h2 className="text-xl font-semibold">{product.name}</h2>
            <p>Price: £{product.price.toFixed(2)}</p>
            <p>SKU: {product.sku}</p>

            {/* Display associated product images in a grid */}
            <div className="mt-2 grid grid-cols-2 gap-2">
              {product.images.map((image) => (
                <div key={image.id}>
                  <img
                    src={image.image_url} // Image source URL
                    alt={image.alt_text || 'Product image'} // Fallback alt text
                    className="w-full h-auto rounded"
                  />
                </div>
              ))}
            </div>

          </div>
        ))}
        
      </div>
    </div>
  );
};

export default HomePage;
