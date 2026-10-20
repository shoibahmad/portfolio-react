import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { buildAdjacency, buildSkillGraph } from '../data/skillGraph';
import './SkillGraph.css';

/**
 * The stack, drawn as the network it actually is.
 *
 * Three layers — domains feed technologies, technologies feed projects — with
 * every edge derived from the project catalogue rather than placed by hand.
 * Hovering or focusing any node lights the whole path it belongs to, which is
 * the question the diagram exists to answer: what did this skill actually go
 * into, and what is this project actually made of.
 *
 * Drawn as SVG rather than canvas on purpose. Canvas would render the same
 * picture and lose every node as a focus target, a hit area and a label — and
 * for 39 nodes and 87 edges there is nothing to gain in exchange.
 */

/* Geometry. A fixed viewBox with preserveAspectRatio lets the whole diagram
   scale as one unit, so the layout cannot reflow into overlapping labels at an
   unlucky width — it just gets smaller, and below the breakpoint the container
   scrolls instead. */
const VIEW = { width: 1200, height: 800 };
const PAD_Y = 68;
const COLUMN = { domain: 120, skill: 498, project: 858 };
const DOMAIN_BOX = { width: 168, height: 34 };

/** Evenly distribute n nodes down the usable height, centred as a block. */
function layout(count) {
    const usable = VIEW.height - PAD_Y * 2;
    const step = usable / count;
    return (index) => PAD_Y + step * (index + 0.5);
}

/**
 * Cubic bezier between two columns.
 *
 * Control points pushed horizontally rather than toward each other: it keeps
 * every curve leaving a node at the same angle, so a node with eleven edges
 * reads as a fan instead of a scribble.
 */
function curve(x1, y1, x2, y2) {
    const dx = (x2 - x1) * 0.46;
    return `M${x1},${y1} C${x1 + dx},${y1} ${x2 - dx},${y2} ${x2},${y2}`;
}

/** How many signals travel the network at once while it is idle. */
const PULSE_COUNT = 5;
const PULSE_SPEED = 0.00042; // progress per millisecond — ~2.4s end to end

