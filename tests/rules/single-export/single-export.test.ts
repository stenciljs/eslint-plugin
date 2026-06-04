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
        // Type exports are allowed (export type alias)
        code: `@Component({ tag: 'sample-tag' })
export class SampleTag {
  render() {
    return (<div>test</div>);
  }
}
export type SampleProps = { name: string };`,
        filename: 'valid-type.tsx'
      },
      {
        // Interface exports are allowed (TSInterfaceDeclaration)
        code: `@Component({ tag: 'sample-tag' })
export class SampleTag {
  render() {
    return (<div>test</div>);
  }
}
export interface SampleInterface { name: string; }`,
        filename: 'valid-interface.tsx'
      },
      {
        // No @Component — rule should not report anything
        code: `export function helper() {}`,
        filename: 'valid-no-component.tsx'
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
        // Exported function declaration
        code: `@Component({ tag: 'sample-tag' })
export class SampleTag {
  render() {
    return (<div>test</div>);
  }
}

export function helper() {}`,
        filename: 'invalid-function.tsx',
        errors: 1
      },
      {
        // Re-export specifier: export { helper }
        code: `function helper() {}

@Component({ tag: 'sample-tag' })
export class SampleTag {
  render() {
    return (<div>test</div>);
  }
}

export { helper };`,
        filename: 'invalid-specifier.tsx',
        errors: 1
      },
      {
        // export default expression (no id)
        code: `@Component({ tag: 'sample-tag' })
export class SampleTag {
  render() {
    return (<div>test</div>);
  }
}

export default 42;`,
        filename: 'invalid-default.tsx',
        errors: 1
      },
      {
        // export default class with id
        code: `@Component({ tag: 'sample-tag' })
export class SampleTag {
  render() {
    return (<div>test</div>);
  }
}

export default class Helper {}`,
        filename: 'invalid-default-class.tsx',
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
