import path from 'node:path';
import fs from 'node:fs';

import { test } from 'vitest';

import { ruleTester } from '../rule-tester';
import rule from '../../../src/rules/render-returns-host';

test('render-returns-host', () => {
  const files = {
    good: path.resolve(__dirname, 'render-returns-host.good.tsx'),
    wrong: path.resolve(__dirname, 'render-returns-host.wrong.tsx')
  };
  ruleTester.run('render-returns-host', rule, {
    valid: [
      {
        code: fs.readFileSync(files.good, 'utf8'),
        filename: files.good
      }
    ],

    invalid: [
      {
        code: fs.readFileSync(files.wrong, 'utf8'),
        filename: files.wrong,
        errors: 1
      }
    ]
  });
});
