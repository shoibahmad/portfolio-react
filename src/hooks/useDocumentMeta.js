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
 */

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

export function useDocumentMeta({ title, description, pathname }) {
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
}

export default useDocumentMeta;
