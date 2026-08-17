import React, { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion } from 'framer-motion';
import './Reveal3D.css';

/**
 * Depth presets — the "from" pose each element animates out of.
 * Only compositor-friendly properties (transform / opacity) are animated,
 * so a page full of these still scrolls at 60fps.
 */
const PRESETS = {
    tilt:   { rotateX: 26,  rotateY: 0,   z: -160, y: 64,  scale: 0.94 },
    depth:  { rotateX: 12,  rotateY: 0,   z: -420, y: 36,  scale: 0.86 },
    flipL:  { rotateX: 8,   rotateY: -30, z: -220, y: 28,  scale: 0.92 },
    flipR:  { rotateX: 8,   rotateY: 30,  z: -220, y: 28,  scale: 0.92 },
    rise:   { rotateX: 14,  rotateY: 0,   z: -70,  y: 84,  scale: 0.97 },
    unfold: { rotateX: -34, rotateY: 0,   z: -140, y: -20, scale: 0.95 }
};

const SPRING = { type: 'spring', stiffness: 62, damping: 18, mass: 0.9 };

/**
 * Scroll-triggered 3D entrance.
 *
 * Uses whileInView (one-shot) rather than a scroll-linked progress value so the
 * animation is guaranteed to complete — a scroll-linked reveal on an element near
 * the bottom of the document can never finish its input range and would stay
 * permanently half-transformed.
 */
export const Reveal3D = ({
    children,
    preset = 'tilt',
    delay = 0,
    perspective = 1300,
    amount = 0.15,
    once = true,
    className = '',
    style,
    ...rest
}) => {
    const reduceMotion = useReducedMotion();
    const from = PRESETS[preset] || PRESETS.tilt;

    if (reduceMotion) {
        return <div className={className} style={style} {...rest}>{children}</div>;
    }

    return (
        <div className="reveal3d-stage" style={{ perspective: `${perspective}px` }}>
            <motion.div
                className={`reveal3d-item ${className}`}
                style={style}
                initial={{
                    opacity: 0,
                    rotateX: from.rotateX,
                    rotateY: from.rotateY,
                    z: from.z,
                    y: from.y,
                    scale: from.scale
                }}
                whileInView={{ opacity: 1, rotateX: 0, rotateY: 0, z: 0, y: 0, scale: 1 }}
                viewport={{ once, amount }}
                transition={{ ...SPRING, delay }}
                {...rest}
            >
                {children}
            </motion.div>
        </div>
    );
};

/**
 * Staggered 3D reveal for lists/grids. Each direct child gets an incremental delay.
 */
export const Reveal3DGroup = ({
    children,
    preset = 'rise',
    stagger = 0.08,
    baseDelay = 0,
    perspective = 1300,
    amount = 0.1,
    className = '',
    ...rest
}) => {
    const reduceMotion = useReducedMotion();
    const items = React.Children.toArray(children);

    if (reduceMotion) {
        return <div className={className} {...rest}>{children}</div>;
    }

    return (
        <div className={className} style={{ perspective: `${perspective}px` }} {...rest}>
            {items.map((child, i) => (
                <Reveal3D
                    key={child.key ?? i}
                    preset={preset}
                    delay={baseDelay + i * stagger}
                    perspective={perspective}
                    amount={amount}
                >
                    {child}
                </Reveal3D>
            ))}
        </div>
    );
};

/**
 * Scroll-linked parallax depth. Safe here because it drives a continuous
 * decorative offset rather than a reveal — a clamped range just means less travel.
 */
export const ParallaxDepth = ({
    children,
    speed = 60,
    rotate = 0,
    scaleRange = null,
    className = '',
    ...rest
}) => {
    const ref = useRef(null);
    const reduceMotion = useReducedMotion();

    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start']
    });

    const smooth = useSpring(scrollYProgress, { stiffness: 110, damping: 30, mass: 0.4 });

    const y = useTransform(smooth, [0, 1], [speed, -speed]);
    const rotateX = useTransform(smooth, [0, 0.5, 1], [rotate, 0, -rotate]);
    const scale = useTransform(
        smooth,
        [0, 0.5, 1],
        scaleRange ?? [1, 1, 1]
    );

    if (reduceMotion) {
        return <div ref={ref} className={className} {...rest}>{children}</div>;
    }

    return (
        <motion.div
            ref={ref}
            className={`reveal3d-parallax ${className}`}
            style={{ y, rotateX, scale }}
            {...rest}
        >
            {children}
        </motion.div>
    );
};

export default Reveal3D;
