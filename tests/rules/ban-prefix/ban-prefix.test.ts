import path from 'node:path';
import fs from 'node:fs';

import { test } from 'vitest';

import { ruleTester } from '../rule-tester';
import rule from '../../../src/rules/ban-prefix';

test('ban-prefix', () => {
  const files = {
    good: path.resolve(__dirname, 'ban-prefix.good.tsx'),
    wrong: path.resolve(__dirname, 'ban-prefix.wrong.tsx')
  };
  // const options = [['stencil', 'stnl']];
  ruleTester.run('ban-prefix', rule, {
    valid: [
      {
        code: fs.readFileSync(files.good, 'utf8'),
        // options,
        filename: files.good
      }
    ],

    invalid: [
      {
        code: fs.readFileSync(files.wrong, 'utf8'),
        // options,
        filename: files.wrong,
        errors: 1
      }
    ]
  });
});
