import React from 'react';

/**
 * Layout wrapper.
 *
 * This used to attach a mousemove listener per section to drive a radial
 * "flashlight" highlight. That effect is gone with the glass theme, so the
 * listener is gone too — several sections each sampling pointer position every
 * frame is real main-thread cost for no remaining visual result.
 *
 * Kept as a component because four sections still compose with it, and a plain
 * wrapper is a cheaper change than rewriting each of their layouts.
 */
const Spotlight = ({ children, className = '', ...rest }) => (
    <div className={className} {...rest}>
        {children}
    </div>
);

export default Spotlight;
