/**
 * Writing catalogue.
 *
 * Held here, next to the project and profile catalogues, for the same reason
 * they are: a fact that appears on the site should appear in exactly one file,
 * and a post is mostly facts.
 *
 * `body` is a typed block array rather than a Markdown string, and that is a
 * deliberate trade. Markdown would mean shipping a parser and a sanitiser to
 * every visitor in order to render two documents written by one person and
 * reviewed before they go out — a dependency, a bundle cost and an injection
 * surface, bought in exchange for authoring convenience nobody has asked for.
 * A block array renders with plain JSX and zero new packages, every block type
 * is one the renderer actually supports (so a typo fails visibly in
 * development instead of emitting raw asterisks in production), and the content
 * stays queryable: reading time below is computed from these blocks rather than
 * typed by hand and then quietly going stale.
 *
 * Block shapes:
 *   { type: 'p',       text }
 *   { type: 'h2',      text }
 *   { type: 'list',    items: [], ordered?: boolean }
 *   { type: 'code',    lang, code, caption? }
 *   { type: 'callout', tone: 'note' | 'todo', text }
 *
 * `tone: 'todo'` is a gap marker rather than a note to the reader — see the
 * handling in BlogPost.jsx. Every technical claim in these posts traces to
 * something recorded in src/data/projects.js or src/data/profile.js; where a
 * sentence would be stronger with a number, a snippet or an incident that is
 * not written down anywhere in this repo, there is a todo block instead of an
 * invention.
 */

