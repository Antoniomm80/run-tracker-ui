import {ColorScheme, ColorSchemeProvider, MantineProvider} from "@mantine/core";
import "./runtracker/i18n/i18nconfig";
import {create} from "zustand";
import RunTrackerAppShell from "./runtracker/components/appShell";
import {QueryClient, QueryClientProvider} from "@tanstack/react-query";
import {ReactQueryDevtools} from "@tanstack/react-query-devtools";
import {TrackSummary} from "./runtracker/domain/tracksummary";
import {RunTrackerState} from "./runtracker/domain/runtrackerstate";
import {useState} from "react";
import {Notifications} from "@mantine/notifications";
import "./App.css";

export const useRunTrackerStore = create<RunTrackerState>()((set, get) => ({
    tracksSummary: [],
    setTracksSummary: (tracks: TrackSummary[]) => set(() => ({tracksSummary: [...tracks]})),
    selectedTrack: undefined,
    setSelectedTrack: (trackId) => set(() => ({selectedTrack: trackId})),
    getSelectedTrack: () => {
        if (get().tracksSummary.length === 0) {
            return undefined;
        }
        if (get().selectedTrack === undefined) {
            set({selectedTrack: get().tracksSummary[0].id});
            return get().tracksSummary[0];
        }
        return get().tracksSummary.find((t) => t.id === get().selectedTrack);
    },
    clear: () => set(() => ({selectedTrack: undefined})),
    open: () => {
    },
    setOpen: (open: () => void) => set(() => ({open: open})),
}));
export default function App() {
    const [colorScheme, setColorScheme] = useState<ColorScheme>("light");
    const toggleColorScheme = (value?: ColorScheme) =>
        setColorScheme(value || (colorScheme === "dark" ? "light" : "dark"));
    const queryClient = new QueryClient();

    return (
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider theme={{colorScheme}} withGlobalStyles withNormalizeCSS styles={{
                global: () => ({
                    body: {
                        overflow: 'hidden',
                        position: 'fixed',
                        width: '100%',
                        height: '100dvh',
                    },
                }),
            }}>
                <Notifications/>
                <QueryClientProvider client={queryClient}>
                    <div className="main-container">
                        <RunTrackerAppShell/>
                    </div>
                    <ReactQueryDevtools initialIsOpen={false}/>
                </QueryClientProvider>
            </MantineProvider>
        </ColorSchemeProvider>
    );
}
