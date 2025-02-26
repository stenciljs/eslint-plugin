import path from 'node:path';
import fs from 'node:fs';

import { test } from 'vitest';

import { ruleTester } from '../rule-tester';
import rule from '../../../src/rules/required-jsdoc';

test('required-jsdoc', () => {
  const files = {
    good: path.resolve(__dirname, 'required-jsdoc.good.tsx'),
    wrong: path.resolve(__dirname, 'required-jsdoc.wrong.tsx')
  };
  ruleTester.run('required-jsdoc', rule, {
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
        errors: 6
      }
    ]
  });
});
