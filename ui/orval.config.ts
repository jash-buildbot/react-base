import { defineConfig } from "orval";
const input = {
  target: "./petstore.json",
  validation: false,
};
const hooks = { afterAllFilesWrite: "prettier --write" };
const hookOverrides = {};
const zodSchemaOverrides = {};

export default defineConfig({
  hooksGen: {
    input,
    output: {
      target: "src/services/hooks.ts",
      schemas: "src/services/types",
      client: "react-query",
      mock: false,
      override: hookOverrides,
    },
    hooks
  },
  zodSchemaGen: {
    output: {
      client: "zod",
      target: "./src/services/zodSchemas.ts",
      override: zodSchemaOverrides,
    },
    input,
    hooks
  },
});
