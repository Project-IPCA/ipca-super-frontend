import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const BASE = mode === "production" ? "/super/" : "/";

  return {
    plugins: [react()],
    server: { port: 5175 },
    base: BASE,
    optimizeDeps: {
      include: ["react-apexcharts", "apexcharts"],
    },
    build: {
      sourcemap: false,
    },
  };
});
