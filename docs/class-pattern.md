# class-pattern

Ensures that a Component's `class name` have a valid pattern.

## Config

An object containing:

- `pattern`: the pattern to match with class name
- `ignoreCase`: **true** if you want to ignore case sensitive in pattern match

### Config examples

```json
{ "@stencil/class-pattern": ["error", { "pattern": "^(?!NoStart).*Component$", "ignoreCase": true }] }
```

## Schema

```json
{
  "type": "object",
  "properties": {
    "pattern": {
      "type": "string"
    },
    "ignoreCase": {
      "type": "boolean",
      "required": false
    }
  },
  "additionalProperties": false
}
```
