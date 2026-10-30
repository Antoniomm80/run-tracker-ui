import { useSyncExternalStore } from "react";

export function useMediaQuery(query: string): boolean {
    return useSyncExternalStore(
        (onChange) => {
            const media = window.matchMedia(query);
            media.addEventListener("change", onChange);
            return () => media.removeEventListener("change", onChange);
        },
        () => window.matchMedia(query).matches,
        () => false,
    );
}

/** Matches Tailwind's `md` breakpoint: list + detail side by side. */
export const useIsSplitLayout = () => useMediaQuery("(min-width: 768px)");
