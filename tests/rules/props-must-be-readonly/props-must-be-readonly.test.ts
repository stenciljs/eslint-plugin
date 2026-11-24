import path from "node:path";
import fs from "node:fs";

import { test } from "vitest";

import { ruleTester } from "../rule-tester";
import rule from "../../../src/rules/props-must-be-readonly";

test("props-must-be-readonly", () => {
  const files = {
    good: path.resolve(import.meta.dirname, "props-must-be-readonly.good.tsx"),
    wrong: path.resolve(import.meta.dirname, "props-must-be-readonly.wrong.tsx"),
  };
  const validCode = fs.readFileSync(files.good, "utf8");

  ruleTester.run("props-must-be-readonly", rule, {
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

test("props-must-be-readonly with options that are not static", () => {
  const filename = path.resolve(import.meta.dirname, "props-must-be-readonly.good.tsx");
  const component = (prop: string) =>
    `@Component({ tag: 'sample-tag' }) export class SampleTag { ${prop} }`;

  ruleTester.run("props-must-be-readonly", rule, {
    valid: [
      {
        code: component("@Prop({ attribute: Attribute.test, mutable: true }) test = '';"),
        filename,
      },
      { code: component("@Prop({ ...options, mutable: true }) test = '';"), filename },
    ],
    invalid: [
      {
        code: component("@Prop({ attribute: Attribute.test }) test = '';"),
        output: component("@Prop({ attribute: Attribute.test }) readonly test = '';"),
        filename,
        errors: 1,
      },
      {
        // the spread may override `mutable`
        code: component("@Prop({ mutable: true, ...options }) test = '';"),
        output: component("@Prop({ mutable: true, ...options }) readonly test = '';"),
        filename,
        errors: 1,
      },
    ],
  });
});
