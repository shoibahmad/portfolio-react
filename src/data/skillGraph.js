/**
 * Skill → project graph.
 *
 * Derived, never hand-maintained. The relationships drawn by <SkillGraph> come
 * out of the same catalogue every other surface reads — the `tech` array on
 * each project — so adding a project adds its edges, and a graph that
 * disagrees with the project list is not a state this file can reach.
 *
 * Three layers, in the order a neural network reads:
 *
 *   domains  →  skills  →  projects
 *
 * The middle layer is the dense one on purpose. A skill belongs to exactly one
 * domain but feeds many projects, so the fan-out happens on the right-hand
 * side where there is room for it, and the left-hand side stays readable.
 */

import { PROJECTS } from './projects';

/* ---------------------------------------------------------------------------
   Canonicalisation
   ---------------------------------------------------------------------------
   The catalogue spells the same technology several ways, because each entry
   was written while that project was fresh: "React", "React 18" and "React.js"
   are three strings for one node. Collapsing them here rather than editing the
   catalogue keeps each project's tech list reading the way its author meant it.

   Anything not named below passes through unchanged — this is a correction
   list, not a whitelist, so a new technology reaches the graph on its own.
   ------------------------------------------------------------------------ */
const ALIASES = {
    'React.js': 'React',
    'React 18': 'React',
    'React 19': 'React',
    Gemini: 'Gemini AI',
    'Gemini 1.5': 'Gemini AI',
    'Gemini Pro': 'Gemini AI',
    'Gemini 2.5 Flash': 'Gemini AI',
    'Gemini Vision': 'Gemini AI',
    'Django REST Framework': 'Django',
    'Firebase Firestore': 'Firebase',
    'Firebase Auth': 'Firebase',
    Tailwind: 'Tailwind CSS',
    JS: 'JavaScript',
    'JavaScript (ES6+)': 'JavaScript',
    Node: 'Node.js',
    ML: 'Machine learning',
    'Naive Bayes': 'Machine learning',
    'Scikit-learn': 'Machine learning',
    SpaCy: 'NLP',
    TextBlob: 'NLP'
};

const canonical = (tech) => ALIASES[tech] || tech;

/* ---------------------------------------------------------------------------
   Domains
   ---------------------------------------------------------------------------
   Deliberately not SKILL_GROUPS. That list is organised for reading as a CV —
   seven groups, several of which hold a single project's worth of technology.
   Six wider domains give the input layer a shape that fans out instead of
   running parallel, which is the whole point of drawing it.

   A technology named in no domain is dropped rather than bucketed into an
   "Other" node: a catch-all would accumulate every one-off dependency and go
   on to dominate the picture it is supposed to clarify.
   ------------------------------------------------------------------------ */
export const DOMAINS = [
    {
        id: 'frontend',
        label: 'Frontend',
        tech: [
            'React',
            'Next.js',
            'Vite',
            'Tailwind CSS',
            'Framer Motion',
            'React Router',
            'Chart.js',
            'highlight.js',
            'Lottie',
            'JSZip',
            'HTML',
            'CSS'
        ]
    },
    {
        id: 'backend',
        label: 'Backend & APIs',
        tech: ['FastAPI', 'Flask', 'Django', 'Node.js']
    },
    {
        id: 'ai',
        label: 'AI & LLM',
        tech: ['Gemini AI', 'LangChain', 'Machine learning', 'NLP', 'Pandas']
    },
    {
        id: 'data',
        label: 'Data & storage',
        tech: ['Firebase', 'Supabase', 'pgvector', 'MongoDB', 'JSON']
    },
    {
        id: 'mobile',
        label: 'Mobile',
        tech: ['Flutter', 'Dart', 'Android', 'Provider']
    },
    {
        id: 'tooling',
        label: 'Languages & tooling',
        tech: [
            'Python',
            'JavaScript',
            'TypeScript',
            'Docker',
            'Playwright',
            'Puppeteer',
            'Selenium',
            'Cloudinary'
        ]
    }
];

/** Reverse index: canonical technology → the domain that claims it. */
const DOMAIN_OF = new Map();
DOMAINS.forEach((domain) => {
    domain.tech.forEach((tech) => DOMAIN_OF.set(tech, domain.id));
});

/**
 * Shorten a catalogue title to something that fits beside a 6px node.
 *
 * Project titles carry a subtitle after an em dash ("Mike AI — Smart
 * Recruitment Platform") that is useful in a list and useless in a diagram.
 * Same split the slug generator uses, so the label and the URL always name the
 * same half of the title.
 */
