/**
 * Generate public/sitemap.xml from the app's own route table.
 *
 * The sitemap used to be maintained by hand and had gone stale: it listed six
 * URLs with a lastmod of 2025-03-01, was missing /resume entirely, and — because
 * the site had no SPA fallback — every URL on it returned a 404. Deriving it
 * from src/data/routes.js means adding a route adds a sitemap entry, and there
 * is no second list to forget.
 *
 * Runs from the `prebuild` script, so `npm run build` cannot ship a stale one.
 */
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { ROUTES, SITE_URL } from '../src/data/routes.js';
import { PROJECTS } from '../src/data/projects.js';

const here = dirname(fileURLToPath(import.meta.url));
const outFile = resolve(here, '../public/sitemap.xml');

const today = new Date().toISOString().slice(0, 10);

const entries = [
    ...ROUTES.map((route) => ({
        loc: `${SITE_URL}${route.path}`,
        changefreq: route.changefreq,
        priority: route.priority
    })),
    /* Each case study is a real, indexable URL now that /projects/:slug resolves,
       so each one earns its own entry. Priority sits below the section pages:
       these are leaves, not landing pages. */
    ...PROJECTS.map((project) => ({
        loc: `${SITE_URL}/projects/${project.slug}`,
        changefreq: 'monthly',
        priority: '0.6'
    }))
];

const xml = [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...entries.map((entry) => [
        '  <url>',
        `    <loc>${entry.loc}</loc>`,
        `    <lastmod>${today}</lastmod>`,
        `    <changefreq>${entry.changefreq}</changefreq>`,
        `    <priority>${entry.priority}</priority>`,
        '  </url>'
    ].join('\n')),
    '</urlset>',
    ''
].join('\n');

writeFileSync(outFile, xml, 'utf8');
console.log(`sitemap.xml: ${entries.length} URLs (${ROUTES.length} pages, ${PROJECTS.length} projects)`);
