import path from 'node:path';
import fs from 'node:fs';

import { test } from 'vitest';

import { ruleTester } from '../rule-tester';
import rule from '../../../src/rules/strict-mutable';

test('strict-mutable', () => {
  const files = {
    good: path.resolve(__dirname, 'strict-mutable.good.tsx'),
    wrong: path.resolve(__dirname, 'strict-mutable.wrong.tsx'),
    nonComponent: path.resolve(__dirname, 'strict-mutable.non-component.tsx'),
    inlineValid: path.resolve(__dirname, 'strict-mutable.inline-valid.tsx'),
    missingAssignment: path.resolve(__dirname, 'strict-mutable.missing-assignment.tsx')
  };
  ruleTester.run('strict-mutable', rule, {
    valid: [
      {
        code: fs.readFileSync(files.good, 'utf8'),
        filename: files.good
      },
      {
        code: fs.readFileSync(files.nonComponent, 'utf8'),
        filename: files.nonComponent
      },
      {
        code: fs.readFileSync(files.inlineValid, 'utf8'),
        filename: files.inlineValid
      }
    ],

    invalid: [
      {
        code: fs.readFileSync(files.wrong, 'utf8'),
        filename: files.wrong,
        errors: 2
      },
      {
        code: fs.readFileSync(files.missingAssignment, 'utf8'),
        filename: files.missingAssignment,
        errors: 1
      }
    ]
  });
});
