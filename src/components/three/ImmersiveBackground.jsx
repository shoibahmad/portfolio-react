import React, { Suspense, lazy, useEffect, useState } from 'react';
import './ImmersiveBackground.css';

/**
 * Code-split boundary. Everything three.js lives behind this import, so the
 * initial bundle never carries it — the chunk is only fetched once a device has
 * been cleared as capable.
 */
const Scene3D = lazy(() => import('./Scene3D'));

/**
 * Decide whether this device should run the WebGL layer at all.
 *
 * The brief was "no lag while scrolling", and the only way to guarantee that on
 * a weak device is to not start a render loop on it. Every check below is a
 * reason the 3D would cost more than it returns.
 */
function shouldRender3D() {
    if (typeof window === 'undefined') return false;

    // Respect the OS accessibility setting
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;

    // Phones and small tablets: battery and thermal cost outweigh the effect,
    // and the corridor is barely visible behind full-width mobile layouts
    if (window.innerWidth < 900) return false;

    // Coarse pointer means touch-first hardware even at desktop widths
    if (window.matchMedia('(pointer: coarse)').matches) return false;

    // Low-core / low-memory machines
    if (typeof navigator.hardwareConcurrency === 'number' && navigator.hardwareConcurrency <= 4) {
        return false;
    }
    if (typeof navigator.deviceMemory === 'number' && navigator.deviceMemory <= 4) {
        return false;
    }

    // Data-saver mode
    if (navigator.connection?.saveData) return false;

    // Actual WebGL support, verified rather than assumed
    try {
        const canvas = document.createElement('canvas');
        const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
        if (!gl) return false;
        // Software renderers (SwiftShader/llvmpipe) report WebGL but are far too slow
        const info = gl.getExtension('WEBGL_debug_renderer_info');
        if (info) {
            const renderer = String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL) || '');
            if (/swiftshader|llvmpipe|software/i.test(renderer)) return false;
        }
        return true;
    } catch {
        return false;
    }
}

const ImmersiveBackground = () => {
    const [enabled, setEnabled] = useState(false);
    const [paused, setPaused] = useState(false);

    // The pinned walkthrough runs its own scene. While it is on screen this
    // corridor is completely hidden behind it, so rendering both would burn a
    // second GPU budget for pixels nobody can see.
    useEffect(() => {
        const onVisibility = (e) => setPaused(Boolean(e.detail));
        window.addEventListener('walkthrough:visibility', onVisibility);
        return () => window.removeEventListener('walkthrough:visibility', onVisibility);
    }, []);

    useEffect(() => {
        if (!shouldRender3D()) return;

        // Defer past first paint so the 3D chunk never competes with the content
        // the visitor actually came to read.
        const start = () => setEnabled(true);

        if ('requestIdleCallback' in window) {
            const id = window.requestIdleCallback(start, { timeout: 2200 });
            return () => window.cancelIdleCallback(id);
        }
        const id = setTimeout(start, 1200);
        return () => clearTimeout(id);
    }, []);

    if (!enabled) return null;

    return (
        <div className="immersive-3d-layer" aria-hidden="true">
            <Suspense fallback={null}>
                <Scene3D paused={paused} />
            </Suspense>
        </div>
    );
};

export default ImmersiveBackground;
