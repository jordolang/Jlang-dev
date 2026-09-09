"use client";

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { m } from 'framer-motion';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Simulate newsletter subscription (replace with actual API call)
    setTimeout(() => {
      if (email && email.includes('@')) {
        setStatus('success');
        setMessage('Thanks for subscribing! Check your email for confirmation.');
        setEmail('');
      } else {
        setStatus('error');
        setMessage('Please enter a valid email address.');
      }
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 5000);
    }, 1000);
  };

  return (
    <div className="my-16">
      <m.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="relative overflow-hidden bg-gradient-to-br from-indigo-500/10 via-purple-500/10 to-pink-500/10 dark:from-indigo-500/5 dark:via-purple-500/5 dark:to-pink-500/5 border border-indigo-200 dark:border-indigo-800 rounded-3xl p-8 md:p-12"
      >
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }} />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto text-center">
          {/* Icon */}
          <m.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl mb-6 shadow-lg"
          >
            <Icon icon="solar:letter-bold" width={32} height={32} className="text-white" />
          </m.div>

          {/* Heading */}
          <h3 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Subscribe to the Newsletter
          </h3>
          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
            Get the latest posts and insights delivered directly to your inbox. No spam, unsubscribe anytime.
          </p>

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              disabled={status === 'loading'}
              className="flex-1 px-6 py-4 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 disabled:opacity-50"
              required
            />
            <m.button
              type="submit"
              disabled={status === 'loading'}
              whileHover={{ scale: status === 'loading' ? 1 : 1.05 }}
              whileTap={{ scale: status === 'loading' ? 1 : 0.95 }}
              className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg"
            >
              {status === 'loading' ? (
                <>
                  <Icon icon="svg-spinners:ring-resize" width={20} height={20} />
                  <span>Subscribing...</span>
                </>
              ) : (
                <>
                  <span>Subscribe</span>
                  <Icon icon="solar:arrow-right-outline" width={20} height={20} />
                </>
              )}
            </m.button>
          </form>

          {/* Status Message */}
          {message && (
            <m.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-4 rounded-xl flex items-center justify-center gap-2 ${
                status === 'success'
                  ? 'bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
              }`}
            >
              <Icon 
                icon={status === 'success' ? 'solar:check-circle-bold' : 'solar:danger-circle-bold'} 
                width={20} 
                height={20} 
              />
              <span className="text-sm font-medium">{message}</span>
            </m.div>
          )}

          {/* Privacy Note */}
          <p className="mt-6 text-xs text-gray-500 dark:text-gray-400">
            We respect your privacy. Your email will never be shared.
          </p>
        </div>
      </m.div>
    </div>
  );
}