export const POSTS = [
    {
        slug: 'offline-first-sync-ruralhealth',
        title: "Writing a sync layer that assumes the network is gone",
        dek: "RuralHealth AI had to stay fully usable with no connectivity, then reconcile without loss or duplication the moment a device came back. Notes on the IndexedDB store, the SyncQueue above it, and why conflict was both the smallest part and the nastiest.",
        date: '2026-09-14',
        tags: ['Offline-first', 'IndexedDB', 'Sync', 'React', 'Django REST Framework'],
        body: [
            {
                type: 'p',
                text: "The requirement that shaped RuralHealth AI was not a feature. It was a condition: the frontline health workers who use it screen patients in places where connectivity is intermittent or absent, and the app has to be fully usable anyway. Every other decision in the system — the Django REST Framework API, the role-based dashboards, the Gemini Pro clinical risk analysis — sits downstream of that one sentence."
            },
            {
                type: 'p',
                text: "Offline support sounds like something you add at the end, a cache bolted on once the features work. It is not. If the network is optional, every write has to be allowed to succeed before anyone knows whether it will ever reach a server — and that changes what a write is. It stops being a request and becomes a record of an intention the system now owes someone."
            },

            { type: 'h2', text: "Two requirements that pull against each other" },
            {
                type: 'p',
                text: "Stated plainly, the brief was: fully usable with no connectivity, and reconcile without loss or duplication once a device reconnects. Those two sentences are the whole engineering problem, and they pull in opposite directions."
            },
            {
                type: 'p',
                text: "The first says the interface must never wait on a server. A worker standing in front of a patient with a form to fill cannot be told to try again later. The second says the data is not disposable. Screening records feed a regional dashboard used for high-risk surveillance, and PostgreSQL keeps the audit log. A record that quietly fails to upload is worse than one that was never taken, because the dashboard then shows an absence where there was really a patient — and an absence reads like a negative result. A record that uploads twice is worse again: it inflates exactly the counts an officer is deciding from."
            },
            {
                type: 'p',
                text: "So the device has to be authoritative for a while, and then stop being authoritative, cleanly, without anybody noticing the handover."
            },

            { type: 'h2', text: "Local-first means the form does not know about the network" },
            {
                type: 'p',
                text: "The architecture that falls out of this is local-first, and the inversion matters far more than the choice of storage engine. The interface writes to a local store on the device and takes its acknowledgement from there. It never calls the API directly and it never waits on one. A separate process — the SyncQueue — owns the job of getting whatever is in that store to the server, eventually."
            },
            {
                type: 'p',
                text: "The practical consequence is that the screening form contains no connectivity logic at all. No spinner tied to a fetch, no error state for a timeout, no retry button. That is the difference between an offline mode you can reason about and one that works on the three screens somebody remembered to handle."
            },

            { type: 'h2', text: "Why IndexedDB and not the easy option" },
            {
                type: 'p',
                text: "localStorage was never really a candidate. It is synchronous, so every read blocks the main thread on what is realistically a mid-range Android phone. It stores strings, so structured screening data is serialised and reparsed on every access. It has no indexes, so the most frequent query in the whole layer — give me the writes that have not synced yet, oldest first — means reading and parsing the entire store."
            },
            {
                type: 'p',
                text: "IndexedDB is the opposite on every one of those axes: asynchronous, transactional, storing structured clones rather than strings, and indexed. The transactional part is easy to overlook and it is the one that saves you. A phone closed, dropped or killed by the operating system mid-write is a normal event here rather than an edge case, and a half-written screening record is the kind of corruption you find weeks later in an audit log, with no way left to reconstruct what the worker actually saw."
            },
            {
                type: 'p',
                text: "There is nothing exotic underneath any of it. Two ordinary browser APIs carry the whole thing, and all of the actual engineering is in what sits between them."
            },
            {
                type: 'code',
                lang: 'js',
                caption: "Illustrative — the two platform primitives the layer stands on, not the project's source.",
                code: [
                    "// The index is the point. The queue's hot query is \"pending writes,",
                    "// oldest first\", and that must never mean scanning the whole store.",
                    "const store = db.createObjectStore('screenings', { keyPath: 'localId' });",
                    "store.createIndex('bySyncState', ['syncState', 'createdAt']);",
                    "",
                    "// An 'online' event is a prompt to try again. It is not evidence.",
                    "window.addEventListener('online', () => queue.drain());"
                ].join('\n')
            },
            {
                type: 'callout',
                tone: 'todo',
                text: "TODO: replace the illustrative snippet above with the real object-store definition and version-upgrade handler from the RuralHealth repo, including the actual store names and index keys."
            },

            { type: 'h2', text: "The queue, and the contract it is held to" },
            {
                type: 'p',
                text: "The SyncQueue is a custom piece rather than an off-the-shelf library. The reason to write one is that generic sync libraries make a conflict policy decision on your behalf, and in a clinical context you spend longer fighting the default than you would have spent writing the thing."
            },
            {
                type: 'p',
                text: "The contract is short. A write is accepted locally and acknowledged to the person using the app immediately. It is marked pending. It is attempted whenever the device looks reachable. It is only treated as done once the server has confirmed it, and nothing in the interface is allowed to imply otherwise before then."
            },
            {
                type: 'p',
                text: "That last clause is a product decision as much as a technical one. Saved and saved to the server are different facts, and a health system should not blur them — least of all for the person who will be asked, months later, why a record is missing."
            },
            {
                type: 'callout',
                tone: 'todo',
                text: "TODO: confirm how pending versus confirmed state is surfaced in the health worker interface — a per-record indicator, a global queue count, or both."
            },

            { type: 'h2', text: "Retry is mostly about what not to retry" },
            {
                type: 'p',
                text: "Retry logic is where a naive implementation drains batteries and then gets itself rate-limited. Retrying immediately on failure is wrong here for two reasons, both about correlation. A device that has just failed is almost certainly still offline, so a retry fifty milliseconds later is a wasted radio wake-up on a phone that has to last a day in the field. And connectivity tends to return for everybody at once: a district of devices retrying on the same schedule arrives at the API as one herd, a self-inflicted outage at exactly the moment the data finally has somewhere to go. Backoff with jitter is the standard answer because the alternative fails in a way that looks identical to the server being broken."
            },
            {
                type: 'p',
                text: "The more interesting half is classification. A transport error or a 503 is worth retrying. A 400 is not. A malformed payload retried forever is a queue that never drains and a device that is permanently syncing. Non-retryable failures have to leave the queue and surface as something a person can act on, because a failure that exists only in a log is a failure nobody in a rural clinic is ever going to see."
            },
            {
                type: 'callout',
                tone: 'todo',
                text: "TODO: document the real backoff schedule (base delay, multiplier, ceiling, jitter), the attempt cap before a write is parked, and what the worker sees when a record is parked permanently."
            },

            { type: 'h2', text: "Conflict is smaller than it looks, and the remainder is nastier" },
            {
                type: 'p',
                text: "Most of the usual conflict horror stories do not apply here, for a structural reason worth stating out loud: the clinical risk analysis runs server-side, with Gemini Pro, after the data has arrived. The device never computes the thing most likely to be contested. The client is the sole author of the raw screening data; the server is the sole author of the derived assessment. When two writers never touch the same field, most of the conflict surface disappears by construction rather than by cleverness — and designing it away is far cheaper than resolving it afterwards."
            },
            {
                type: 'p',
                text: "What is left is genuine. Role-based access spans health worker, officer and patient interfaces, so more than one role can legitimately touch the same record, and a device dark for a day can be holding an edit made against a version that has since moved on. Last-write-wins is the obvious default, and it is wrong here in a specific direction: the stale writer is the offline one, and the offline one is the person who was standing with the patient. A rule that systematically discards the field observation in favour of whoever happened to have signal is not a tiebreak, it is a bias."
            },
            {
                type: 'callout',
                tone: 'todo',
                text: "TODO: write up the actual conflict-resolution rule used in the SyncQueue — which fields are client-authoritative, which are server-authoritative, and one worked example of a record edited on both sides."
            },

            { type: 'h2', text: "Reconnecting is not an event" },
            {
                type: 'p',
                text: "navigator.onLine and the online event are worth less than they appear. They tell you the device has a network interface, not that anything is reachable. A captive portal is online. A connection that resolves DNS and then times out is online. So the event is a prompt to try, not a statement of fact, and reconciliation has to be driven by an attempt actually succeeding rather than by the browser's optimism."
            },
            {
                type: 'p',
                text: "Order matters too. Pushing pending local writes before pulling server state is not an arbitrary preference: doing it the other way round lets the pull overwrite work that has not been sent yet, which is the precise loss case the entire layer exists to prevent."
            },
            {
                type: 'callout',
                tone: 'todo',
                text: "TODO: describe the real reconciliation pass — push-then-pull ordering, how the pull is scoped per role, and how the regional dashboard learns that a batch of backdated screenings has just landed."
            },

            { type: 'h2', text: "What I would keep" },
            {
                type: 'list',
                items: [
                    "Decide local-first at the start. It is an inversion of control, not a feature, and retrofitting it means rewriting every screen that saves anything.",
                    "Keep connectivity logic in one place and let the interface stay ignorant of it.",
                    "Choose a store with indexes and transactions. The hot query is what is still pending; the hostile environment is a phone that dies mid-write.",
                    "Classify failures before scheduling retries. Permanent failures need a person, not a timer.",
                    "Design conflict away where you can, by giving every field one legitimate author.",
                    "Treat online as a hint, and a successful response as the only evidence."
                ]
            },
            {
                type: 'p',
                text: "None of this is novel and none of it is clever. It is the whole difference between a demo on a desk with full-strength wifi and an application that still works for somebody standing in a village with no bars, which was the only requirement that ever mattered."
            }
        ]
    },

    {
        slug: 'evaluating-llm-output-without-ground-truth',
        title: "Evaluating model output when there is no ground truth",
        dek: "Two of the systems I have shipped grade things nobody holds a labelled answer for: whether exam behaviour was suspicious, and whether a candidate fits a role. What you can still measure once the key at the back of the book is gone.",
        date: '2026-10-06',
        tags: ['LLM evaluation', 'Gemini', 'Embeddings', 'pgvector', 'MediaPipe'],
        body: [
            {
                type: 'p',
                text: "Two of the systems I have shipped are graded on something nobody holds a labelled answer for. SecureEval AI decides whether what a student did during an examination was suspicious. Mike AI decides whether a candidate fits a role. Neither question has a key at the back of the book, and pretending otherwise is the most common way I have watched an LLM feature ship broken."
            },
            {
                type: 'p',
                text: "It is worth starting with the contrast, because I have also built the comfortable kind. Truth Guard AI is a convolutional model for deepfake detection reporting 92% accuracy on the FaceForensics++ benchmark — a public benchmark, deliberately, rather than a split I chose for myself. Med-AI Vigi is an XGBoost and random-forest ensemble for adverse drug reaction risk, reporting an 87% F1 and an 18% reduction in false negatives against the baseline. In both cases the label exists before I arrive, and the argument is only about which metric to report and whether the split is honest. That is a comfortable argument to be having."
            },
            {
                type: 'p',
                text: "Then you build something where the label does not exist, and every habit from the first kind of project quietly stops working."
            },

            { type: 'h2', text: "Suspicious was not a label, it was a negotiation" },
            {
                type: 'p',
                text: "SecureEval AI is an examination-integrity platform built for Integral University and now in active daily institutional use. The detection pipeline has two halves: MediaPipe Face Mesh runs in the browser and handles multi-face geometry, and Gemini 1.5 classifies behavioural sequences server-side."
            },
            {
                type: 'p',
                text: "What is not in the architecture diagram is that the requirements arrived ambiguous — the definition of suspicious itself had to be negotiated with the university's stakeholders. That is not a project-management footnote, it is the evaluation problem. You cannot measure agreement with a ground truth that does not exist yet, and in this domain the ground truth is not discovered, it is decided."
            },
            {
                type: 'p',
                text: "So the first evaluation artefact on a project like this is not a test set. It is a rubric, written down and agreed by the people who will act on the output. If two invigilators watching the same session cannot agree on whether it was suspicious, no model is going to settle it for them, and a precision figure computed against one person's opinion is measuring that person."
            },
            {
                type: 'callout',
                tone: 'todo',
                text: "TODO: include the agreed definition of suspicious that came out of the stakeholder sessions, and the rubric text the Gemini 1.5 classifier is actually prompted with."
            },

            { type: 'h2', text: "Split the system where truth comes back" },
            {
                type: 'p',
                text: "The most useful structural move was keeping those two halves separate, because they are evaluable in completely different ways."
            },
            {
                type: 'p',
                text: "How many distinct face meshes are present in a frame is a geometric fact. It has an answer. You can hold that layer to an objective standard, build a fixture set, and regress it like any other code. Whether a sequence of behaviour over several minutes constitutes collusion is a judgement, and no fixture set will ever settle it. Pushing as much of the decision as possible down into the layer where truth still exists, and reserving the model for the part that genuinely needs judgement, is the highest-leverage move I know in a system like this. Every decision you take out of the model is a decision you can test."
            },

            { type: 'h2', text: "Precision is the metric you can actually audit" },
            {
                type: 'p',
                text: "The figure that platform reports is 90%+ precision on suspicious-activity detection, and reporting precision rather than accuracy or recall is not cosmetic."
            },
            {
                type: 'p',
                text: "Precision is auditable without a complete labelled set. To check it you only have to review what the system flagged: a finite pile a human being can realistically work through. Recall is the expensive one, because knowing what you missed means labelling everything, including the thousands of sessions in which nothing happened. Nobody on a live platform is going to produce that corpus, and a recall number quoted without one is a number somebody made up."
            },
            {
                type: 'p',
                text: "Precision also matches the cost asymmetry. Flagging an honest student is not the mirror image of missing a dishonest one; one of those produces an accusation against a named person. The output is not a verdict, it is evidence handed to an invigilator through a real-time monitoring dashboard — and making the session observable enough for a human to adjudicate properly is what makes a precision-first metric the honest choice rather than the convenient one."
            },
            {
                type: 'callout',
                tone: 'todo',
                text: "TODO: record how the 90%+ precision was measured — sample size, who adjudicated the flagged sessions, over what period, and against which version of the agreed rubric."
            },

            { type: 'h2', text: "The recruitment version of the same problem" },
            {
                type: 'p',
                text: "Mike AI ranks candidates on experience-role fit rather than keyword overlap. Resumes and job descriptions are embedded with Gemini's text embedding model and stored in Supabase pgvector; ranking is high-dimensional similarity search over those vectors. The failure it exists to fix is specific: keyword filters miss qualified people whose experience does not match the phrasing a recruiter happened to type."
            },
            {
                type: 'p',
                text: "The missing label here is whether somebody turned out to be a good hire, and it is missing in a worse way than SecureEval's. It does not arrive for months. It arrives only for candidates who were actually hired — a sample selected by the very system you are evaluating — and it is confounded by everything that happens to a person after they start. You will never close that loop fast enough to learn from it."
            },
            {
                type: 'code',
                lang: 'sql',
                caption: "Illustrative — the generic pgvector ranking shape, not the project's source.",
                code: [
                    "-- pgvector exposes distance as an operator, so \"rank by fit\"",
                    "-- collapses into an ORDER BY.",
                    "SELECT id",
                    "FROM   candidates",
                    "ORDER  BY embedding <=> :job_embedding",
                    "LIMIT  20;"
                ].join('\n')
            },
            {
                type: 'p',
                text: "Mechanically the ranking is that, and the simplicity is the problem: no number in that query means anything to a human. A cosine distance of 0.31 is not a fact a recruiter can act on, and more to the point it is not a fact a recruiter can dispute."
            },

            { type: 'h2', text: "Build the evaluation out of the failure you were hired to fix" },
            {
                type: 'p',
                text: "When there is no ground truth for correct, there is very often still a ground truth for better than what it replaced. The brief for Mike AI names its baseline explicitly — keyword filtering — and a named baseline makes a bounded evaluation possible."
            },
            {
                type: 'p',
                text: "Run both over the same role. Take the set difference: the candidates semantic search surfaces that the keyword filter dropped, and the ones it drops that the keyword filter kept. Hand only that difference to a recruiter and ask, for each one, which call was right. That is a finishable review — dozens of judgements rather than thousands, aimed precisely at the behaviour the system was built to change, and it yields a claim you can defend in one sentence: of the people keyword matching would have hidden, this proportion were genuinely worth a conversation."
            },
            {
                type: 'p',
                text: "It also fails usefully. If the recruiter sides with the keyword filter across most of the difference, the embedding is adding noise rather than fit — learned for the price of an afternoon rather than a hiring cycle."
            },
            {
                type: 'callout',
                tone: 'todo',
                text: "TODO: state whether this baseline-difference evaluation was run on Mike AI, on which role and candidate pool, and what the recruiter's adjudication came back as."
            },

            { type: 'h2', text: "Make the output explain itself, then evaluate the explanation" },
            {
                type: 'p',
                text: "The other reason a similarity score alone is not enough is that it cannot be checked. That is why match results carry generated pros and cons alongside a breakdown across skills, experience and role fit rather than a bare number. The explanation is not decoration. It is the evaluation surface."
            },
            {
                type: 'p',
                text: "A recruiter cannot tell you whether 0.31 is right. They can tell you in seconds that the system has credited somebody with four years of a tool they have never touched. Structured, checkable reasons turn an unfalsifiable score into a set of claims a domain expert can mark wrong — and if the reasons are wrong, the score is wrong, whatever the vectors say. It is the same argument for reaching after a heuristic you can read whenever one will do: Aura detects sarcasm through tone-emoji contradiction and polarity-emotion mismatch, and the rule fitting in a sentence is most of what makes it reviewable."
            },

            { type: 'h2', text: "What stays measurable" },
            {
                type: 'p',
                text: "Even with no correctness label, a surprising amount survives:"
            },
            {
                type: 'list',
                items: [
                    "Stability. Run the same input ten times. Output that moves is telling you about sampling rather than about the world, and that variance bounds every other number you report.",
                    "Agreement with an adjudicated sample — small, carefully labelled, scored against the written rubric rather than one person's instinct.",
                    "Precision on flagged items, because the flags are a finite pile somebody can review.",
                    "Recovery against the baseline you replaced, which is where the keyword difference lives.",
                    "Behaviour under load. SecureEval's asynchronous REST endpoints and explicit service contracts exist to hold concurrent student sessions, and throughput under concurrency is an ordinary engineering fact with an ordinary measurement.",
                    "Failure behaviour: what happens when the model returns malformed output, times out, or refuses. Fully testable, and where unevaluated systems actually break."
                ]
            },

            { type: 'h2', text: "Rigor, calibration, clarity" },
            {
                type: 'p',
                text: "The three words I kept from Mercor's agent-evaluation course are rigor, calibration and clarity, and they map onto all of the above almost directly. Rigor is writing the rubric down before measuring anything. Calibration is being honest about which number you are entitled to claim — precision, not accuracy, when all you reviewed is the flags. Clarity is making the output explain itself well enough that the person holding it can tell you when it is wrong."
            },
            {
                type: 'p',
                text: "None of that hands you a ground truth. It hands you something more useful on a system that is already live: a defensible account of what you measured, what you could not, and which of those two the number in the headline came from."
            },
            {
                type: 'callout',
                tone: 'todo',
                text: "TODO: add one real incident — a session SecureEval flagged wrongly, or a candidate Mike AI ranked badly — with what the review found and what changed afterwards. Both posts would be stronger for a concrete failure, and I have not written one down."
            }
        ]
    }
];

