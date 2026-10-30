import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useIsSplitLayout } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { addMonths, currentYearMonth, useStatsWindow, YearMonth } from "../../domain/queries";
import { RouteMonthStats } from "../../domain/types";
import { formatDuration, formatHours, formatKm, formatMonth, formatMonthShort } from "../../utils/format";
import { PhoneHeader } from "../layout/PhoneHeader";
import { MonthBars } from "./MonthBars";

const toIndex = ({ year, month }: YearMonth) => year * 12 + month - 1;

const sum = (rows: RouteMonthStats[]) => ({
    runs: rows.reduce((n, r) => n + r.times, 0),
    distance: rows.reduce((n, r) => n + r.totalDistance, 0),
    duration: rows.reduce((n, r) => n + r.totalDuration, 0),
});

export function StatsPage() {
    const wide = useIsSplitLayout();
    const now = currentYearMonth();
    const [selected, setSelected] = useState<YearMonth>(now);
    // The chart shows the 12 months ending here; it follows the selection when it walks off either edge.
    const [windowEnd, setWindowEnd] = useState<YearMonth>(now);
    const statsWindow = useStatsWindow(windowEnd);

    const select = (month: YearMonth) => {
        if (toIndex(month) > toIndex(now)) return;
        setSelected(month);
        if (toIndex(month) > toIndex(windowEnd)) setWindowEnd(month);
        else if (toIndex(month) < toIndex(windowEnd) - 11) setWindowEnd(addMonths(month, 11));
    };

    const current = statsWindow.find((m) => toIndex(m) === toIndex(selected));
    const rows = [...(current?.query.data ?? [])].sort((a, b) => b.totalDistance - a.totalDistance);
    const totals = sum(rows);
    const isLoading = current?.query.isLoading ?? true;
    const atLatest = toIndex(selected) >= toIndex(now);
    const bars = statsWindow.map((m) => ({
        year: m.year,
        month: m.month,
        distance: m.query.data ? sum(m.query.data).distance : undefined,
    }));

    const kpis = [
        { label: "Salidas", value: String(totals.runs), unit: "carreras", brand: false },
        { label: "Distancia", value: formatKm(totals.distance, 1), unit: "km", brand: true },
        { label: "Tiempo", value: formatHours(totals.duration), unit: "horas", brand: false },
    ];

    const chevron =
        "inline-flex size-11 shrink-0 items-center justify-center rounded-full border bg-card transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40";
    const first = statsWindow[0];

    return (
        <>
            {wide ? (
                <h1 className="mb-6 font-display text-[34px] font-extrabold tracking-[-0.03em]">Estadísticas</h1>
            ) : (
                <PhoneHeader title="Estadísticas" />
            )}

            <div className={cn("flex flex-col", wide ? "max-w-4xl gap-6" : "gap-3.5 px-4 pb-6")}>
                <section
                    aria-labelledby="bars-title"
                    className={cn("flex flex-col border bg-card", wide ? "gap-[18px] rounded-3xl p-6" : "gap-2.5 rounded-[20px] px-3.5 pb-2.5 pt-3.5")}
                >
                    <div className="flex items-baseline justify-between gap-3">
                        <h2 id="bars-title" className={cn("font-semibold", wide ? "text-[15px]" : "text-[13px]")}>
                            {wide ? "Kilómetros por mes" : "Km por mes"}
                        </h2>
                        <span className={cn("text-muted-foreground", wide ? "text-[13px]" : "text-[11px]")}>
                            {wide
                                ? `${formatMonthShort(first.month)} ${first.year} – ${formatMonthShort(windowEnd.month)} ${windowEnd.year} · toca un mes`
                                : "toca una barra"}
                        </span>
                    </div>
                    <MonthBars months={bars} selected={selected} onSelect={select} wide={wide} />
                </section>

                <div className="flex items-center gap-2 lg:gap-3">
                    <button type="button" aria-label="Mes anterior" className={chevron} onClick={() => select(addMonths(selected, -1))}>
                        <ChevronLeft className="size-[18px]" aria-hidden />
                    </button>
                    <h2
                        aria-live="polite"
                        className={cn("flex-1 font-display font-extrabold", wide ? "text-[26px]" : "text-center text-2xl")}
                    >
                        {formatMonth(selected.year, selected.month)}
                    </h2>
                    <button type="button" aria-label="Mes siguiente" className={chevron} disabled={atLatest} onClick={() => select(addMonths(selected, 1))}>
                        <ChevronRight className="size-[18px]" aria-hidden />
                    </button>
                </div>

                <dl className={cn("grid grid-cols-3", wide ? "gap-3" : "gap-2")}>
                    {kpis.map((kpi) => (
                        <div
                            key={kpi.label}
                            className={cn("flex flex-col gap-0.5 border bg-card", wide ? "gap-1 rounded-[20px] p-5" : "rounded-2xl p-3")}
                        >
                            <dt className={cn("text-muted-foreground", wide ? "text-[13px]" : "text-xs")}>{kpi.label}</dt>
                            <dd
                                className={cn(
                                    "font-display font-extrabold leading-none tracking-[-0.03em] tabular",
                                    wide ? "text-[52px]" : "text-[30px]",
                                    kpi.brand && "text-brand",
                                    isLoading && "animate-pulse text-muted-foreground",
                                )}
                            >
                                {isLoading ? "–" : kpi.value}
                            </dd>
                            <dd className={cn("text-muted-foreground", wide ? "text-[13px]" : "text-xs")}>{kpi.unit}</dd>
                        </div>
                    ))}
                </dl>

                {!isLoading && rows.length === 0 ? (
                    <p className="rounded-2xl border border-dashed bg-card p-6 text-center text-sm text-muted-foreground">
                        Sin salidas en {formatMonth(selected.year, selected.month).toLowerCase()}.
                    </p>
                ) : wide ? (
                    <RouteTable rows={rows} />
                ) : (
                    <RouteRows rows={rows} />
                )}

                {wide && <YearTotal year={selected.year} />}
            </div>
        </>
    );
}

