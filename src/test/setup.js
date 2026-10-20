/**
 * Runs once per test file, before any test in it.
 *
 * Only the jest-dom matcher registration lives here, and that is the point.
 * Testing Library's DOM cleanup needs no wiring: it registers its own afterEach
 * when one exists as a global, which `globals: true` in vitest.config.js
 * guarantees. Anything heavier — shared mocks, fake timers, a seeded document —
 * belongs in the file that needs it, so no test silently inherits state it did
 * not ask for and cannot see.
 */
import '@testing-library/jest-dom/vitest';
