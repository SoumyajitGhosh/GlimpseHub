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
      // 'prompt' (not 'autoUpdate') so <PWABadge> can ask before reloading.
      registerType: "prompt",
      includeAssets: ["favicon.ico", "apple-touch-icon-180x180.png", "logo-camera.svg"],
      manifest: {
        name: "GlimpseHub",
        short_name: "GlimpseHub",
        description:
          "Share moments — posts with filters, comments, chat and real-time notifications.",
        theme_color: "#0a0a0a",
        background_color: "#0a0a0a",
        display: "standalone",
        start_url: "/",
        scope: "/",
        icons: [
          { src: "pwa-64x64.png", sizes: "64x64", type: "image/png" },
          { src: "pwa-192x192.png", sizes: "192x192", type: "image/png" },
          { src: "pwa-512x512.png", sizes: "512x512", type: "image/png" },
          {
            src: "maskable-icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
          },
        ],
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,svg,png,ico,woff2}"],
        // Never cache API responses — they're per-user and change constantly.
        navigateFallbackDenylist: [/^\/api\//],
        runtimeCaching: [
          {
            // Cloudinary-hosted post images / avatars.
            urlPattern: /^https:\/\/res\.cloudinary\.com\/.*/i,
            handler: "CacheFirst",
            options: {
              cacheName: "cloudinary-images",
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
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
