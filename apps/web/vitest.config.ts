import path from "node:path";

import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    // Mirror the tsconfig path alias so tests import modules the same way
    // the application does.
    alias: { "@": path.resolve(__dirname, "src") },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts"],
  },
});
