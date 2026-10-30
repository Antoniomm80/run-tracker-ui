import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, MapPin, Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { Track } from "../../domain/types";
import { formatDate, formatDelta, formatDuration, formatKm, formatPace } from "../../utils/format";
import { History } from "./History";
import { LogTimeSheet } from "./LogTimeSheet";
import { MapSheet } from "./MapSheet";

interface RouteDetailProps {
    track: Track;
    /** Split layout (tablet/desktop): hero as a card, action next to the history title. */
    wide: boolean;
}

function summarize(track: Track) {
    if (track.times.length === 0) {
        return null;
    }
    const best = track.times.reduce((a, b) => (b.duration < a.duration ? b : a));
    const latest = track.times.reduce((a, b) => (b.trainingDate > a.trainingDate ? b : a));
    return { best, latest, gap: latest.duration - best.duration };
}

const ctaClass =
    "inline-flex items-center justify-center gap-2 rounded-full bg-primary font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function RouteDetail({ track, wide }: RouteDetailProps) {
    const [logOpen, setLogOpen] = useState(false);
    const [mapOpen, setMapOpen] = useState(false);
    const summary = summarize(track);
    const ctaLabel = summary ? "Registrar tiempo" : "Registrar primer tiempo";

    const chips = summary
        ? [
              { label: "Distancia", value: `${formatKm(track.distance)} km` },
              { label: "Ritmo", value: `${formatPace(summary.best.duration, track.distance)} /km` },
              {
                  label: "Último",
                  value:
                      summary.gap === 0
                          ? "Récord"
                          : wide
                            ? `${formatDuration(summary.latest.duration)} · ${formatDelta(summary.gap)}`
                            : formatDelta(summary.gap),
              },
          ]
        : [
              { label: "Distancia", value: `${formatKm(track.distance)} km` },
              { label: "Ritmo", value: "—" },
              { label: "Salidas", value: "0" },
          ];

    const mapButton = track.pathToMap ? (
        <button
            type="button"
            onClick={() => setMapOpen(true)}
            className="inline-flex h-[34px] shrink-0 items-center gap-1.5 rounded-full bg-hero-chip px-3 text-[13px] font-semibold transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-foreground"
        >
            <MapPin className="size-[15px]" aria-hidden />
            Ver mapa
        </button>
    ) : null;

    return (
        <>
            <div
                className={cn(
                    "flex flex-col gap-2.5 bg-hero text-hero-foreground",
                    wide ? "rounded-3xl px-[22px] pb-[22px] pt-5" : "rounded-b-[28px] px-4 pb-6 pt-[max(8px,env(safe-area-inset-top))]",
                )}
            >
                {wide ? (
                    <div className="flex items-start justify-between gap-3">
                        <h1 className="text-xl font-semibold leading-tight">{track.name}</h1>
                        {mapButton}
                    </div>
                ) : (
                    <>
                        <div className="-ml-2 flex items-center justify-between">
                            <Link
                                to="/"
                                aria-label="Volver a rutas"
                                className="inline-flex size-11 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-hero-foreground"
                            >
                                <ChevronLeft className="size-[22px]" aria-hidden />
                            </Link>
                            {mapButton}
                        </div>
                        <h1 className="text-[19px] font-semibold leading-tight">{track.name}</h1>
                    </>
                )}

                {wide && track.description && <p className="text-[13px] leading-normal opacity-90">{track.description}</p>}

                {summary ? (
                    <div className="mt-1 flex items-end gap-3">
                        <span
                            className={cn(
                                "font-display font-extrabold leading-[0.9] tracking-[-0.04em] text-hero-record tabular",
                                wide ? "text-[84px]" : "text-[76px]",
                            )}
                        >
                            {formatDuration(summary.best.duration)}
                        </span>
                        <span className="pb-1 text-[13px] font-medium leading-snug text-hero-muted">
                            Récord
                            <br />
                            {formatDate(summary.best.trainingDate)}
                        </span>
                    </div>
                ) : (
                    <div className="flex flex-col gap-1.5">
                        <span className="font-display text-[52px] font-extrabold leading-[0.95] tracking-[-0.03em] text-hero-record">
                            Sin récord
                        </span>
                        <span className="text-[13px] font-medium text-hero-muted opacity-90">
                            Registra tu primera salida para fijar la marca.
                        </span>
                    </div>
                )}

                <dl className="mt-1.5 grid grid-cols-3 gap-2">
                    {chips.map((chip) => (
                        <div key={chip.label} className="flex flex-col gap-px rounded-xl bg-hero-chip px-2.5 py-2">
                            <dt className="text-[11px] font-medium text-hero-muted">{chip.label}</dt>
                            <dd className="font-display text-[17px] font-bold tabular">{chip.value}</dd>
                        </div>
                    ))}
                </dl>
            </div>

            <div className={cn(wide ? "mt-4" : "px-4 pb-28 pt-[18px]")}>
                <History
                    times={track.times}
                    distance={track.distance}
                    wide={wide}
                    action={
                        wide ? (
                            <button type="button" onClick={() => setLogOpen(true)} className={cn(ctaClass, "h-11 px-[18px] text-sm")}>
                                <Timer className="size-[18px]" aria-hidden />
                                {ctaLabel}
                            </button>
                        ) : undefined
                    }
                />
            </div>

            {!wide && (
                <div className="fixed inset-x-0 bottom-0 z-10 bg-gradient-to-t from-background from-70% to-transparent px-4 pb-[max(28px,env(safe-area-inset-bottom))] pt-3">
                    <button type="button" onClick={() => setLogOpen(true)} className={cn(ctaClass, "h-[54px] w-full text-[15px]")}>
                        <Timer className="size-[18px]" aria-hidden />
                        {ctaLabel}
                    </button>
                </div>
            )}

            <LogTimeSheet
                open={logOpen}
                onOpenChange={setLogOpen}
                trackId={track.id}
                trackName={track.name}
                distance={track.distance}
                best={summary?.best.duration ?? null}
            />
            {track.pathToMap && (
                <MapSheet
                    open={mapOpen}
                    onOpenChange={setMapOpen}
                    trackName={track.name}
                    distance={track.distance}
                    mapUrl={track.pathToMap}
                />
            )}
        </>
    );
}
