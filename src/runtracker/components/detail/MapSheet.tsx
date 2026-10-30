import { ExternalLink } from "lucide-react";
import { ResponsiveSheet } from "@/components/ui/responsive-sheet";
import { formatKm } from "../../utils/format";

interface MapSheetProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    trackName: string;
    /** Metres. */
    distance: number;
    /** Google My Maps embed URL. */
    mapUrl: string;
}

/** My Maps embed links (`/maps/d/embed?mid=…`) open full screen as `/maps/d/viewer?mid=…`. */
const toViewerUrl = (embedUrl: string) => embedUrl.replace("/maps/d/embed", "/maps/d/viewer");

export function MapSheet({ open, onOpenChange, trackName, distance, mapUrl }: MapSheetProps) {
    return (
        <ResponsiveSheet
            open={open}
            onOpenChange={onOpenChange}
            title="Mapa"
            description={`${trackName} · ${formatKm(distance)} km`}
            size="tall"
            showClose
        >
            <div className="relative min-h-0 flex-1 overflow-hidden rounded-[20px] border bg-muted">
                <iframe
                    src={mapUrl}
                    title={`Mapa de ${trackName}`}
                    loading="lazy"
                    className="absolute inset-0 size-full border-0"
                />
            </div>
            <a
                href={toViewerUrl(mapUrl)}
                target="_blank"
                rel="noreferrer"
                className="flex h-[52px] shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-[15px] font-semibold text-primary-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            >
                Abrir en Google Maps
                <ExternalLink className="size-4" aria-hidden />
            </a>
        </ResponsiveSheet>
    );
}
