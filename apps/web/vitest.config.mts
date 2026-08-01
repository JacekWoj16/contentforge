import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Read path aliases from tsconfig, so tests resolve imports exactly the
    // way the application does. Native since Vite 8; no plugin needed.
    tsconfigPaths: true,
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
