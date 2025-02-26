import path from 'node:path';
import fs from 'node:fs';

import { test } from 'vitest';

import { ruleTester } from '../rule-tester';
import rule from '../../../src/rules/prefer-vdom-listener';

test('prefer-vdom-listener', () => {
  const files = {
    good: path.resolve(__dirname, 'prefer-vdom-listener.good.tsx'),
    wrong: path.resolve(__dirname, 'prefer-vdom-listener.wrong.tsx')
  };
  ruleTester.run('prefer-vdom-listener', rule, {
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
        errors: 1
      }
    ]
  });
});
