import { test } from "vitest";

import { ruleTesterNoTypeInfo } from "./rule-tester-no-typeinfo";
import asyncMethods from "../../src/rules/async-methods";
import renderReturnsHost from "../../src/rules/render-returns-host";
import strictBooleanConditions from "../../src/rules/strict-boolean-conditions";

const stencilComponent = `
export class MyComponent {
  render() {
    return <div>hello</div>;
  }
}
`;

test("async-methods skips gracefully without type info", () => {
  ruleTesterNoTypeInfo.run("async-methods", asyncMethods, {
    valid: [{ code: stencilComponent }],
    invalid: [],
  });
});

test("render-returns-host skips gracefully without type info", () => {
  ruleTesterNoTypeInfo.run("render-returns-host", renderReturnsHost, {
    valid: [{ code: stencilComponent }],
    invalid: [],
  });
});

test("strict-boolean-conditions skips gracefully without type info", () => {
  ruleTesterNoTypeInfo.run("strict-boolean-conditions", strictBooleanConditions, {
    valid: [{ code: stencilComponent }],
    invalid: [],
  });
});
