import { useEffect } from 'react';
import { SITE_URL } from '../data/routes';

/**
 * Sync document metadata with the current route.
 *
 * Written imperatively rather than by rendering `<title>` in the tree. React 19
 * can hoist metadata into `<head>`, but it *appends* — and index.html already
 * ships a `<title>` for the initial paint and for crawlers that do not execute
 * JavaScript. With two title elements the browser honours the first, so the
 * hoisted one would silently do nothing. Writing to the existing nodes avoids
 * that ambiguity entirely.
 *
 * Open Graph tags are updated alongside, so a link shared from an interior page
 * previews as that page rather than as the homepage.
 *
 * Routes may also supply a JSON-LD node (see src/data/structuredData.js), which
 * is written to a single dedicated `<script>` described below.
 */

const JSON_LD_SELECTOR = 'script[type="application/ld+json"][data-dynamic="true"]';

function setMeta(selector, attr, value) {
    const el = document.head.querySelector(selector);
    if (el) {
        el.setAttribute(attr, value);
        return;
    }
    // The tag may not exist in index.html (og:url on a fresh install, say)
    const created = document.createElement('meta');
    const [, key, name] = selector.match(/\[(\w+)="([^"]+)"\]/) || [];
    if (!key || !name) return;
    created.setAttribute(key, name);
    created.setAttribute(attr, value);
    document.head.appendChild(created);
}

/**
 * Write (or clear) the one route-owned JSON-LD block.
 *
 * Three constraints shape this, and the `data-dynamic` attribute is what
 * satisfies all three at once:
 *
 * 1. index.html ships a static `Person` block that must survive untouched —
 *    it is the record crawlers that never run JavaScript see. A bare
 *    `script[type="application/ld+json"]` selector would match that block
 *    first and overwrite it on the very first navigation.
 * 2. Appending a block per route is worse than useless: crawlers read *every*
 *    JSON-LD node in the head, so a visitor who browsed four case studies
 *    would leave Googlebot four contradictory SoftwareSourceCode nodes in one
 *    document. Marking exactly one node and rewriting its contents guarantees
 *    at most one route-owned block at any moment.
 * 3. A route with nothing to declare has to actively remove the node. Leaving
 *    the previous one in place would mean /contact still claiming to be the
 *    last project the visitor looked at.
 *
 * Takes the already-serialised string rather than the object, so the caller can
 * use that same string as its effect dependency.
 */
function setJsonLd(serialised) {
    const existing = document.head.querySelector(JSON_LD_SELECTOR);

    if (!serialised) {
        if (existing) existing.remove();
        return;
    }

    if (existing) {
        existing.textContent = serialised;
        return;
    }

    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.setAttribute('data-dynamic', 'true');
    script.textContent = serialised;
    document.head.appendChild(script);
}

/**
 * @param {object}        meta
 * @param {string}        meta.title
 * @param {string}        [meta.description]
 * @param {string}        [meta.pathname]
 * @param {object|object[]} [meta.jsonLd] A structured-data node, or an array of
 *   them, from src/data/structuredData.js. Omit it and any block left by the
 *   previous route is removed.
 */
export function useDocumentMeta({ title, description, pathname, jsonLd }) {
    /* Serialised here rather than inside the effect so the *string* can be the
       dependency. The builders in structuredData.js return a fresh object on
       every call, so an object identity dep would rewrite the <script> on every
       render of every route while the JSON inside it never changed. */
    const jsonLdText = jsonLd ? JSON.stringify(jsonLd) : '';

    useEffect(() => {
        if (!title) return;

        document.title = title;

        if (description) {
            setMeta('meta[name="description"]', 'content', description);
            setMeta('meta[property="og:description"]', 'content', description);
            setMeta('meta[property="twitter:description"]', 'content', description);
        }

        setMeta('meta[property="og:title"]', 'content', title);
        setMeta('meta[property="twitter:title"]', 'content', title);

        if (pathname) {
            const url = `${SITE_URL}${pathname === '/' ? '/' : pathname}`;
            setMeta('meta[property="og:url"]', 'content', url);
            setMeta('meta[property="twitter:url"]', 'content', url);

            // Canonical keeps the redirect-shim query string out of the index
            const canonical = document.head.querySelector('link[rel="canonical"]');
            if (canonical) canonical.setAttribute('href', url);
        }
    }, [title, description, pathname]);

    /* Kept in its own effect, and deliberately not behind the `if (!title)`
       guard above: clearing a stale node is the correct behaviour even for a
       route that supplies no title at all, and tying the two together would
       make an unrelated metadata change rewrite the JSON-LD for no reason. */
    useEffect(() => {
        setJsonLd(jsonLdText);
    }, [jsonLdText]);
}

export default useDocumentMeta;
