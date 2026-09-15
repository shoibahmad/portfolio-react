/**
 * Route table — the single source for navigation metadata.
 *
 * Every page previously shared the one `<title>` and description baked into
 * index.html, so `/projects` and `/contact` were indistinguishable in search
 * results and in link previews. These entries drive the per-route metadata at
 * runtime, and `scripts/generate-sitemap.mjs` builds sitemap.xml from the same
 * list at build time — which is what stops the sitemap going stale again.
 */

export const SITE_URL = 'https://shoibahmad.in';

const NAME = 'Shoib Ahmad';

export const ROUTES = [
    {
        path: '/',
        title: `${NAME} — Full-Stack Engineer`,
        description:
            'Full-stack engineer shipping production systems end to end: React and Next.js interfaces on FastAPI and Django REST Framework backends, with LLMs integrated into real product workflows.',
        changefreq: 'weekly',
        priority: '1.0'
    },
    {
        path: '/projects',
        title: `Projects — ${NAME}`,
        description:
            'Nineteen shipped systems across web, mobile and applied AI — each with its architecture, the problem it solved, and what it taught.',
        changefreq: 'weekly',
        priority: '0.9'
    },
    {
        path: '/skills',
        title: `Skills — ${NAME}`,
        description:
            'The stack behind the work: React.js, Next.js, Tailwind, FastAPI, Django REST Framework, LLM integration, PostgreSQL, Docker and GCP.',
        changefreq: 'monthly',
        priority: '0.7'
    },
    {
        path: '/experience',
        title: `Experience & education — ${NAME}`,
        description:
            'Client engagements owned end to end, plus education, certifications and published research.',
        changefreq: 'monthly',
        priority: '0.8'
    },
    {
        path: '/services',
        title: `Services — ${NAME}`,
        description:
            'React and Next.js interfaces, REST API backends, and LLM integration — three areas where the work is deep rather than broad.',
        changefreq: 'monthly',
        priority: '0.8'
    },
    {
        path: '/resume',
        title: `Resume — ${NAME}`,
        description:
            'An interactive career timeline: filter by section, or select any technology to trace it across every role and degree it appears in.',
        changefreq: 'monthly',
        priority: '0.8'
    },
    {
        path: '/contact',
        title: `Contact — ${NAME}`,
        description:
            'Open to new opportunities, high-impact projects, and AI engineering collaborations. Email, LinkedIn, GitHub or WhatsApp.',
        changefreq: 'yearly',
        priority: '0.6'
    }
];

/** Shown for any path the router does not recognise. */
export const NOT_FOUND_META = {
    title: `Page not found — ${NAME}`,
    description: 'That page does not exist. Browse the projects, skills and experience instead.'
};

export function findRouteMeta(pathname) {
    return ROUTES.find((route) => route.path === pathname) || null;
}
