import { useRef, useEffect } from 'react';

/**
 * Document scroll progress (0..1) exposed as a ref, never as state.
 *
 * This is the single most important piece for scroll smoothness: writing scroll
 * position into React state re-renders the tree on every scroll event, which is
 * what makes scroll-driven 3D sites stutter. A ref lets the render loop sample
 * the latest value without React participating in scrolling at all.
 *
 * The listener is passive (never blocks the compositor) and rAF-coalesced, so
 * bursty wheel/touch events collapse into at most one read per frame.
 * `scrollHeight` is cached and only re-measured on resize, since reading it
 * during scroll would force layout every frame.
 */
export function useScrollProgress() {
    const progress = useRef(0);

    useEffect(() => {
        let rafId = 0;
        let maxScroll = 1;

        const measure = () => {
            const doc = document.documentElement;
            maxScroll = Math.max(doc.scrollHeight - window.innerHeight, 1);
        };

        const read = () => {
            rafId = 0;
            progress.current = Math.min(Math.max(window.scrollY / maxScroll, 0), 1);
        };

        const onScroll = () => {
            if (rafId === 0) rafId = requestAnimationFrame(read);
        };

        const onResize = () => {
            measure();
            onScroll();
        };

        measure();
        read();

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize, { passive: true });

        // Route changes and image loads change document height without a resize event
        const ro = new ResizeObserver(measure);
        ro.observe(document.documentElement);

        return () => {
            if (rafId) cancelAnimationFrame(rafId);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            ro.disconnect();
        };
    }, []);

    return progress;
}

/**
 * Normalised pointer position (-0.5..0.5) as a ref, for camera parallax.
 * Same no-state rule as above.
 */
export function usePointerRef() {
    const pointer = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const onMove = (e) => {
            pointer.current.x = e.clientX / window.innerWidth - 0.5;
            pointer.current.y = e.clientY / window.innerHeight - 0.5;
        };
        window.addEventListener('pointermove', onMove, { passive: true });
        return () => window.removeEventListener('pointermove', onMove);
    }, []);

    return pointer;
}
