import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';

import { SITE_URL } from '../data/routes';
import useDocumentMeta from './useDocumentMeta';

/**
 * These read the real document rather than a mock of it.
 *
 * The hook exists *because* index.html already ships a `<title>`, a description
 * and a canonical link — React's metadata hoisting would append duplicates that
 * the browser then ignores, so the hook mutates the existing nodes instead.
 * Asserting that against a stubbed `document` would prove nothing about the
 * behaviour that matters, so every test here seeds the head with the tags
 * index.html actually serves and then inspects what the hook did to them.
 */

/* A trimmed copy of the head index.html ships: enough of it that the two code
   paths in setMeta — update an existing node, create a missing one — are both
   exercised by real inputs. og:url is deliberately absent; see below. */
const SHIPPED_HEAD = `
    <title>Shoib Ahmad - Full-Stack Engineer</title>
    <meta name="description" content="unchanged" />
    <meta property="og:title" content="unchanged" />
    <meta property="og:description" content="unchanged" />
    <meta property="twitter:title" content="unchanged" />
    <meta property="twitter:description" content="unchanged" />
    <meta property="twitter:url" content="https://shoibahmad.in/" />
    <link rel="canonical" href="https://shoibahmad.in/" />
`;

const PROJECTS_META = {
    title: 'Projects — Shoib Ahmad',
    description: 'Nineteen shipped systems across web, mobile and applied AI.',
    pathname: '/projects'
};

const content = (selector) => document.head.querySelector(selector)?.getAttribute('content');
const canonicalHref = () => document.head.querySelector('link[rel="canonical"]')?.getAttribute('href');

beforeEach(() => {
    // jsdom hands out one document per test *file*, not per test, so the head
    // has to be reset or each case inherits the previous one's writes.
    document.head.innerHTML = SHIPPED_HEAD;
});

describe('useDocumentMeta', () => {
    it('writes the title to the document', () => {
        renderHook(() => useDocumentMeta(PROJECTS_META));

        expect(document.title).toBe(PROJECTS_META.title);
    });

    it('updates the shipped description tag instead of adding a second one', () => {
        renderHook(() => useDocumentMeta(PROJECTS_META));

        expect(content('meta[name="description"]')).toBe(PROJECTS_META.description);
        // The duplicate is the real failure mode: a crawler reads the first tag,
        // so an appended one is invisible and the page keeps the stale copy.
        expect(document.head.querySelectorAll('meta[name="description"]')).toHaveLength(1);
    });

    it('mirrors the title and description into the Open Graph and Twitter tags', () => {
        renderHook(() => useDocumentMeta(PROJECTS_META));

        expect(content('meta[property="og:title"]')).toBe(PROJECTS_META.title);
        expect(content('meta[property="twitter:title"]')).toBe(PROJECTS_META.title);
        expect(content('meta[property="og:description"]')).toBe(PROJECTS_META.description);
        expect(content('meta[property="twitter:description"]')).toBe(PROJECTS_META.description);
    });

    it('points the canonical link at the site origin plus the current path', () => {
        renderHook(() => useDocumentMeta(PROJECTS_META));

        expect(canonicalHref()).toBe(`${SITE_URL}/projects`);
    });

    it('keeps the canonical for the home route at a single trailing slash', () => {
        renderHook(() => useDocumentMeta({ ...PROJECTS_META, pathname: '/' }));

        expect(canonicalHref()).toBe(`${SITE_URL}/`);
    });

    it('creates a meta tag the document does not already have', () => {
        // SHIPPED_HEAD omits og:url, standing in for the "fresh install" case
        // setMeta's fallback branch was written for.
        expect(document.head.querySelector('meta[property="og:url"]')).toBeNull();

        renderHook(() => useDocumentMeta(PROJECTS_META));

        expect(content('meta[property="og:url"]')).toBe(`${SITE_URL}/projects`);
    });

    it('rewrites everything when the route changes', () => {
        const { rerender } = renderHook((props) => useDocumentMeta(props), {
            initialProps: PROJECTS_META
        });

        rerender({ title: 'Contact — Shoib Ahmad', description: 'Email, LinkedIn, GitHub.', pathname: '/contact' });

        expect(document.title).toBe('Contact — Shoib Ahmad');
        expect(content('meta[name="description"]')).toBe('Email, LinkedIn, GitHub.');
        expect(canonicalHref()).toBe(`${SITE_URL}/contact`);
    });

    it('leaves the document alone when there is no title yet', () => {
        document.title = 'Shoib Ahmad - Full-Stack Engineer';

        renderHook(() => useDocumentMeta({ title: '', description: 'ignored', pathname: '/projects' }));

        // The early return is what lets a caller render before its metadata has
        // resolved without blanking the title index.html already painted.
        expect(document.title).toBe('Shoib Ahmad - Full-Stack Engineer');
        expect(content('meta[name="description"]')).toBe('unchanged');
    });

    it('writes the og tags even when no canonical link exists', () => {
        document.head.querySelector('link[rel="canonical"]')?.remove();

        expect(() => renderHook(() => useDocumentMeta(PROJECTS_META))).not.toThrow();
        expect(content('meta[property="og:url"]')).toBe(`${SITE_URL}/projects`);
    });

    it('skips the URL tags when no pathname is supplied', () => {
        renderHook(() => useDocumentMeta({ title: 'Standalone', description: 'No route.' }));

        expect(document.title).toBe('Standalone');
        expect(document.head.querySelector('meta[property="og:url"]')).toBeNull();
        expect(canonicalHref()).toBe('https://shoibahmad.in/');
    });
});
