import { TrackSummary } from "../domain/tracksummary";
import { TrackListItem } from "./tracklistitem";

interface TrackListProps {
    tracks: TrackSummary[];
    navigation?: boolean;
}

export const TrackList = (props: TrackListProps) => {

    return (
        <div className="flex flex-col gap-2">
            {props.tracks.map((track, index) => (
                <TrackListItem key={`${index}-${track.id}`} track={track} navigation={props.navigation} />
            ))}
        </div>
    );
};
