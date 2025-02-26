export default {
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:@stencil/recommended",
  ],
  rules: {
    '@stencil/ban-default-true': 2,
    '@stencil/strict-boolean-conditions': 2,

    // Resets
    "@typescript-eslint/camelcase": 0,
    "@typescript-eslint/explicit-function-return-type": 0,
    "@typescript-eslint/ban-ts-ignore": 0,
    "@typescript-eslint/no-this-alias": 0,
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-unused-vars": 0,
    "@typescript-eslint/no-empty-interface": 0,
    "@typescript-eslint/no-use-before-define": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "no-constant-condition": 0,


    // Best practices
    "no-shadow": 2,
    "no-var": 2,
    "prefer-object-spread": 2,
    "no-nested-ternary": 2,
    "no-duplicate-imports": 2,

    // General formatting
    "indent": [2, 2],
    "no-trailing-spaces": 2,
    "curly": [2, "all"],
    "comma-spacing": 2,
    "comma-style": 2,
    "computed-property-spacing": 2,
    "comma-dangle": [2, {
      'objects': 'always-multiline'
    }],
    "func-style": [2, "expression", { "allowArrowFunctions": true }],
    "multiline-ternary": [2, "always-multiline"],
    "operator-linebreak": [2, "after", { "overrides": { "?": "before", ":": "before" } }],
    "linebreak-style": 2,
    "space-in-parens": 2,
    "@typescript-eslint/semi": 2,
    "@typescript-eslint/brace-style": 2,
    "@typescript-eslint/func-call-spacing": 2,

    // JSX formatting
    "react/jsx-closing-tag-location": 2,
    "react/jsx-curly-newline": [2, "never"],
    "react/jsx-closing-bracket-location": 2,
    "react/jsx-curly-spacing": [2, {"when": "never", "children": true}],
    "react/jsx-boolean-value": [2, "never"],
    "react/jsx-child-element-spacing": 2,
    "react/jsx-indent-props": [2, "first"],
    "react/jsx-props-no-multi-spaces": 2,
    "react/jsx-equals-spacing": [2, "never"],
  }
};
