# enforce-slot-jsdoc

This rule ensures proper slot documentation by verifying:

* Every slot defined in the component has a corresponding @slot JSDoc tag.
* Every @slot JSDoc tag matches a slot in the component.

**Note**: Only slots with static names can be detected for mismatches.

## Config

No config is needed

## Usage

```json
{ "@stencil-community/enforce-slot-jsdoc": "error" }
```
