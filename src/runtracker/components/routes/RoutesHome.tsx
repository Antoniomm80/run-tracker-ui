import { Link } from "react-router-dom";
import { Trophy } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsSplitLayout } from "@/hooks/use-media-query";
import { useLatestRun, useTracks } from "../../domain/queries";
import { formatDate, formatDelta, formatDuration, formatHours, formatKm, formatMonth, formatPace } from "../../utils/format";
import { PhoneHeader } from "../layout/PhoneHeader";
import { NewRouteButton } from "./NewRouteButton";
import { RouteList } from "./RouteList";
import { RoutesSkeleton } from "./RoutesSkeleton";

/** `/`: the route list on phones; on split layouts the list lives in the sidebar, so this shows a summary. */
export function RoutesHome() {
    return useIsSplitLayout() ? <PickARoute /> : <PhoneRoutes />;
}

function PhoneRoutes() {
    const { data: routes, isLoading, isError } = useTracks();
    return (
        <>
            <PhoneHeader title="Rutas" />
            <div className="px-4 pb-32">
                {isLoading ? (
                    <RoutesSkeleton />
                ) : isError ? (
                    <p className="rounded-2xl border border-dashed p-6 text-center text-sm text-muted-foreground">
                        No se han podido cargar las rutas. Comprueba la conexión con el servidor.
                    </p>
                ) : (
                    <RouteList routes={routes ?? []} />
                )}
            </div>
            <NewRouteButton variant="fab" />
        </>
    );
}

function PickARoute() {
    const { data: routes = [] } = useTracks();
    const { latest, currentMonth, isLoading } = useLatestRun();

    const lastRecord = routes
        .flatMap(({ durationBest: best, trainingDateBest: date, ...route }) =>
            best != null && date ? [{ ...route, best, date }] : [],
        )
        .sort((a, b) => b.date.localeCompare(a.date))[0];
    const withoutTimes = routes.filter((r) => r.durationBest == null);
    const month = currentMonth.query.data ?? [];
    const monthKpis = [
        { value: String(month.reduce((n, r) => n + r.times, 0)), unit: "salidas", brand: false },
        { value: formatKm(month.reduce((n, r) => n + r.totalDistance, 0), 1), unit: "km", brand: true },
        { value: formatHours(month.reduce((n, r) => n + r.totalDuration, 0)), unit: "horas", brand: false },
    ];

    const latestBest = latest ? Math.min(...latest.track.times.map((t) => t.duration)) : 0;
    const latestGap = latest ? latest.time.duration - latestBest : 0;

    return (
        <div className="flex max-w-4xl flex-col gap-6 lg:px-7 lg:py-5">
            <div className="flex flex-col gap-1.5">
                <h1 className="font-display text-[40px] font-extrabold leading-tight tracking-[-0.03em]">Elige una ruta</h1>
                <p className="text-[15px] text-muted-foreground">
                    Selecciona una ruta de la lista para ver su récord e historial, o retoma donde lo dejaste.
                </p>
            </div>

            {isLoading ? (
                <Skeleton className="h-36 rounded-3xl" />
            ) : (
                latest && (
                    <Link
                        to={`/tracks/${latest.track.id}`}
                        className="flex flex-wrap items-end justify-between gap-6 rounded-3xl bg-hero p-6 text-hero-foreground transition-opacity hover:opacity-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                    >
                        <div className="flex min-w-0 flex-col gap-2">
                            <span className="text-xs font-semibold uppercase tracking-[0.08em] text-hero-muted">
                                Última salida · {formatDate(latest.time.trainingDate)}
                            </span>
                            <span className="text-xl font-semibold">{latest.track.name}</span>
                            <span className="text-[13px] text-hero-muted tabular">
                                {formatKm(latest.track.distance)} km · {formatPace(latest.time.duration, latest.track.distance)} /km ·{" "}
                                {latestGap === 0
                                    ? "nuevo récord"
                                    : `${formatDelta(latestGap)} sobre el récord (${formatDuration(latestBest)})`}
                            </span>
                        </div>
                        <span className="font-display text-[72px] font-extrabold leading-[0.9] tracking-[-0.04em] text-hero-record tabular">
                            {formatDuration(latest.time.duration)}
                        </span>
                    </Link>
                )
            )}

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <section aria-labelledby="month-kpis" className="flex flex-col gap-3 rounded-[20px] border bg-card p-5">
                    <h2 id="month-kpis" className="text-[13px] font-semibold">
                        {formatMonth(currentMonth.year, currentMonth.month)}
                    </h2>
                    <dl className="grid grid-cols-3 gap-2">
                        {monthKpis.map((kpi) => (
                            <div key={kpi.unit} className="flex flex-col-reverse gap-0.5">
                                <dt className="text-xs text-muted-foreground">{kpi.unit}</dt>
                                <dd className={`font-display text-[32px] font-extrabold leading-none tabular ${kpi.brand ? "text-brand" : ""}`}>
                                    {kpi.value}
                                </dd>
                            </div>
                        ))}
                    </dl>
                    <Link to="/charts" className="text-[13px] font-semibold text-brand hover:underline">
                        Ver estadísticas
                    </Link>
                </section>

                {lastRecord && (
                    <section aria-labelledby="last-record" className="flex flex-col gap-2.5 rounded-[20px] border bg-card p-5">
                        <h2 id="last-record" className="text-[13px] font-semibold">
                            Récord más reciente
                        </h2>
                        <Link to={`/tracks/${lastRecord.id}`} className="flex items-center gap-3 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
                            <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                                <Trophy className="size-5" aria-hidden />
                            </span>
                            <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                                <span className="truncate text-[15px] font-semibold">{lastRecord.name}</span>
                                <span className="text-xs text-muted-foreground tabular">
                                    {formatDate(lastRecord.date)} · {formatKm(lastRecord.distance)} km ·{" "}
                                    {formatPace(lastRecord.best, lastRecord.distance)} /km
                                </span>
                            </span>
                            <span className="font-display text-[28px] font-extrabold text-success tabular">
                                {formatDuration(lastRecord.best)}
                            </span>
                        </Link>
                        {withoutTimes.length > 0 && (
                            <span className="text-xs text-muted-foreground">
                                {withoutTimes.length === 1 ? "1 ruta aún sin tiempos" : `${withoutTimes.length} rutas aún sin tiempos`}:{" "}
                                {withoutTimes.map((r) => r.name).join(", ")}
                            </span>
                        )}
                    </section>
                )}
            </div>
        </div>
    );
}
