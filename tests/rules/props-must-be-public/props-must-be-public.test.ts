import path from 'node:path';
import fs from 'node:fs';

import { test } from 'vitest';

import { ruleTester } from '../rule-tester';
import rule from '../../../src/rules/props-must-be-public';

test('props-must-be-public', () => {
  const files = {
    good: path.resolve(__dirname, 'props-must-be-public.good.tsx'),
    wrong: path.resolve(__dirname, 'props-must-be-public.wrong.tsx')
  };
  ruleTester.run('props-must-be-public', rule, {
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
