import { describe, expect, it } from 'vitest';

import { CATEGORIES, PROJECTS, findProjectBySlug, slugify } from './projects';

/**
 * The catalogue is the only data the router resolves against, and slugs are the
 * fragile part of it.
 *
 * `slugify` keeps just the text before an em dash or a bracket, so two titles
 * that differ only *after* that point collapse onto one URL — one case study
 * becomes unreachable and the other answers to both addresses. The module does
 * check for that, but behind `import.meta.env.DEV`, which means the check is
 * compiled out of the very build that would ship the broken links. These tests
 * are the half of that guard that runs regardless.
 */

/* Read unguarded by Projects.jsx or ProjectModal.jsx — a missing one renders
   `undefined` into the page or throws. */
const REQUIRED_TEXT_FIELDS = ['title', 'category', 'date', 'description', 'image', 'link', 'slug'];

describe('slugify', () => {
    it('keeps only the text before an em dash', () => {
        expect(slugify('SecureEval AI — Examination Integrity Platform')).toBe('secureeval-ai');
    });

    it('keeps only the text before an opening bracket', () => {
        expect(slugify('IU CA (Cross Platform App)')).toBe('iu-ca');
    });

    it('treats a plain hyphen as part of the name, not as a separator', () => {
        // Only the em dash and the bracket truncate; "Lumina - Smart Inventory"
        // uses an ASCII hyphen and so keeps its whole title.
        expect(slugify('Lumina - Smart Inventory Management')).toBe('lumina-smart-inventory-management');
        expect(slugify('Med-AI Vigi — ADR Risk Predictor')).toBe('med-ai-vigi');
    });

    it('collapses punctuation runs and strips the edges', () => {
        expect(slugify('Truth Guard AI (Misinformation)')).toBe('truth-guard-ai');
        expect(slugify('  Food POS!  ')).toBe('food-pos');
    });

    it('returns an empty string when nothing precedes the em dash', () => {
        // Not hypothetical punctuation trivia: an empty slug produces the URL
        // /projects/ , which the router reads as the index. The per-project
        // slug-shape assertion below is what keeps one out of the catalogue.
        expect(slugify('— Untitled')).toBe('');
    });
});

describe('PROJECTS', () => {
    it('is not empty', () => {
        expect(PROJECTS.length).toBeGreaterThan(0);
    });

    it('gives every project a slug that is unique across the catalogue', () => {
        const titleBySlug = new Map();
        const collisions = [];

        for (const project of PROJECTS) {
            const existing = titleBySlug.get(project.slug);
            if (existing) {
                collisions.push(`"${project.slug}" ← "${existing}" and "${project.title}"`);
            } else {
                titleBySlug.set(project.slug, project.title);
            }
        }

        // Compared as an array rather than a count so a failure names both of
        // the titles that collided and the slug they fought over.
        expect(collisions).toEqual([]);
    });

    it.each(PROJECTS)('$title has a non-empty, URL-safe slug', (project) => {
        expect(project.slug).toMatch(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);
    });

    it.each(PROJECTS)('$title has every field the project UI reads', (project) => {
        for (const field of REQUIRED_TEXT_FIELDS) {
            expect(typeof project[field]).toBe('string');
            expect(project[field].trim()).not.toBe('');
        }

        // Projects.jsx builds its search haystack with `project.tech.join(' ')`,
        // so a missing or non-array tech list breaks the filter, not just a chip.
        expect(Array.isArray(project.tech)).toBe(true);
        expect(project.tech.length).toBeGreaterThan(0);
    });

    it.each(PROJECTS)('$title keeps its optional case-study fields well-formed', (project) => {
        /* ProjectModal substitutes generic copy when these are absent, so a
           project may legitimately omit them. A wrong *type* is a different
           thing: `.map` on a string or a rendered object crashes the modal, and
           the fallback never gets a chance to run. */
        for (const field of ['challenge', 'solution']) {
            if (field in project) expect(typeof project[field]).toBe('string');
        }

        if ('learnings' in project) {
            expect(Array.isArray(project.learnings)).toBe(true);
            for (const learning of project.learnings) expect(typeof learning).toBe('string');
        }

        if ('architecture' in project) {
            expect(Array.isArray(project.architecture)).toBe(true);
            for (const node of project.architecture) {
                expect(typeof node.step).toBe('string');
                expect(typeof node.icon).toBe('string');
            }
        }
    });

    it('only uses categories the filter bar can select', () => {
        const selectable = new Set(CATEGORIES);
        const unreachable = PROJECTS
            .filter((project) => !selectable.has(project.category))
            .map((project) => `${project.title} (${project.category})`);

        // A category missing from CATEGORIES has no chip, so those projects are
        // only ever reachable through search.
        expect(unreachable).toEqual([]);
    });

    it('has at least one project behind every category chip', () => {
        const used = new Set(PROJECTS.map((project) => project.category));
        const empty = CATEGORIES.filter((category) => category !== 'All' && !used.has(category));

        expect(empty).toEqual([]);
    });
});

describe('findProjectBySlug', () => {
    it.each(PROJECTS)('round-trips $title', (project) => {
        // Identity, not equality: App.jsx reads `project.description` straight
        // off the result, so a copy would hide a stale-reference bug.
        expect(findProjectBySlug(project.slug)).toBe(project);
    });

    it('returns null for an unknown slug', () => {
        expect(findProjectBySlug('no-such-project')).toBeNull();
    });

    it('returns null for an empty slug', () => {
        expect(findProjectBySlug('')).toBeNull();
    });

    it('does not resolve a partial slug', () => {
        // App.jsx feeds this the raw path capture, so a prefix match would open
        // the wrong case study for a mistyped or truncated URL.
        const [first] = PROJECTS;
        expect(findProjectBySlug(first.slug.slice(0, -1))).toBeNull();
    });
});