const SkillGraph = () => {
    const navigate = useNavigate();

    const graph = useMemo(() => buildSkillGraph(), []);
    const { related, edgesFor } = useMemo(() => buildAdjacency(graph), [graph]);

    /* Hover is transient, pin survives the pointer leaving. Kept apart so that
       moving the mouse across a pinned diagram previews another path without
       destroying the one the visitor deliberately selected. */
    const [hovered, setHovered] = useState(null);
    const [pinned, setPinned] = useState(null);
    /* Lazily initialised rather than defaulted to false: a browser with no
       IntersectionObserver never gets the effect below, so it has to start in
       the revealed state or the diagram would be permanently invisible. */
    const [revealed, setRevealed] = useState(
        () => typeof window !== 'undefined' && !('IntersectionObserver' in window)
    );

    const active = hovered || pinned;

    const positions = useMemo(() => {
        const map = new Map();
        const domainY = layout(graph.domains.length);
        const skillY = layout(graph.skills.length);
        const projectY = layout(graph.projects.length);

        graph.domains.forEach((node, i) => map.set(node.id, { x: COLUMN.domain, y: domainY(i) }));
        graph.skills.forEach((node, i) => map.set(node.id, { x: COLUMN.skill, y: skillY(i) }));
        graph.projects.forEach((node, i) => map.set(node.id, { x: COLUMN.project, y: projectY(i) }));

        return map;
    }, [graph]);

    const paths = useMemo(
        () =>
            graph.edges.map((edge) => {
                const from = positions.get(edge.from);
                const to = positions.get(edge.to);
                /* Domain nodes are boxes, so their edges leave the right-hand
                   face rather than the centre — otherwise every curve starts
                   underneath the label it belongs to. */
                const x1 = edge.layer === 0 ? from.x + DOMAIN_BOX.width / 2 : from.x;
                return { ...edge, d: curve(x1, from.y, to.x, to.y) };
            }),
        [graph, positions]
    );

    const activeSet = active ? related.get(active) : null;
    const activeEdges = active ? edgesFor.get(active) : null;

    const isLit = useCallback((id) => !activeSet || activeSet.has(id), [activeSet]);
    const isEdgeLit = useCallback((id) => !activeEdges || activeEdges.has(id), [activeEdges]);

    /* ---------------------------------------------------------------------
       Entrance
       ---------------------------------------------------------------------
       The draw-in only starts once the diagram is actually on screen. Running
       it at mount meant that on the Skills page — where the graph sits below
       two screens of cards — the whole animation had finished before anyone
       scrolled far enough to see it.
       ------------------------------------------------------------------ */
    const rootRef = useRef(null);

    useEffect(() => {
        const node = rootRef.current;
        if (!node || !('IntersectionObserver' in window)) return undefined;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (!entry.isIntersecting) return;
                setRevealed(true);
                observer.disconnect();
            },
            { threshold: 0.18 }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, []);

    /* ---------------------------------------------------------------------
       Idle signals
       ---------------------------------------------------------------------
       A pool of dots walking real paths, positioned by writing straight to the
       DOM inside one rAF loop. Driving these through state would re-render a
       tree of 126 elements sixty times a second to move five circles.

       Each pulse crosses the network in two hops, domain → skill → project, so
       what travels is a complete path rather than a decorative blink.
       ------------------------------------------------------------------ */
    const pathRefs = useRef(new Map());
    const pulseRefs = useRef([]);
    const pulseCoreRefs = useRef([]);

    useEffect(() => {
        if (!revealed) return undefined;
        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

        const layer0 = graph.edges.filter((e) => e.layer === 0);
        const bySource = new Map();
        graph.edges
            .filter((e) => e.layer === 1)
            .forEach((edge) => {
                if (!bySource.has(edge.from)) bySource.set(edge.from, []);
                bySource.get(edge.from).push(edge);
            });

        const pick = (list) => list[Math.floor(Math.random() * list.length)];

        /** A fresh two-hop route, or null if the graph cannot supply one. */
        const route = () => {
            const first = pick(layer0);
            const onward = bySource.get(first.to);
            if (!onward || !onward.length) return null;
            return {
                hops: [first.id, pick(onward).id],
                hop: 0,
                progress: Math.random() * -0.9 // negative staggers the start
            };
        };

        const pulses = Array.from({ length: PULSE_COUNT }, route).filter(Boolean);
        if (!pulses.length) return undefined;

        let frame = 0;
        let last = performance.now();

        const tick = (now) => {
            const delta = Math.min(now - last, 64); // a backgrounded tab must not teleport them
            last = now;

            pulses.forEach((pulse, i) => {
                const dot = pulseRefs.current[i];
                const core = pulseCoreRefs.current[i];
                if (!dot) return;

                pulse.progress += delta * PULSE_SPEED;

                if (pulse.progress >= 1) {
                    pulse.hop += 1;
                    pulse.progress = 0;

                    if (pulse.hop > 1) {
                        const next = route();
                        if (next) Object.assign(pulse, next);
                        else pulse.hop = 0;
                    }
                }

                if (pulse.progress < 0) {
                    dot.style.opacity = '0';
                    if (core) core.style.opacity = '0';
                    return;
                }

                const path = pathRefs.current.get(pulse.hops[pulse.hop]);
                if (!path) {
                    dot.style.opacity = '0';
                    if (core) core.style.opacity = '0';
                    return;
                }

                const point = path.getPointAtLength(path.getTotalLength() * pulse.progress);
                dot.setAttribute('cx', point.x);
                dot.setAttribute('cy', point.y);
                /* Fade in and out at the ends so a dot never pops into
                   existence on top of a node. */
                const fade = Math.sin(pulse.progress * Math.PI);
                dot.style.opacity = String(fade * 0.9);

                if (core) {
                    core.setAttribute('cx', point.x);
                    core.setAttribute('cy', point.y);
                    core.style.opacity = String(fade);
                }
            });

            frame = requestAnimationFrame(tick);
        };

        frame = requestAnimationFrame(tick);
        return () => cancelAnimationFrame(frame);
    }, [graph, revealed]);

    const registerPath = useCallback((id) => (node) => {
        if (node) pathRefs.current.set(id, node);
        else pathRefs.current.delete(id);
    }, []);

    /* ---------------------------------------------------------------------
       Interaction
       ------------------------------------------------------------------ */
    const activate = (node) => {
        if (node.kind === 'project') {
            navigate(`/projects/${node.slug}`);
            return;
        }
        setPinned((current) => (current === node.id ? null : node.id));
    };

    const onKeyDown = (node) => (event) => {
        if (event.key !== 'Enter' && event.key !== ' ') return;
        event.preventDefault();
        activate(node);
    };

    const nodeProps = (node, label) => ({
        tabIndex: 0,
        role: 'button',
        'aria-label': label,
        'aria-pressed': node.kind === 'project' ? undefined : pinned === node.id,
        onMouseEnter: () => setHovered(node.id),
        onMouseLeave: () => setHovered(null),
        onFocus: () => setHovered(node.id),
        onBlur: () => setHovered(null),
        onClick: () => activate(node),
        onKeyDown: onKeyDown(node)
    });

    const className = [
        'skill-graph',
        revealed ? 'is-revealed' : '',
        active ? 'is-focused' : ''
    ]
        .filter(Boolean)
        .join(' ');

    return (
        <section className={className} ref={rootRef} aria-labelledby="skill-graph-title">
            <header className="skill-graph__head">
                <div>
                    <span className="skill-graph__kicker">Signal path</span>
                    <h2 className="skill-graph__title" id="skill-graph-title">
                        Every skill, traced to what it shipped.
                    </h2>
                </div>
                <p className="skill-graph__hint">
                    Hover or focus any node to light its path. Select a project to open
                    its case study.
                    {pinned && (
                        <button
                            type="button"
                            className="skill-graph__clear"
                            onClick={() => setPinned(null)}
                        >
                            Clear selection
                        </button>
                    )}
                </p>
            </header>

            <div className="skill-graph__scroll">
                <svg
                    className="skill-graph__svg"
                    viewBox={`0 0 ${VIEW.width} ${VIEW.height}`}
                    preserveAspectRatio="xMidYMid meet"
                    role="img"
                    aria-label={`Network diagram connecting ${graph.domains.length} domains through ${graph.skills.length} technologies to ${graph.projects.length} projects.`}
                >
                    <defs>
                        <linearGradient id="sg-edge" x1="0" x2="1">
                            <stop offset="0%" stopColor="var(--sg-edge-from)" />
                            <stop offset="100%" stopColor="var(--sg-edge-to)" />
                        </linearGradient>
                        <radialGradient id="sg-pulse">
                            <stop offset="0%" stopColor="var(--sg-signal)" stopOpacity="1" />
                            <stop offset="100%" stopColor="var(--sg-signal)" stopOpacity="0" />
                        </radialGradient>
                    </defs>

                    <g aria-hidden="true">
                        <text
                            className="skill-graph__column-label"
                            x={COLUMN.domain}
                            y="30"
                            textAnchor="middle"
                        >
                            Domains
                        </text>
                        <text
                            className="skill-graph__column-label"
                            x={COLUMN.skill}
                            y="30"
                            textAnchor="middle"
                        >
                            Technologies
                        </text>
                        <text
                            className="skill-graph__column-label"
                            x={COLUMN.project}
                            y="30"
                            textAnchor="middle"
                        >
                            Projects
                        </text>
                    </g>

                    <g className="skill-graph__edges">
                        {paths.map((edge, i) => (
                            <path
                                key={edge.id}
                                ref={registerPath(edge.id)}
                                className={`skill-graph__edge ${isEdgeLit(edge.id) ? '' : 'is-dim'}`}
                                d={edge.d}
                                style={{ '--delay': `${i * 9}ms` }}
                            />
                        ))}
                    </g>

                    <g className="skill-graph__pulses" aria-hidden="true">
                        {Array.from({ length: PULSE_COUNT }, (_, i) => (
                            <g key={i}>
                                <circle
                                    ref={(node) => {
                                        pulseRefs.current[i] = node;
                                    }}
                                    className="skill-graph__pulse"
                                    r="11"
                                    cx="-20"
                                    cy="-20"
                                />
                                <circle
                                    ref={(node) => {
                                        pulseCoreRefs.current[i] = node;
                                    }}
                                    className="skill-graph__pulse-core"
                                    r="2.4"
                                    cx="-20"
                                    cy="-20"
                                />
                            </g>
                        ))}
                    </g>

                    <g className="skill-graph__layer">
                        {graph.domains.map((node, i) => {
                            const { x, y } = positions.get(node.id);
                            const item = { ...node, kind: 'domain' };
                            return (
                                <g
                                    key={node.id}
                                    className={`skill-graph__node is-domain ${isLit(node.id) ? '' : 'is-dim'}`}
                                    style={{ '--delay': `${i * 60}ms` }}
                                    {...nodeProps(
                                        item,
                                        `${node.label} domain, ${node.skills.length} technologies`
                                    )}
                                >
                                    <rect
                                        x={x - DOMAIN_BOX.width / 2}
                                        y={y - DOMAIN_BOX.height / 2}
                                        width={DOMAIN_BOX.width}
                                        height={DOMAIN_BOX.height}
                                        rx="8"
                                    />
                                    <text x={x} y={y} dominantBaseline="central" textAnchor="middle">
                                        {node.label}
                                    </text>
                                </g>
                            );
                        })}

                        {graph.skills.map((node, i) => {
                            const { x, y } = positions.get(node.id);
                            const item = { ...node, kind: 'skill' };
                            return (
                                <g
                                    key={node.id}
                                    className={`skill-graph__node is-skill ${isLit(node.id) ? '' : 'is-dim'}`}
                                    style={{ '--delay': `${360 + i * 45}ms` }}
                                    {...nodeProps(
                                        item,
                                        `${node.label}, used in ${node.projects.length} projects`
                                    )}
                                >
                                    <circle className="skill-graph__halo" cx={x} cy={y} r="14" />
                                    <circle className="skill-graph__dot" cx={x} cy={y} r="6.5" />
                                    <text
                                        x={x - 22}
                                        y={y}
                                        dominantBaseline="central"
                                        textAnchor="end"
                                    >
                                        {node.label}
                                    </text>
                                </g>
                            );
                        })}

                        {graph.projects.map((node, i) => {
                            const { x, y } = positions.get(node.id);
                            const item = { ...node, kind: 'project' };
                            return (
                                <g
                                    key={node.id}
                                    className={`skill-graph__node is-project ${isLit(node.id) ? '' : 'is-dim'}`}
                                    style={{ '--delay': `${900 + i * 32}ms` }}
                                    {...nodeProps(
                                        item,
                                        `${node.label}, built with ${node.skills.length} of these technologies. Opens the case study.`
                                    )}
                                >
                                    <circle className="skill-graph__halo" cx={x} cy={y} r="11" />
                                    <circle className="skill-graph__dot" cx={x} cy={y} r="4.5" />
                                    <text
                                        x={x + 18}
                                        y={y}
                                        dominantBaseline="central"
                                        textAnchor="start"
                                    >
                                        {node.label}
                                    </text>
                                </g>
                            );
                        })}
                    </g>
                </svg>
            </div>

            <footer className="skill-graph__legend">
                <span className="skill-graph__legend-item is-domain">Domain</span>
                <span className="skill-graph__legend-item is-skill">Technology</span>
                <span className="skill-graph__legend-item is-project">Project</span>
                <span className="skill-graph__legend-note">
                    Derived from the project catalogue — {graph.edges.length} connections
                    across {graph.projects.length} builds.
                </span>
            </footer>

            {/* The same relationships as text. An SVG with a one-line label tells
                a screen reader that a diagram exists and nothing about what it
                says; this is the diagram's actual content, reachable by anyone
                who cannot use a pointer or see the curves. */}
            <div className="sr-only">
                <h3>Technologies and the projects they were used in</h3>
                <ul>
                    {graph.skills.map((skill) => (
                        <li key={skill.id}>
                            {skill.label}:{' '}
                            {skill.projects
                                .map(
                                    (id) => graph.projects.find((p) => p.id === id)?.label
                                )
                                .filter(Boolean)
                                .join(', ')}
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    );
};

export default SkillGraph;
