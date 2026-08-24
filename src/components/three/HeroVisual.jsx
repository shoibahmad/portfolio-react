import React, { Suspense, lazy, useEffect, useState } from 'react';
import './HeroVisual.css';

/**
 * Code-split boundary. Everything three.js lives behind this import, so the
 * initial bundle never carries it — the chunk is fetched only after a device has
 * been cleared as capable.
 */
const HeroObject = lazy(() => import('./HeroObject'));

/**
 * Decide whether this device should run WebGL, and at what quality.
 *
 * Returns 'high' | 'low' | null. null means render the static fallback and never
 * start a render loop at all — on a weak device that is the only way to
 * guarantee the page still scrolls cleanly.
 */
function detectQuality() {
    if (typeof window === 'undefined') return null;

    // Respect the OS accessibility setting
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;

    // Data-saver mode
    if (navigator.connection?.saveData) return null;

    // Verify WebGL rather than assume it
    let renderer = '';
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (!gl) return null;

        // Software renderers report WebGL support but are far too slow to use
        const info = gl.getExtension('WEBGL_debug_renderer_info');
        if (info) {
            renderer = String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL) || '');
            if (/swiftshader|llvmpipe|software/i.test(renderer)) return null;
        }
    } catch {
        return null;
    }

    const cores = navigator.hardwareConcurrency;
    const memory = navigator.deviceMemory;

    if ((typeof cores === 'number' && cores <= 4) ||
        (typeof memory === 'number' && memory <= 4) ||
        window.matchMedia('(pointer: coarse)').matches) {
        // Capable enough to render, not enough for shadow maps and 64-segment
        // geometry. The scene reads the same at this tier, it just costs less.
        return 'low';
    }

    return 'high';
}

/**
 * Static stand-in shown while the chunk loads, and permanently on devices that
 * fail the capability check. It mirrors the silhouette of the rendered object —
 * a lit sphere sitting on a soft contact shadow — so the layout never shifts and
 * the composition still reads as intended without WebGL.
 */
const StaticForm = () => (
    <div className="hero-object-fallback" aria-hidden="true">
        <div className="hero-object-fallback__ring" />
        <div className="hero-object-fallback__sphere" />
        <div className="hero-object-fallback__shadow" />
    </div>
);

const HeroVisual = () => {
    const [quality, setQuality] = useState(null);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        const q = detectQuality();
        if (!q) return;

        // Defer past first paint so the three.js chunk never competes with the
        // content the visitor actually came to read.
        const start = () => {
            setQuality(q);
            setReady(true);
        };

        if ('requestIdleCallback' in window) {
            const id = window.requestIdleCallback(start, { timeout: 1800 });
            return () => window.cancelIdleCallback(id);
        }
        const id = setTimeout(start, 900);
        return () => clearTimeout(id);
    }, []);

    if (!ready) return <StaticForm />;

    return (
        <Suspense fallback={<StaticForm />}>
            <HeroObject quality={quality} />
        </Suspense>
    );
};

export default HeroVisual;
