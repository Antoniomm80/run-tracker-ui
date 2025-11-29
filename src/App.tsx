import "./runtracker/i18n/i18nconfig";
import { create } from "zustand";
import RunTrackerAppShell from "./runtracker/components/appShell";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { TrackSummary } from "./runtracker/domain/tracksummary";
import { RunTrackerState } from "./runtracker/domain/runtrackerstate";
import { useEffect, useState } from "react";
import { Toaster } from "@/components/ui/sonner"
import "./App.css";

export const useRunTrackerStore = create<RunTrackerState>()((set, get) => ({
    tracksSummary: [],
    setTracksSummary: (tracks: TrackSummary[]) => set(() => ({ tracksSummary: [...tracks] })),
    selectedTrack: undefined,
    setSelectedTrack: (trackId) => set(() => ({ selectedTrack: trackId })),
    getSelectedTrack: () => {
        if (get().tracksSummary.length === 0) {
            return undefined;
        }
        if (get().selectedTrack === undefined) {
            set({ selectedTrack: get().tracksSummary[0].id });
            return get().tracksSummary[0];
        }
        return get().tracksSummary.find((t) => t.id === get().selectedTrack);
    },
    clear: () => set(() => ({ selectedTrack: undefined })),
    open: () => {
    },
    setOpen: (open: () => void) => set(() => ({ open: open })),
}));

export default function App() {
    const [colorScheme, setColorScheme] = useState<"light" | "dark">("light");

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");
        root.classList.add(colorScheme);
    }, [colorScheme]);

    const toggleColorScheme = () =>
        setColorScheme(colorScheme === "dark" ? "light" : "dark");

    const queryClient = new QueryClient();

    return (
        <QueryClientProvider client={queryClient}>
            <div className="main-container bg-background text-foreground min-h-screen flex flex-col">
                <RunTrackerAppShell toggleColorScheme={toggleColorScheme} colorScheme={colorScheme} />
            </div>
            <Toaster />
            <ReactQueryDevtools initialIsOpen={false} />
        </QueryClientProvider>
    );
}
