import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./", // 修改为你的部署路径，例如 "/earthonline/" 或 "./" (相对路径)
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 8080,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: false, // 生产环境关闭sourcemap减少体积
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ["react", "react-dom", "react-i18next", "i18next", "axios"],
          ui: ["lucide-react"],
        },
      },
    },
  },
});
