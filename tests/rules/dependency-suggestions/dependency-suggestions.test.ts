import fs from 'node:fs';
import path from 'node:path';

import { test } from 'vitest';

import { ruleTester } from '../rule-tester';
import rule from '../../../src/rules/dependency-suggestions';

test('dependency-suggestions', () => {
  const fixtures = {
    good: path.resolve(__dirname, 'dependency-suggestions.good.ts'),
    bad: path.resolve(__dirname, 'dependency-suggestions.bad.ts'),
    custom: path.resolve(__dirname, 'dependency-suggestions.custom.ts'),
  };

  ruleTester.run('dependency-suggestions', rule, {
    valid: [
      {
        code: fs.readFileSync(fixtures.good, 'utf8'),
        filename: fixtures.good,
      },
      {
        code: fs.readFileSync(fixtures.custom, 'utf8'),
        filename: fixtures.custom,
      },
    ],
    invalid: [
      {
        code: fs.readFileSync(fixtures.bad, 'utf8'),
        filename: fixtures.bad,
        errors: 4,
      },
    ],
  });
});

