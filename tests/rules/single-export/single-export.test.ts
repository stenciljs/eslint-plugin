import path from 'node:path';
import fs from 'node:fs';

import { test } from 'vitest';

import { ruleTester } from '../rule-tester';
import { ruleTesterNoTypeInfo } from '../rule-tester-no-typeinfo';
import rule from '../../../src/rules/single-export';

test('single-export', () => {
  const files = {
    good: path.resolve(__dirname, 'single-export.good.tsx'),
    wrong: path.resolve(__dirname, 'single-export.wrong.tsx')
  };
  ruleTester.run('single-export', rule, {
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
        errors: 2
      }
    ]
  });
});

test('single-export (no type info)', () => {
  ruleTesterNoTypeInfo.run('single-export', rule, {
    valid: [
      {
        code: `@Component({ tag: 'sample-tag' })
export class SampleTag {
  render() {
    return (<div>test</div>);
  }
}`,
        filename: 'valid.tsx'
      },
      {
        // Type exports are allowed
        code: `@Component({ tag: 'sample-tag' })
export class SampleTag {
  render() {
    return (<div>test</div>);
  }
}
export type SampleProps = { name: string };`,
        filename: 'valid-type.tsx'
      }
    ],
    invalid: [
      {
        code: `@Component({ tag: 'sample-tag' })
export class SampleTag {
  render() {
    return (<div>test</div>);
  }
}

export const helper = () => {};`,
        filename: 'invalid.tsx',
        errors: 1
      },
      {
        code: `@Component({ tag: 'sample-tag' })
export class SampleTag {
  render() {
    return (<div>test1</div>);
  }
}

@Component({ tag: 'sample-other-tag' })
export class SampleOtherTag {
  render() {
    return (<div>test2</div>);
  }
}`,
        filename: 'invalid-two-components.tsx',
        errors: 2
      }
    ]
  });
});
