import path from "node:path";
import { fileURLToPath } from "node:url";
import { createViteConfig } from "@commerceos/tooling/vite";

const appRoot = path.dirname(fileURLToPath(import.meta.url));

export default createViteConfig({ appRoot, sourceRoot: path.resolve(appRoot, "../app-shell/src") });
