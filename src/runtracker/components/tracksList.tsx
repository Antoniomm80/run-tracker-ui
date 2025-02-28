import {TrackSummary} from "../domain/tracksummary";
import {TrackListItem} from "./tracklistitem";

interface TrackListProps {
    tracks: TrackSummary[];
    navigation?: boolean;
}

export const TrackList: React.FC<TrackListProps> = (props) => {

    return (
        <>
            {props.tracks.map((track, index) => (
                <TrackListItem key={`${index}-${track.id}`} track={track} navigation={props.navigation}/>
            ))}
        </>
    );
};
