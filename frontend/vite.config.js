import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  base: "./", // 修改为你的部署路径，例如 "/earthonline/" 或 "./" (相对路径)
  plugins: [react()],
  server: {
    host: "127.0.0.1",
    port: 3000,
    open: true,
  },
  build: {
    outDir: "dist",
    sourcemap: true,
  },
});
