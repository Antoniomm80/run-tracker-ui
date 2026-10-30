import axios from "axios";
import { SERVER_URL } from "../../config";
import { NewRunTime, NewTrack, RouteMonthStats, RunTime, Track, TrackSummary } from "./types";

const http = axios.create({ baseURL: SERVER_URL });

export const api = {
    async listTracks(): Promise<TrackSummary[]> {
        const { data } = await http.get<TrackSummary[]>("/path-stats");
        return data;
    },

    async getTrack(trackId: number): Promise<Track> {
        const { data } = await http.get<Track>(`/paths/${trackId}`);
        return { ...data, times: data.times ?? [] };
    },

    async createTrack(track: NewTrack): Promise<Track> {
        const { data } = await http.post<Track>("/paths", track);
        return data;
    },

    async createTime(trackId: number, time: NewRunTime): Promise<RunTime> {
        const { data } = await http.post<RunTime>(`/paths/${trackId}/times`, time);
        return data;
    },

    /** `month` is 1-based. */
    async getMonthStats(year: number, month: number): Promise<RouteMonthStats[]> {
        const { data } = await http.get<RouteMonthStats[]>("/times/stats", { params: { month, year } });
        return data;
    },
};
