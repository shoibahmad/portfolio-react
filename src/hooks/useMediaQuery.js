import { useCallback, useSyncExternalStore } from 'react';

/**
 * Subscribe to a media query.
 *
 * Built on useSyncExternalStore rather than useState + useEffect. A media query
 * list is exactly what that hook is for: an external store React does not own.
 * It also removes the tearing window the effect-based version had, where the
 * first paint could use a stale match if the viewport changed between the
 * initial read and the subscription.
 *
 * Use this only where a breakpoint needs a genuinely different component tree —
 * a master/detail pane that becomes a card grid, say. Anything CSS can express
 * belongs in a stylesheet; this costs a render.
 */
export function useMediaQuery(query) {
    const subscribe = useCallback(
        (onStoreChange) => {
            if (typeof window === 'undefined') return () => {};
            const list = window.matchMedia(query);
            list.addEventListener('change', onStoreChange);
            return () => list.removeEventListener('change', onStoreChange);
        },
        [query]
    );

    const getSnapshot = useCallback(() => {
        if (typeof window === 'undefined') return false;
        return window.matchMedia(query).matches;
    }, [query]);

    // Server snapshot: no viewport exists, so report the narrow layout. It is
    // the one that degrades gracefully if hydration disagrees.
    const getServerSnapshot = () => false;

    return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export default useMediaQuery;
