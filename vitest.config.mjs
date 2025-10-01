import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: ['packages/*/vitest.config.*', 'packages/!(client|workers|edge-functionsq)/package.json'],
  },
})
