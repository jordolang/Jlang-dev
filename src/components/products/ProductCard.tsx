"use client";

import { m } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";
import { AnalyticsEvents, trackEvent } from "@/lib/analytics";

interface DigitalProduct {
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
  features?: string[];
}

interface ProductCardProps {
  product: DigitalProduct;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  return (
    <m.article
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className="group"
    >
      <Link
        href={`/products/${product.slug}`}
        onClick={() => trackEvent(AnalyticsEvents.PROJECT_CLICKED, { project: `Product: ${product.name}` })}
      >
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-700 transition-all duration-300 overflow-hidden shadow-lg hover:shadow-xl h-full flex flex-col">
          {/* Product Image */}
          <div className="relative h-64 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-purple-500/20"></div>
            {product.previewImage?.url ? (
              <Image
                src={product.previewImage.url}
                alt={product.previewImage.alt || product.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                <Icon icon="solar:bag-4-bold" className="text-indigo-500" width={64} height={64} />
              </div>
            )}

            {/* Category Badge */}
            <div className="absolute top-4 left-4 px-3 py-1 bg-black/50 backdrop-blur-sm rounded-full">
              <span className="text-white text-xs font-medium flex items-center gap-1">
                <Icon icon="solar:tag-bold" width={12} height={12} />
                {product.category}
              </span>
            </div>

            {/* Price Badge */}
            <div className="absolute top-4 right-4 px-4 py-2 bg-indigo-600 backdrop-blur-sm rounded-full">
              <span className="text-white text-sm font-bold">
                {product.price}
              </span>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 flex-1 flex flex-col">
            {/* Product Name */}
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 line-clamp-2">
              {product.name}
            </h3>

            {/* Description */}
            <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 flex-1">
              {product.description}
            </p>

            {/* Features Preview (if available) */}
            {product.features && product.features.length > 0 && (
              <div className="mb-4">
                <ul className="space-y-1">
                  {product.features.slice(0, 3).map((feature, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Icon
                        icon="solar:check-circle-bold"
                        className="text-green-500 mt-0.5 flex-shrink-0"
                        width={16}
                        height={16}
                      />
                      <span className="line-clamp-1">{feature}</span>
                    </li>
                  ))}
                </ul>
                {product.features.length > 3 && (
                  <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                    +{product.features.length - 3} more feature{product.features.length - 3 !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            )}

            {/* CTA Button */}
            <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800">
              <div className="flex items-center justify-between text-indigo-600 dark:text-indigo-400 font-medium group-hover:text-indigo-700 dark:group-hover:text-indigo-300 transition-colors">
                <span>View Details</span>
                <Icon
                  icon="solar:arrow-right-outline"
                  width={20}
                  height={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </m.article>
  );
}
