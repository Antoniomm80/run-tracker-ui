import { cn } from "@/lib/utils";
import { YearMonth } from "../../domain/queries";
import { formatKm, formatMonth, formatMonthShort } from "../../utils/format";

export interface MonthTotal extends YearMonth {
    /** Metres; undefined while loading. */
    distance?: number;
}

interface MonthBarsProps {
    months: MonthTotal[];
    selected: YearMonth;
    onSelect: (month: YearMonth) => void;
    /** Larger bars with km values and 3-letter labels (tablet/desktop). */
    wide?: boolean;
}

const same = (a: YearMonth, b: YearMonth) => a.year === b.year && a.month === b.month;

/**
 * Kilometres per month as plain bars. Each bar is a button that selects its month,
 * so the chart doubles as the month picker.
 */
export function MonthBars({ months, selected, onSelect, wide = false }: MonthBarsProps) {
    const max = Math.max(...months.map((m) => m.distance ?? 0), 1);
    const maxBar = wide ? 160 : 72;

    return (
        <div
            role="group"
            aria-label="Kilómetros por mes"
            className={cn("grid grid-cols-12 items-end", wide ? "h-[220px] gap-2.5" : "h-24 gap-1")}
        >
            {months.map((m) => {
                const isSelected = same(m, selected);
                const km = m.distance ?? 0;
                const label = formatMonthShort(m.month);
                return (
                    <button
                        key={`${m.year}-${m.month}`}
                        type="button"
                        aria-pressed={isSelected}
                        aria-label={`${formatMonth(m.year, m.month)}: ${m.distance === undefined ? "cargando" : `${formatKm(km, 1)} km`}`}
                        onClick={() => onSelect(m)}
                        className={cn(
                            "group flex h-full flex-col items-stretch justify-end rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                            wide ? "gap-2" : "gap-1",
                        )}
                    >
                        {wide && (
                            <span aria-hidden className={cn("text-center text-[11px] font-semibold tabular", isSelected ? "text-brand" : "text-muted-foreground")}>
                                {km ? formatKm(km, 1) : "–"}
                            </span>
                        )}
                        <span
                            aria-hidden
                            className={cn(
                                "block min-h-[3px] transition-[height,background-color] duration-300 motion-reduce:transition-none",
                                wide ? "rounded-t-lg rounded-b-[3px]" : "rounded-t-[5px] rounded-b-[2px]",
                                isSelected ? "bg-brand" : "bg-border group-hover:bg-bar",
                                m.distance === undefined && "animate-pulse",
                            )}
                            style={{ height: Math.round((km / max) * maxBar) }}
                        />
                        <span
                            aria-hidden
                            className={cn(
                                "text-center",
                                wide ? "text-xs" : "text-[10px]",
                                isSelected ? "font-bold text-foreground" : "text-muted-foreground",
                            )}
                        >
                            {wide ? label : label.charAt(0).toUpperCase()}
                        </span>
                    </button>
                );
            })}
        </div>
    );
}
