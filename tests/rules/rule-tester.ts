import path from 'node:path';

import parser from '@typescript-eslint/parser';
import { RuleTester } from 'eslint';

export const ruleTester = new RuleTester({
    languageOptions: {
        parser,
        parserOptions: {
            ecmaVersion: 2022,
            sourceType: 'module',
            ecmaFeatures: {
                jsx: true
            },
            project: path.resolve(__dirname, '..', 'configs', 'tsconfig.json'),
            extraFileExtensions: ['.ts', '.tsx'],
            env: {
                browser: true,
                node: true,
                es6: true
            }
        }
    }
});
