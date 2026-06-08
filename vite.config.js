import { defineConfig } from "vite";
import react            from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-router-dom"],
          query:  ["@tanstack/react-query"],
          ui:     ["lucide-react", "framer-motion"],
        },
      },
    },
    // منع source maps في production
    sourcemap: false,
    // Minify
    minify: "esbuild",
  },
  // منع ظهور الـ .env variables في الـ bundle عدا الـ VITE_ prefix
  envPrefix: "VITE_",
});