import { RuleTester } from "eslint";

/**
 * RuleTester without typescript-eslint parser services.
 * Simulates environments (e.g. oxlint JS plugin runtime) where
 * esTreeNodeToTSNodeMap and program are unavailable.
 */
export const ruleTesterNoTypeInfo = new RuleTester({
  languageOptions: {
    ecmaVersion: 2022,
    sourceType: "module",
    parserOptions: {
      ecmaFeatures: {
        jsx: true,
      },
    },
  },
});
