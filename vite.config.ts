import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import tailwind from "@tailwindcss/vite";
import path from "node:path";
import basicSsl from "@vitejs/plugin-basic-ssl";

// @ts-expect-error no type
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const { VITE_SERVER_URL, VITE_QUEUE_URL } = env;

  return {
    plugins: [react(), tailwind(), basicSsl()],
    resolve: {
      alias: { "@": path.resolve(__dirname, "src") },
    },
    server: {
      https: true,
      port: 3001,
      proxy: {
        "^/api/.*": {
          target: VITE_SERVER_URL,
          changeOrigin: true,
          secure: false,
        },

        "^/auth-api/.*": {
          target: VITE_SERVER_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (p) => p.replace(/^\/auth-api/, ""),
        },

        "^/sse/.*": {
          target: VITE_QUEUE_URL,
          changeOrigin: true,
          secure: false,
          rewrite: (p) => p.replace(/^\/sse/, ""),
        },
      },
    },
  };
});
