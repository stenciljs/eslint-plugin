# decorators-style

Ensures that all Stencil decorators are used in a consistent style.

## Config

One argument which is an object with the keys `"prop"`, `"state"`, `"element"`, `"event"`, `"method"`, `"watch"`, `"listen"`.
All of it can be set to a string, which must be one of the following values:

- `"inline"`
- `"multiline"`
- `"ignore"`

A member is considered “multiline” if its declaration is on a line after the last decorator.
If decorators are composed (multiple decorators for a single declaration), "multiline" requires each decorator to be on its own line.


### Config examples

```json
{ "@stencil/decorators-style": ["error", { "prop": "inline", "method": "multiline" }] }
```

## Schema

```json
{
  "type": "array",
  "items": {
    "type": "string"
  }
}
```

> Fix included
