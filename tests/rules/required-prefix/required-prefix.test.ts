import path from 'node:path';
import fs from 'node:fs';

import { test } from 'vitest';

import { ruleTester } from '../rule-tester';
import rule from '../../../src/rules/required-prefix';

test('required-prefix', () => {
  const files = {
    good: path.resolve(__dirname, 'required-prefix.good.tsx'),
    wrong: path.resolve(__dirname, 'required-prefix.wrong.tsx')
  };
  const options = [['app-', 'me-']];
  ruleTester.run('required-prefix', rule, {
    valid: [
      {
        code: fs.readFileSync(files.good, 'utf8'),
        options,
        filename: files.good
      }
    ],

    invalid: [
      {
        code: fs.readFileSync(files.wrong, 'utf8'),
        options,
        filename: files.wrong,
        errors: 1
      }
    ]
  });
});
