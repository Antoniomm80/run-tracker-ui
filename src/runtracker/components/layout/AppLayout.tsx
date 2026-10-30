import { useState } from "react";
import { Outlet, useMatch } from "react-router-dom";
import { Search } from "lucide-react";
import { useIsSplitLayout, useMediaQuery } from "@/hooks/use-media-query";
import { cn } from "@/lib/utils";
import { useTracks } from "../../domain/queries";
import { MainNav } from "../MainNav";
import { ThemeToggle } from "../ThemeToggle";
import { NewRouteButton } from "../routes/NewRouteButton";
import { RouteList } from "../routes/RouteList";
import { RoutesSkeleton } from "../routes/RoutesSkeleton";

/**
 * Phones (< md): every screen is a full page with its own header.
 * Tablet/desktop: 72px header; route sections get a list sidebar next to the content.
 */
export function AppLayout() {
    const split = useIsSplitLayout();
    const onStats = Boolean(useMatch("/charts"));

    if (!split) {
        return (
            <main className="min-h-dvh">
                <Outlet />
            </main>
        );
    }

    return (
        <div className="flex h-dvh flex-col">
            <header className="flex h-[72px] shrink-0 items-center gap-4 border-b px-5 pt-[env(safe-area-inset-top)] lg:gap-5 lg:px-6">
                <span className="font-display text-[22px] font-extrabold tracking-[-0.03em]">Run tracker</span>
                <MainNav className="w-[260px] lg:w-[280px]" />
                <div className="flex-1" />
                <ThemeToggle />
            </header>
            <div className="flex min-h-0 flex-1">
                {!onStats && <RoutesSidebar />}
                <main className={cn("min-w-0 flex-1 overflow-y-auto", onStats ? "px-8 py-7" : "p-5")}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

function RoutesSidebar() {
    const { data: routes, isLoading } = useTracks();
    const wide = useMediaQuery("(min-width: 1024px)");
    const [query, setQuery] = useState("");
    const selected = useMatch("/tracks/:trackId")?.params.trackId;

    return (
        <aside
            aria-label="Rutas"
            className="flex w-[320px] shrink-0 flex-col gap-3.5 overflow-y-auto border-r p-4 lg:w-[380px] lg:p-5"
        >
            {wide ? (
                <div className="flex items-center gap-2">
                    <label className="flex h-11 min-w-0 flex-1 items-center gap-2 rounded-full border bg-card px-3.5 text-muted-foreground focus-within:border-brand focus-within:ring-1 focus-within:ring-brand">
                        <Search className="size-4 shrink-0" aria-hidden />
                        <input
                            type="search"
                            placeholder="Buscar ruta"
                            aria-label="Buscar ruta"
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                            className="min-w-0 flex-1 bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none"
                        />
                    </label>
                    <NewRouteButton variant="compact" />
                </div>
            ) : (
                <NewRouteButton variant="block" />
            )}
            {isLoading ? (
                <RoutesSkeleton />
            ) : (
                <RouteList routes={routes ?? []} selectedId={selected ? Number(selected) : undefined} query={query} dense />
            )}
        </aside>
    );
}
