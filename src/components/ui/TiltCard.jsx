import React, { useRef } from 'react';

/**
 * Pointer-tracked tilt for a single card.
 *
 * The rotation is written straight to the node's style inside a rAF rather than
 * through React state. A card grid where every element re-renders on mousemove
 * is the classic reason "3D card" effects feel sticky; this way React never
 * participates in the interaction at all.
 *
 * Angles are intentionally small (max ~5deg). Past roughly 8deg the effect stops
 * reading as a card leaning toward you and starts reading as a novelty.
 */
const TiltCard = ({
    children,
    max = 5,
    lift = 6,
    depth = 30,
    className = '',
    as: Tag = 'div',
    disabled = false,
    ...rest
}) => {
    const ref = useRef(null);
    const frame = useRef(0);
    const target = useRef({ rx: 0, ry: 0, active: false });

    const apply = () => {
        frame.current = 0;
        const node = ref.current;
        if (!node) return;
        const { rx, ry, active } = target.current;
        node.style.transform = active
            ? `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translate3d(0, ${-lift}px, ${depth}px)`
            : '';
    };

    const schedule = () => {
        if (frame.current === 0) frame.current = requestAnimationFrame(apply);
    };

    const handleMove = (e) => {
        if (disabled) return;
        const node = ref.current;
        if (!node) return;
        const rect = node.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        target.current = { rx: -py * max * 2, ry: px * max * 2, active: true };
        schedule();
    };

    const handleLeave = () => {
        target.current = { rx: 0, ry: 0, active: false };
        schedule();
    };

    return (
        <Tag
            ref={ref}
            className={`tilt-card ${className}`}
            onPointerMove={handleMove}
            onPointerLeave={handleLeave}
            {...rest}
        >
            {children}
        </Tag>
    );
};

export default TiltCard;
