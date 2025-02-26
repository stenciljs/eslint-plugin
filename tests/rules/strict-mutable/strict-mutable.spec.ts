import path from 'node:path';
import fs from 'node:fs';

import { test } from 'vitest';

import { ruleTester } from '../rule-tester';
import rule from '../../../src/rules/strict-mutable';

test('strict-mutable', () => {
  const files = {
    good: path.resolve(__dirname, 'strict-mutable.good.tsx'),
    wrong: path.resolve(__dirname, 'strict-mutable.wrong.tsx')
  };
  ruleTester.run('strict-mutable', rule, {
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
