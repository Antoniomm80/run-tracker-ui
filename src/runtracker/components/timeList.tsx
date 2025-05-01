import {ScrollArea} from "@mantine/core";
import {TimeProps} from "../domain/time";
import {TimeListItem} from "./timelistitem";

type TimeListProps = {
    times: TimeProps[];
    distance: number;
};

export function TimeList(props: TimeListProps) {
    return (
        <ScrollArea h={250}>
            {props.times.map((time) => (
                <TimeListItem key={`tli-${time.id}`} time={time} distance={props.distance}/>
            ))}
        </ScrollArea>
    );
}
