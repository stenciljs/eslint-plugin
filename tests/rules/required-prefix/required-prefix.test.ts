import path from "node:path";
import fs from "node:fs";

import { test } from "vitest";

import { ruleTester } from "../rule-tester";
import rule from "../../../src/rules/required-prefix";

test("required-prefix", () => {
  const files = {
    good: path.resolve(import.meta.dirname, "required-prefix.good.tsx"),
    wrong: path.resolve(import.meta.dirname, "required-prefix.wrong.tsx"),
  };
  const options = [["app-", "me-"]];
  ruleTester.run("required-prefix", rule, {
    valid: [
      {
        code: fs.readFileSync(files.good, "utf8"),
        options,
        filename: files.good,
      },
    ],

    invalid: [
      {
        code: fs.readFileSync(files.wrong, "utf8"),
        options,
        filename: files.wrong,
        errors: 1,
      },
    ],
  });
});

test("required-prefix with options that are not static", () => {
  const filename = path.resolve(import.meta.dirname, "required-prefix.good.tsx");
  const options = [["app-"]];

  ruleTester.run("required-prefix", rule, {
    valid: [
      { code: `@Component({ tag: 'app-tag', styles: CSS }) export class A {}`, filename, options },
      { code: `@Component({ tag: TAG }) export class A {}`, filename, options },
      { code: `@Component(options) export class A {}`, filename, options },
    ],
    invalid: [
      {
        code: `@Component({ tag: 'sample-tag', styles: CSS }) export class A {}`,
        filename,
        options,
        errors: 1,
      },
    ],
  });
});
