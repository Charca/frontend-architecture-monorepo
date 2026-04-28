import { fileURLToPath } from "node:url";
import path from "node:path";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export function reactViteConfig({ dirname = process.cwd(), plugins = [], alias = {} } = {}) {
  return defineConfig({
    plugins: [react(), tailwindcss(), ...plugins],
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
