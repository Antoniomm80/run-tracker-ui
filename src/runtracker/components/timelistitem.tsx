import { Card } from "@/components/ui/card";
import { TimeProps } from "../domain/time";
import { translate } from "react-i18nify";
import timeUtils from "../utils/timeutils";
import { IconCalendar } from "@tabler/icons-react";

type TimeListItemProps = {
    time: TimeProps;
    distance: number;
};

export function TimeListItem(props: TimeListItemProps) {
    return (
        <Card className="mt-2 p-4 border rounded-md shadow-sm">
            <div className="grid gap-2">
                <div className="font-semibold text-lg">
                    {translate("labels.duration")}: {timeUtils.printTime(props.time.duration)}
                </div>
                <div className="text-muted-foreground">
                    {translate("labels.pace")}:{" "}
                    <strong className="text-foreground">{timeUtils.calculateSpeed(props.time.duration, props.distance)}</strong>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                    <IconCalendar size="1.4rem" stroke={1.4} />
                    <span>{timeUtils.formatDate(props.time.trainingDate)}</span>
                </div>
            </div>
        </Card>
    );
}
