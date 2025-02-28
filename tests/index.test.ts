import { test, expect } from 'vitest';

import * as stencilEslint from '../src';

test('test', () => {
    expect(stencilEslint.default.configs).toBeDefined();
    expect(stencilEslint.default.configs.flat).toBeDefined();
    expect(stencilEslint.default.configs.base).toBeDefined();
    expect(stencilEslint.default.configs.strict).toBeDefined();
    expect(stencilEslint.default.configs.recommended).toBeDefined();
    expect(stencilEslint.default.configs.flat.base).toBeDefined();
    expect(stencilEslint.default.configs.flat.recommended).toBeDefined();
    expect(stencilEslint.default.configs.flat.strict).toBeDefined();
    expect(stencilEslint.default.rules).toBeInstanceOf(Object);
});
