import React from 'react';
import './RouteFallback.css';

/**
 * Shown while a lazily-loaded route chunk is in flight.
 *
 * Deliberately not a spinner. The chunks are small and usually arrive inside a
 * frame or two on a warm connection, and a spinner that flashes for 80ms reads
 * as jank rather than as progress — so this holds the page's vertical rhythm
 * with a quiet placeholder and lets a fast load look like no load at all.
 */
const RouteFallback = () => (
  <div className="route-fallback" role="status" aria-live="polite">
    <span className="sr-only">Loading…</span>
    <div className="route-fallback__bar" />
  </div>
);

export default RouteFallback;
