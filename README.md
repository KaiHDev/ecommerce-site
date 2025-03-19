E-commerce Site
Welcome to the E-commerce Site! This platform allows you to manage products, view them on a public storefront, and perform various administrative tasks such as adding, editing, and deleting products. It is built using React for the front-end, Next.js for server-side rendering, and Supabase for the backend.

Features
Product Management (Add, Edit, Delete)
Admin Dashboard for product management
Product List Page with search, filtering, and pagination
Cart and Checkout (integrated with Stripe for future payments)
Admin-Only Product Editing (full control over product details and images)
User Authentication (protected routes for admin users)
Technologies Used
Frontend: React, Next.js
Backend: Supabase (for authentication, database management, and storage)
Styling: Material-UI
Authentication: Supabase Auth
Database: Supabase PostgreSQL Database
File Storage: Supabase Storage (for images)
Payment Integration (Stripe for future integration)
Getting Started
To get started with the e-commerce site locally, follow these steps:

1. Clone the repository
bash
Copy
git clone <repository-url>
cd <repository-folder>
2. Install dependencies
Make sure you have Node.js installed. Then, run:

bash
Copy
npm install
3. Set up Supabase
This project uses Supabase for the backend, including authentication, database management, and image storage. You will need a Supabase account and a project to use this locally.

Create a Supabase Account:

Visit https://supabase.io and sign up for an account if you don’t have one.
Create a Supabase Project:

After logging in, click on Create a New Project.
Follow the instructions to create a project, and once created, you’ll have access to your Supabase URL and Supabase Anon Key.
Set up the Database:

Go to the Supabase Dashboard and navigate to the SQL Editor.
Run the following SQL queries to create the products and product_images tables:
sql
Copy
-- products table
create table products (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  price numeric not null,
  description text,
  sku text,
  created_at timestamp default now(),
  product_image text,
  slug text
);

-- product_images table
create table product_images (
  id uuid primary key default uuid_generate_v4(),
  product_id uuid references products(id),
  image_url text,
  alt_text text,
  image_order integer
);
Supabase Storage (for storing images):

Go to Supabase Storage and create a bucket to store product images.
Make sure to enable public access to the bucket if you want to serve the images publicly.
Add your Supabase Credentials:

Go to Project Settings -> API and copy your Supabase URL and Anon Key.
Create a .env.local file in the root of your project and add the following environment variables:
bash
Copy
SUPABASE_URL=<your-supabase-url>
SUPABASE_ANON_KEY=<your-supabase-anon-key>
4. Start the development server
Run the following command to start the development server:

bash
Copy
npm run dev
Visit http://localhost:3000 in your browser to view the site.

Admin Dashboard
The Admin Dashboard allows admins to manage products, including adding new products, editing existing ones, and deleting products. You can access this dashboard from the Admin Panel once logged in as an admin.

Editing Products
Admins can edit the product details and reorder images using a simple interface. A video guide on how to edit products will be uploaded shortly. You can watch the tutorial below:

[Video Tutorial: How to Edit Products]

Image Handling in Admin
In the Admin Panel, you can upload images for each product using the drag-and-drop feature. These images will be stored in Supabase Storage, and the first image will be set as the primary image for the product.

To reorder the images, simply drag and drop them in the desired order. The order will be saved in the product_images table in the database, and the first image will be used as the product_image in the products table.

Deployment
To deploy the site, you can use platforms such as Netlify or Vercel. Make sure your environment variables are set correctly on the platform’s dashboard.

Deploy to Netlify
Push your code to a Git repository (GitHub, GitLab, etc.)
Connect your repository to Netlify.
Configure the build settings as follows:
Build Command: npm run build
Publish Directory: out
Once deployed, your site will be live!

License
This project is licensed under the MIT License - see the LICENSE file for details.
