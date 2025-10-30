import fs from 'node:fs';
import path from 'node:path';

import { test } from 'vitest';

import { ruleTester } from '../rule-tester';
import rule from '../../../src/rules/ban-side-effects';

test('ban-side-effects', () => {
  const fixtures = {
    good: path.resolve(__dirname, 'ban-side-effects.good.ts'),
    bad: path.resolve(__dirname, 'ban-side-effects.bad.ts'),
    spec: path.resolve(__dirname, 'ban-side-effects.spec.ts'),
    e2e: path.resolve(__dirname, 'ban-side-effects.e2e.ts'),
    createStore: path.resolve(__dirname, 'ban-side-effects.create-store.ts'),
  };

  ruleTester.run('ban-side-effects', rule, {
    valid: [
      {
        code: fs.readFileSync(fixtures.good, 'utf8'),
        filename: fixtures.good,
      },
      {
        code: fs.readFileSync(fixtures.bad, 'utf8'),
        filename: fixtures.bad,
        options: [['initApp']],
      },
      {
        code: fs.readFileSync(fixtures.spec, 'utf8'),
        filename: fixtures.spec,
      },
      {
        code: fs.readFileSync(fixtures.e2e, 'utf8'),
        filename: fixtures.e2e,
      },
    ],
    invalid: [
      {
        code: fs.readFileSync(fixtures.bad, 'utf8'),
        filename: fixtures.bad,
        errors: 1,
      },
      {
        code: fs.readFileSync(fixtures.createStore, 'utf8'),
        filename: fixtures.createStore,
        options: [[]],
        errors: 1,
      },
    ],
  });
});

