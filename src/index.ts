/**
 * @fileoverview ESLint rules specific to Stencil JS projects.
 * @author Tom Chinery &lt;tom.chinery@addtoevent.co.uk&gt;
 */

import { createRequire } from "node:module";
import type { Linter } from "eslint";
import rules from "./rules";
import configs from "./configs";

const plugin = {
  rules,
  configs,
};

const FLAT_FILES = ["**/*.ts", "**/*.tsx"];

let flat: Record<string, Linter.Config> | undefined;

// `eslint-plugin-react` and `@typescript-eslint/parser` are only needed by the flat
// ESLint configs below - resolved lazily so that consumers who only need `rules`/`configs`
// (e.g. oxlint's `jsPlugins` loader, which imports this same module) aren't forced to have
// ESLint's peer deps installed just to load the plugin.
Object.defineProperty(configs, "flat", {
  enumerable: true,
  configurable: true,
  get(): Record<string, Linter.Config> {
    if (!flat) {
      const require = createRequire(import.meta.url);
      const react = require("eslint-plugin-react");
      // Only `strict` references `@typescript-eslint/*` rule IDs (semi, brace-style,
      // func-call-spacing, plus a handful reset to "off") - ESLint's flat config validates
      // every rule key against a registered plugin regardless of severity, so this has to be
      // registered under the `@typescript-eslint` namespace even for the "off" entries.
      const typescriptEslint = require("@typescript-eslint/eslint-plugin");

      const languageOptions: Linter.Config["languageOptions"] = {
        parser: require("@typescript-eslint/parser"),
        parserOptions: configs.base.overrides[0].parserOptions,
      };

      // Flat config has no equivalent of the legacy `extends: ["plugin:stencil/base"]`
      // chain, so each tier's rules are merged in here to preserve the same
      // base -> recommended -> strict cascade the .eslintrc configs describe.
      const baseRules = configs.base.overrides[0].rules;
      const recommendedRules = { ...baseRules, ...configs.recommended.rules };
      const strictRules = { ...recommendedRules, ...configs.strict.rules };

      flat = {
        base: {
          files: FLAT_FILES,
          plugins: { stencil: plugin },
          rules: baseRules,
          languageOptions,
        },
        recommended: {
          files: FLAT_FILES,
          plugins: { react, stencil: plugin },
          rules: recommendedRules,
          languageOptions,
        },
        strict: {
          files: FLAT_FILES,
          plugins: { react, stencil: plugin, "@typescript-eslint": typescriptEslint },
          rules: strictRules,
          languageOptions,
        },
      };
    }
    return flat;
  },
});

export default plugin;
