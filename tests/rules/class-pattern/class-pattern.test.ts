import path from 'node:path';
import fs from 'node:fs';

import { test } from 'vitest';

import { ruleTester } from '../rule-tester';
import rule from '../../../src/rules/class-pattern';

test('class-pattern', () => {
  const files = {
    good: path.resolve(__dirname, 'class-pattern.good.tsx'),
    wrong: path.resolve(__dirname, 'class-pattern.wrong.tsx')
  };
  const options = [{ pattern: '^(?!NoStart).*Component$', ignoreCase: true }];
  ruleTester.run('class-pattern', rule, {
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
