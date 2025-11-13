import fs from 'node:fs';
import path from 'node:path';

import { test } from 'vitest';

import { ruleTester } from '../rule-tester';
import rule from '../../../src/rules/strict-boolean-conditions';

const messagePattern = /This type is not allowed/i;
const errors = (count: number) => Array.from({ length: count }, () => ({ message: messagePattern }));

test('strict-boolean-conditions', () => {
  ruleTester.run('strict-boolean-conditions', rule, {
    valid: [
      {
        code: fs.readFileSync(path.resolve(__dirname, 'valid-with-options.ts'), 'utf8'),
        filename: path.resolve(__dirname, 'valid-with-options.ts'),
        options: [['allow-string', 'allow-number', 'allow-enum', 'allow-any-rhs', 'allow-boolean-or-undefined', 'allow-null-union', 'allow-undefined-union']]
      },
      {
        code: fs.readFileSync(path.resolve(__dirname, 'valid-default.ts'), 'utf8'),
        filename: path.resolve(__dirname, 'valid-default.ts'),
      },
    ],
    invalid: [
      {
        code: fs.readFileSync(path.resolve(__dirname, 'invalid-basic.ts'), 'utf8'),
        filename: path.resolve(__dirname, 'invalid-basic.ts'),
        errors: errors(4)
      },
      {
        code: fs.readFileSync(path.resolve(__dirname, 'invalid-unions.ts'), 'utf8'),
        filename: path.resolve(__dirname, 'invalid-unions.ts'),
        options: [[]],
        errors: errors(2)
      },
      {
        code: fs.readFileSync(path.resolve(__dirname, 'invalid-mixed.ts'), 'utf8'),
        filename: path.resolve(__dirname, 'invalid-mixed.ts'),
        errors: errors(4)
      },
    ],
  });
});

