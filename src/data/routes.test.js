import { describe, expect, it } from 'vitest';

import { NOT_FOUND_META, ROUTES, SITE_URL, findRouteMeta } from './routes';

/**
 * ROUTES feeds two consumers that never meet.
 *
 * useDocumentMeta reads it at runtime; scripts/generate-sitemap.mjs reads it at
 * build time from the `prebuild` hook. A missing description ships a blank
 * `<meta>`; a missing changefreq or priority writes `<changefreq></changefreq>`
 * into sitemap.xml, which Search Console rejects for the whole file. Neither
 * failure is visible while developing — the page still renders — so the shape
 * of every entry is pinned here instead.
 */

/** The only values the sitemap protocol accepts for <changefreq>. */
const CHANGEFREQ_VALUES = ['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'];

describe('ROUTES', () => {
    it('has no duplicate paths', () => {
        const seen = new Set();
        const duplicates = ROUTES.map((route) => route.path).filter((path) => {
            if (seen.has(path)) return true;
            seen.add(path);
            return false;
        });

        // findRouteMeta takes the first match, so a second entry for the same
        // path is dead metadata that still inflates the sitemap.
        expect(duplicates).toEqual([]);
    });

    it('has no duplicate titles', () => {
        const titles = ROUTES.map((route) => route.title);

        // Two pages sharing a <title> are near-duplicates to a crawler, which
        // is the exact problem this route table was introduced to fix.
        expect(new Set(titles).size).toBe(titles.length);
    });

    it.each(ROUTES)('$path carries a title and a description', (route) => {
        expect(typeof route.title).toBe('string');
        expect(route.title.trim()).not.toBe('');
        expect(typeof route.description).toBe('string');
        expect(route.description.trim()).not.toBe('');
    });

    it.each(ROUTES)('$path is absolute and free of a trailing slash', (route) => {
        // findRouteMeta is an exact string compare against location.pathname,
        // so '/projects/' would never match and would quietly 404.
        expect(route.path.startsWith('/')).toBe(true);
        if (route.path !== '/') expect(route.path.endsWith('/')).toBe(false);
    });

    it.each(ROUTES)('$path carries the fields generate-sitemap.mjs interpolates', (route) => {
        expect(CHANGEFREQ_VALUES).toContain(route.changefreq);
        expect(route.priority).toMatch(/^(0\.\d|1\.0)$/);
    });
});

describe('SITE_URL', () => {
    it('is an absolute https origin with no trailing slash', () => {
        // useDocumentMeta builds canonicals as `${SITE_URL}${pathname}`, so a
        // trailing slash here emits https://shoibahmad.in//projects — a
        // different URL to a crawler, and a self-inflicted duplicate.
        expect(SITE_URL).toMatch(/^https:\/\/[^/]+$/);
    });
});

describe('findRouteMeta', () => {
    it.each(ROUTES)('resolves $path to its own entry', (route) => {
        expect(findRouteMeta(route.path)).toBe(route);
    });

    it('returns null for an unknown path', () => {
        expect(findRouteMeta('/does-not-exist')).toBeNull();
    });

    it('returns null for a project detail path', () => {
        // App.jsx depends on this miss: a /projects/:slug URL has to fall
        // through to the catalogue lookup rather than inherit the index page's
        // title and description.
        expect(findRouteMeta('/projects/web-sonar')).toBeNull();
    });

    it('returns null rather than undefined, so a caller can use ?? and ||', () => {
        expect(findRouteMeta('/nope')).not.toBeUndefined();
        expect(findRouteMeta('/nope')).toBeNull();
    });
});

describe('NOT_FOUND_META', () => {
    it('carries its own title and description', () => {
        // Without it a 404 keeps whatever metadata the previous route wrote,
        // and the missing page gets indexed under the real page's title.
        expect(NOT_FOUND_META.title.trim()).not.toBe('');
        expect(NOT_FOUND_META.description.trim()).not.toBe('');
    });

    it('is distinct from every real route title', () => {
        expect(ROUTES.map((route) => route.title)).not.toContain(NOT_FOUND_META.title);
    });
});
