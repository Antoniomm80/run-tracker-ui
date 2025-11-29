import { TimeProps } from "../domain/time";
import { TimeListItem } from "./timelistitem";

type TimeListProps = {
    times: TimeProps[];
    distance: number;
};

export function TimeList(props: TimeListProps) {
    return (
        <div className="h-[250px] overflow-auto pr-2">
            {props.times.map((time) => (
                <TimeListItem key={`tli-${time.id}`} time={time} distance={props.distance} />
            ))}
        </div>
    );
}
