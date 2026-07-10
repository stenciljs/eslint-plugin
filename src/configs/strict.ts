import type { Linter } from "eslint";

export default {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:stencil/recommended",
  ],
  rules: {
    "stencil/ban-default-true": 2,
    "stencil/strict-boolean-conditions": 2,

    // Resets - the recommended-tier defaults from `@typescript-eslint/recommended` are too
    // aggressive for typical Stencil component code.
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/no-this-alias": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-unused-vars": 0,
    "@typescript-eslint/no-empty-interface": 0,
    "@typescript-eslint/no-use-before-define": 0,
    "@typescript-eslint/no-explicit-any": 0,

    // Best practices
    "no-shadow": 2,
    "no-var": 2,
    "prefer-object-spread": 2,
    "no-nested-ternary": 2,
    "no-duplicate-imports": 2,
    curly: [2, "all"],
  },
} satisfies Linter.BaseConfig;
