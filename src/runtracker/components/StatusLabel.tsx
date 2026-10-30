import { cn } from "@/lib/utils";
import { RouteStatus } from "../domain/routeGroups";
import { formatDelta } from "../utils/format";

/** Latest run vs. record: "Récord", "+29 s" or "—" when the route has no times. */
export function StatusLabel({ status, className }: { status: RouteStatus; className?: string }) {
    const base = "text-xs font-semibold tabular whitespace-nowrap";
    switch (status.kind) {
        case "record":
            return <span className={cn(base, "text-success", className)}>Récord</span>;
        case "slower":
            return (
                <span className={cn(base, "text-warning", className)} title="Último tiempo respecto al récord">
                    {formatDelta(status.seconds)}
                </span>
            );
        default:
            return <span className={cn(base, "text-muted-foreground", className)} aria-label="Sin tiempos">—</span>;
    }
}
