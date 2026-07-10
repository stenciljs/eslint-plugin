# @stencil/eslint-plugin

ESLint rules specific to Stencil JS projects.

## Installation

Install this plugin in your project via:

```bash
npm i --save-dev @stencil/eslint-plugin
```

## Usage

### Configuration (new: eslint.config.*)

The plugin exports 3 flat configs for use with eslint >= 9:

- flat.base
- flat.recommended
- flat.strict

```js
// eslint.config.mjs
import stencil from '@stencil/eslint-plugin';

export default [
  ...
  stencil.configs.flat.recommended,
  ...
];
```

Alternatively:

```js
// eslint.config.js
const stencil = require('@stencil/eslint-plugin');

module.exports = [
  ...
  stencil.configs.flat.recommended,
  ...
];
```

Exclude
directories created by the Stencil compilation process with an `ignores` entry instead:

```js
// eslint.config.js
import stencil from "@stencil/eslint-plugin";

export default [{ ignores: ["dist", "loader", "www"] }, stencil.configs.flat.recommended];
```

Lint all your project:

```sh
npm run lint
```

### Configuration (oxlint)

This plugin can also run under [oxlint](https://oxc.rs/docs/guide/usage/linter.html) via its `jsPlugins`
support, instead of ESLint:

```bash
npm i --save-dev oxlint @stencil/eslint-plugin
```

```json
// .oxlintrc.json
{
  "jsPlugins": [{ "name": "stencil", "specifier": "@stencil/eslint-plugin" }],
  "rules": {
    "stencil/async-methods": "error",
    "stencil/methods-must-be-public": "error"
  }
}
```

TypeScript type information (e.g. type-aware checks in `async-methods`) run in a degraded, type-blind
mode under oxlint, since oxlint doesn't do type resolution.

```sh
npx oxlint .
```

### Configuration (legacy: .eslintrc*)

Only works on ESLint 8, or ESLint 9 with the `ESLINT_USE_FLAT_CONFIG=false` environment variable set -
ESLint no longer reads `.eslintrc.*` files by default, and that escape hatch is removed entirely in
ESLint 10. Use the [flat config](#configuration-new-eslintconfig) above unless you have a specific
reason not to.

`.eslintrc.json` configuration file:

```json
{
  "parserOptions": {
    "project": "./tsconfig.json"
  },
  "extends": ["plugin:stencil/recommended"]
}
```

## Supported Rules

- [`stencil/async-methods`](./docs/async-methods.md)

This rule catches Stencil public methods that are not async.

- [`stencil/ban-default-true`](./docs/ban-default-true.md)

This rule catches Stencil Props with a default value of `true`.

- [`stencil/ban-prefix`](./docs/ban-prefix.md)

This rule catches Stencil Component banned tag name prefix.

- [`stencil/class-pattern`](./docs/class-pattern.md)

This rule catches Stencil Component class name not matching configurable pattern.

- [`stencil/decorators-context`](./docs/decorators-context.md)

This rule catches Stencil decorators in bad locations.

- [`stencil/decorators-style`](./docs/decorators-style.md)

This rule catches Stencil decorators style usage.

- [`stencil/element-type`](./docs/element-type.md)

This rule catches Stencil Element decorator have the correct type.

- [`stencil/host-data-deprecated`](./docs/host-data-deprecated.md)

This rule catches Stencil method hostData.

- [`stencil/methods-must-be-public`](./docs/methods-must-be-public.md)

This rule catches Stencil Methods marked as private or protected.

- [`stencil/no-unused-watch`](./docs/no-unused-watch.md)

This rule catches Stencil Watchs with non existing Props or States.

- [`stencil/own-methods-must-be-private`](./docs/own-methods-must-be-private.md)

This rule catches own class methods marked as public.

- [`stencil/own-props-must-be-private`](./docs/own-props-must-be-private.md)

This rule catches own class properties marked as public.

- [`stencil/prefer-vdom-listener`](./docs/prefer-vdom-listener.md)

This rule catches Stencil Listen with vdom events.

- [`stencil/props-must-be-public`](./docs/props-must-be-public.md)

This rule catches Stencil Props marked as private or protected.

- [`stencil/props-must-be-readonly`](./docs/props-must-be-readonly.md)

This rule catches Stencil Props marked as non readonly, excluding mutable ones.

- [`stencil/render-returns-host`](./docs/render-returns-host.md)

This rule catches Stencil Render returning array instead of Host tag.

- [`stencil/required-jsdoc`](./docs/required-jsdoc.md)

This rule catches Stencil Props, Methods and Events to define jsdoc.

- [`stencil/required-prefix`](./docs/required-prefix.md)

This rule catches Stencil Component required tag name prefix.

- [`stencil/reserved-member-names`](./docs/reserved-member-names.md)

This rule catches Stencil Prop names that share names of Global HTML Attributes.

- [`stencil/single-export`](./docs/single-export.md)

This rule catches modules that expose more than just the Stencil Component itself.

- [`stencil/strict-mutable`](./docs/strict-mutable.md)

This rule catches Stencil Prop marked as mutable but not changing value in code.

## Recommended rules

```json
{
  "stencil/async-methods": "error",
  "stencil/ban-prefix": ["error", ["stencil", "stnl", "st"]],
  "stencil/decorators-context": "error",
  "stencil/decorators-style": [
    "error",
    {
      "prop": "inline",
      "state": "inline",
      "element": "inline",
      "event": "inline",
      "method": "multiline",
      "watch": "multiline",
      "listen": "multiline"
    }
  ],
  "stencil/element-type": "error",
  "stencil/host-data-deprecated": "error",
  "stencil/methods-must-be-public": "error",
  "stencil/no-unused-watch": "error",
  "stencil/own-methods-must-be-private": "error",
  "stencil/own-props-must-be-private": "error",
  "stencil/prefer-vdom-listener": "error",
  "stencil/props-must-be-public": "error",
  "stencil/props-must-be-readonly": "error",
  "stencil/render-returns-host": "error",
  "stencil/required-jsdoc": "error",
  "stencil/reserved-member-names": "error",
  "stencil/single-export": "error",
  "stencil/strict-mutable": "error"
}
```

## Contributing

When submitting new rules please:

- Describe your new rule in the README.md
- Provide a suite of unit tests for your rule
- Follow ESLint Rule guidelines (the [eslint-rule yeoman generator](https://github.com/eslint/generator-eslint) is good for this)

All contributions welcome.

## License

- [MIT](https://raw.githubusercontent.com/stenciljs/eslint-plugin/refs/heads/main/LICENSE.md)
