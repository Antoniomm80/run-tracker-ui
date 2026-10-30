/** ISO calendar date as returned by the API, e.g. "2021-11-28". */
export type IsoDate = string;

export interface TrackSummary {
    id: number;
    name: string;
    description: string | null;
    /** Metres. */
    distance: number;
    /** Seconds; null when the route has no times yet. */
    durationBest: number | null;
    trainingDateBest: IsoDate | null;
    durationLatest: number | null;
    trainingDateLatest: IsoDate | null;
    /** Seconds the latest run was slower than the best one (0 = latest is the record). */
    latestToBestTimespan: number | null;
}

export interface RunTime {
    id: number;
    /** Seconds. */
    duration: number;
    trainingDate: IsoDate;
}

export interface Track {
    id: number;
    name: string;
    description: string | null;
    /** Metres. */
    distance: number;
    pathToMap?: string | null;
    times: RunTime[];
}

export interface NewTrack {
    name: string;
    description?: string;
    /** Metres. */
    distance: number;
    pathToMap?: string;
}

export interface NewRunTime {
    /** Seconds. */
    duration: number;
    trainingDate: IsoDate;
}

export interface RouteMonthStats {
    pathId: number;
    name: string;
    times: number;
    /** Seconds. */
    totalDuration: number;
    /** Metres. */
    totalDistance: number;
}
