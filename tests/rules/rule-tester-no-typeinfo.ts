import parser from '@typescript-eslint/parser';
import { RuleTester } from 'eslint';

/**
 * RuleTester without typescript-eslint parser services (no type info).
 * Simulates environments (e.g. oxlint JS plugin runtime) where
 * esTreeNodeToTSNodeMap and program are unavailable.
 */
export const ruleTesterNoTypeInfo = new RuleTester({
    languageOptions: {
        parser,
        parserOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            ecmaFeatures: {
                jsx: true
            },
        }
    }
});