export function shortTitle(title) {
    return title.split(/[—(]/)[0].trim();
}

/**
 * Build the graph.
 *
 * @param {object} [options]
 * @param {number} [options.skillLimit] How many technologies to draw. The tail
 *   is a long list of single-use dependencies — drawing all of them turns the
 *   middle column into a wall of one-edge nodes and buries the technologies
 *   that actually recur. Ranked by project count, ties broken alphabetically so
 *   the layout is stable across builds rather than dependent on array order.
 */
export function buildSkillGraph({ skillLimit = 14 } = {}) {
    /* Tech → the projects using it, deduped per project: an entry listing both
       "React" and "React 18" must not count twice and must not draw two edges
       into the same node. */
    const usage = new Map();

    PROJECTS.forEach((project) => {
        const seen = new Set();

        (project.tech || []).forEach((raw) => {
            const tech = canonical(raw);
            if (!DOMAIN_OF.has(tech) || seen.has(tech)) return;
            seen.add(tech);

            if (!usage.has(tech)) usage.set(tech, []);
            usage.get(tech).push(project.slug);
        });
    });

    const ranked = [...usage.entries()]
        .map(([label, slugs]) => ({
            id: `skill-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
            label,
            domain: DOMAIN_OF.get(label),
            slugs
        }))
        .sort((a, b) => b.slugs.length - a.slugs.length || a.label.localeCompare(b.label))
        .slice(0, skillLimit);

    /* Only projects that survived the skill cut get a node. A project whose
       every technology fell into the tail would otherwise sit in the output
       column with nothing connected to it, reading as a failure rather than as
       the result of a filter. */
    const projects = PROJECTS.map((project) => ({
        id: `project-${project.slug}`,
        slug: project.slug,
        label: shortTitle(project.title),
        category: project.category,
        skills: ranked.filter((s) => s.slugs.includes(project.slug)).map((s) => s.id)
    })).filter((project) => project.skills.length > 0);

    const liveProjects = new Set(projects.map((p) => p.id));

    const skills = ranked.map((skill) => ({
        id: skill.id,
        label: skill.label,
        domain: skill.domain,
        projects: skill.slugs
            .map((slug) => `project-${slug}`)
            .filter((id) => liveProjects.has(id))
    }));

    /* Domains are filtered last, for the same reason: a domain whose skills all
       fell outside the limit has nothing left to connect to. */
    const domains = DOMAINS.map((domain) => ({
        id: `domain-${domain.id}`,
        label: domain.label,
        skills: skills.filter((s) => s.domain === domain.id).map((s) => s.id)
    })).filter((domain) => domain.skills.length > 0);

    const edges = [
        ...domains.flatMap((domain) =>
            domain.skills.map((skillId) => ({
                id: `${domain.id}__${skillId}`,
                from: domain.id,
                to: skillId,
                layer: 0
            }))
        ),
        ...skills.flatMap((skill) =>
            skill.projects.map((projectId) => ({
                id: `${skill.id}__${projectId}`,
                from: skill.id,
                to: projectId,
                layer: 1
            }))
        )
    ];

    return { domains, skills, projects, edges };
}

/**
 * Adjacency for highlighting.
 *
 * Hovering a node lights the whole path it participates in, not just its
 * immediate neighbours — a project has to reach back through its skills to the
 * domains, or the top of the diagram goes dark at exactly the moment you ask
 * it what a project is made of. Computed once per graph rather than per hover,
 * because a hover handler that walks every edge is a hover handler that drops
 * frames on a trackpad sweep.
 */
export function buildAdjacency(graph) {
    const related = new Map();
    const edgesFor = new Map();

    const link = (a, b) => {
        if (!related.has(a)) related.set(a, new Set([a]));
        related.get(a).add(b);
    };

    graph.edges.forEach((edge) => {
        link(edge.from, edge.to);
        link(edge.to, edge.from);

        [edge.from, edge.to].forEach((nodeId) => {
            if (!edgesFor.has(nodeId)) edgesFor.set(nodeId, new Set());
            edgesFor.get(nodeId).add(edge.id);
        });
    });

    /* The second hop — domain ↔ project, through whichever skills they share.
       Without it, hovering "AI & LLM" lights its technologies and stops, which
       is the least interesting half of the answer.

       The edge sets have to make the same hop. A domain that lights its
       projects while the curves reaching them stay dim draws a path with a
       hole in the middle, which reads as a rendering bug rather than as a
       highlight. */
    const domainOfSkill = new Map();
    graph.domains.forEach((domain) => {
        domain.skills.forEach((skillId) => domainOfSkill.set(skillId, domain.id));
    });

    const ownEdge = (nodeId, edgeId) => {
        if (!edgesFor.has(nodeId)) edgesFor.set(nodeId, new Set());
        edgesFor.get(nodeId).add(edgeId);
    };

    graph.skills.forEach((skill) => {
        const domainId = domainOfSkill.get(skill.id);

        skill.projects.forEach((projectId) => {
            const outgoing = `${skill.id}__${projectId}`;

            if (domainId) {
                link(domainId, projectId);
                link(projectId, domainId);

                /* The domain reaches forward past its own technologies... */
                ownEdge(domainId, outgoing);
                /* ...and the project reaches back past the technologies that
                   built it, to the domains they belong to. */
                ownEdge(projectId, `${domainId}__${skill.id}`);
            }
        });
    });

    return { related, edgesFor };
}
