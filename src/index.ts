/**
 * @fileoverview ESLint rules specific to Stencil JS projects.
 * @author Tom Chinery &lt;tom.chinery@addtoevent.co.uk&gt;
 */

// @ts-expect-error - no types
import react from 'eslint-plugin-react';
import rules from './rules';
import configs from './configs';

const plugin = {
  rules,
  configs
};

const flatBase = {
  plugins: { '@stencil': plugin },
  rules: configs.base.overrides[0].rules,
  languageOptions: { parserOptions: configs.base.overrides[0].parserOptions },
}

const flatRecommended = {
  plugins: { 
    react: react, 
    '@stencil': plugin 
  },
  rules: configs.recommended.rules,
  languageOptions: { parserOptions: configs.base.overrides[0].parserOptions },
}

const flatStrict = {
  plugins: { 
    react: react, 
    '@stencil': plugin 
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
