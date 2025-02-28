import path from 'node:path';
import fs from 'node:fs';

import { test } from 'vitest';

import rule from '../../../src/rules/methods-must-be-public';
import { ruleTester } from '../rule-tester';

test('methods-must-be-public', () => {
  const files = {
    good: path.resolve(__dirname, 'methods-must-be-public.good.tsx'),
    wrong: path.resolve(__dirname, 'methods-must-be-public.wrong.tsx')
  };
  ruleTester.run('methods-must-be-public', rule, {
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
