# required-prefix

Ensures that a Component's `tag` use any of the given prefixes.

## Config

An array of `"string"`s which Component `tag` will be use as a prefix.

### Config examples

```json
{ "@stencil/required-prefix": ["error", ["app"]] }
```

## Schema

```json
{
  "type": "array",
  "items": {
    "type": "string"
  },
  "minLength": 1
}
```
