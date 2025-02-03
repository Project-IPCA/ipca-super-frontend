import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { port: 5175 },
  optimizeDeps: {
    include: ["react-apexcharts", "apexcharts"],
  },
  build: {
    sourcemap: false,
  },
});
