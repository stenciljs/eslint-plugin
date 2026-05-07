import path from 'node:path';
import fs from 'node:fs';

import { test } from 'vitest';

import rule from '../../../src/rules/enforce-slot-jsdoc';
import { ruleTester } from '../rule-tester';

test('stencil rules', () => {
  const files = {
    good: path.resolve(__dirname, 'enforce-slot-jsdoc.good.tsx'),
    wrong: path.resolve(__dirname, 'enforce-slot-jsdoc.wrong.tsx'),
    noJsdoc: path.resolve(__dirname, 'enforce-slot-jsdoc.no-jsdoc.tsx'),
  };
  const validCode = fs.readFileSync(files.good, 'utf8');

  ruleTester.run('enforce-slot-jsdoc', rule, {
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
        errors: 3,
      },
      {
        code: fs.readFileSync(files.noJsdoc, 'utf8'),
        filename: files.noJsdoc,
        errors: 2, // <default> and header slots not documented
      }
    ]
  });
});