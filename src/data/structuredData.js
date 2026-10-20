/**
 * JSON-LD builders — one node per kind of thing the site actually publishes.
 *
 * index.html ships a single static `Person` block. That node is correct for the
 * homepage and says nothing useful anywhere else: a case study is a piece of
 * software, the IJSAT paper is a scholarly article, and a deep URL has a
 * breadcrumb trail. Widening the static block into one large @graph was the
 * other option, but then every route would advertise every entity and the one
 * thing a rich result needs — "this page is about *this*" — would be lost.
 *
 * So each route builds the node that describes it and `useDocumentMeta` writes
 * it into a second, route-owned `<script>`; see that file for why it is a
 * separate tagged node rather than an append.
 *
 * Every function returns a plain object (or null) — serialisation is the hook's
 * job. That split is what keeps these pure: no DOM, no side effects, and a
 * return value a test can compare field by field.
 */

import { SITE_URL } from './routes';
import { BASICS } from './profile';
import { slugify } from './projects';

const SCHEMA_CONTEXT = 'https://schema.org';

/* The static Person block in index.html carries no `@id`, and index.html is not
   ours to edit — so the only join key available to a consumer reading both
   blocks is an identical `url`. Repeating just name + url (rather than the full
   Person record) is deliberate: it is enough for the two nodes to reconcile
   into one entity, and too little to drift out of sync with the static copy. */
const AUTHOR_REF = {
    '@type': 'Person',
    name: BASICS.name,
    url: SITE_URL
};

/**
 * Absolutise a value that may be a site-relative path or an external URL.
 *
 * Paths in the data files are site-relative ("/images/aura.svg") because that
 * is what the app renders. Structured-data consumers fetch these out of the
 * page's context, where a leading slash means nothing — so everything is
 * absolutised on the way out.
 *
 * Returns undefined for the catalogue's "#" placeholder link, which marks a
 * project with no public repository. Emitting `codeRepository: "#"` would be a
 * broken URL in the eyes of a validator, where emitting nothing is simply a
 * property the node does not have.
 */
function absolute(value) {
    if (!value || value === '#') return undefined;
    if (/^(https?:|mailto:)/i.test(value)) return value;
    return `${SITE_URL}${value.startsWith('/') ? '' : '/'}${value}`;
}

/* Structured-data validators treat a property that is present but empty as an
   error rather than as an absence, so optional fields are dropped instead of
   emitted as null. Builders can then list every property unconditionally and
   let this decide what survives. */
function compact(node) {
    return Object.fromEntries(
        Object.entries(node).filter(([, value]) => {
            if (value === undefined || value === null || value === '') return false;
            if (Array.isArray(value) && value.length === 0) return false;
            return true;
        })
    );
}

const MONTHS = [
    'january', 'february', 'march', 'april', 'may', 'june',
    'july', 'august', 'september', 'october', 'november', 'december'
];

/**
 * "November 2025" -> "2025-11", falling back to the bare year.
 *
 * schema.org dates are ISO 8601; the CV data stores a human-readable month name
 * because that is what the Publications component prints. Narrowing to YYYY-MM
 * rather than padding out a full date keeps the emitted value exactly as precise
 * as the source — an ISO date with a guessed "-01" on the end would publish a
 * day the site does not actually know.
 */
function isoMonth(date, year) {
    const match = typeof date === 'string' ? date.trim().match(/^([A-Za-z]+)\s+(\d{4})$/) : null;
    if (match) {
        const index = MONTHS.indexOf(match[1].toLowerCase());
        if (index !== -1) return `${match[2]}-${String(index + 1).padStart(2, '0')}`;
    }
    return year || undefined;
}

/**
 * A project case study, as SoftwareSourceCode.
 *
 * SoftwareSourceCode rather than the broader CreativeWork or the narrower
 * SoftwareApplication: every entry in the catalogue is source that exists and
 * is described by its stack, but most are not installable products with an
 * operating system and a price, which is what SoftwareApplication's expected
 * properties ask for.
 *
 * @param {object} project An entry from PROJECTS in ./projects.
 * @returns {object|null} A SoftwareSourceCode node, or null for a missing project.
 */
export function buildProjectSchema(project) {
    if (!project) return null;

    /* PROJECTS attaches `slug` to every entry at module load, but a caller may
       hand us a literal, so the slug is re-derived through the same function
       rather than producing a URL with "undefined" in the middle of it. */
    const slug = project.slug || slugify(project.title);

    return compact({
        '@context': SCHEMA_CONTEXT,
        '@type': 'SoftwareSourceCode',
        name: project.title,
        headline: project.title,
        description: project.description,
        /* The canonical address is the on-site case study, not the repository —
           that is the page this node is attached to, and the one that should
           win the rich result. The repository goes in codeRepository below. */
        url: `${SITE_URL}/projects/${slug}`,
        image: absolute(project.image),
        codeRepository: absolute(project.link),
        /* `tech` is the catalogue's badge list: languages, frameworks and
           managed services mixed together ("Next.js", "Supabase", "Python").
           programmingLanguage would be false for most of those entries, so the
           list goes to runtimePlatform — defined loosely enough to be accurate —
           and is mirrored into keywords, which is what search surfaces read. */
        runtimePlatform: project.tech,
        keywords: Array.isArray(project.tech) ? project.tech.join(', ') : undefined,
        genre: project.category,
        author: AUTHOR_REF,
        creator: AUTHOR_REF,
        isPartOf: {
            '@type': 'CollectionPage',
            name: 'Projects',
            url: `${SITE_URL}/projects`
        }
    });
}

