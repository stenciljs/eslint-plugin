import { defineConfig } from "rolldown";
import { dts } from "rolldown-plugin-dts";

const external = [
  "eslint",
  "typescript",
  "tsutils",
  "jsdom",
  "eslint-utils",
  "eslint-plugin-react",
  "@stencil/cli",
  /^node:/,
];

const input = {
  index: "src/index.ts",
  wizard: "src/wizard.ts",
};
const sourcemap = true;

export default defineConfig({
  input,
  output: {
    dir: "dist",
    format: "esm",
    sourcemap,
    entryFileNames: "[name].js",
  },
  external,
  plugins: [dts({ sourcemap: true })],
});
