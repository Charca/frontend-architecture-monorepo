import { fileURLToPath } from "node:url";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export function reactViteConfig({ dirname = process.cwd(), plugins = [], alias = {} } = {}) {
  const apiTarget = process.env.COMMERCEOS_API_URL ?? "http://localhost:3001";

  return defineConfig({
    plugins: [react(), tailwindcss(), ...plugins],
    server: {
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
    preview: {
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
    resolve: {
      alias: {
        "@": path.resolve(dirname, "./src"),
        ...alias,
      },
    },
  });
}

export function dirnameFromMetaUrl(metaUrl) {
  return path.dirname(fileURLToPath(metaUrl));
}
