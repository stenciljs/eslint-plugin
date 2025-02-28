import { defineConfig } from 'vitest/config'

export default defineConfig({
    test: {
        testTimeout: 10 * 1000, // 10 seconds
        include: ['tests/**/*.test.ts'],
        exclude: [
            'dist', '.idea', '.git', '.cache',
            '**/node_modules/**',
        ],
        coverage: {
            enabled: true,
            thresholds: {
                branches: 83,
                functions: 74,
                lines: 77,
                statements: 77
            }
        },
    }
})