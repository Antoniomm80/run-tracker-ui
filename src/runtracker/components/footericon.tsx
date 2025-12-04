import { Button } from "@/components/ui/button";
import { BarChart, Activity } from "lucide-react";

type FooterIconProps = {
    onClick: () => void;
    variant: "default" | "ghost" | "secondary";
    type: "run" | "chart";
}

export function FooterIcon(props: FooterIconProps) {
    return (
        <Button size="icon" variant={props.variant} onClick={props.onClick} className="h-12 w-12 rounded-full">
            {props.type === "run" && <Activity className="h-8 w-8" />}
            {props.type === "chart" && <BarChart className="h-8 w-8" />}
        </Button>
    );
}
