import React from 'react';
import { motion, useReducedMotion } from 'framer-motion';

/**
 * Scroll-triggered entrance.
 *
 * Deliberately understated: a short rise and fade, nothing else. The previous
 * version flipped and rotated whole sections through 3D space, which fought the
 * quiet layout it was wrapping — depth belongs on individual cards under the
 * pointer, not on entire pages arriving sideways.
 *
 * Uses `whileInView` (one-shot) rather than a scroll-linked progress value so
 * the animation is guaranteed to finish. A scroll-linked reveal on an element
 * near the bottom of the document can never complete its input range and would
 * sit permanently half-transformed.
 */

const DISTANCE = { rise: 28, soft: 16, none: 0 };

export const Reveal = ({
    children,
    variant = 'rise',
    delay = 0,
    amount = 0.15,
    once = true,
    className = '',
    style,
    ...rest
}) => {
    const reduceMotion = useReducedMotion();
    const y = DISTANCE[variant] ?? DISTANCE.rise;

    if (reduceMotion) {
        return <div className={className} style={style} {...rest}>{children}</div>;
    }

    return (
        <motion.div
            className={className}
            style={style}
            initial={{ opacity: 0, y }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once, amount }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1], delay }}
            {...rest}
        >
            {children}
        </motion.div>
    );
};

/**
 * Staggered entrance for a list or grid. Each direct child gets an incremental
 * delay, capped so a long grid does not leave its last item arriving seconds
 * after the first.
 */
export const RevealGroup = ({
    children,
    variant = 'rise',
    stagger = 0.06,
    baseDelay = 0,
    maxDelay = 0.4,
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
        <div className={className} {...rest}>
            {items.map((child, i) => (
                <Reveal
                    key={child.key ?? i}
                    variant={variant}
                    delay={Math.min(baseDelay + i * stagger, maxDelay)}
                    amount={amount}
                >
                    {child}
                </Reveal>
            ))}
        </div>
    );
};

export default Reveal;
