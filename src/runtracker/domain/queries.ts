import { useMutation, useQueries, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "./api";
import { NewRunTime, NewTrack, RunTime, Track } from "./types";

export const queryKeys = {
    tracks: ["tracks"] as const,
    track: (id: number) => ["track", id] as const,
    stats: ["stats"] as const,
    monthStats: (year: number, month: number) => ["stats", year, month] as const,
};

export function useTracks() {
    return useQuery(queryKeys.tracks, api.listTracks);
}

export function useTrack(trackId: number) {
    return useQuery(queryKeys.track(trackId), () => api.getTrack(trackId), {
        enabled: Number.isInteger(trackId) && trackId > 0,
    });
}

export interface YearMonth {
    year: number;
    /** 1-based. */
    month: number;
}

export function addMonths({ year, month }: YearMonth, delta: number): YearMonth {
    const index = year * 12 + (month - 1) + delta;
    return { year: Math.floor(index / 12), month: (index % 12) + 1 };
}

/** Stats for the 12 months ending at `end`, oldest first. */
export function useStatsWindow(end: YearMonth) {
    const months = Array.from({ length: 12 }, (_, i) => addMonths(end, i - 11));
    const results = useQueries({
        queries: months.map(({ year, month }) => ({
            queryKey: queryKeys.monthStats(year, month),
            queryFn: () => api.getMonthStats(year, month),
            staleTime: 5 * 60 * 1000,
        })),
    });
    return months.map((ym, i) => ({ ...ym, query: results[i] }));
}

export function useCreateTime(trackId: number) {
    const client = useQueryClient();
    return useMutation((time: NewRunTime) => api.createTime(trackId, time), {
        onSuccess: () =>
            Promise.all([
                client.invalidateQueries(queryKeys.track(trackId)),
                client.invalidateQueries(queryKeys.tracks),
                client.invalidateQueries(queryKeys.stats),
            ]),
    });
}

export function useCreateTrack() {
    const client = useQueryClient();
    return useMutation((track: NewTrack) => api.createTrack(track), {
        onSuccess: () => client.invalidateQueries(queryKeys.tracks),
    });
}

export function currentYearMonth(): YearMonth {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

/**
 * Most recent run across all routes. `/path-stats` doesn't fill the "latest" fields, so this
 * finds the newest month with activity in the last year and checks those routes' times.
 */
export function useLatestRun() {
    const months = useStatsWindow(currentYearMonth());
    const latestMonth = [...months].reverse().find((m) => (m.query.data?.length ?? 0) > 0);
    const routeIds = latestMonth?.query.data?.map((r) => r.pathId) ?? [];
    const tracks = useQueries({
        queries: routeIds.map((id) => ({ queryKey: queryKeys.track(id), queryFn: () => api.getTrack(id) })),
    });

    const isLoading = months.some((m) => m.query.isLoading) || tracks.some((t) => t.isLoading);
    let latest: { track: Track; time: RunTime } | undefined;
    for (const { data: track } of tracks) {
        if (!track) continue;
        for (const time of track.times) {
            if (!latest || time.trainingDate > latest.time.trainingDate) {
                latest = { track, time };
            }
        }
    }
    return { isLoading, latest, currentMonth: months[months.length - 1] };
}