/* Reading time is derived rather than typed.
   A hand-written "7 min read" is correct exactly once: the first edit to a post
   makes it a lie, and nothing in the build would ever catch it. 200 words per
   minute is the conventional figure for prose on a screen. Code blocks count at
   a quarter weight, because a reader skims a snippet rather than reading every
   token of it, and counting them at full rate makes a technical post look twice
   as long as it actually reads. */
function blockWords(block) {
    const count = (value) => (value ? value.trim().split(/\s+/).length : 0);

    switch (block.type) {
        case 'list':
            return block.items.reduce((total, item) => total + count(item), 0);
        case 'code':
            return Math.round((count(block.code) + count(block.caption)) / 4);
        default:
            return count(block.text);
    }
}

export function readingTimeFor(body) {
    const words = body.reduce((total, block) => total + blockWords(block), 0);
    return Math.max(1, Math.round(words / 200));
}

/* Attached once at module load rather than recomputed per render, so the index
   card and the post header cannot disagree about how long the same post is. */
for (const post of POSTS) {
    post.readingTime = readingTimeFor(post.body);
}

/* A duplicate slug would make one post unreachable and silently shadow another,
   exactly as it would in the project catalogue. Cheap to check once, and it
   fails loudly during development instead of producing a URL that quietly opens
   the wrong article. */
