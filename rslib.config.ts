import { pluginReact } from '@rsbuild/plugin-react';
import { defineConfig } from '@rslib/core';

export default defineConfig({
  lib: [
    {
      bundle: false,
      dts: true,
      format: 'esm',
      syntax: ['es2022'],
    },
  ],
  output: {
    target: 'web',
  },
  plugins: [pluginReact()],
  source: {
    entry: {
      index: ['./src/**', '!src/**/__tests__/**', '!src/**/*.test.*'],
    },
  },
});
