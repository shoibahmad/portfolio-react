/**
 * Profile — single source of truth, transcribed from the CV.
 *
 * Before this file existed the same facts were typed out in eight places: the
 * hero, the about chapters, the contact list, the footer, the resume page, the
 * printable CV sheet, the terminal, and the JSON-LD in index.html. They had
 * already drifted — the phone number, the MCA grade and the role list disagreed
 * depending on which page you were on.
 *
 * Everything that appears in more than one surface lives here. Update the CV,
 * update this file, and every surface follows.
 */

export const BASICS = {
    name: 'Shoib Ahmad',
    title: 'Full-Stack Engineer',
    specialties: ['React', 'Next.js', 'REST APIs', 'AI/LLM Integration', 'Tailwind'],
    email: 'shoibsahmad@gmail.com',

    /* No `phone` field on purpose.
     *
     * The number is never rendered as text anywhere on the site — the only way
     * to reach it is the WhatsApp action below, which opens a conversation
     * directly.
     *
     * Note the number is still present inside this URL, because wa.me requires
     * it to address the chat. That means it is visible on hover, in the status
     * bar and in page source. To remove it completely, create a WhatsApp
     * Business short link (https://wa.me/message/XXXXXXXX) and paste it here in
     * place of this URL — nothing else needs to change. */
    whatsapp:
        'https://wa.me/918840324043?text=' +
        encodeURIComponent(
            'Hi Shoib — I came across your portfolio and would like to talk about a project.'
        ),
    whatsappLabel: 'Chat on WhatsApp',

    location: 'Lucknow, India',
    availability: 'Open to opportunities',
    site: 'shoibahmad.in',
    siteUrl: 'https://shoibahmad.in',
    linkedin: 'https://www.linkedin.com/in/shoib-ahmad-788096219/',
    linkedinLabel: 'linkedin.com/in/shoib-ahmad-788096219',
    github: 'https://github.com/shoibahmad',
    githubLabel: 'github.com/shoibahmad'
};

/** The CV's professional summary, trimmed to a hero-sized lede. */
export const LEDE =
    'Final-year MCA student who ships production full-stack systems end to end — from React and Next.js interfaces to REST API backends — including a live examination-integrity platform in daily institutional use and an offline-first rural healthcare platform, both owned solo from requirements through deployment.';

export const SUMMARY =
    'Final-year MCA student (CGPA 8.10) who ships production full-stack systems end-to-end — from React/Next.js interfaces to REST API backends — including a live examination-integrity platform in daily institutional use and an offline-first rural healthcare platform, both owned solo from requirements through deployment. Comfortable across the stack (React.js, Next.js, Tailwind CSS, FastAPI/Django REST Framework), with a track record of turning ambiguous product requirements into working, well-tested systems with minimal supervision. Integrates LLMs (Gemini, Claude) into real product workflows — prompt design, model evaluation, pipeline integration — and is currently deepening TypeScript and Node.js/NestJS.';

/** Rotating roles in the hero, taken from the CV's title line. */
export const ROLES = [
    'Full-Stack Engineer',
    'React & Next.js Developer',
    'REST API Engineer',
    'AI & LLM Integration'
];

/**
 * Hero fact row. Every number here is verifiable from the CV or from the
 * project catalogue — nothing is rounded up for effect.
 */
export const FACTS = [
    { value: '19', label: 'Projects' },
    { value: '2', label: 'Live platforms' },
    { value: '8.10', label: 'MCA CGPA' },
    { value: '1', label: 'Publication' }
];

/**
 * Skills, grouped exactly as the CV groups them.
 *
 * No proficiency percentages. The CV does not claim any, and a self-assigned
 * "94%" next to a framework name is a number with no unit behind it. The
 * `learning` group is kept separate rather than folded in, because the CV draws
 * that distinction deliberately.
 */
export const SKILL_GROUPS = [
    {
        id: 'frontend',
        title: 'Frontend',
        icon: 'fas fa-code',
        skills: ['React.js', 'Next.js', 'Vite', 'JavaScript (ES6+)', 'Tailwind CSS', 'HTML/CSS']
    },
    {
        id: 'backend',
        title: 'Backend & APIs',
        icon: 'fas fa-server',
        skills: [
            'FastAPI',
            'Django REST Framework',
            'Flask',
            'RESTful API Design',
            'Asynchronous Services',
            'Auth Flows',
            'Service Contracts'
        ]
    },
    {
        id: 'ai',
        title: 'AI / LLM',
        icon: 'fas fa-brain',
        skills: [
            'LLM Integration (Gemini, Claude API)',
            'Prompt Engineering',
            'Model Evaluation',
            'PyTorch',
            'Scikit-learn'
        ]
    },
    {
        id: 'data',
        title: 'Databases',
        icon: 'fas fa-database',
        skills: [
            'PostgreSQL',
            'SQL',
            'Relational Data Modeling',
            'Firebase Firestore',
            'IndexedDB'
        ]
    },
    {
        id: 'cloud',
        title: 'Cloud & DevOps',
        icon: 'fas fa-cloud',
        skills: [
            'Google Cloud Platform',
            'Microsoft Azure',
            'Azure DevOps (CI/CD)',
            'Docker',
            'Git/GitHub',
            'Postman'
        ]
    },
    {
        id: 'fundamentals',
        title: 'Core fundamentals',
        icon: 'fas fa-cubes',
        skills: [
            'Data Structures & Algorithms',
            'OOP',
            'System Design',
            'Offline-First Architecture',
            'Testing',
            'Documentation'
        ]
    },
    {
        id: 'learning',
        title: 'Actively deepening',
        icon: 'fas fa-seedling',
        learning: true,
        skills: ['TypeScript', 'Node.js', 'NestJS', 'RAG Pipelines', 'Vector Databases', 'AWS']
    }
];

