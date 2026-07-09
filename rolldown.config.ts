import { defineConfig } from "rolldown";
import { dts } from "rolldown-plugin-dts";

const external = [
  "eslint",
  "typescript",
  "tsutils",
  "jsdom",
  "eslint-utils",
  "eslint-plugin-react",
];

const input = "src/index.ts";
const sourcemap = true;

export default defineConfig({
  input,
  output: {
    dir: "dist",
    format: "esm",
    sourcemap,
  },
  external,
  plugins: [dts({ sourcemap: true })],
});
