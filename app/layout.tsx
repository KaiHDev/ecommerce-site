import Header from "@/app/components/Header";
import "./styles/globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white min-h-screen">
        <Header />
        <main className="container mx-auto p-6">{children}</main>
      </body>
    </html>
  );
}
