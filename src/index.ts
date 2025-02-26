/**
 * @fileoverview ESLint rules specific to Stencil JS projects.
 * @author Tom Chinery &lt;tom.chinery@addtoevent.co.uk&gt;
 */

import type { Linter } from 'eslint';
import react from 'eslint-plugin-react';
import rules from './rules';
import configs from './configs';

const plugin = {
  rules,
  configs
};

const flatBase: Linter.Config = {
  plugins: { 'stencil': plugin },
  rules: configs.base.overrides[0].rules,
  languageOptions: { parserOptions: configs.base.overrides[0].parserOptions },
}

const flatRecommended: Linter.Config = {
  plugins: { 
    react: react, 
    'stencil': plugin 
  },
  rules: configs.recommended.rules,
  languageOptions: { parserOptions: configs.base.overrides[0].parserOptions },
}

const flatStrict: Linter.Config = {
  plugins: { 
    react: react, 
    'stencil': plugin 
  },
  rules: configs.strict.rules,
  languageOptions: { parserOptions: configs.base.overrides[0].parserOptions },
}

configs.flat = {
  base: flatBase,
  recommended: flatRecommended,
  strict: flatStrict,
}

export default plugin;
