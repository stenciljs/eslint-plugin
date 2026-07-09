import path from "node:path";
import fs from "node:fs";

import { test } from "vitest";

import { ruleTester } from "../rule-tester";
import rule from "../../../src/rules/single-export";

test("single-export", () => {
  const files = {
    good: path.resolve(import.meta.dirname, "single-export.good.tsx"),
    wrong: path.resolve(import.meta.dirname, "single-export.wrong.tsx"),
    typeOnlyExports: path.resolve(import.meta.dirname, "single-export.type-only-exports.tsx"),
    localInterfaceSpecifier: path.resolve(
      import.meta.dirname,
      "single-export.local-interface-specifier.tsx",
    ),
    extraValueExport: path.resolve(import.meta.dirname, "single-export.extra-value-export.tsx"),
    extraDefaultExport: path.resolve(import.meta.dirname, "single-export.extra-default-export.tsx"),
    exportAll: path.resolve(import.meta.dirname, "single-export.export-all.tsx"),
    noComponent: path.resolve(import.meta.dirname, "single-export.no-component.tsx"),
  };
  ruleTester.run("single-export", rule, {
    valid: [
      {
        code: fs.readFileSync(files.good, "utf8"),
        filename: files.good,
      },
      {
        // interfaces/type aliases are exempt -- they don't affect bundling
        code: fs.readFileSync(files.typeOnlyExports, "utf8"),
        filename: files.typeOnlyExports,
      },
      {
        // a local (non-exported) interface re-exported via a specifier is still type-only
        code: fs.readFileSync(files.localInterfaceSpecifier, "utf8"),
        filename: files.localInterfaceSpecifier,
      },
      {
        // files without any @Component() class are out of scope for this rule
        code: fs.readFileSync(files.noComponent, "utf8"),
        filename: files.noComponent,
      },
    ],

    invalid: [
      {
        code: fs.readFileSync(files.wrong, "utf8"),
        filename: files.wrong,
        errors: 2,
      },
      {
        // a plain value export alongside the component is a violation
        code: fs.readFileSync(files.extraValueExport, "utf8"),
        filename: files.extraValueExport,
        errors: 1,
      },
      {
        // a default export alongside the component is also a violation
        code: fs.readFileSync(files.extraDefaultExport, "utf8"),
        filename: files.extraDefaultExport,
        errors: 1,
      },
      {
        // re-exporting everything from another module is a violation
        code: fs.readFileSync(files.exportAll, "utf8"),
        filename: files.exportAll,
        errors: 1,
      },
    ],
  });
});
