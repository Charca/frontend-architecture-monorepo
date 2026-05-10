import { createEslintConfig } from "@commerceos/tooling/eslint";

export default createEslintConfig({
  boundaryElements: [
    { type: "authentication", category: "platform", pattern: "src/modules/authentication/**/*", mode: "full" },
    { type: "shared", category: "platform", pattern: "src/shared/**/*", mode: "full" },
    { type: "modules", pattern: "src/modules/*/**/*", capture: ["moduleName"], mode: "full" },
  ],
});
