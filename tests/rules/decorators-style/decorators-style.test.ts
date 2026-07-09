import path from "node:path";
import fs from "node:fs";

import { test } from "vitest";

import { ruleTester } from "../rule-tester";
import rule from "../../../src/rules/decorators-style";

test("decorators-style", () => {
  const files = {
    good: path.resolve(import.meta.dirname, "decorators-style.good.tsx"),
    wrong: path.resolve(import.meta.dirname, "decorators-style.wrong.tsx"),
  };
  const options = [
    {
      prop: "inline",
      state: "inline",
      element: "inline",
      event: "inline",
      method: "multiline",
      watch: "multiline",
      listen: "multiline",
    },
  ];
  ruleTester.run("decorators-style", rule, {
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
        errors: 5,
      },
    ],
  });
});

test("decorators-style detects multiline violation with adjacent decorator on same line", () => {
  const options = [
    {
      watch: "multiline",
      listen: "multiline",
    },
  ];
  ruleTester.run("decorators-style-mixed", rule, {
    valid: [
      {
        // Each decorator on its own line — valid multiline
        code: `
@Component({ tag: 'sample-tag' })
export class SampleTag {
  @Prop() test?: string;

  @Listen('click')
  @Watch('test')
  watchForTest() {}

  render() {
    return (<div>test</div>);
  }
}`,
        options,
        filename: path.resolve(import.meta.dirname, "decorators-style.good.tsx"),
      },
    ],

    invalid: [
      {
        // Both on same line — @Listen should be flagged (next is @Watch on same line)
        code: `
@Component({ tag: 'sample-tag' })
export class SampleTag {
  @Prop() test?: string;

  @Listen('click') @Watch('test')
  watchForTest() {}

  render() {
    return (<div>test</div>);
  }
}`,
        options,
        filename: path.resolve(import.meta.dirname, "decorators-style.wrong.tsx"),
        errors: 1, // @Listen flagged; @Watch has newline after it (member on next line)
      },
    ],
  });
});
