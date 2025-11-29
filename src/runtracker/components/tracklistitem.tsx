import { Card } from "@/components/ui/card";
import { TrackSummary } from "../domain/tracksummary";
import timeUtils from "../utils/timeutils";
import { IconArrowDownRight, IconArrowUpRight, IconCalendar, IconRun, IconTrophy } from "@tabler/icons-react";
import { useRunTrackerStore } from "../../App";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface TimeRefDecoratorProps {
    track: TrackSummary;
}

const TimeRefDecorator: React.FC<TimeRefDecoratorProps> = (props) => {
    if (!props.track.latestToBestTimespan) {
        return <></>;
    }
    const diferencia = props.track.latestToBestTimespan;
    const DiffIcon = diferencia < 0 ? IconArrowUpRight : IconArrowDownRight;
    const isPositive = diferencia < 0; // Negative difference means faster (better)

    return (
        <div className="flex flex-col items-start gap-1">
            <div className={cn(
                "p-1 rounded-md",
                isPositive ? "bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400" : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
            )}>
                <DiffIcon size="1.25rem" stroke={1.25} />
            </div>
            <span className="text-sm">{`${diferencia > 0 ? "+" : ""}${diferencia}s`}</span>
        </div>
    );
};

function CardElement(props: { icon: React.ReactNode, text: string, active: boolean }) {
    return (
        <div className="flex items-center gap-2">
            {props.icon}
            <span className={cn(
                "text-sm",
                props.active ? "text-primary-foreground/90" : "text-muted-foreground"
            )}>
                {props.text}
            </span>
        </div>
    );
}

interface TrackListItemProps {
    track: TrackSummary;
    navigation: boolean | undefined;
}

export const TrackListItem: React.FC<TrackListItemProps> = ({ track }) => {
    const selectedTrack = useRunTrackerStore((state) => state.selectedTrack);
    const navigate = useNavigate();
    const handleOnClick = () => navigate(`/tracks/${track.id}`);
    const active = track.id === selectedTrack;

    const prepareDistanceText = (path: TrackSummary): string => {
        return ` ${path.distanceInKms()} kms`;
    }
    const prepareTimeText = (path: TrackSummary): string => {
        if (!path.durationBest) {
            return "";
        }
        return ` ${timeUtils.printTime(path.durationBest)}`;
    };

    const prepareDateText = (path: TrackSummary): string => {
        if (!path.trainingDateBest) {
            return "";
        }
        return ` ${timeUtils.formatDate(path.trainingDateBest)}`;
    };

    return (
        <Card
            className={cn(
                "mt-2 cursor-pointer transition-colors hover:bg-accent/50",
                active ? "bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-900 dark:hover:bg-blue-800" : ""
            )}
            onClick={handleOnClick}
        >
            <div className="p-3 grid grid-cols-12 gap-2">
                <div className="col-span-11">
                    <h3 className={cn("font-semibold text-base mb-2", active ? "text-white" : "")}>
                        {track.name}
                    </h3>
                    <div className="flex flex-wrap gap-3 items-center">
                        <CardElement
                            icon={<IconRun size="1.4rem" stroke={1.4} color={active ? "white" : "orange"} />}
                            text={prepareDistanceText(track)}
                            active={active}
                        />
                        <CardElement
                            icon={<IconTrophy size="1.4rem" stroke={1.4} color={active ? "white" : "#fbbf24"} />} // yellow-400
                            text={prepareTimeText(track)}
                            active={active}
                        />
                        <CardElement
                            icon={<IconCalendar size="1.4rem" stroke={1.4} color={active ? "white" : "#ef4444"} />} // red-500
                            text={prepareDateText(track)}
                            active={active}
                        />
                    </div>
                </div>
                <div className="col-span-1 flex justify-center">
                    <TimeRefDecorator track={track} />
                </div>
            </div>
        </Card>
    );
};
