import { useState } from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DISTANCE_BANDS, DistanceFilter, groupRoutes, routeStatus } from "../../domain/routeGroups";
import { TrackSummary } from "../../domain/types";
import { formatDate, formatDuration, formatKm } from "../../utils/format";
import { StatusLabel } from "../StatusLabel";

const FILTERS: { value: DistanceFilter; label: string }[] = [
    { value: "all", label: "Todas" },
    ...[...DISTANCE_BANDS].reverse().map(({ band, chip }) => ({ value: band, label: chip })),
];

interface ChipsProps {
    value: DistanceFilter;
    onChange: (f: DistanceFilter) => void;
    dense?: boolean;
}

export function DistanceFilterChips({ value, onChange, dense }: ChipsProps) {
    return (
        <div
            role="group"
            aria-label="Filtrar por distancia"
            className={cn("flex", dense ? "flex-wrap gap-1.5" : "gap-2 overflow-x-auto [scrollbar-width:none]")}
        >
            {FILTERS.map((f) => {
                const on = f.value === value;
                return (
                    <button
                        key={f.value}
                        type="button"
                        aria-pressed={on}
                        onClick={() => onChange(f.value)}
                        className={cn(
                            "shrink-0 rounded-full font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            dense ? "h-8 px-3 text-xs" : "h-9 px-3.5 text-[13px]",
                            on ? "bg-primary text-primary-foreground" : "border bg-card text-foreground/80 hover:bg-muted",
                        )}
                    >
                        {f.label}
                    </button>
                );
            })}
        </div>
    );
}

function RouteRow({ route, selected, dense }: { route: TrackSummary; selected: boolean; dense?: boolean }) {
    const { durationBest, trainingDateBest } = route;
    const meta = durationBest != null && trainingDateBest
        ? `Récord ${formatDuration(durationBest)}${dense ? "" : ` · ${formatDate(trainingDateBest)}`}`
        : dense
          ? "Sin tiempos"
          : "Sin tiempos todavía";
    return (
        <li className="border-t border-muted first:border-t-0">
            <Link
                to={`/tracks/${route.id}`}
                aria-current={selected ? "page" : undefined}
                className={cn(
                    "flex items-center transition-colors hover:bg-muted/60 focus-visible:bg-muted focus-visible:outline-none",
                    dense ? "min-h-[56px] gap-3 px-3 py-2.5" : "min-h-[64px] gap-3.5 px-3.5 py-3",
                    selected && "bg-brand-soft hover:bg-brand-soft",
                )}
            >
                <span className={cn("flex shrink-0 flex-col items-center leading-none", dense ? "w-10" : "w-12")}>
                    <span className={cn("font-display font-extrabold text-brand", dense ? "text-[17px]" : "text-xl")}>
                        {formatKm(route.distance, 1)}
                    </span>
                    <span className={cn("mt-1 font-semibold text-muted-foreground", dense ? "text-[9px]" : "text-[10px]")}>KM</span>
                </span>
                <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <span className={cn("truncate font-semibold", dense ? "text-sm" : "text-[15px]")}>{route.name}</span>
                    <span className={cn("truncate text-muted-foreground tabular", dense ? "text-xs" : "text-[13px]")}>{meta}</span>
                </span>
                <StatusLabel status={routeStatus(route)} />
            </Link>
        </li>
    );
}

interface RouteListProps {
    routes: TrackSummary[];
    selectedId?: number;
    /** Case- and accent-insensitive name filter. */
    query?: string;
    /** Sidebar density (tablet/desktop). */
    dense?: boolean;
    className?: string;
}

const normalize = (text: string) => text.normalize("NFD").replace(/\p{Diacritic}/gu, "").toLowerCase();

export function RouteList({ routes, selectedId, query = "", dense = false, className }: RouteListProps) {
    const [filter, setFilter] = useState<DistanceFilter>("all");
    const needle = normalize(query.trim());
    const groups = groupRoutes(needle ? routes.filter((r) => normalize(r.name).includes(needle)) : routes, filter);

    return (
        <div className={cn("flex flex-col", dense ? "gap-3.5" : "gap-4", className)}>
            <DistanceFilterChips value={filter} onChange={setFilter} dense={dense} />
            {groups.map((group) => (
                <section key={group.band} aria-labelledby={`band-${group.band}`} className="flex flex-col gap-2">
                    <h2
                        id={`band-${group.band}`}
                        className={cn("font-semibold uppercase tracking-[0.08em] text-muted-foreground", dense ? "text-[11px]" : "text-xs")}
                    >
                        {group.title}
                    </h2>
                    <ul className="overflow-hidden rounded-2xl border bg-card">
                        {group.routes.map((route) => (
                            <RouteRow key={route.id} route={route} selected={route.id === selectedId} dense={dense} />
                        ))}
                    </ul>
                </section>
            ))}
            {groups.length === 0 && (
                <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                    {needle ? `Ninguna ruta coincide con «${query.trim()}».` : "No hay rutas en este rango de distancia."}
                </p>
            )}
        </div>
    );
}
