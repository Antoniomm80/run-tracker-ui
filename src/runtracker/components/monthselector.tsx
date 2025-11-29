import { useContext } from "react";
import { StatsGraphContextContent } from "./statsgraphcontext";
import { StatsGraphContext } from "./statsgraphcontextmanager";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "./monthselector.css";

const MonthSelector: React.FC = () => {
    const statsGraphContext: StatsGraphContextContent = useContext(StatsGraphContext);
    return (
        <div className="month-selector flex items-center justify-center gap-4 py-4">
            <Button variant="ghost" size="icon" onClick={() => statsGraphContext.substractMonth()}>
                <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-lg font-semibold min-w-[150px] text-center">
                {statsGraphContext.getMonthLabel()}
            </span>
            <Button variant="ghost" size="icon" onClick={() => statsGraphContext.addMonth()}>
                <ChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
}
export default MonthSelector;