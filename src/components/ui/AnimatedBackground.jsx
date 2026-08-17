import React from 'react';
import './AnimatedBackground.css';

/**
 * Ambient warm glow behind the page.
 *
 * This used to also run a canvas particle system on its own requestAnimationFrame
 * loop with an O(n^2) neighbour scan every frame. That work is now done by the
 * WebGL corridor in ImmersiveBackground, and running two independent render loops
 * is a direct cause of scroll stutter — every frame the main thread spent drawing
 * 2D particles was a frame it could not spend on scrolling.
 *
 * What remains is pure CSS: the orbs animate on `transform` only, so they are
 * composited on the GPU and cost the main thread nothing during scroll.
 */
const AnimatedBackground = () => (
    <div className="animated-bg-container" aria-hidden="true">
        <div className="ambient-orb orb-1"></div>
        <div className="ambient-orb orb-2"></div>
        <div className="ambient-orb orb-3"></div>
    </div>
);

export default AnimatedBackground;
