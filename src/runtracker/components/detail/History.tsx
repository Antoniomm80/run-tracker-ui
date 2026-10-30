import { ReactNode } from "react";
import { Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { RunTime } from "../../domain/types";
import { formatDate, formatDelta, formatDuration, formatPace } from "../../utils/format";

interface HistoryProps {
    times: RunTime[];
    /** Metres. */
    distance: number;
    /** Wide layout (tablet/desktop): column headers, pace column, action next to the title. */
    wide?: boolean;
    action?: ReactNode;
}

/** Every run, newest first, with a bar showing how far it was from the record. */
export function History({ times, distance, wide = false, action }: HistoryProps) {
    const sorted = [...times].sort((a, b) => b.trainingDate.localeCompare(a.trainingDate));
    const best = Math.min(...times.map((t) => t.duration));
    const worst = Math.max(...times.map((t) => t.duration));
    const spread = Math.max(worst - best, 1);
    const columns = wide
        ? "grid-cols-[100px_minmax(0,1fr)_70px_64px] px-4"
        : "grid-cols-[92px_minmax(0,1fr)_64px] px-3.5";

    return (
        <section aria-labelledby="history-title" className="flex flex-col gap-3">
            <div className="flex min-h-11 items-center justify-between gap-3">
                <h2 id="history-title" className={cn("font-display font-extrabold", wide ? "text-[22px]" : "text-xl")}>
                    Historial
                </h2>
                {times.length > 0 && !wide && (
                    <span className="text-xs text-muted-foreground">barra = distancia al récord</span>
                )}
                {action}
            </div>

            {times.length === 0 ? (
                <div className="flex flex-col items-center gap-2.5 rounded-2xl border border-dashed border-bar bg-card px-5 py-8 text-center">
                    <span className="flex size-[52px] items-center justify-center rounded-full bg-brand-soft text-brand">
                        <Timer className="size-6" aria-hidden />
                    </span>
                    <strong className="text-[15px]">Aún no hay tiempos</strong>
                    <span className="max-w-[260px] text-[13px] leading-normal text-muted-foreground">
                        Cuando registres salidas, aquí verás cada tiempo y lo lejos que quedó de tu récord.
                    </span>
                </div>
            ) : (
                <div className="overflow-hidden rounded-2xl border bg-card">
                    {wide && (
                        <div
                            aria-hidden
                            className={cn("grid gap-3 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-muted-foreground", columns)}
                        >
                            <span>Fecha</span>
                            <span>Distancia al récord</span>
                            <span className="text-right">Ritmo</span>
                            <span className="text-right">Tiempo</span>
                        </div>
                    )}
                    <ol>
                        {sorted.map((time, index) => {
                            const gap = time.duration - best;
                            const isRecord = gap === 0;
                            const pace = formatPace(time.duration, distance);
                            const label = `${formatDate(time.trainingDate)}: ${formatDuration(time.duration)}, ritmo ${pace} por km, ${
                                isRecord ? "récord" : `${formatDelta(gap)} sobre el récord`
                            }`;
                            return (
                                <li
                                    key={time.id}
                                    aria-label={label}
                                    className={cn(
                                        "grid items-center gap-3 tabular",
                                        wide ? "py-3" : "py-[11px]",
                                        (wide || index > 0) && "border-t border-muted",
                                        columns,
                                    )}
                                >
                                    <span className="text-[13px] text-muted-foreground" aria-hidden>
                                        {formatDate(time.trainingDate)}
                                    </span>
                                    <span className="h-1.5 overflow-hidden rounded-full bg-muted" aria-hidden>
                                        <span
                                            className="block h-full rounded-full bg-bar"
                                            style={{ width: `${Math.round((gap / spread) * 100)}%` }}
                                        />
                                    </span>
                                    {wide && (
                                        <span className="text-right text-[13px] text-muted-foreground" aria-hidden>
                                            {pace}
                                        </span>
                                    )}
                                    <span
                                        aria-hidden
                                        className={cn("text-right font-display text-base font-bold", isRecord && "text-brand")}
                                    >
                                        {formatDuration(time.duration)}
                                    </span>
                                </li>
                            );
                        })}
                    </ol>
                </div>
            )}
        </section>
    );
}
