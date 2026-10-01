"use client";

import { useState, useMemo, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Icon } from "@iconify/react";
import { m, AnimatePresence } from "framer-motion";
import ProductCard from "./ProductCard";
import { useDebounce } from "@/hooks/useDebounce";

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

// Component to highlight matching text in search results
function HighlightedText({ text, searchQuery }: { text: string; searchQuery: string }) {
  // If no search query, return text as-is
  if (!searchQuery.trim()) {
    return <>{text}</>;
  }

  // Escape special regex characters in search query
  const escapedQuery = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  // Create regex for case-insensitive matching
  const regex = new RegExp(`(${escapedQuery})`, 'gi');

  // Split text by matches
  const parts = text.split(regex);

  return (
    <>
      {parts.map((part, index) => {
        // Check if this part matches the search query (case-insensitive)
        const isMatch = part.toLowerCase() === searchQuery.toLowerCase();

        return isMatch ? (
          <mark
            key={index}
            className="bg-yellow-200 dark:bg-yellow-500/40 text-gray-900 dark:text-white px-1 rounded"
          >
            {part}
          </mark>
        ) : (
          <span key={index}>{part}</span>
        );
      })}
    </>
  );
}

// Reports the `q` URL parameter whenever it changes. Isolated behind a Suspense
// boundary so reading search params doesn't opt the whole page out of static rendering.
function SearchParamSync({ onQueryChange }: { onQueryChange: (query: string) => void }) {
  const query = useSearchParams().get('q') ?? '';

  useEffect(() => {
    onQueryChange(query);
  }, [query, onQueryChange]);

  return null;
}

export default function ProductGrid({
  products,
  filterByCategory,
  title = "Digital Products",
  description = "Templates, starter kits, and resources to accelerate your projects"
}: {
  products: DigitalProduct[];
  filterByCategory?: string;
  title?: string;
  description?: string;
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(filterByCategory ?? null);
  const [priceFilter, setPriceFilter] = useState<'all' | 'free' | 'paid'>('all');
  const searchInputRef = useRef<HTMLInputElement>(null);
  // Last query reflected in the URL, so our own URL writes aren't echoed back into the input
  const urlQueryRef = useRef('');

  // Debounce search query to reduce re-renders and URL updates
  const debouncedSearchQuery = useDebounce(searchQuery, 200);
  const normalizedQuery = debouncedSearchQuery.trim();

  // Adopt the query from the URL on load and on later navigations (e.g. following a /products?q=... link)
  const handleUrlQueryChange = useCallback((query: string) => {
    if (query !== urlQueryRef.current) {
      urlQueryRef.current = query;
      setSearchQuery(query);
    }
  }, []);

  // Update the URL from the debounced query. Uses the History API so typing doesn't trigger router navigations.
  useEffect(() => {
    if (normalizedQuery === urlQueryRef.current) return;
    urlQueryRef.current = normalizedQuery;

    const params = new URLSearchParams(window.location.search);
    if (normalizedQuery) {
      params.set('q', normalizedQuery);
    } else {
      params.delete('q');
    }

    const search = params.toString();
    window.history.replaceState(null, '', `${window.location.pathname}${search ? `?${search}` : ''}`);
  }, [normalizedQuery]);

  // Keyboard shortcut: Press '/' to focus search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Only trigger if '/' is pressed and user is not already typing in an input or textarea
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Get all unique categories
  const allCategories = useMemo(() => {
    const categorySet = new Set<string>();
    products.forEach(product => {
      if (product.category) {
        categorySet.add(product.category);
      }
    });
    return Array.from(categorySet).sort();
  }, [products]);

  // Filter products based on search, category, and price
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const query = normalizedQuery.toLowerCase();
      const matchesSearch = query === '' ||
        product.name.toLowerCase().includes(query) ||
        product.description.toLowerCase().includes(query) ||
        product.category.toLowerCase().includes(query) ||
        (product.features && product.features.some(feature => feature.toLowerCase().includes(query)));

      const matchesCategory = !selectedCategory || product.category === selectedCategory;

      const matchesPrice = priceFilter === 'all' ||
        (priceFilter === 'free' && product.basePrice === 0) ||
        (priceFilter === 'paid' && product.basePrice > 0);

      return matchesSearch && matchesCategory && matchesPrice;
    });
  }, [products, normalizedQuery, selectedCategory, priceFilter]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white">
      <Suspense fallback={null}>
        <SearchParamSync onQueryChange={handleUrlQueryChange} />
      </Suspense>
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold mb-4">{title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">{description}</p>
        </div>
      </header>

      {/* Search and Filters */}
      <section className="border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <Icon
                icon="solar:magnifer-linear"
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                width={20}
                height={20}
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search products... (Press '/' to focus)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  aria-label="Clear search"
                >
                  <Icon icon="solar:close-circle-bold" width={20} height={20} />
                </button>
              )}
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory(null)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === null
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500'
                  }`}
                >
                  All
                </button>
                {allCategories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-indigo-600 text-white'
                        : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Price
              </label>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setPriceFilter('all')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    priceFilter === 'all'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500'
                  }`}
                >
                  All
                </button>
                <button
                  onClick={() => setPriceFilter('free')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    priceFilter === 'free'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500'
                  }`}
                >
                  Free
                </button>
                <button
                  onClick={() => setPriceFilter('paid')}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    priceFilter === 'paid'
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500'
                  }`}
                >
                  Paid
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Results Summary */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400">
            {filteredProducts.length === 0 ? (
              'No products found'
            ) : (
              <>
                Showing <span className="font-semibold text-gray-900 dark:text-white">{filteredProducts.length}</span> product{filteredProducts.length !== 1 ? 's' : ''}
              </>
            )}
          </p>

          {(normalizedQuery || selectedCategory || priceFilter !== 'all') && (
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
                setPriceFilter('all');
              }}
              className="text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 font-medium flex items-center gap-1"
            >
              <Icon icon="solar:restart-bold" width={16} height={16} />
              Clear all filters
            </button>
          )}
        </div>
      </section>

      {/* Product Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-20">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-16">
            <Icon
              icon="solar:box-minimalistic-bold-duotone"
              className="mx-auto text-gray-400 dark:text-gray-600 mb-4"
              width={64}
              height={64}
            />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No products found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Try adjusting your search or filters to find what you&apos;re looking for.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
                setPriceFilter('all');
              }}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors"
            >
              Clear all filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <AnimatePresence mode="wait">
              {filteredProducts.map((product, index) => (
                <ProductCard key={product.slug} product={product} index={index} />
              ))}
            </AnimatePresence>
          </div>
        )}
      </section>
    </div>
  );
}
