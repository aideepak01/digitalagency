import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * True only after the client has hydrated. Uses useSyncExternalStore
 * (not useEffect + setState) so React handles the post-hydration
 * re-render itself instead of triggering a cascading render.
 */
export function useMounted() {
  return useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );
}
