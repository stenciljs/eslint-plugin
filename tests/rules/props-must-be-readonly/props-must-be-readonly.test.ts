import path from 'node:path';
import fs from 'node:fs';

import { test } from 'vitest';

import { ruleTester } from '../rule-tester';
import rule from '../../../src/rules/props-must-be-readonly';

test('props-must-be-readonly', () => {
  const files = {
    good: path.resolve(__dirname, 'props-must-be-readonly.good.tsx'),
    wrong: path.resolve(__dirname, 'props-must-be-readonly.wrong.tsx')
  };
  const validCode = fs.readFileSync(files.good, 'utf8');

  ruleTester.run('props-must-be-readonly', rule, {
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
        output: validCode
      }
    ]
  });
});
