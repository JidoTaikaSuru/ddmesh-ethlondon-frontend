import path from "path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  define: {
    "process.env": {},
  },
  server: {
    port: 3000,
    proxy: {
      "/neon": {
        target: "https://console.neon.tech/api/v2",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/neon/, ""),
      },
    },
  },
});
