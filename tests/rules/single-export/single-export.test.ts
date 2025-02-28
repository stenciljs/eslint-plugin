import path from 'node:path';
import fs from 'node:fs';

import { test } from 'vitest';

import { ruleTester } from '../rule-tester';
import rule from '../../../src/rules/single-export';

test('single-export', () => {
  const files = {
    good: path.resolve(__dirname, 'single-export.good.tsx'),
    wrong: path.resolve(__dirname, 'single-export.wrong.tsx')
  };
  ruleTester.run('single-export', rule, {
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
        errors: 2
      }
    ]
  });
});
