import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/products/ProductDetail";
import { getAllProducts, getProduct } from "@/lib/products";
import { JsonLd } from "@/components/JsonLd";
import { generateProductSchema, SITE_URL } from "@/lib/schema";

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product Not Found" };

  const url = `${SITE_URL}/products/${product.slug}`;
  return {
    title: `${product.name} | Jordan Lang`,
    description: product.description,
    keywords: product.category,
    alternates: {
      canonical: `/products/${product.slug}`,
    },
    openGraph: {
      title: product.name,
      description: product.description,
      type: "website",
      url,
      images: product.previewImage?.url ? [{ url: product.previewImage.url, alt: product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.description,
      images: product.previewImage?.url ? [product.previewImage.url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const [product, allProducts] = await Promise.all([
    getProduct(slug),
    getAllProducts(),
  ]);

  if (!product) notFound();

  // Get related products from the same category
  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p.slug !== product.slug)
    .slice(0, 3);

  // Generate Product schema for SEO
  const productUrl = `${SITE_URL}/products/${product.slug}`;
  const productSchema = generateProductSchema({
    name: product.name,
    description: product.description,
    image: product.previewImage.url,
    brand: {
      name: "Jordan Lang",
    },
    offers: {
      price: product.basePrice,
      priceCurrency: "USD",
      availability: "InStock",
      url: productUrl,
    },
  });

  return (
    <>
      <JsonLd data={productSchema} />
      <ProductDetail
        product={product}
        relatedProducts={relatedProducts}
      />
    </>
  );
}
