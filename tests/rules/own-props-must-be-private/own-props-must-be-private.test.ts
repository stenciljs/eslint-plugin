import path from 'node:path';
import fs from 'node:fs';

import { test } from 'vitest';

import { ruleTester } from '../rule-tester';
import rule from '../../../src/rules/own-props-must-be-private';

test('stencil rules', () => {
  const files = {
    good: path.resolve(__dirname, 'own-props-must-be-private.good.tsx'),
    wrong: path.resolve(__dirname, 'own-props-must-be-private.wrong.tsx'),
    output: path.resolve(__dirname, 'own-props-must-be-private.output.tsx')
  };
  ruleTester.run('own-props-must-be-private', rule, {
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
        errors: 4,
        output: fs.readFileSync(files.output, 'utf8')
      }
    ]
  });
});
