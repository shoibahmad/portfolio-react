import React, { useCallback } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import './PageTransition.css';

/* ---------------------------------------------------------------------------
   Smooth Overlay Wipe Transition
   ---------------------------------------------------------------------------
   Award-winning transition style: a gradient overlay panel sweeps across the
   viewport (left → right) to conceal the outgoing page, holds briefly, then
   wipes away (left → right) to reveal the incoming page underneath.

   The effect is achieved with two layers:
   1. The page content itself (simple opacity fade)
   2. An overlay <motion.div> that slides across using clipPath

   This keeps position:sticky and stacking context intact because we never
   apply `filter` to the page wrapper.
   ------------------------------------------------------------------------ */

const EASE = [0.76, 0, 0.24, 1]; // cubic-bezier for buttery smooth movement

/* --- Page content fades gently underneath the wipe overlay --- */
const pageVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      duration: 0.4,
      delay: 0.35,
      ease: 'easeOut',
    },
  },
  exit: {
    opacity: 0,
    transition: {
      duration: 0.25,
      ease: 'easeIn',
    },
  },
};

/* --- The wipe overlay slides in then out --- */
const overlayVariants = {
  initial: {
    clipPath: 'inset(0 100% 0 0)', // fully hidden to the right
  },
  animate: {
    clipPath: [
      'inset(0 100% 0 0)',   // start: hidden
      'inset(0 0% 0 0)',     // mid: fully covers viewport
      'inset(0 0% 0 100%)',  // end: slides away to the left
    ],
    transition: {
      duration: 0.8,
      ease: EASE,
      times: [0, 0.45, 1],
    },
  },
};

/* --- Reduced motion: simple crossfade --- */
const reducedVariants = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.15 } },
  exit:    { opacity: 0, transition: { duration: 0.1 } },
};

const PageTransition = ({ children }) => {
  const location = useLocation();
  const reduceMotion = useReducedMotion();
  const variants = reduceMotion ? reducedVariants : pageVariants;

  const handleComplete = useCallback((definition) => {
    if (definition === 'animate') {
      requestAnimationFrame(() => {
        document
          .querySelectorAll('.animate-on-scroll')
          .forEach((el) => el.classList.add('is-visible'));
      });
    }
  }, []);

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        className="page-transition-wrapper"
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        onAnimationComplete={handleComplete}
      >
        {/* Overlay wipe panel — only rendered when motion is allowed */}
        {!reduceMotion && (
          <motion.div
            className="page-transition-overlay"
            variants={overlayVariants}
            initial="initial"
            animate="animate"
            aria-hidden="true"
          />
        )}

        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default PageTransition;
