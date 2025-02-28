import path from 'node:path';
import fs from 'node:fs';

import { test } from 'vitest';

import { ruleTester } from '../rule-tester';
import rule from '../../../src/rules/no-unused-watch';

test('no-unused-watch', () => {
  const files = {
    good: path.resolve(__dirname, 'no-unused-watch.good.tsx'),
    wrong: path.resolve(__dirname, 'no-unused-watch.wrong.tsx')
  };
  ruleTester.run('no-unused-watch', rule, {
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
