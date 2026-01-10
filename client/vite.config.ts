import { defineConfig } from "vite";
import path from "path";
import react from "@vitejs/plugin-react";
import ternaryTagger from "@ternary-sh/react-vite-component-tagger";

export default defineConfig({
  plugins: [react(), ternaryTagger()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    headers: {
      "Cross-Origin-Opener-Policy": "same-origin-allow-popups",
      "Cross-Origin-Embedder-Policy": "credentialless",
    },
    proxy: {
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    outDir: "build",
    chunkSizeWarningLimit: 1000,
  },
});
