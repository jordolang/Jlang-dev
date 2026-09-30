"use client";

import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { m } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";

export interface ProductDetailProduct {
  slug: string;
  name: string;
  description: string;
  fullDescription?: string;
  price: string;
  basePrice: number;
  previewImage: {
    url: string;
    alt?: string;
  };
  category: string;
  features?: string[];
  detailedFeatures?: {
    title: string;
    description: string;
    icon?: string;
  }[];
  gallery?: {
    url: string;
    alt?: string;
  }[];
  purchaseUrl?: string;
  downloadUrl?: string;
  requirements?: string[];
  whatsIncluded?: string[];
}

interface ProductDetailProps {
  product: ProductDetailProduct;
  relatedProducts?: {
    slug: string;
    name: string;
    description: string;
    price: string;
    basePrice: number;
    previewImage: {
      url: string;
      alt?: string;
    };
    category: string;
  }[];
}

export default function ProductDetail({ product, relatedProducts = [] }: ProductDetailProps) {
  const [productUrl, setProductUrl] = useState("");
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") setProductUrl(window.location.href);
  }, []);

  useEffect(() => {
    trackEvent(AnalyticsEvents.PROJECT_CLICKED, { project: `Product: ${product.name}` });
  }, [product.name]);

  const isFree = product.basePrice === 0;

  const allImages = [
    product.previewImage,
    ...(product.gallery || [])
  ].filter(img => img?.url);

  const handlePurchase = async () => {
    trackEvent(AnalyticsEvents.PROJECT_CLICKED, {
      project: `Product Purchase: ${product.name}`,
      action: 'purchase_clicked'
    });

    // For free products, handle downloads directly
    if (isFree && product.downloadUrl) {
      window.location.href = product.downloadUrl;
      return;
    }

    // For products with external purchase URLs, open them
    if (product.purchaseUrl) {
      window.open(product.purchaseUrl, '_blank');
      return;
    }

    // For paid products, create Stripe Checkout session
    setIsProcessing(true);
    setError(null);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          productSlug: product.slug,
          productName: product.name,
          price: product.basePrice,
          successUrl: `${window.location.origin}/products/${product.slug}?success=true`,
          cancelUrl: `${window.location.origin}/products/${product.slug}?canceled=true`,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create checkout session' }));
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { url } = await response.json();

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during checkout');
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <header className="border-b border-gray-200 dark:border-gray-800 sticky top-0 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
          >
            <Icon icon="solar:arrow-left-outline" width={20} height={20} />
            <span className="font-medium">Back to Products</span>
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
          {/* Left Column - Images */}
          <m.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-4"
          >
            {/* Main Image */}
            <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
              {allImages[selectedImageIndex]?.url ? (
                <Image
                  src={allImages[selectedImageIndex].url}
                  alt={allImages[selectedImageIndex].alt || product.name}
                  fill
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                  <Icon icon="solar:bag-4-bold" className="text-indigo-500" width={120} height={120} />
                </div>
              )}

              {/* Category Badge */}
              <div className="absolute top-4 left-4 px-3 py-1.5 bg-black/50 backdrop-blur-sm rounded-full">
                <span className="text-white text-sm font-medium flex items-center gap-1">
                  <Icon icon="solar:tag-bold" width={14} height={14} />
                  {product.category}
                </span>
              </div>
            </div>

            {/* Gallery Thumbnails */}
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {allImages.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`relative h-24 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImageIndex === index
                        ? 'border-indigo-600 dark:border-indigo-400'
                        : 'border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700'
                    }`}
                  >
                    <Image
                      src={image.url}
                      alt={image.alt || `${product.name} preview ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </m.div>

          {/* Right Column - Product Info */}
          <m.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent leading-tight">
                {product.name}
              </h1>

              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6">
                {product.description}
              </p>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-5xl font-bold text-gray-900 dark:text-white">
                  {product.price}
                </span>
                {isFree && (
                  <span className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full text-sm font-medium">
                    Free Download
                  </span>
                )}
              </div>
            </div>

            {/* Purchase Button */}
            <div className="space-y-3">
              <button
                onClick={handlePurchase}
                disabled={isProcessing}
                className="w-full px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Icon icon="solar:restart-bold" width={24} height={24} className="animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <Icon icon={isFree ? "solar:download-bold" : "solar:bag-4-bold"} width={24} height={24} />
                    <span>{isFree ? 'Download Now' : 'Purchase Now'}</span>
                  </>
                )}
              </button>

              {error && (
                <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-sm text-red-600 dark:text-red-400 flex items-center gap-2">
                    <Icon icon="solar:danger-circle-bold" width={16} height={16} />
                    {error}
                  </p>
                </div>
              )}

              <div className="flex items-center justify-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Icon icon="solar:shield-check-bold" width={16} height={16} className="text-green-500" />
                <span>Secure checkout • Instant access</span>
              </div>
            </div>

            {/* Quick Features */}
            {product.features && product.features.length > 0 && (
              <div className="border-t border-b border-gray-200 dark:border-gray-800 py-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Icon icon="solar:star-bold" width={20} height={20} className="text-indigo-600 dark:text-indigo-400" />
                  Key Features
                </h3>
                <ul className="space-y-3">
                  {product.features.map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-3">
                      <Icon
                        icon="solar:check-circle-bold"
                        className="text-green-500 mt-0.5 flex-shrink-0"
                        width={20}
                        height={20}
                      />
                      <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What's Included */}
            {product.whatsIncluded && product.whatsIncluded.length > 0 && (
              <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                  <Icon icon="solar:box-bold" width={20} height={20} className="text-indigo-600 dark:text-indigo-400" />
                  What's Included
                </h3>
                <ul className="space-y-2">
                  {product.whatsIncluded.map((item, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-gray-700 dark:text-gray-300">
                      <Icon
                        icon="solar:file-text-bold"
                        className="text-indigo-600 dark:text-indigo-400 mt-0.5 flex-shrink-0"
                        width={16}
                        height={16}
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </m.div>
        </div>

        {/* Full Description */}
        {product.fullDescription && (
          <m.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-12 max-w-4xl"
          >
            <h2 className="text-3xl font-bold mb-6">About This Product</h2>
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {product.fullDescription}
              </p>
            </div>
          </m.section>
        )}

        {/* Detailed Features */}
        {product.detailedFeatures && product.detailedFeatures.length > 0 && (
          <m.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-12"
          >
            <h2 className="text-3xl font-bold mb-8">Features in Detail</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.detailedFeatures.map((feature, idx) => (
                <div
                  key={idx}
                  className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 p-6 hover:border-indigo-500 dark:hover:border-indigo-500 transition-colors"
                >
                  <div className="flex items-start gap-4">
                    {feature.icon && (
                      <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center flex-shrink-0">
                        <Icon icon={feature.icon} width={24} height={24} className="text-white" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </m.section>
        )}

        {/* Requirements */}
        {product.requirements && product.requirements.length > 0 && (
          <m.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12 max-w-2xl"
          >
            <h2 className="text-3xl font-bold mb-6">Requirements</h2>
            <ul className="space-y-3">
              {product.requirements.map((req, idx) => (
                <li key={idx} className="flex items-start gap-3">
                  <Icon
                    icon="solar:info-circle-bold"
                    className="text-blue-500 mt-0.5 flex-shrink-0"
                    width={20}
                    height={20}
                  />
                  <span className="text-gray-700 dark:text-gray-300">{req}</span>
                </li>
              ))}
            </ul>
          </m.section>
        )}

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <m.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="mb-12"
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-3xl font-bold">Related Products</h2>
              <Link
                href="/products"
                className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-1"
              >
                <span>View All</span>
                <Icon icon="solar:arrow-right-outline" width={20} height={20} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedProducts.slice(0, 3).map((relatedProduct) => (
                <Link
                  key={relatedProduct.slug}
                  href={`/products/${relatedProduct.slug}`}
                  className="group bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-800 hover:border-indigo-500 dark:hover:border-indigo-500 transition-all overflow-hidden"
                >
                  <div className="relative h-48">
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20" />
                    {relatedProduct.previewImage?.url ? (
                      <Image
                        src={relatedProduct.previewImage.url}
                        alt={relatedProduct.previewImage.alt || relatedProduct.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                        <Icon icon="solar:bag-4-bold" className="text-indigo-500" width={48} height={48} />
                      </div>
                    )}

                    <div className="absolute top-3 right-3 px-3 py-1.5 bg-indigo-600 backdrop-blur-sm rounded-full">
                      <span className="text-white text-sm font-bold">
                        {relatedProduct.price}
                      </span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-bold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors line-clamp-2">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {relatedProduct.description}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </m.section>
        )}

        {/* Bottom CTA */}
        <m.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-2xl p-12"
        >
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            {isFree ? 'Download this free resource now' : 'Get instant access to this product'}
          </p>
          <button
            onClick={handlePurchase}
            disabled={isProcessing}
            className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 inline-flex items-center gap-2"
          >
            {isProcessing ? (
              <>
                <Icon icon="solar:restart-bold" width={24} height={24} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <Icon icon={isFree ? "solar:download-bold" : "solar:bag-4-bold"} width={24} height={24} />
                <span>{isFree ? 'Download Now' : `Get it for ${product.price}`}</span>
              </>
            )}
          </button>
        </m.div>

        {/* Back to Products Link */}
        <div className="text-center mt-12">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-indigo-500/20 rounded-xl hover:from-indigo-500/20 hover:to-purple-500/20 transition-all"
          >
            <Icon icon="solar:arrow-left-outline" width={20} height={20} className="text-indigo-600 dark:text-indigo-400" />
            <span className="text-gray-700 dark:text-gray-300 font-medium">Browse All Products</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
