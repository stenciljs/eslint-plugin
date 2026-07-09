import path from "node:path";
import fs from "node:fs";

import { test } from "vitest";

import { ruleTester } from "../rule-tester";
import rule from "../../../src/rules/element-type";

test("element-type", () => {
  const files = {
    good: path.resolve(import.meta.dirname, "element-type.good.tsx"),
    wrong: path.resolve(import.meta.dirname, "element-type.wrong.tsx"),
    explicitAny: path.resolve(import.meta.dirname, "element-type.explicit-any.tsx"),
    missingTypeAnnotation: path.resolve(
      import.meta.dirname,
      "element-type.missing-type-annotation.tsx",
    ),
  };
  const validCode = fs.readFileSync(files.good, "utf8");

  ruleTester.run("element-type", rule, {
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
      {
        code: fs.readFileSync(files.explicitAny, "utf8"),
        filename: files.explicitAny,
        errors: 1,
        output: validCode,
      },
      {
        code: fs.readFileSync(files.missingTypeAnnotation, "utf8"),
        filename: files.missingTypeAnnotation,
        errors: 1,
        output: validCode,
      },
    ],
  });
});
