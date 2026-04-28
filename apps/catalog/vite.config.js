import { dirnameFromMetaUrl, reactViteConfig } from "@commerceos/tooling/vite/react";

export default reactViteConfig({ dirname: dirnameFromMetaUrl(import.meta.url) });
