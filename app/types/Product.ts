export type ProductImage = {
    image_url: string;
    image_order: number;
  };

export type Product = {
    id: string;
    name: string;
    price: number;
    sku: string;
    description?: string;
    primary_image_url?: string;
    slug: string;
};