/**
 * The published paper, as ScholarlyArticle.
 *
 * @param {object} publication An entry from PUBLICATIONS in ./profile.
 * @returns {object|null} A ScholarlyArticle node, or null for a missing entry.
 */
export function buildPublicationSchema(publication) {
    if (!publication) return null;

    /* `authors` is one display string in the CV data. Splitting it on commas to
       manufacture a list would invent co-authors the first time it is written
       "Ahmad, S." — so the string is carried as a single Person name, and only
       upgraded to the linked author record when it matches the site owner
       exactly. */
    const author =
        publication.authors === BASICS.name
            ? AUTHOR_REF
            : publication.authors
                ? { '@type': 'Person', name: publication.authors }
                : undefined;

    return compact({
        '@context': SCHEMA_CONTEXT,
        '@type': 'ScholarlyArticle',
        headline: publication.title,
        name: publication.title,
        abstract: publication.abstract,
        description: publication.abstract,
        author,
        datePublished: isoMonth(publication.date, publication.year),
        creativeWorkStatus: publication.status,
        inLanguage: 'en',
        url: absolute(publication.link),
        sameAs: absolute(publication.link),
        isPartOf: {
            '@type': 'Periodical',
            name: publication.journal
        },
        publisher: {
            '@type': 'Organization',
            name: publication.journal
        },
        /* The paper has no page of its own on this site. /experience is the
           route whose description promises published research, so that is the
           page this article is presented on. */
        mainEntityOfPage: `${SITE_URL}/experience`
    });
}

/* "mike-ai" -> "Mike Ai". Only ever reached for intermediate crumbs, which are
   single lowercase words from the route table ("projects"); leaf crumbs take
   the caller's label, which is why no attempt is made to guess the
   capitalisation of an acronym. */
function titleCase(segment) {
    return segment.replace(/-/g, ' ').replace(/\b[a-z]/g, (character) => character.toUpperCase());
}

/**
 * The trail from the homepage down to the current URL, as BreadcrumbList.
 *
 * Returns null for "/" — a one-item breadcrumb is a trail with nowhere to go,
 * and search engines discard it anyway, so emitting it would only add bytes.
 *
 * @param {string} pathname The router's current pathname, e.g. "/projects/aura".
 * @param {string} [label]  Display name for the final crumb. Pass the thing's
 *   own title (`project.title`), not the document title — the document title
 *   carries a " — Shoib Ahmad" suffix that reads as nonsense inside a trail.
 * @returns {object|null} A BreadcrumbList node, or null for the homepage.
 */
export function buildBreadcrumbSchema(pathname, label) {
    const segments = (pathname || '/').split('/').filter(Boolean);
    if (segments.length === 0) return null;

    const crumbs = [{ name: 'Home', item: `${SITE_URL}/` }];

    let href = '';
    segments.forEach((segment, index) => {
        href += `/${segment}`;
        const isLeaf = index === segments.length - 1;
        crumbs.push({
            name: isLeaf && label ? label : titleCase(segment),
            item: `${SITE_URL}${href}`
        });
    });

    return {
        '@context': SCHEMA_CONTEXT,
        '@type': 'BreadcrumbList',
        itemListElement: crumbs.map((crumb, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: crumb.name,
            item: crumb.item
        }))
    };
}

/**
 * Fold several nodes into one value fit for a single `<script>` tag.
 *
 * A route usually has more than one thing to say — a case study is both a
 * SoftwareSourceCode and a point on a breadcrumb trail — while the hook writes
 * exactly one JSON-LD node. @graph is the schema.org-sanctioned way to carry
 * several nodes under one context, so the per-node "@context" keys are stripped
 * and hoisted onto the wrapper. Nulls are filtered out, so callers can pass
 * `buildBreadcrumbSchema(...)` straight through without guarding the "/" case.
 */
export function buildGraph(...nodes) {
    const present = nodes.flat().filter(Boolean);
    if (present.length === 0) return null;
    if (present.length === 1) return present[0];

    return {
        '@context': SCHEMA_CONTEXT,
        '@graph': present.map((node) => {
            const copy = { ...node };
            delete copy['@context'];
            return copy;
        })
    };
}
