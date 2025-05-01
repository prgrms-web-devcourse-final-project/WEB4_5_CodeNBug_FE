import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import path from "path";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const { VITE_SERVER_URL } = env;

  return {
    plugins: [react(), tailwind()],
    resolve: {
      alias: { "@": path.resolve(__dirname, "./src") },
    },
    server: {
      port: 3001,
      proxy: {
        "/api": {
          target: VITE_SERVER_URL,
          changeOrigin: true,
        },
      },
    },
  };
});
