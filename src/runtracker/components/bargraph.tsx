import React from "react";
import { BarElement, CategoryScale, Chart as ChartJS, Legend, LinearScale, Title, Tooltip } from "chart.js";
import { Bar } from "react-chartjs-2";
import { translate } from "react-i18nify";
import { TrackStatsProps } from "./trackstats";
import "./bargraph.css";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

export interface BarGraphProps {
    data: TrackStatsProps[];
}

const BarGraph: React.FC<BarGraphProps> = (props) => {
    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "top" as const,
            },
            title: {
                display: true,
                text: translate("stats.graphTitle"),
            },
        },
    };

    const labels = props.data.map((item) => {
        if (item.name.length > 20) {
            return item.name.substring(0, 20) + "...";
        }
        return item.name;
    });
    const data = {
        labels: labels,
        datasets: [
            {
                label: translate("stats.distance"),
                data: props.data.map((item) => item.totalDistance / 1000),
                backgroundColor: "rgba(255, 99, 132, 0.2)",
            },
            {
                label: translate("stats.time"),
                data: props.data.map((item) => item.totalDuration / 3600),
                backgroundColor: "rgba(54, 162, 235, 0.2)",
            },
        ],
    };

    return (
        <div className="relative h-[400px] w-full">
            <Bar data={data} options={options} className="w-full h-full" />
        </div>)
};

export default BarGraph;
