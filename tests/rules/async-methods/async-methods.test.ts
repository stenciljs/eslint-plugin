import path from 'node:path';
import fs from 'node:fs';

import { test } from 'vitest';

import { ruleTester } from '../rule-tester';
import { ruleTesterNoTypeInfo } from '../rule-tester-no-typeinfo';
import rule from '../../../src/rules/async-methods';

test('async-methods', () => {
  const files = {
    good: path.resolve(__dirname, 'async-methods.good.tsx'),
    wrong: path.resolve(__dirname, 'async-methods.wrong.tsx')
  };
  const validCode = fs.readFileSync(files.good, 'utf8');

  ruleTester.run('async-methods', rule, {
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
        errors: 1,
        output: validCode,
      }
    ]
  });
});

test('async-methods (no type info)', () => {
  ruleTesterNoTypeInfo.run('async-methods', rule, {
    valid: [
      {
        code: `@Component({ tag: 'sample-tag' })
export class SampleTag {
  @Method()
  async someMethod() {
    return 'method';
  }
  render() { return (<div>test</div>); }
}`,
        filename: 'valid-async.tsx'
      },
      {
        code: `@Component({ tag: 'sample-tag' })
export class SampleTag {
  @Method()
  someMethod(): Promise<string> {
    return Promise.resolve('method');
  }
  render() { return (<div>test</div>); }
}`,
        filename: 'valid-promise-annotation.tsx'
      },
      {
        // @Method outside @Component — rule should skip (isComponent() is false)
        code: `export class NotAComponent {
  @Method()
  someMethod() {
    return 'method';
  }
}`,
        filename: 'valid-not-component.tsx'
      }
    ],
    invalid: [
      {
        code: `@Component({ tag: 'sample-tag' })
export class SampleTag {
  @Method()
  someMethod() {
    return 'method';
  }
  render() { return (<div>test</div>); }
}`,
        filename: 'invalid.tsx',
        errors: 1,
        output: `@Component({ tag: 'sample-tag' })
export class SampleTag {
  @Method()
  async someMethod() {
    return 'method';
  }
  render() { return (<div>test</div>); }
}`
      }
    ]
  });
});
