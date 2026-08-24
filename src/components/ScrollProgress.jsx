import { useEffect, useRef } from 'react';
import './ScrollProgress.css';

/**
 * Reading-progress hairline.
 *
 * Writes `transform: scaleX()` straight to the node inside a rAF instead of
 * holding progress in state. Two reasons: React never re-renders during scroll,
 * and a scale is a compositor-only change where the previous `width: %` forced
 * a layout pass on every scroll event.
 */
const ScrollProgress = () => {
    const barRef = useRef(null);

    useEffect(() => {
        let frame = 0;
        let max = 1;

        const measure = () => {
            const doc = document.documentElement;
            max = Math.max(doc.scrollHeight - doc.clientHeight, 1);
        };

        const paint = () => {
            frame = 0;
            const progress = Math.min(Math.max(window.scrollY / max, 0), 1);
            if (barRef.current) {
                barRef.current.style.transform = `scaleX(${progress})`;
            }
        };

        const onScroll = () => {
            if (frame === 0) frame = requestAnimationFrame(paint);
        };

        const onResize = () => {
            measure();
            onScroll();
        };

        measure();
        paint();

        window.addEventListener('scroll', onScroll, { passive: true });
        window.addEventListener('resize', onResize, { passive: true });

        // Route changes and late-loading images change document height without
        // firing a resize event
        const observer = new ResizeObserver(onResize);
        observer.observe(document.documentElement);

        return () => {
            if (frame) cancelAnimationFrame(frame);
            window.removeEventListener('scroll', onScroll);
            window.removeEventListener('resize', onResize);
            observer.disconnect();
        };
    }, []);

    return <div className="scroll-progress" ref={barRef} aria-hidden="true" />;
};

export default ScrollProgress;
