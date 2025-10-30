import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        testTimeout: 30 * 1000, // allow complex ESLint rule suites to gather type info
        include: ['tests/**/*.test.ts'],
        exclude: [
            'dist', '.idea', '.git', '.cache',
            '**/node_modules/**',
        ],
        coverage: {
            enabled: true,
            include: ['src/**/*.ts'],
            exclude: [
                '**/dist/**',
                '**/tests/**',
                '**/node_modules/**',
                '**/*.d.ts'
            ],
            thresholds: {
                branches: 75,
                functions: 74,
                lines: 77,
                statements: 77
            }
        },
    }
})