import { withRslibConfig } from '@rstest/adapter-rslib';
import { defineConfig } from '@rstest/core';

export default defineConfig({
  extends: withRslibConfig(),
  coverage: {
    exclude: [
      '**/__tests__/**',
      '**/*.test.{ts,tsx}',
      'src/env.d.ts',
      'src/index.ts',
    ],
    include: ['src/**/*.{ts,tsx}'],
    provider: 'v8',
    reporter: ['text', 'html'],
  },
  include: ['src/**/__tests__/**/*.test.{ts,tsx}'],
  setupFiles: ['./rstest.setup.ts'],
  testEnvironment: 'happy-dom',
});
