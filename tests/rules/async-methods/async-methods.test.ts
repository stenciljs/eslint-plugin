import path from "node:path";
import fs from "node:fs";

import { test } from "vitest";

import { ruleTester } from "../rule-tester";
import rule from "../../../src/rules/async-methods";

test("async-methods", () => {
  const files = {
    good: path.resolve(import.meta.dirname, "async-methods.good.tsx"),
    wrong: path.resolve(import.meta.dirname, "async-methods.wrong.tsx"),
  };
  const validCode = fs.readFileSync(files.good, "utf8");

  ruleTester.run("async-methods", rule, {
    valid: [
      {
        code: validCode,
        filename: files.good,
      },
    ],

    invalid: [
      {
        code: fs.readFileSync(files.wrong, "utf8"),
        filename: files.wrong,
        errors: 1,
        output: validCode,
      },
    ],
  });
});

const filename = path.resolve(import.meta.dirname, "async-methods.wrong.tsx");
const component = (method: string) => `@Component({ tag: "sample-tag" }) class A { ${method} }`;

test("async-methods with a type that can't be resolved", () => {
  ruleTester.run("async-methods", rule, {
    valid: [{ code: component("@Method() async foo(): Unresolved {}"), filename }],
    invalid: [{ code: component("@Method() foo(): Unresolved {}"), filename, errors: 1 }],
  });
});

test("async-methods fix", () => {
  const fixed = (before: string, after: string) => ({
    code: component(before),
    output: component(after),
    filename,
    errors: 1,
  });
  const notFixed = (method: string) => ({
    code: component(method),
    output: null,
    filename,
    errors: 1,
  });

  ruleTester.run("async-methods", rule, {
    valid: [],
    invalid: [
      fixed("@Method() foo() {}", "@Method() async foo() {}"),
      fixed("@Method()\n foo() {}", "@Method()\n async foo() {}"),
      fixed("@Method()\r\n foo() {}", "@Method()\r\n async foo() {}"),
      fixed("@Method() public foo() {}", "@Method() public async foo() {}"),
      fixed("@Method() protected foo() {}", "@Method() protected async foo() {}"),
      fixed("@Method() @Other() foo() {}", "@Method() @Other() async foo() {}"),
      fixed("@Method() // note\n foo() {}", "@Method() // note\n async foo() {}"),
      fixed("/** Doc */ @Method() foo() {}", "/** Doc */ @Method() async foo() {}"),
      fixed("@Method() static foo() {}", "@Method() static async foo() {}"),
      fixed("@Method() ['foo']() {}", "@Method() async ['foo']() {}"),
      fixed("@Method() [('foo')]() {}", "@Method() async [('foo')]() {}"),
      notFixed("@Method() foo(): string { return ''; }"),
      notFixed("@Method() *foo() {}"),
      notFixed("@Method() async *foo() {}"),
      notFixed("@Method() get foo() { return 1; }"),
    ],
  });
});
