import React from 'react';
import ErrorBoundaryFallback from './ErrorBoundaryFallback';

/**
 * Last line of defence around the routed tree.
 *
 * Before this existed, a single throwing component took the whole site to a
 * blank white page — React 18+ unmounts the entire tree when an error reaches
 * the root, so a broken project card and a broken router were equally fatal
 * and equally silent. The three most likely sources here are all data-shaped:
 * a project slug that resolves to nothing, a malformed entry in one of the
 * src/data catalogues, and a third-party widget failing to initialise.
 *
 * Still a class. Error boundaries have no hook equivalent — getDerivedState-
 * FromError and componentDidCatch are only available on classes, and that has
 * not changed in React 19.
 */
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
    this.handleReset = this.handleReset.bind(this);
  }

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    /* Kept to console rather than shipped anywhere. There is no error
       reporting service wired up, and inventing a silent network call to one
       would be worse than a log the developer can actually find. */
    console.error('Unhandled error in routed tree:', error, info?.componentStack);
  }

  /* Clearing the error re-renders the children that threw. That is only safe
     because every route here renders from static catalogues — a retry hits the
     same data and either works or fails the same way, rather than replaying a
     mutation. */
  handleReset() {
    this.setState({ error: null });
  }

  componentDidUpdate(prevProps) {
    /* A navigation away from the broken route should clear the error, or the
       fallback would outlive the thing that caused it and the site would look
       permanently broken. */
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) {
      this.handleReset();
    }
  }

  render() {
    if (this.state.error) {
      return <ErrorBoundaryFallback onReset={this.handleReset} />;
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