/**
 * Professional experience.
 *
 * The CV separates paid engagements from projects, and so does this list. Work
 * that used to sit here as a "role" — Price Radar, ADR Risk Predictor, Resume
 * Analyzer — is project work and lives in the project catalogue instead.
 */
export const EXPERIENCE = [
    {
        title: 'Agentic AI Developer',
        company: 'Mike Agent AI',
        location: 'Remote',
        date: 'Mar 2026 – Apr 2026',
        /* Template literals rather than quoted strings: this copy contains both
           an apostrophe and a pair of double quotes, so either quote character
           would need escaping and the sentence would stop being readable here. */
        summary: `Mike AI is a premium, AI-driven recruitment intelligence platform designed to transform how talent is matched, managed, and hired. By leveraging Google's Gemini AI and vector-based semantic search, Mike AI moves beyond keyword matching to understand the true "fit" between a candidate's experience and a job's requirements.`,
        highlights: [
            `Built a recruitment intelligence platform that matches candidates on semantic fit rather than keyword overlap, using Google's Gemini AI with vector-based search.`,
            'Modelled the match between a candidate and a role as a similarity problem over embeddings, so near-miss phrasing stops hiding qualified people.',
            'Covered the hiring workflow end to end — matching, pipeline management and hiring — rather than scoring candidates in isolation.'
        ],
        skills: ['Gemini AI', 'Vector Search', 'LLM Integration', 'Prompt Engineering', 'Python']
    },
    {
        title: 'Software Developer',
        company: 'SecureEval AI',
        location: 'Lucknow',
        date: 'Jan 2026 – Mar 2026',
        summary:
            'Architected and delivered a dual-interface full-stack examination-integrity platform, now live and in active daily use.',
        highlights: [
            'Architected and delivered a dual-interface full-stack examination-integrity platform (React.js frontend, FastAPI backend), now live and in active daily use — owned end-to-end from design through deployment.',
            'Designed high-throughput asynchronous REST API endpoints with clear service contracts to reliably handle concurrent student sessions at scale.',
            'Integrated MediaPipe Face Mesh and Gemini 1.5 for real-time multi-face detection and behavioural analysis, achieving 90%+ suspicious-activity detection precision.',
            'Partnered directly with university stakeholders to translate ambiguous requirements into a reliable, observable system with a real-time admin monitoring dashboard.'
        ],
        skills: ['React.js', 'FastAPI', 'Gemini 1.5', 'MediaPipe']
    },
    {
        title: 'Freelance Software Engineer',
        company: 'RuralHealthAI',
        location: 'Remote',
        date: '2025 – 2026',
        summary:
            'Independently designed and built an offline-capable disease-screening platform for frontline rural health workers.',
        highlights: [
            'Independently designed and built RuralHealthAI, an offline-capable disease-screening platform (Django REST Framework backend, React 18/Vite frontend) for frontline rural health workers, delivered as a client engagement.',
            'Architected a local-first offline sync layer using IndexedDB and a custom SyncQueue handling retry logic, conflict resolution, and automatic reconciliation on reconnect.',
            'Integrated Google Gemini Pro for AI-driven clinical risk analysis and built REST endpoints for authentication, role-based dashboards, and screening data (Firebase Auth/Firestore + PostgreSQL audit logging).',
            'Implemented role-based access across health worker, officer, and patient interfaces, including a regional dashboard for high-risk surveillance and analytics.'
        ],
        skills: ['Django REST Framework', 'React 18', 'IndexedDB', 'Gemini Pro', 'PostgreSQL']
    }
];

export const EDUCATION = [
    {
        degree: 'Master of Computer Applications (MCA)',
        institution: 'Jamia Hamdard University',
        cgpa: '8.10 / 10',
        date: 'Aug 2024 – Jun 2026',
        location: 'Delhi',
        skills: ['Data Structures & Algorithms', 'System Design', 'OOP']
    },
    {
        degree: 'Bachelor of Computer Applications (BCA)',
        institution: 'Integral University',
        cgpa: '9.10 / 10',
        date: 'Oct 2021 – Jun 2024',
        location: 'Lucknow',
        skills: ['Programming', 'DBMS', 'Software Engineering']
    }
];

export const CERTIFICATIONS = [
    {
        title: 'Generative AI Foundation',
        issuer: 'UpGrad',
        date: 'Jun 2025',
        icon: 'fas fa-brain'
    },
    {
        title: 'Python Bootcamp',
        issuer: 'Code for Cause',
        date: 'Aug 2024',
        icon: 'fab fa-python'
    },
    {
        title: 'Campus Ambassador',
        issuer: 'Hack2skill — Google Build with AI Solution Challenge',
        date: '2026',
        icon: 'fas fa-users'
    }
];

export const PUBLICATIONS = [
    {
        title: 'IU CA Cross Platform Application',
        journal: 'International Journal of Science and Advanced Technology (IJSAT)',
        year: '2025',
        date: 'November 2025',
        authors: 'Shoib Ahmad',
        link: 'https://www.ijsat.org/research-paper.php?id=9262',
        status: 'Published',
        abstract:
            'A cross-platform solution addressing modern university management challenges through unified digital interfaces.'
    }
];
