import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

/**
 * Test-runner config, deliberately a separate file from vite.config.js.
 *
 * Vitest prefers vitest.config.* over vite.config.* and does *not* merge the
 * two, so the React plugin is restated here rather than inherited — without it
 * every .jsx test file fails to parse. The build config is left untouched on
 * purpose: `base` and anything else added for deployment has no meaning in a
 * test run, and folding the two together would mean a test-only option could
 * change what ships.
 */
export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],

    /* Stylesheets are stubbed, not compiled. Every component imports its own
       .css file, so processing them would cost a transform per component to
       assert nothing: jsdom performs no layout, so no test here can observe a
       computed style anyway. */
    css: false,

    /* Scoped to src so the runner never walks dist/ or the sitemap script. */
    include: ['src/**/*.test.{js,jsx}']
  }
})
