export default {
  overrides: [
    {
      files: ['*.ts', '*.tsx'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2018,
        sourceType: 'module',
        ecmaFeatures: {
          'jsx': true
        }
      },
      env: {
        es2020: true,
        browser: true,
      },
      plugins: [
        '@stencil'
      ],
      rules: {
        '@stencil/async-methods': 2,
        '@stencil/ban-prefix': [2, ['stencil', 'stnl', 'st']],
        '@stencil/decorators-context': 2,
        '@stencil/element-type': 2,
        '@stencil/host-data-deprecated': 2,
        '@stencil/methods-must-be-public': 2,
        '@stencil/no-unused-watch': 2,
        '@stencil/prefer-vdom-listener': 2,
        '@stencil/props-must-be-public': 2,
        '@stencil/render-returns-host': 2,
        '@stencil/reserved-member-names': 2,
        '@stencil/single-export': 2,
      }
    }
  ],
  settings: {
    "react": {
      // intentionally fill the version field with an invalid semver string. this appears to remove the error/warning
      // emitted to the console when this key/value pair is not in place, but does not tie us to a version of React,
      // even superficially
      "version": "stencil-maintainers-put-an-invalid-version-intentionally-if-this-errors-please-raise-an-issue-https://github.com/stenciljs/eslint-plugin/issues",
    }
  },
};
