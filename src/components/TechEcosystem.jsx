import React, { useRef, useEffect, useState, useMemo } from 'react';
import ForceGraph2D from 'react-force-graph-2d';

const TechEcosystem = () => {
    const containerRef = useRef(null);
    const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
    const [isDark, setIsDark] = useState(false); // Could hook into a global theme context

    // Detect theme from CSS variables or system preference
    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: containerRef.current.clientHeight || 600
                });
            }
        };

        window.addEventListener('resize', updateDimensions);
        updateDimensions();

        // Simple dark mode detection via computed style
        const fgColor = getComputedStyle(document.body).getPropertyValue('--text-primary');
        if (fgColor && fgColor.includes('#fff')) { // Very basic check, can be improved
            setIsDark(true);
        }

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const data = useMemo(() => {
        const nodes = [
            // Core Hubs
            { id: "Shoib", group: 0, val: 20, label: "Shoib Ahmad" },
            { id: "AI/ML", group: 1, val: 15 },
            { id: "Web Dev", group: 2, val: 15 },
            { id: "Mobile", group: 3, val: 15 },
            { id: "Backend", group: 4, val: 12 },

            // AI/ML Stack
            { id: "Python", group: 1, val: 10 },
            { id: "TensorFlow", group: 1, val: 8 },
            { id: "Scikit-learn", group: 1, val: 8 },
            { id: "Pandas", group: 1, val: 6 },
            { id: "NLP", group: 1, val: 8 },
            { id: "OpenCV", group: 1, val: 6 },

            // Web Stack
            { id: "React", group: 2, val: 10 },
            { id: "Next.js", group: 2, val: 8 },
            { id: "JavaScript", group: 2, val: 8 },
            { id: "HTML/CSS", group: 2, val: 6 },
            { id: "Vite", group: 2, val: 5 },

            // Mobile Stack
            { id: "Flutter", group: 3, val: 12 },
            { id: "Dart", group: 3, val: 8 },
            { id: "Kotlin", group: 3, val: 6 },
            { id: "Android", group: 3, val: 6 },

            // Backend/Tools
            { id: "Node.js", group: 4, val: 8 },
            { id: "Firebase", group: 4, val: 9 },
            { id: "Flask", group: 4, val: 7 },
            { id: "FastAPI", group: 4, val: 7 },
            { id: "MongoDB", group: 4, val: 7 },
            { id: "Git", group: 5, val: 6 },
            { id: "Linux", group: 5, val: 6 },
            { id: "C++", group: 6, val: 6 },
            { id: "Java", group: 6, val: 6 },
        ];

        const links = [
            // Hub Connections
            { source: "Shoib", target: "AI/ML" },
            { source: "Shoib", target: "Web Dev" },
            { source: "Shoib", target: "Mobile" },
            { source: "Shoib", target: "Backend" },

            // AI/ML Connections
            { source: "AI/ML", target: "Python" },
            { source: "Python", target: "TensorFlow" },
            { source: "Python", target: "Scikit-learn" },
            { source: "Python", target: "Pandas" },
            { source: "AI/ML", target: "NLP" },
            { source: "AI/ML", target: "OpenCV" },

            // Web Connections
            { source: "Web Dev", target: "React" },
            { source: "React", target: "Next.js" },
            { source: "React", target: "JavaScript" },
            { source: "Web Dev", target: "HTML/CSS" },
            { source: "Web Dev", target: "Vite" },

            // Mobile Connections
            { source: "Mobile", target: "Flutter" },
            { source: "Flutter", target: "Dart" },
            { source: "Mobile", target: "Kotlin" },
            { source: "Mobile", target: "Android" },

            // Backend/Cross-cutting
            { source: "Backend", target: "Node.js" },
            { source: "Backend", target: "Flask" },
            { source: "Backend", target: "FastAPI" },
            { source: "Backend", target: "MongoDB" },
            { source: "Backend", target: "Firebase" },
            { source: "Web Dev", target: "Node.js" }, // Cross link
            { source: "Mobile", target: "Firebase" }, // Cross link
            { source: "Python", target: "Flask" },
            { source: "Python", target: "FastAPI" },

            // Core Langs
            { source: "Shoib", target: "C++" },
            { source: "Shoib", target: "Java" },
            { source: "Shoib", target: "Linux" },
            { source: "Shoib", target: "Git" },
        ];

        return { nodes, links };
    }, []);

    const [highlightNodes, setHighlightNodes] = useState(new Set());
    const [highlightLinks, setHighlightLinks] = useState(new Set());
    const [hoverNode, setHoverNode] = useState(null);

    const handleNodeHover = (node) => {
        setHoverNode(node || null);
        const newHighlightNodes = new Set();
        const newHighlightLinks = new Set();

        if (node) {
            newHighlightNodes.add(node.id);
            // specific logic to find neighbors based on links
            // We need to iterate over *all* links to find connected ones because react-force-graph
            // might change the link object structure to include source/target objects instead of IDs.
            // However, since we define 'data' in useMemo, let's access the graph's internal structure if possible
            // or just search the `data.links`.
            // Note: After the graph initializes, data.links source/target become Objects.

            // A safer way is to rely on the graph's internal state, but we don't have direct access to "neighbors" property usually.
            // We will iterate through the links available in the force-graph callback or state.
            // Actually, the `node` object passed to onNodeHover usually has a `neighbors` array if we calculate it, 
            // but by default it doesn't.
            // Let's do a quick link search:
            data.links.forEach(link => {
                const sourceId = typeof link.source === 'object' ? link.source.id : link.source;
                const targetId = typeof link.target === 'object' ? link.target.id : link.target;

                if (sourceId === node.id) {
                    newHighlightNodes.add(targetId);
                    newHighlightLinks.add(link);
                } else if (targetId === node.id) {
                    newHighlightNodes.add(sourceId);
                    newHighlightLinks.add(link);
                }
            });
        }

        setHighlightNodes(newHighlightNodes);
        setHighlightLinks(newHighlightLinks);
    };

    const paintRing = (node, ctx, globalScale) => {
        // add ring just for highlighted nodes
        const fontSize = 12 / globalScale;
        ctx.beginPath();
        const r = Math.sqrt(Math.max(0, node.val || 1)) * 4 + 2;
        ctx.arc(node.x, node.y, r * 1.4, 0, 2 * Math.PI, false);
        ctx.fillStyle = node === hoverNode ? 'rgba(255,255,255,0.2)' : 'transparent';
        ctx.fill();
        ctx.strokeStyle = node === hoverNode ? 'rgba(255,255,255,0.6)' : 'transparent';
        ctx.stroke();
    };

    return (
        <div ref={containerRef} style={{ width: '100%', height: '600px', background: 'var(--bg-secondary)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--border)' }}>
            <ForceGraph2D
                width={dimensions.width}
                height={dimensions.height}
                graphData={data}
                nodeLabel="id"
                nodeColor={node => {
                    if (hoverNode && !highlightNodes.has(node.id)) return 'rgba(200,200,200,0.2)';
                    const colors = ['#27272a', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];
                    return colors[node.group % colors.length];
                }}
                linkColor={link => {
                    if (hoverNode && !highlightLinks.has(link)) return 'rgba(200,200,200,0.1)';
                    return '#cbd5e1';
                }}
                linkWidth={link => (hoverNode && highlightLinks.has(link) ? 3 : 1.5)}
                linkDirectionalParticles={4}
                linkDirectionalParticleWidth={link => (hoverNode && highlightLinks.has(link) ? 3 : 0)}
                nodeCanvasObject={(node, ctx, globalScale) => {
                    const label = node.id;
                    const fontSize = 14 / globalScale; // 14px fixed screen size

                    // Radius logic
                    const radius = Math.sqrt(Math.max(0, node.val || 1)) * 4 + 2;

                    // Node coloring logic
                    const isHub = node.group <= 4;
                    const isDimmed = hoverNode && !highlightNodes.has(node.id);
                    const opacity = isDimmed ? 0.2 : 1; // Higher opacity for ghost nodes so they aren't invisible

                    ctx.globalAlpha = opacity;

                    // Draw Node Circle
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, radius, 0, 2 * Math.PI, false);

                    // Colors
                    const colors = ['#27272a', '#ef4444', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#64748b'];
                    const baseColor = colors[node.group % colors.length] || '#333';

                    ctx.fillStyle = isDimmed ? '#cbd5e1' : baseColor;
                    ctx.fill();

                    // Draw Text
                    ctx.globalAlpha = 1; // Text always fully opaque (or controlled)

                    // Configure Text
                    ctx.font = `${isHub ? 'bold' : 'normal'} ${fontSize}px Sans-Serif`;
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';

                    // Text Color logic
                    // Hubs: Text inside, usually white
                    // Others: Text below, dark for contrast

                    if (isHub && node.val > 10) {
                        // Inside the bubble
                        ctx.fillStyle = '#ffffff';
                        // Only draw if there is space? hub radius is ~20px. fontSize is variable. 
                        // If zoomed way out, text might overflow bubble, but usually fine.
                        ctx.fillText(label, node.x, node.y);
                    } else {
                        // Below the bubble
                        const textY = node.x + radius + fontSize;

                        // Draw a subtle background for the text for max readability
                        const textWidth = ctx.measureText(label).width;
                        const bkgPad = 2 / globalScale;

                        if (!isDimmed) {
                            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
                            ctx.fillRect(
                                node.x - textWidth / 2 - bkgPad,
                                node.y + radius + 1,
                                textWidth + bkgPad * 2,
                                fontSize + bkgPad * 2
                            );
                        }

                        ctx.fillStyle = isDimmed ? 'rgba(0,0,0,0.2)' : '#1e293b';
                        ctx.fillText(label, node.x, node.y + radius + fontSize);
                    }
                }}
                nodeCanvasObjectMode={() => 'replace'} // We take over drawing
                onNodeHover={handleNodeHover}
                onNodeDragEnd={node => {
                    node.fx = node.x;
                    node.fy = node.y;
                }}
                enableNodeDrag={true}
                enableZoomInteraction={true}
                d3VelocityDecay={0.3}
            />
        </div>
    );
};

// Helper to darken colors (simple version)
function adjustColor(color, amount) {
    return '#' + color.replace(/^#/, '').replace(/../g, color => ('0' + Math.min(255, Math.max(0, parseInt(color, 16) + amount)).toString(16)).substr(-2));
}

export default TechEcosystem;
