import { IsoDate } from "../domain/types";

const LOCALE = "es-ES";

const pad = (n: number) => n.toString().padStart(2, "0");

/** 3334 → "55:34", 5111 → "1:25:11". */
export function formatDuration(seconds: number): string {
    const s = Math.round(seconds);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const rest = s % 60;
    return h > 0 ? `${h}:${pad(m)}:${pad(rest)}` : `${m}:${pad(rest)}`;
}

/** Total time for summaries: 19288 → "5:21" (h:mm). */
export function formatHours(seconds: number): string {
    const totalMinutes = Math.round(seconds / 60);
    return `${Math.floor(totalMinutes / 60)}:${pad(totalMinutes % 60)}`;
}

/** Seconds per km as "m:ss". */
export function formatPace(seconds: number, metres: number): string {
    const perKm = Math.round(seconds / (metres / 1000));
    return `${Math.floor(perKm / 60)}:${pad(perKm % 60)}`;
}

/** 10040 → "10,04"; `digits` controls the decimals. */
export function formatKm(metres: number, digits = 2): string {
    return (metres / 1000).toLocaleString(LOCALE, { minimumFractionDigits: digits, maximumFractionDigits: digits });
}

/** Gap to the record: 29 → "+29 s", 140 → "+2:20", negative values get "−". */
export function formatDelta(seconds: number): string {
    const sign = seconds < 0 ? "−" : "+";
    const abs = Math.abs(Math.round(seconds));
    return abs < 60 ? `${sign}${abs} s` : `${sign}${formatDuration(abs)}`;
}

/** Parses "2021-11-28" as a local calendar date (no timezone shift). */
export function parseIsoDate(date: IsoDate): Date {
    const [y, m, d] = date.split("-").map(Number);
    return new Date(y, m - 1, d);
}

export function toIsoDate(date: Date): IsoDate {
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** "28 nov 2021". */
export function formatDate(date: IsoDate): string {
    return parseIsoDate(date)
        .toLocaleDateString(LOCALE, { day: "numeric", month: "short", year: "numeric" })
        .replace(/\./g, "");
}

/** "Mayo 2025". */
export function formatMonth(year: number, month: number): string {
    const label = new Date(year, month - 1, 1).toLocaleDateString(LOCALE, { month: "long", year: "numeric" });
    return label.charAt(0).toUpperCase() + label.slice(1).replace(" de ", " ");
}

/** "may" — short month name without the trailing dot. */
export function formatMonthShort(month: number): string {
    return new Date(2000, month - 1, 1).toLocaleDateString(LOCALE, { month: "short" }).replace(/\./g, "");
}

/** Parses "mm:ss" or "h:mm:ss" into seconds; returns null when malformed. */
export function parseDuration(value: string): number | null {
    const match = value.trim().match(/^(?:(\d+):)?(\d{1,3}):([0-5]\d)$/);
    if (!match) {
        return null;
    }
    const [, h, m, s] = match;
    return Number(h ?? 0) * 3600 + Number(m) * 60 + Number(s);
}
