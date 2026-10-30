import { useState } from "react";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { NewRouteSheet } from "./NewRouteSheet";

const variants = {
    /** Phone: floating pill centered above the bottom edge. */
    fab: "fixed bottom-[max(28px,env(safe-area-inset-bottom))] left-1/2 z-10 h-[54px] -translate-x-1/2 px-6 text-[15px] shadow-[0_8px_24px_hsl(var(--brand)/0.35)]",
    /** Tablet sidebar: full width. */
    block: "h-12 w-full text-[15px]",
    /** Desktop sidebar, next to the search field. */
    compact: "h-11 px-4 text-sm",
};

export function NewRouteButton({ variant }: { variant: keyof typeof variants }) {
    const [open, setOpen] = useState(false);
    return (
        <>
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={cn(
                    "inline-flex shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-brand font-semibold text-brand-foreground transition-opacity hover:opacity-90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
                    variants[variant],
                )}
            >
                <Plus className="size-[18px]" strokeWidth={2.4} aria-hidden />
                {variant === "compact" ? "Nueva" : "Nueva ruta"}
            </button>
            <NewRouteSheet open={open} onOpenChange={setOpen} />
        </>
    );
}
