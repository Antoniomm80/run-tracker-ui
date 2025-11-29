import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { IconClock, IconRun } from "@tabler/icons-react";
import { TimeProps } from "../domain/time";
import { TrackProps } from "../domain/track";
import timeUtils from "../utils/timeutils";
import { translate } from "react-i18nify";
import "./trackcard.css";

interface TrackCardProps {
    bestTime: TimeProps | undefined;
    track: TrackProps;
    open: () => void;
}

export function TrackCard(props: TrackCardProps) {
    const buildBest = () => {
        if (props.bestTime) {
            return (
                <div className="text-sm">
                    <p><strong>Duración: </strong>{`${timeUtils.printTime(props.bestTime.duration)}`} </p>
                    <p><strong>Fecha: </strong>{`${timeUtils.formatDate(props.bestTime.trainingDate)}`}</p>
                </div>
            );
        }
        return <></>;
    };

    return (
        <Card className="relative overflow-visible mt-8 pt-8">
            <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-500 rounded-full p-3 text-white shadow-lg z-10">
                <IconRun size="2rem" stroke={1.5} />
            </div>

            <CardContent className="pt-4">
                <div className="map-wrapper mb-6 rounded-md overflow-hidden border">
                    <div className="map-container">
                        {props.track.pathToMap !== undefined &&
                            <iframe src={props.track.pathToMap} width="100%" height="300px" title="map" frameBorder="0" />}
                    </div>
                </div>

                <CardTitle className="text-xl font-bold mb-2">
                    {props.track.name}
                </CardTitle>

                <p className="text-muted-foreground line-clamp-3 mb-4">
                    {props.track.description}
                </p>

                <div className="flex justify-between items-end mt-4">
                    <div>{buildBest()}</div>
                    <Button onClick={props.open} className="gap-2">
                        <IconClock size="1rem" />
                        {translate("actions.add")}
                    </Button>
                </div>
            </CardContent>
        </Card>
    );
}
