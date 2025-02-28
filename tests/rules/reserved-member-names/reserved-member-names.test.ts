import path from 'node:path';
import fs from 'node:fs';

import { test } from 'vitest';

import { ruleTester } from '../rule-tester';
import rule from '../../../src/rules/reserved-member-names';

test('reserved-member-names', () => {
  const files = {
    good: path.resolve(__dirname, 'reserved-member-names.good.tsx'),
    wrong: path.resolve(__dirname, 'reserved-member-names.wrong.tsx')
  };
  ruleTester.run('reserved-member-names', rule, {
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
        errors: 10
      }
    ]
  });
});
