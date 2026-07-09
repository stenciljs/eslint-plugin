import path from "node:path";
import fs from "node:fs";

import { test } from "vitest";

import rule from "../../../src/rules/enforce-slot-jsdoc";
import { ruleTester } from "../rule-tester";

test("stencil rules", () => {
  const files = {
    good: path.resolve(import.meta.dirname, "enforce-slot-jsdoc.good.tsx"),
    wrong: path.resolve(import.meta.dirname, "enforce-slot-jsdoc.wrong.tsx"),
    noJsdoc: path.resolve(import.meta.dirname, "enforce-slot-jsdoc.no-jsdoc.tsx"),
    hyphenated: path.resolve(import.meta.dirname, "enforce-slot-jsdoc.hyphenated.tsx"),
    hyphenatedWrong: path.resolve(import.meta.dirname, "enforce-slot-jsdoc.hyphenated-wrong.tsx"),
  };

  ruleTester.run("enforce-slot-jsdoc", rule, {
    valid: [
      {
        code: fs.readFileSync(files.good, "utf8"),
        filename: files.good,
      },
      {
        // Hyphenated slot names must be documented using their full name,
        // not just the segment before the first hyphen.
        code: fs.readFileSync(files.hyphenated, "utf8"),
        filename: files.hyphenated,
      },
    ],

    invalid: [
      {
        code: fs.readFileSync(files.wrong, "utf8"),
        filename: files.wrong,
        errors: 3,
      },
      {
        code: fs.readFileSync(files.noJsdoc, "utf8"),
        filename: files.noJsdoc,
        errors: 2, // <default> and header slots not documented
      },
      {
        // Documenting only the first segment of a hyphenated slot name
        // (e.g. @slot brand instead of @slot brand-bar-logo) must not pass.
        code: fs.readFileSync(files.hyphenatedWrong, "utf8"),
        filename: files.hyphenatedWrong,
        errors: 2, // brand-bar-logo not documented, brand not implemented
      },
    ],
  });
});
