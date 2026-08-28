import tsconfigPaths from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    globals: true,
    include: ['packages/*/src/**/*.test.ts'],
    exclude: ['.claude', 'node_modules'],
    server: {
      deps: {
        inline: ['@flighthq'],
      },
    },
  },
});
