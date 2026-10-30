import { FormEvent, ReactNode, useState } from "react";
import { useNavigate } from "react-router-dom";
import { CircleAlert } from "lucide-react";
import { toast } from "sonner";
import { ResponsiveSheet } from "@/components/ui/responsive-sheet";
import { cn } from "@/lib/utils";
import { useCreateTrack } from "../../domain/queries";

interface NewRouteSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function NewRouteSheet({ open, onOpenChange }: NewRouteSheetProps) {
    return (
        <ResponsiveSheet
            open={open}
            onOpenChange={onOpenChange}
            title="Nueva ruta"
            description="Guarda un recorrido para empezar a registrar tiempos."
        >
            <NewRouteForm onDone={() => onOpenChange(false)} />
        </ResponsiveSheet>
    );
}

type Field = "name" | "distance" | "mapUrl";

/** "13,5" or "13.5" → metres; null when not a positive number. */
function parseKm(value: string): number | null {
    const km = Number(value.trim().replace(",", "."));
    return value.trim() !== "" && Number.isFinite(km) && km > 0 ? Math.round(km * 1000) : null;
}

const inputClass =
    "h-12 w-full rounded-[14px] border bg-background px-3.5 text-foreground placeholder:text-muted-foreground focus:border-2 focus:border-brand focus:outline-none aria-[invalid=true]:border-2 aria-[invalid=true]:border-destructive";

function NewRouteForm({ onDone }: { onDone: () => void }) {
    const navigate = useNavigate();
    const { mutate, isLoading } = useCreateTrack();
    const [name, setName] = useState("");
    const [distance, setDistance] = useState("");
    const [mapUrl, setMapUrl] = useState("");
    const [description, setDescription] = useState("");
    const [touched, setTouched] = useState<Record<Field, boolean>>({ name: false, distance: false, mapUrl: false });

    const metres = parseKm(distance);
    const errors: Partial<Record<Field, string>> = {};
    if (!name.trim()) errors.name = "El nombre es obligatorio";
    if (metres === null) errors.distance = "Indica la distancia en km, mayor que cero";
    if (mapUrl.trim() && !/^https:\/\/\S+$/.test(mapUrl.trim())) errors.mapUrl = "Debe ser una URL que empiece por https://";

    const shown = (field: Field) => (touched[field] ? errors[field] : undefined);
    const touch = (field: Field) => () => setTouched((t) => ({ ...t, [field]: true }));

    const submit = (e: FormEvent) => {
        e.preventDefault();
        setTouched({ name: true, distance: true, mapUrl: true });
        if (Object.keys(errors).length > 0 || metres === null) return;
        mutate(
            {
                name: name.trim(),
                distance: metres,
                pathToMap: mapUrl.trim() || undefined,
                description: description.trim() || undefined,
            },
            {
                onSuccess: (track) => {
                    toast.success("Ruta guardada");
                    onDone();
                    navigate(`/tracks/${track.id}`);
                },
                onError: () => toast.error("No se ha podido guardar la ruta. Inténtalo de nuevo."),
            },
        );
    };

    return (
        <form onSubmit={submit} noValidate className="flex flex-col gap-4">
            <FormField id="nr-name" label="Nombre" error={shown("name")}>
                <input
                    id="nr-name"
                    autoFocus
                    autoComplete="off"
                    placeholder="p. ej. Casa - Odiseo"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    onBlur={touch("name")}
                    aria-invalid={Boolean(shown("name"))}
                    aria-describedby={shown("name") ? "nr-name-err" : undefined}
                    className={inputClass}
                />
            </FormField>

            <FormField id="nr-dist" label="Distancia" error={shown("distance")}>
                <div className="relative">
                    <input
                        id="nr-dist"
                        inputMode="decimal"
                        autoComplete="off"
                        placeholder="0,00"
                        value={distance}
                        onChange={(e) => setDistance(e.target.value)}
                        onBlur={touch("distance")}
                        aria-invalid={Boolean(shown("distance"))}
                        aria-describedby={shown("distance") ? "nr-dist-err" : undefined}
                        className={cn(inputClass, "pr-14 tabular")}
                    />
                    <span aria-hidden className="pointer-events-none absolute inset-y-0 right-3.5 flex items-center text-sm font-semibold text-muted-foreground">
                        km
                    </span>
                </div>
            </FormField>

            <FormField
                id="nr-map"
                label="URL del mapa"
                optional
                error={shown("mapUrl")}
                hint="En Google My Maps: Compartir › Insertar en mi sitio › copia la URL del src."
            >
                <input
                    id="nr-map"
                    type="url"
                    inputMode="url"
                    autoComplete="off"
                    placeholder="https://www.google.com/maps/d/embed?mid=…"
                    value={mapUrl}
                    onChange={(e) => setMapUrl(e.target.value)}
                    onBlur={touch("mapUrl")}
                    aria-invalid={Boolean(shown("mapUrl"))}
                    aria-describedby={shown("mapUrl") ? "nr-map-err" : "nr-map-hint"}
                    className={inputClass}
                />
            </FormField>

            <FormField id="nr-desc" label="Descripción" optional>
                <textarea
                    id="nr-desc"
                    rows={3}
                    placeholder="Por dónde va, cuestas, referencias…"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className={cn(inputClass, "h-auto resize-none py-3")}
                />
            </FormField>

            <div className="mt-1 grid grid-cols-[minmax(0,1fr)_minmax(0,2fr)] gap-2.5">
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
                    {isLoading ? "Guardando…" : "Guardar ruta"}
                </button>
            </div>
        </form>
    );
}

interface FormFieldProps {
    id: string;
    label: string;
    optional?: boolean;
    error?: string;
    hint?: string;
    children: ReactNode;
}

function FormField({ id, label, optional, error, hint, children }: FormFieldProps) {
    return (
        <div className="flex flex-col gap-1.5">
            <label htmlFor={id} className="text-sm font-semibold">
                {label} {optional && <span className="font-normal text-muted-foreground">(opcional)</span>}
            </label>
            {children}
            {error ? (
                <span id={`${id}-err`} className="flex items-center gap-1.5 text-xs font-medium text-destructive">
                    <CircleAlert className="size-3.5 shrink-0" aria-hidden />
                    {error}
                </span>
            ) : (
                hint && (
                    <span id={`${id}-hint`} className="text-xs text-muted-foreground">
                        {hint}
                    </span>
                )
            )}
        </div>
    );
}
