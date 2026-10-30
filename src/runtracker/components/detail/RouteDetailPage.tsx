import { Link, useParams } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import { useIsSplitLayout } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { useTrack } from "../../domain/queries";
import { RouteDetail } from "./RouteDetail";

export function RouteDetailPage() {
    const trackId = Number(useParams().trackId);
    const wide = useIsSplitLayout();
    const { data: track, isLoading, isError } = useTrack(trackId);

    if (isLoading) {
        return (
            <div aria-busy className={cn("flex flex-col gap-4", !wide && "p-4")}>
                <span className="sr-only">Cargando ruta…</span>
                <Skeleton className={cn("h-64", wide ? "rounded-3xl" : "rounded-[28px]")} />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-72 rounded-2xl" />
            </div>
        );
    }

    if (isError || !track) {
        return (
            <div className="flex flex-col items-center gap-3 p-10 text-center">
                <p className="font-display text-2xl font-extrabold">No encontramos esta ruta</p>
                <p className="text-sm text-muted-foreground">Puede que se haya borrado o que el servidor no responda.</p>
                <Link to="/" className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
                    Volver a rutas
                </Link>
            </div>
        );
    }

    return <RouteDetail key={track.id} track={track} wide={wide} />;
}
