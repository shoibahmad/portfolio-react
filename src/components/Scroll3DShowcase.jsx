import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import './Scroll3DShowcase.css';

const stackLayers = [
    {
        id: "layer-4",
        number: "04",
        name: "Human Interface & Experience",
        tag: "TOP PRESENTATION LAYER",
        color: "#FF6B00",
        icon: "fas fa-desktop",
        headline: "Fluid, Ultra-Responsive Client Engines",
        description: "Crafting polished user interfaces with React 19, Next.js 16 App Router, Framer Motion micro-animations, and high-contrast accessible design systems.",
        tech: ["React 19", "Next.js 16", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite"],
        metrics: [
            { label: "Rendering", value: "SSR / SPA" },
            { label: "UX Flow", value: "60 FPS" },
            { label: "Responsiveness", value: "Mobile First" }
        ],
        zOffset: 140
    },
    {
        id: "layer-3",
        number: "03",
        name: "GenAI & Agent Intelligence",
        tag: "COGNITIVE & REASONING LAYER",
        color: "#FF8C33",
        icon: "fas fa-brain",
        headline: "Autonomous Agents & Vision Pipelines",
        description: "Orchestrating multi-agent systems, Gemini 2.5 Flash multimodal vision analyzers, RAG workflows, and natural language diagnostic tools.",
        tech: ["Gemini 2.5", "LangChain", "Autonomous Agents", "Multimodal Vision", "Prompt Engineering"],
        metrics: [
            { label: "Agent Specs", value: "12+ Created" },
            { label: "Embeddings", value: "768-dim" },
            { label: "AI Models", value: "Gemini / NLP" }
        ],
        zOffset: 45
    },
    {
        id: "layer-2",
        number: "02",
        name: "Vector Search & Asynchronous APIs",
        tag: "DATA RETRIEVAL & API LAYER",
        color: "#FFAA55",
        icon: "fas fa-database",
        headline: "Microsecond Latency & High Throughput",
        description: "FastAPI REST and WebSocket backends paired with Supabase pgvector high-dimensional similarity search and asynchronous persistence engines.",
        tech: ["FastAPI", "Python 3.12", "Supabase", "pgvector", "SQLAlchemy", "Firebase"],
        metrics: [
            { label: "Latency", value: "<50ms" },
            { label: "Concurrency", value: "Async AsyncIO" },
            { label: "Vector Store", value: "PostgreSQL" }
        ],
        zOffset: -45
    },
    {
        id: "layer-1",
        number: "01",
        name: "Cloud, Containers & Infrastructure",
        tag: "FOUNDATIONAL PLATFORM LAYER",
        color: "#FF5500",
        icon: "fas fa-server",
        headline: "Robust, Reproducible Cloud Deployments",
        description: "Dockerized container clusters, Linux bash automation, GitHub Actions CI/CD workflows, and academic research architectures.",
        tech: ["Docker", "Linux / Bash", "Git", "GitHub Actions", "CI/CD", "Render / GCP"],
        metrics: [
            { label: "Containers", value: "Docker" },
            { label: "Uptime", value: "99.9%" },
            { label: "Environment", value: "Linux-First" }
        ],
        zOffset: -140
    }
];

/**
 * One extruded plate in the exploded stack.
 *
 * Split into its own component so the translateZ `useTransform` runs at the top
 * level of a component rather than inside the parent's `.map()` callback.
 */
const IsometricLayerPlate = ({ layer, isSelected, explosionFactor, onSelect }) => {
    const translateZ = useTransform(
        explosionFactor,
        (v) => `${layer.zOffset * v * 1.35}px`
    );

    return (
        <motion.div
            className={`isometric-layer-plate ${isSelected ? 'selected' : ''}`}
            onClick={onSelect}
            style={{
                translateZ,
                borderColor: isSelected ? layer.color : '#E5DCD3',
                transformStyle: 'preserve-3d'
            }}
            whileHover={{ scale: 1.05 }}
        >
            {/* Plate Surface content */}
            <div className="plate-surface">
                <div className="plate-header">
                    <span className="plate-num" style={{ color: layer.color }}>{layer.number}</span>
                    <span className="plate-title">{layer.name}</span>
                    <i className={`${layer.icon} plate-icon`} style={{ color: layer.color }}></i>
                </div>
                <div className="plate-chips">
                    {layer.tech.slice(0, 3).map((t, idx) => (
                        <span key={idx} className="plate-chip">{t}</span>
                    ))}
                </div>
            </div>

            {/* Plate 3D Extrusion Sides */}
            <div className="plate-edge edge-front"></div>
            <div className="plate-edge edge-side"></div>
        </motion.div>
    );
};

const Scroll3DShowcase = () => {
    const sectionRef = useRef(null);
    const [selectedLayerIndex, setSelectedLayerIndex] = useState(0);

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"]
    });

    // Smooth transforms without viewport locking
    const explosionFactor = useTransform(scrollYProgress, [0.15, 0.5, 0.85], [0.2, 1, 0.4]);
    const stackRotateX = useTransform(scrollYProgress, [0.15, 0.5, 0.85], [56, 50, 44]);
    const stackRotateZ = useTransform(scrollYProgress, [0.15, 0.5, 0.85], [-30, -25, -20]);

    return (
        <section ref={sectionRef} className="exploded-3d-stack-section">
            <div className="container">
                {/* Header */}
                <div className="stack-header text-center">
                    <div className="stack-badge">
                        <span className="badge-dot"></span>
                        3D ARCHITECTURAL DECONSTRUCTION
                    </div>
                    <h2 className="section-title">
                        The Full-Stack <span className="hero-title-accent">System Prism.</span>
                    </h2>
                    <p className="section-subtitle">
                        Scroll down to explode the 3D software architecture and inspect how each layer is engineered.
                    </p>
                </div>

                {/* Interactive 3D Arena */}
                <div className="stack-arena-grid">
                    {/* 3D Exploded Canvas Arena */}
                    <div className="stack-3d-canvas-container">
                        <motion.div
                            className="stack-isometric-prism"
                            style={{
                                rotateX: stackRotateX,
                                rotateZ: stackRotateZ,
                                transformStyle: "preserve-3d"
                            }}
                        >
                            {stackLayers.map((layer, index) => (
                                <IsometricLayerPlate
                                    key={layer.id}
                                    layer={layer}
                                    isSelected={index === selectedLayerIndex}
                                    explosionFactor={explosionFactor}
                                    onSelect={() => setSelectedLayerIndex(index)}
                                />
                            ))}

                            {/* Central 3D Energy Core Laser */}
                            <div className="prism-core-laser"></div>
                        </motion.div>

                        {/* 3D Perspective Footprint Shadow */}
                        <div className="stack-shadow-base"></div>
                    </div>

                    {/* Right: Layer Inspector HUD */}
                    <div className="stack-hud-inspector">
                        <div className="hud-layer-selector">
                            {stackLayers.map((layer, index) => (
                                <button
                                    key={layer.id}
                                    className={`hud-selector-btn ${index === selectedLayerIndex ? 'active' : ''}`}
                                    onClick={() => setSelectedLayerIndex(index)}
                                >
                                    <span className="hud-num">{layer.number}</span>
                                    <span className="hud-name">{layer.name.split(' ')[0]}</span>
                                </button>
                            ))}
                        </div>

                        {/* Active Layer Details Card */}
                        <AnimatePresence mode="wait">
                            {stackLayers[selectedLayerIndex] && (
                                <motion.div
                                    key={stackLayers[selectedLayerIndex].id}
                                    className="hud-details-card"
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.25 }}
                                >
                                    <div className="hud-card-top">
                                        <span className="hud-tag" style={{ color: stackLayers[selectedLayerIndex].color }}>
                                            {stackLayers[selectedLayerIndex].tag}
                                        </span>
                                        <span className="hud-layer-num">{stackLayers[selectedLayerIndex].number} / 04</span>
                                    </div>

                                    <h3 className="hud-title">{stackLayers[selectedLayerIndex].name}</h3>
                                    <h5 className="hud-headline">{stackLayers[selectedLayerIndex].headline}</h5>
                                    <p className="hud-desc">{stackLayers[selectedLayerIndex].description}</p>

                                    {/* Tech Pills */}
                                    <div className="hud-tech-cluster">
                                        <span className="hud-cluster-lbl">DEPLOYED TECHNOLOGIES:</span>
                                        <div className="hud-pills">
                                            {stackLayers[selectedLayerIndex].tech.map((t, idx) => (
                                                <span key={idx} className="hud-tech-pill">{t}</span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Metrics Grid */}
                                    <div className="hud-metrics-row">
                                        {stackLayers[selectedLayerIndex].metrics.map((m, idx) => (
                                            <div key={idx} className="hud-metric-box">
                                                <span className="m-val" style={{ color: stackLayers[selectedLayerIndex].color }}>{m.value}</span>
                                                <span className="m-lbl">{m.label}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Link Action */}
                                    <div className="hud-actions">
                                        <Link to="/skills" className="btn-hud-explore">
                                            <span>Explore Layer Capabilities</span>
                                            <i className="fas fa-arrow-right"></i>
                                        </Link>
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default Scroll3DShowcase;
