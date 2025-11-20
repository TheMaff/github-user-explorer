import { defineConfig } from 'vite'
import { configDefaults } from 'vitest/config'

export default defineConfig({
    test: {
        ...configDefaults,
        environment: 'node',
        globals: true,
        include: ['src/**/*.test.ts'],
    },
})