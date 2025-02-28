import path from 'node:path';
import fs from 'node:fs';

import { test } from 'vitest';

import { ruleTester } from '../rule-tester';
import rule from '../../../src/rules/async-methods';

test('async-methods', () => {
  const files = {
    good: path.resolve(__dirname, 'async-methods.good.tsx'),
    wrong: path.resolve(__dirname, 'async-methods.wrong.tsx')
  };
  const validCode = fs.readFileSync(files.good, 'utf8');

  ruleTester.run('async-methods', rule, {
    valid: [
      {
        code: validCode,
        filename: files.good
      }
    ],

    invalid: [
      {
        code: fs.readFileSync(files.wrong, 'utf8'),
        filename: files.wrong,
        errors: 1,
        output: validCode,
      }
    ]
  });
});
