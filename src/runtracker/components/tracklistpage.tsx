import {useRunTrackerStore} from "../../App";
import {NewTrackFab} from "./newTrackFab";
import {TrackList} from "./tracksList";
import {useMediaQuery} from "@mantine/hooks";
import {ScrollArea} from "@mantine/core";
import "./tracklistpage.css";

export function TrackListPage() {
    const tracksSummary = useRunTrackerStore((state) => state.tracksSummary);
    const open = useRunTrackerStore((state) => state.open);
    const isMobile = useMediaQuery('(max-width: 48em)');
    return (
        <>
            <ScrollArea className="track-list-page">
                <TrackList tracks={tracksSummary}/>
            </ScrollArea>
            {isMobile && <NewTrackFab open={open}/>}

        </>
    );
}
