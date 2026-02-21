import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],

  build: {
    chunkSizeWarningLimit: 900,

    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes("node_modules")) return;

          // React core
          if (id.includes("react") || id.includes("react-dom")) {
            return "react-vendor";
          }

          // Router
          if (id.includes("react-router")) {
            return "router";
          }

          // Charts (หนัก)
          if (id.includes("recharts")) {
            return "charts";
          }

          // Carousel
          if (id.includes("react-slick") || id.includes("slick-carousel")) {
            return "carousel";
          }

          // Socket
          if (id.includes("socket.io-client")) {
            return "socket";
          }

          // Icons
          if (id.includes("@iconify")) {
            return "icons";
          }

          // HTTP
          if (id.includes("axios")) {
            return "http";
          }

          // default vendor
          return "vendor";
        },
      },
    },
  },
});
