import rule from '../../../../src/rules/enforce-slot-jsdoc';
import { ruleTester } from '../rule-tester';
import * as path from 'path';
import * as fs from 'fs';

describe('stencil rules', () => {
  const files = {
    good: path.resolve(__dirname, 'enforce-slot-jsdoc.good.tsx'),
    wrong: path.resolve(__dirname, 'enforce-slot-jsdoc.wrong.tsx')
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
      }
    ]
  });
});
