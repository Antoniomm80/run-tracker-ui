import { Skeleton } from "@/components/ui/skeleton";

const ROW_WIDTHS = [
    ["78%", "48%"],
    ["62%", "56%"],
    ["86%", "40%"],
    ["54%", "52%"],
];

/** Placeholder in the shape of the grouped route list. */
export function RoutesSkeleton() {
    return (
        <div aria-busy className="flex flex-col gap-[18px]">
            <span className="sr-only">Cargando rutas…</span>
            <div aria-hidden className="flex gap-2">
                <Skeleton className="h-[34px] w-16 rounded-full bg-bar/60" />
                <Skeleton className="h-[34px] w-[72px] rounded-full" />
                <Skeleton className="h-[34px] w-20 rounded-full" />
                <Skeleton className="h-[34px] w-[72px] rounded-full" />
            </div>
            {[4, 3].map((rows, group) => (
                <div key={group} aria-hidden className="flex flex-col gap-2">
                    <Skeleton className="h-3 w-[140px] bg-bar/60" />
                    <div className="overflow-hidden rounded-2xl border bg-card">
                        {ROW_WIDTHS.slice(0, rows).map(([w1, w2], i) => (
                            <div key={i} className="flex items-center gap-3.5 border-t border-muted p-3.5 first:border-t-0">
                                <Skeleton className="h-[34px] w-11 rounded-[10px] bg-brand-soft" />
                                <div className="flex flex-1 flex-col gap-2">
                                    <Skeleton className="h-3 bg-bar/60" style={{ width: w1 }} />
                                    <Skeleton className="h-2.5" style={{ width: w2 }} />
                                </div>
                                <Skeleton className="h-3 w-10" />
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );
}
