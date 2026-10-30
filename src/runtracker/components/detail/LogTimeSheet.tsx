import { FormEvent, useState } from "react";
import { CalendarDays, Timer, Trophy } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { ResponsiveSheet } from "@/components/ui/responsive-sheet";
import { useCreateTime } from "../../domain/queries";
import { formatDelta, formatDuration, formatKm, formatPace, toIsoDate } from "../../utils/format";

type DateChoice = "today" | "yesterday" | "other";

interface TrackInfo {
    trackId: number;
    trackName: string;
    /** Metres. */
    distance: number;
    /** Current record in seconds, if any. */
    best: number | null;
}

interface LogTimeSheetProps extends TrackInfo {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

/** "Registrar tiempo": drawer on phones, dialog on larger screens. Form state resets on every open. */
export function LogTimeSheet({ open, onOpenChange, ...track }: LogTimeSheetProps) {
    return (
        <ResponsiveSheet
            open={open}
            onOpenChange={onOpenChange}
            title="Registrar tiempo"
            description={`${track.trackName} · ${formatKm(track.distance)} km`}
        >
            <LogTimeForm {...track} onDone={() => onOpenChange(false)} />
        </ResponsiveSheet>
    );
}

const today = () => new Date();
const yesterday = () => {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d;
};

const chip =
    "flex h-11 items-center justify-center gap-1.5 rounded-xl border bg-card text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const timeInput =
    "h-[72px] w-full rounded-2xl border bg-background text-center font-display text-[44px] font-extrabold tabular text-foreground focus:border-2 focus:border-brand focus:outline-none aria-[invalid=true]:border-destructive";

function LogTimeForm({ trackId, distance, best, onDone }: TrackInfo & { onDone: () => void }) {
    const [dateChoice, setDateChoice] = useState<DateChoice>("today");
    const [otherDate, setOtherDate] = useState(toIsoDate(today()));
    const [minutes, setMinutes] = useState("");
    const [seconds, setSeconds] = useState("");
    const [touched, setTouched] = useState(false);
    const { mutate, isLoading } = useCreateTime(trackId);

    const trainingDate =
        dateChoice === "today" ? toIsoDate(today()) : dateChoice === "yesterday" ? toIsoDate(yesterday()) : otherDate;
    const min = Number(minutes);
    const sec = Number(seconds);
    const secondsValid = seconds !== "" && Number.isInteger(sec) && sec >= 0 && sec < 60;
    const minutesValid = minutes !== "" && Number.isInteger(min) && min >= 0;
    const duration = minutesValid && secondsValid ? min * 60 + sec : null;
    const dateValid = Boolean(trainingDate) && trainingDate <= toIsoDate(today());
    const valid = duration !== null && duration > 0 && dateValid;

    const submit = (e: FormEvent) => {
        e.preventDefault();
        setTouched(true);
        if (!valid || duration === null) return;
        const isRecord = best == null || duration < best;
        mutate(
            { duration, trainingDate },
            {
                onSuccess: () => {
                    toast.success(isRecord ? "¡Nuevo récord guardado!" : "Tiempo guardado");
                    onDone();
                },
                onError: () => toast.error("No se ha podido guardar el tiempo. Inténtalo de nuevo."),
            },
        );
    };

    const dateChip = (value: DateChoice) =>
        cn(chip, dateChoice === value ? "border-2 border-foreground font-semibold" : "font-medium text-foreground/80");

    return (
        <form onSubmit={submit} noValidate className="flex flex-col gap-5">
            <fieldset className="flex flex-col gap-2">
                <legend className="mb-2 text-[13px] font-semibold">Fecha</legend>
                <div className="grid grid-cols-3 gap-2">
                    <button type="button" aria-pressed={dateChoice === "today"} className={dateChip("today")} onClick={() => setDateChoice("today")}>
                        Hoy
                    </button>
                    <button type="button" aria-pressed={dateChoice === "yesterday"} className={dateChip("yesterday")} onClick={() => setDateChoice("yesterday")}>
                        Ayer
                    </button>
                    <button type="button" aria-pressed={dateChoice === "other"} className={dateChip("other")} onClick={() => setDateChoice("other")}>
                        <CalendarDays className="size-[15px]" aria-hidden />
                        Otra
                    </button>
                </div>
                {dateChoice === "other" && (
                    <input
                        type="date"
                        aria-label="Fecha del entrenamiento"
                        value={otherDate}
                        max={toIsoDate(today())}
                        onChange={(e) => setOtherDate(e.target.value)}
                        aria-invalid={touched && !dateValid}
                        className="h-11 rounded-xl border bg-card px-3 text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand"
                    />
                )}
                {touched && !dateValid && <p className="text-xs text-destructive">Elige una fecha que no sea futura.</p>}
            </fieldset>

            <fieldset>
                <legend className="mb-2 text-[13px] font-semibold">Tiempo</legend>
                <div className="grid grid-cols-[minmax(0,1fr)_20px_minmax(0,1fr)] items-center">
                    <label className="flex flex-col items-center gap-1">
                        <input
                            inputMode="numeric"
                            pattern="[0-9]*"
                            autoComplete="off"
                            placeholder="00"
                            aria-label="Minutos"
                            autoFocus
                            value={minutes}
                            onChange={(e) => setMinutes(e.target.value.replace(/\D/g, "").slice(0, 3))}
                            aria-invalid={touched && !minutesValid}
                            className={timeInput}
                        />
                        <span className="text-xs text-muted-foreground">min</span>
                    </label>
                    <span className="pb-5 text-center font-display text-4xl font-extrabold" aria-hidden>
                        :
                    </span>
                    <label className="flex flex-col items-center gap-1">
                        <input
                            inputMode="numeric"
                            pattern="[0-9]*"
                            autoComplete="off"
                            placeholder="00"
                            aria-label="Segundos"
                            value={seconds}
                            onChange={(e) => setSeconds(e.target.value.replace(/\D/g, "").slice(0, 2))}
                            aria-invalid={touched && !secondsValid}
                            className={timeInput}
                        />
                        <span className="text-xs text-muted-foreground">seg</span>
                    </label>
                </div>
                {touched && (!minutesValid || !secondsValid || duration === 0) && (
                    <p className="mt-2 text-xs text-destructive">Introduce minutos y segundos (0–59).</p>
                )}
            </fieldset>

            <TimePreview duration={duration} best={best} distance={distance} />

            <div className="grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-2.5">
                <button
                    type="button"
                    onClick={onDone}
                    className="h-[52px] rounded-full border bg-card text-[15px] font-semibold transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                    Cancelar
                </button>
                <button
                    type="submit"
                    disabled={isLoading}
                    className="h-[52px] rounded-full bg-primary text-[15px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-60"
                >
                    {isLoading ? "Guardando…" : "Guardar tiempo"}
                </button>
            </div>
        </form>
    );
}

function TimePreview({ duration, best, distance }: { duration: number | null; best: number | null; distance: number }) {
    if (!duration) {
        return null;
    }
    const pace = `Ritmo ${formatPace(duration, distance)} /km`;
    const isRecord = best == null || duration < best;
    let title: string;
    if (best == null) title = "Primer tiempo de esta ruta";
    else if (duration < best) title = `Nuevo récord, ${formatDelta(best - duration).slice(1)} menos`;
    else if (duration === best) title = "Igualas tu récord";
    else title = `${formatDelta(duration - best)} sobre tu récord (${formatDuration(best)})`;

    return (
        <div
            role="status"
            className={cn(
                "flex items-center gap-3 rounded-2xl px-3.5 py-3",
                isRecord ? "bg-success/10 text-success" : "bg-muted text-foreground",
            )}
        >
            {isRecord ? <Trophy className="size-[22px] shrink-0" aria-hidden /> : <Timer className="size-[22px] shrink-0 text-muted-foreground" aria-hidden />}
            <div className="flex flex-col text-[13px]">
                <strong className="text-sm">{title}</strong>
                <span className={isRecord ? undefined : "text-muted-foreground"}>{pace}</span>
            </div>
        </div>
    );
}
