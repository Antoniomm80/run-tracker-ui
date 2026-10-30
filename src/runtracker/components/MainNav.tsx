import { Link, useMatch } from "react-router-dom";
import { cn } from "@/lib/utils";

const item =
    "flex items-center justify-center rounded-full text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring";
const active = "bg-card font-semibold text-foreground shadow-sm";
const idle = "font-medium text-muted-foreground hover:text-foreground";

/** Segmented control switching between the two top-level sections. */
export function MainNav({ className }: { className?: string }) {
    const onStats = Boolean(useMatch("/charts"));
    return (
        <nav aria-label="Principal" className={cn("grid h-11 grid-cols-2 rounded-full bg-secondary p-1", className)}>
            <Link to="/" aria-current={onStats ? undefined : "page"} className={cn(item, onStats ? idle : active)}>
                Rutas
            </Link>
            <Link to="/charts" aria-current={onStats ? "page" : undefined} className={cn(item, onStats ? active : idle)}>
                Estadísticas
            </Link>
        </nav>
    );
}
