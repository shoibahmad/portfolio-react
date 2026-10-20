import React from 'react';
import { Link } from 'react-router-dom';
import './ErrorBoundaryFallback.css';

/**
 * What a visitor sees when a route throws.
 *
 * Presentational only — the boundary that catches the error lives in
 * ErrorBoundary.jsx. Keeping the two apart means this can be opened in
 * isolation while styling it, which a class component that only renders on a
 * real crash otherwise makes awkward.
 *
 * No stack trace and no error message. The visitor cannot act on either, and
 * both leak internals; the developer gets the full detail on the console
 * instead.
 */
const ErrorBoundaryFallback = ({ onReset }) => (
  <div className="error-fallback" role="alert">
    <div className="error-fallback__inner">
      <span className="error-fallback__eyebrow">Something broke</span>

      <h1 className="error-fallback__title">
        This page didn’t load properly.
      </h1>

      <p className="error-fallback__body">
        That’s a fault on my side, not yours. Trying again usually clears it —
        and if it doesn’t, the rest of the site is still fine.
      </p>

      <div className="error-fallback__actions">
        <button type="button" className="error-fallback__button" onClick={onReset}>
          Try again
        </button>
        <Link to="/" className="error-fallback__link" onClick={onReset}>
          Back to home
        </Link>
      </div>
    </div>
  </div>
);

export default ErrorBoundaryFallback;
