/**
 * Generate a social preview card per URL into public/og/.
 *
 * Every page on the site shared one preview image — the profile photo named in
 * index.html — so a link to /resume, a link to /contact and a link to any of
 * the nineteen case studies all unfurled as the same picture. The route table
 * and the project catalogue already describe what each URL is about, so the
 * cards are derived from them rather than drawn by hand: adding a route adds a
 * card, and there is no second list to forget.
 *
 * SVG rather than PNG, on purpose. Rasterising 1200x630 text would mean a
 * headless browser or a native image library in devDependencies, and the whole
 * point of deriving these at build time is that it stays a `node` one-liner
 * with nothing to install. See the note at the bottom of this file for what
 * that choice costs and what it would take to emit PNG instead.
 *
 * Runs from the `prebuild` script alongside the sitemap, so `npm run build`
 * cannot ship a stale set.
 */
import { mkdirSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

import { ROUTES } from '../src/data/routes.js';
import { PROJECTS } from '../src/data/projects.js';
import { BASICS } from '../src/data/profile.js';

const here = dirname(fileURLToPath(import.meta.url));
const outDir = resolve(here, '../public/og');

/* 1200x630 is the size Facebook, LinkedIn and X all crop to 1.91:1 without
   resampling, which is why it is the de facto single size rather than one of
   several. */
const WIDTH = 1200;
const HEIGHT = 630;
const PAD = 80;
const CONTENT_WIDTH = WIDTH - PAD * 2;

/* Pulled from src/styles/tokens.css rather than re-chosen. These cards are seen
   next to the site, and a preview in a different orange reads as a different
   site. Inverted though: the site is light-on-white, and a white card vanishes
   into the white chat bubble it is unfurled inside. */
const INK = '#101014';
const ACCENT = '#EA580C';
const TEXT = '#FAFAF9';
const MUTED = '#A8A29E';

/* No webfont reference. An SVG opened by an image renderer has no network and
   no font loader, so an @import would silently fall back anyway — and in the
   renderers that *do* honour it, the fetch is a blocking round trip for a
   100KB file. Naming the house fonts first means they are used where installed
   and a sane system stack is used everywhere else. */
const FONT = "'Plus Jakarta Sans','Segoe UI',Inter,system-ui,-apple-system,'Helvetica Neue',Arial,sans-serif";

/* Type sizes, the character budget per line at that size, and how many lines
   the layout can afford. The budget is an estimate — SVG has no text metrics
   available to a plain node script — derived from an average advance of about
   0.55em for bold sans at these sizes. The tiers are tried in order and the
   first one whose wrap fits is used, so a short title gets the large treatment
   and a long one steps down instead of overflowing the card. */
const TITLE_TIERS = [
    { size: 80, maxChars: 22, maxLines: 2 },
    { size: 64, maxChars: 28, maxLines: 3 },
    { size: 52, maxChars: 35, maxLines: 3 }
];

const DECK_SIZE = 26;
const DECK_MAX_CHARS = 78;
const DECK_MAX_LINES = 2;

function escapeXml(value) {
    return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

/* Greedy wrap on whitespace. A single word longer than the budget is given its
   own line rather than being hyphenated: the budget is an estimate, and a word
   that overshoots it by a few characters still fits the card, where a wrong
   hyphen is visible forever. */
function wrap(text, maxChars) {
    const lines = [];
    let line = '';

    for (const word of String(text).split(/\s+/).filter(Boolean)) {
        if (!line) {
            line = word;
        } else if (word === '—' || line.length + 1 + word.length <= maxChars) {
            /* The em dash separating a title from its qualifier is a connector,
               not a word. Letting it start a line produces "Experience &" /
               "— Shoib Ahmad", which reads as a bullet. It is one narrow glyph,
               so it always stays on the line it closes even when that line is
               already at budget. */
            line += ` ${word}`;
        } else {
            lines.push(line);
            line = word;
        }
    }
    if (line) lines.push(line);

    return lines;
}

function clampLines(lines, maxLines) {
    if (lines.length <= maxLines) return lines;
    const kept = lines.slice(0, maxLines);
    kept[maxLines - 1] = `${kept[maxLines - 1].replace(/[\s,.;:—-]+$/, '')}…`;
    return kept;
}

function pickTitleTier(title) {
    for (const tier of TITLE_TIERS) {
        const lines = wrap(title, tier.maxChars);
        if (lines.length <= tier.maxLines) return { ...tier, lines };
    }
    const last = TITLE_TIERS[TITLE_TIERS.length - 1];
    return { ...last, lines: clampLines(wrap(title, last.maxChars), last.maxLines) };
}

function textNode({ x, y, size, weight, fill, content, extra = '' }) {
    return (
        `<text x="${x}" y="${y}" font-family="${FONT}" font-size="${size}" ` +
        `font-weight="${weight}" fill="${fill}"${extra}>${escapeXml(content)}</text>`
    );
}

/**
 * One card.
 *
 * @param {object} card
 * @param {string} card.eyebrow Small accent line above the title — the URL path
 *   for a route, the catalogue category for a project. Both are facts already
 *   in the data; nothing here is written for the card.
 * @param {string} card.title   Rendered large. The route or project title verbatim.
 * @param {string} card.deck    Supporting line, truncated to two lines.
 */
function renderCard({ eyebrow, title, deck }) {
    const { size, maxChars, maxLines, lines } = pickTitleTier(title);
    const titleLines = clampLines(lines, maxLines);
    const titleLeading = Math.round(size * 1.18);

    const deckLines = clampLines(wrap(deck || '', DECK_MAX_CHARS), DECK_MAX_LINES);
    const deckLeading = 38;
    const deckGap = deckLines.length ? 44 : 0;

    /* The text block is centred inside the band between the eyebrow and the
       footer rule rather than pinned to a fixed baseline, so a one-line title
       does not leave the card looking top-heavy next to a three-line one. */
    const bandTop = 200;
    const bandHeight = 300;
    const blockHeight =
        titleLines.length * titleLeading + deckGap + deckLines.length * deckLeading;
    const top = bandTop + Math.max(0, (bandHeight - blockHeight) / 2);

    const body = [
        ...titleLines.map((line, index) =>
            textNode({
                x: PAD,
                y: Math.round(top + size * 0.8 + index * titleLeading),
                size,
                weight: 800,
                fill: TEXT,
                content: line,
                extra: ' letter-spacing="-1.5"'
            })
        ),
        ...deckLines.map((line, index) =>
            textNode({
                x: PAD,
                y: Math.round(
                    top + titleLines.length * titleLeading + deckGap +
                    DECK_SIZE * 0.8 + index * deckLeading
                ),
                size: DECK_SIZE,
                weight: 400,
                fill: MUTED,
                content: line
            })
        )
    ];

    return [
        '<?xml version="1.0" encoding="UTF-8"?>',
        `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" ` +
            `viewBox="0 0 ${WIDTH} ${HEIGHT}" role="img" aria-label="${escapeXml(title)}">`,
        '  <defs>',
        '    <radialGradient id="wash" cx="16%" cy="10%" r="82%">',
        `      <stop offset="0%" stop-color="${ACCENT}" stop-opacity="0.20"/>`,
        `      <stop offset="100%" stop-color="${ACCENT}" stop-opacity="0"/>`,
        '    </radialGradient>',
        '  </defs>',
        `  <rect width="${WIDTH}" height="${HEIGHT}" fill="${INK}"/>`,
        `  <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#wash)"/>`,
        `  <rect x="${PAD}" y="78" width="64" height="6" rx="3" fill="${ACCENT}"/>`,
        '  ' + textNode({
            x: PAD,
            y: 154,
            size: 22,
            weight: 700,
            fill: ACCENT,
            content: String(eyebrow).toUpperCase(),
            extra: ' letter-spacing="4"'
        }),
        ...body.map((node) => `  ${node}`),
        `  <rect x="${PAD}" y="512" width="${CONTENT_WIDTH}" height="1" fill="${TEXT}" fill-opacity="0.12"/>`,
        '  ' + textNode({
            x: PAD,
            y: 562,
            size: 24,
            weight: 700,
            fill: TEXT,
            content: BASICS.site
        }),
        '  ' + textNode({
            x: WIDTH - PAD,
            y: 562,
            size: 24,
            weight: 400,
            fill: MUTED,
            content: `${BASICS.name} · ${BASICS.title}`,
            extra: ' text-anchor="end"'
        }),
        '</svg>',
        ''
    ].join('\n');
}

/* One flat directory, so the filename has to encode the whole path. The same
   derivation serves routes and case studies — "/" becomes home.svg, "/projects"
   becomes projects.svg, "/projects/aura" becomes projects-aura.svg — which
   means a card's filename can be read straight off a URL without a lookup
   table. */
function fileNameFor(pathname) {
    const slug = pathname.split('/').filter(Boolean).join('-');
    return `${slug || 'home'}.svg`;
}

const cards = [
    ...ROUTES.map((route) => ({
        file: fileNameFor(route.path),
        eyebrow: route.path,
        title: route.title,
        deck: route.description
    })),
    /* Each case study is a real, indexable URL now that /projects/:slug
       resolves, so each one earns its own card — these are the links most
       likely to be shared on their own. */
    ...PROJECTS.map((project) => ({
        file: fileNameFor(`/projects/${project.slug}`),
        eyebrow: project.category,
        title: project.title,
        deck: project.description
    }))
];

mkdirSync(outDir, { recursive: true });

for (const card of cards) {
    writeFileSync(resolve(outDir, card.file), renderCard(card), 'utf8');
}

/* Sweep orphans. Renaming a project changes its slug and therefore its
   filename, and the card under the old name would otherwise sit in the build
   forever — still being served, still showing the old title, to every crawler
   holding the old URL. The directory is generated output, so anything in it
   that this run did not write has no reason to exist. */
const written = new Set(cards.map((card) => card.file));
let removed = 0;
for (const entry of readdirSync(outDir)) {
    if (entry.endsWith('.svg') && !written.has(entry)) {
        rmSync(resolve(outDir, entry));
        removed += 1;
    }
}

console.log(
    `og images: ${cards.length} cards (${ROUTES.length} pages, ${PROJECTS.length} projects)` +
    (removed ? `, ${removed} stale removed` : '')
);

/* ---------------------------------------------------------------------------
   On pointing og:image at these
   ---------------------------------------------------------------------------
   Nothing references public/og/ yet, and that is deliberate: Facebook, LinkedIn
   and X all ignore an SVG og:image and fall back to no preview at all, which
   would be worse than the single profile photo in use today. These cards are
   usable right now as <img> sources and as a design to review; to make them the
   actual social previews they need rasterising to PNG first, which needs an
   image library this project does not have.
   ------------------------------------------------------------------------ */
