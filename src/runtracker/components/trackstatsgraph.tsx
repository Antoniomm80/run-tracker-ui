import { useQuery } from "@tanstack/react-query";
import { useContext } from "react";
import timeService from "../domain/timeservice";
import MonthSelector from "./monthselector";
import { StatsGraphContextContent } from "./statsgraphcontext";
import { StatsGraphContext } from "./statsgraphcontextmanager";
import BarGraph from "./bargraph";
import { Card } from "@/components/ui/card";

const TrackStatsGraph: React.FC = () => {
    const statsGraphContext: StatsGraphContextContent = useContext(StatsGraphContext);

    const {
        isLoading,
        data
    } = useQuery(["stats", statsGraphContext.getMonth(), statsGraphContext.getYear()], () => timeService.getMonthStats(statsGraphContext.getMonth(), statsGraphContext.getYear()));


    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-64">
                Loading...
            </div>
        );
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <Card className="p-6">
                <BarGraph data={data || []} />
                <MonthSelector />
            </Card>
        </div>
    );
}
export default TrackStatsGraph;