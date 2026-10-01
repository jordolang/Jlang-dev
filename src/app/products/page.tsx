import type { Metadata } from "next";
import ProductGrid from "@/components/products/ProductGrid";
import { getAllProducts } from "@/lib/products";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Digital Products | Jordan Lang",
  description: "Templates, starter kits, and resources to accelerate your projects.",
  alternates: {
    canonical: "/products",
  },
  openGraph: {
    title: "Digital Products | Jordan Lang",
    description: "Templates, starter kits, and resources to accelerate your projects.",
    type: "website",
  },
};

export default async function ProductsPage() {
  const products = await getAllProducts();
  return <ProductGrid products={products} />;
}
