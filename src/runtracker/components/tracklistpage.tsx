import {useRunTrackerStore} from "../../App";
import {NewTrackFab} from "./newTrackFab";
import {TrackList} from "./tracksList";
import {useMediaQuery} from "@mantine/hooks";
import {ScrollArea} from "@mantine/core";

export function TrackListPage() {
    const tracksSummary = useRunTrackerStore((state) => state.tracksSummary);
    const open = useRunTrackerStore((state) => state.open);
    const isMobile = useMediaQuery('(max-width: 48em)');
    return (
        <>
            <ScrollArea h={"100%"} w={"100%"} sx={{overflow: "hidden"}}>
                <TrackList tracks={tracksSummary}/>
            </ScrollArea>
            {isMobile && <NewTrackFab open={open}/>}

        </>
    );
}
