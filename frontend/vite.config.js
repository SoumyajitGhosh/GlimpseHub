import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr(),
    VitePWA({
      registerType: "autoUpdate",
      devOptions: {
        enabled: true,
      },
      manifest: {
        theme_color: "#ffffff",
      },
    }),
  ],
  build: {
    rollupOptions: {
      input: "./index.html",
    },
  },
  base: "./",
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: "./src/utils/test/setupTests.js",
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.{js,jsx}"],
      exclude: ["src/**/*.test.{js,jsx}", "src/utils/test/**", "src/main.jsx"],
      // Starting floor — raise as Phases 2–4 add tests.
      thresholds: { lines: 2, functions: 2, branches: 2, statements: 2 },
    },
  },
});
