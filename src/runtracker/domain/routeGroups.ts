import { TrackSummary } from "./types";

export type DistanceBand = "long" | "medium" | "short";
export type DistanceFilter = "all" | DistanceBand;

export const DISTANCE_BANDS: { band: DistanceBand; title: string; chip: string }[] = [
    { band: "long", title: "Larga · 10 km o más", chip: "≥ 10 km" },
    { band: "medium", title: "Media · 6 a 10 km", chip: "6–10 km" },
    { band: "short", title: "Corta · menos de 6 km", chip: "< 6 km" },
];

export function distanceBand(metres: number): DistanceBand {
    if (metres >= 10000) return "long";
    if (metres >= 6000) return "medium";
    return "short";
}

export interface RouteGroup {
    band: DistanceBand;
    title: string;
    routes: TrackSummary[];
}

/** Groups routes by distance band (longest first), dropping empty groups. */
export function groupRoutes(routes: TrackSummary[], filter: DistanceFilter): RouteGroup[] {
    return DISTANCE_BANDS
        .filter(({ band }) => filter === "all" || filter === band)
        .map(({ band, title }) => ({
            band,
            title,
            routes: routes
                .filter((r) => distanceBand(r.distance) === band)
                .sort((a, b) => b.distance - a.distance),
        }))
        .filter((group) => group.routes.length > 0);
}

export type RouteStatus =
    | { kind: "none" }
    | { kind: "record" }
    | { kind: "slower"; seconds: number };

/** How the latest run compares with the route's record. */
export function routeStatus(route: Pick<TrackSummary, "durationBest" | "latestToBestTimespan">): RouteStatus {
    if (route.durationBest == null) return { kind: "none" };
    if (!route.latestToBestTimespan) return { kind: "record" };
    return { kind: "slower", seconds: route.latestToBestTimespan };
}