function RouteRows({ rows }: { rows: RouteMonthStats[] }) {
    return (
        <section aria-labelledby="by-route" className="overflow-hidden rounded-2xl border bg-card">
            <h2 id="by-route" className="px-3.5 pb-1 pt-3 text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Por ruta
            </h2>
            <ul>
                {rows.map((r) => (
                    <li key={r.pathId} className="flex flex-col gap-2 border-t border-muted px-3.5 py-3 first:border-t-0">
                        <div className="flex justify-between gap-3">
                            <span className="min-w-0 text-sm font-semibold">{r.name}</span>
                            <span className="whitespace-nowrap font-display text-lg font-extrabold text-brand tabular">
                                {formatKm(r.totalDistance, 1)} km
                            </span>
                        </div>
                        <span className="text-xs text-muted-foreground tabular">
                            {r.times} {r.times === 1 ? "salida" : "salidas"} · {formatDuration(r.totalDuration)}
                        </span>
                    </li>
                ))}
            </ul>
        </section>
    );
}

function RouteTable({ rows }: { rows: RouteMonthStats[] }) {
    return (
        <section className="overflow-hidden rounded-[20px] border bg-card">
            <table className="w-full border-collapse text-sm tabular">
                <caption className="sr-only">Resumen por ruta</caption>
                <thead>
                    <tr className="text-left text-xs text-muted-foreground">
                        <th scope="col" className="px-5 py-3.5 font-medium">Ruta</th>
                        <th scope="col" className="px-2 py-3.5 text-right font-medium">Salidas</th>
                        <th scope="col" className="px-2 py-3.5 text-right font-medium">Km</th>
                        <th scope="col" className="px-5 py-3.5 text-right font-medium">Tiempo</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r) => (
                        <tr key={r.pathId} className="border-t border-muted">
                            <th scope="row" className="px-5 py-3.5 text-left font-semibold">{r.name}</th>
                            <td className="px-2 py-3.5 text-right">{r.times}</td>
                            <td className="px-2 py-3.5 text-right font-semibold">{formatKm(r.totalDistance, 1)}</td>
                            <td className="px-5 py-3.5 text-right">{formatDuration(r.totalDuration)}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </section>
    );
}

function YearTotal({ year }: { year: number }) {
    const months = useStatsWindow({ year, month: 12 });
    if (months.some((m) => m.query.isLoading)) {
        return null;
    }
    const totals = sum(months.flatMap((m) => m.query.data ?? []));
    const minutes = Math.round(totals.duration / 60);
    return (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-[20px] bg-primary px-5 py-[18px] text-primary-foreground">
            <span className="text-sm font-semibold">Total {year}</span>
            <span className="font-display text-xl font-bold tabular">
                {totals.runs} salidas · {formatKm(totals.distance, 1)} km · {Math.floor(minutes / 60)} h {minutes % 60} min
            </span>
        </div>
    );
}
