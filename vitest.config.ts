import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    setupFiles: ['./tests/setup.ts'],
    include: ['**/*.{test,spec}.{ts,tsx}'],
    // Playwright owns tests/e2e
    exclude: ['node_modules', '.next', 'out', 'dist', '.auto-claude', 'tests/e2e/**'],
  },
  resolve: {
    // Most specific first: '@/tests' must win over the '@' -> src mapping
    alias: [
      { find: /^@\/tests\//, replacement: path.resolve(__dirname, './tests') + '/' },
      { find: /^@\//, replacement: path.resolve(__dirname, './src') + '/' },
    ],
  },
})
