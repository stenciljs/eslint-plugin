import { describe, expect, test } from 'vitest';

import base from '../../src/configs/base';
import recommended from '../../src/configs/recommended';
import strict from '../../src/configs/strict';
import configs from '../../src/configs';

describe('configs exports', () => {
  test('base config structure', () => {
    expect(Array.isArray(base.overrides)).toBe(true);
    const override = base.overrides?.[0];
    expect(override?.parser).toBe('@typescript-eslint/parser');
    expect(override?.rules).toMatchObject({
      'stencil/async-methods': 2,
      'stencil/ban-prefix': [2, ['stencil', 'stnl', 'st']],
    });
  });

  test('recommended config extends base and has rules', () => {
    expect(recommended.extends).toEqual(expect.arrayContaining(['plugin:stencil/base']));
    expect(recommended.rules).toBeDefined();
    expect(recommended.rules?.['stencil/strict-mutable']).toBeDefined();
  });

  test('strict config toggles expected rules', () => {
    expect(strict.extends).toEqual(
      expect.arrayContaining([
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:stencil/recommended',
      ]),
    );
    expect(strict.rules?.['stencil/strict-boolean-conditions']).toBe(2);
    expect(strict.rules?.['no-shadow']).toBe(2);
  });

  test('index exports individual configs and flat placeholder', () => {
    expect(configs.base).toBe(base);
    expect(configs.recommended).toBe(recommended);
    expect(configs.strict).toBe(strict);
    expect(configs.flat).toBeDefined();
  });
});