if (import.meta.env?.DEV) {
    const seen = new Map();
    for (const post of POSTS) {
        if (seen.has(post.slug)) {
            console.error(
                `[posts] duplicate slug "${post.slug}": ` +
                `"${seen.get(post.slug)}" and "${post.title}"`
            );
        }
        seen.set(post.slug, post.title);
    }
}

/**
 * Reading order: newest first.
 *
 * Sorted here rather than inside the components so the index, the prev/next
 * links and anything added later all agree on one order. Two surfaces
 * disagreeing about which post is the latest is the bug this prevents.
 */
export const POSTS_BY_DATE = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));

/**
 * Human date for a post's ISO timestamp.
 *
 * Pinned to en-GB rather than the visitor's locale on purpose: the posts are
 * written in British English, and a date that renders "10/6/2026" for some
 * readers and "6/10/2026" for others is ambiguous in a way a spelled-out month
 * never is. The explicit UTC timezone stops a reader west of Greenwich seeing
 * the previous day.
 */
export function formatPostDate(iso) {
    return new Date(`${iso}T00:00:00Z`).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC'
    });
}

export function findPostBySlug(slug) {
    return POSTS.find((post) => post.slug === slug) || null;
}

/**
 * The posts either side of `slug` in reading order.
 *
 * `next` is the newer post, which is the direction a reader is travelling if
 * they arrived from the index — that lists newest first, so "next" there means
 * further up the page, not further back in time.
 */
export function findPostNeighbours(slug) {
    const index = POSTS_BY_DATE.findIndex((post) => post.slug === slug);
    if (index === -1) return { previous: null, next: null };

    return {
        previous: POSTS_BY_DATE[index + 1] || null,
        next: POSTS_BY_DATE[index - 1] || null
    };
}
