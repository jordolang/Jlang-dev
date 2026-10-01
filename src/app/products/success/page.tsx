import type { Metadata } from "next";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { getStripe } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Purchase Successful | JLang Development",
  robots: { index: false, follow: false }
};

export const dynamic = "force-dynamic";

interface PageProps {
  searchParams: Promise<{ session_id?: string }>;
}

export default async function SuccessPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  let session = null;
  let error = null;

  if (sessionId) {
    try {
      const stripe = getStripe();
      session = await stripe.checkout.sessions.retrieve(sessionId, {
        expand: ["line_items", "line_items.data.price.product"]
      });
    } catch (err) {
      error = err instanceof Error ? err.message : "Failed to retrieve session";
    }
  }

  return (
    <main
      id="main-content"
      className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-100 via-blue-50 to-purple-100 px-5 py-16 text-gray-900 dark:from-gray-950 dark:via-slate-950 dark:to-indigo-950 dark:text-white"
    >
      <div className="w-full max-w-3xl">
        <Link
          href="/products"
          className="mb-7 inline-flex items-center gap-2 font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
        >
          <Icon icon="solar:arrow-left-outline" width={20} height={20} />
          Back to Products
        </Link>

        {!session || error ? (
          <div className="rounded-3xl bg-white p-10 text-center shadow-xl dark:bg-gray-900">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
                <Icon icon="solar:danger-circle-bold" className="text-red-600 dark:text-red-400" width={40} height={40} />
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-3">Unable to Retrieve Order</h1>
            <p className="text-gray-600 dark:text-gray-300 mb-6">
              {!sessionId
                ? "No session ID was provided. Please check your confirmation email or contact support."
                : error || "This session may have expired or is invalid."}
            </p>
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
            >
              Browse Products
            </Link>
          </div>
        ) : (
          <div className="rounded-3xl bg-white p-10 shadow-xl dark:bg-gray-900">
            {/* Success Icon */}
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/30">
                <Icon icon="solar:check-circle-bold" className="text-green-600 dark:text-green-400" width={40} height={40} />
              </div>
            </div>

            {/* Success Message */}
            <h1 className="text-center text-4xl font-bold mb-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Purchase Successful!
            </h1>
            <p className="text-center text-gray-600 dark:text-gray-300 mb-8">
              Thank you for your purchase. Your order has been confirmed and you should receive an email shortly.
            </p>

            {/* Order Details */}
            <div className="border-t border-gray-200 dark:border-gray-800 pt-6 mb-6 space-y-4">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <Icon icon="solar:box-bold" className="text-indigo-600 dark:text-indigo-400" width={24} height={24} />
                Order Details
              </h2>

              {/* Order ID */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800/50">
                <span className="text-gray-600 dark:text-gray-400">Order ID</span>
                <span className="font-mono text-sm text-gray-900 dark:text-white">{sessionId}</span>
              </div>

              {/* Status */}
              <div className="flex justify-between items-center py-3 border-b border-gray-100 dark:border-gray-800/50">
                <span className="text-gray-600 dark:text-gray-400">Status</span>
                <div className="flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500" />
                  <span className="font-semibold text-green-600 dark:text-green-400 capitalize">
                    {session.payment_status}
                  </span>
                </div>
              </div>

              {/* Line Items */}
              {session.line_items?.data.map((item, idx) => {
                const product = typeof item.price?.product === "object" ? item.price.product : null;
                const productName = (product && !product.deleted ? product.name : null) || session.metadata?.productName || "Digital Product";
                const amount = item.amount_total ? (item.amount_total / 100).toFixed(2) : "0.00";

                return (
                  <div key={idx} className="py-4 border-b border-gray-100 dark:border-gray-800/50 last:border-b-0">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{productName}</h3>
                        {item.description && (
                          <p className="text-sm text-gray-600 dark:text-gray-400">{item.description}</p>
                        )}
                      </div>
                      <span className="font-bold text-gray-900 dark:text-white ml-4">${amount}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
                      <span>Qty: {item.quantity || 1}</span>
                    </div>
                  </div>
                );
              })}

              {/* Total */}
              <div className="flex justify-between items-center py-4 border-t-2 border-gray-200 dark:border-gray-700">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">
                  ${session.amount_total ? (session.amount_total / 100).toFixed(2) : "0.00"}
                </span>
              </div>
            </div>

            {/* Customer Email */}
            {session.customer_details?.email && (
              <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl p-4 mb-6">
                <div className="flex items-start gap-3">
                  <Icon icon="solar:letter-bold" className="text-blue-600 dark:text-blue-400 mt-0.5" width={20} height={20} />
                  <div>
                    <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      Confirmation sent to:
                    </p>
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      {session.customer_details.email}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Next Steps */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border border-indigo-200 dark:border-indigo-800/50 rounded-xl p-6 mb-6">
              <h3 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                <Icon icon="solar:list-check-bold" className="text-indigo-600 dark:text-indigo-400" width={20} height={20} />
                What&apos;s Next?
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2">
                  <Icon icon="solar:check-circle-bold" className="text-green-500 mt-0.5 flex-shrink-0" width={16} height={16} />
                  <span>Check your email for order confirmation and download instructions</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon="solar:check-circle-bold" className="text-green-500 mt-0.5 flex-shrink-0" width={16} height={16} />
                  <span>Access your purchase through the provided link</span>
                </li>
                <li className="flex items-start gap-2">
                  <Icon icon="solar:check-circle-bold" className="text-green-500 mt-0.5 flex-shrink-0" width={16} height={16} />
                  <span>Need help? Contact support at support@jlang.dev</span>
                </li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/products"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all"
              >
                <Icon icon="solar:bag-4-bold" width={20} height={20} />
                Browse More Products
              </Link>
              <Link
                href="/"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 text-gray-700 dark:text-gray-300 font-semibold rounded-xl transition-all"
              >
                <Icon icon="solar:home-2-bold" width={20} height={20} />
                Back to Home
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
