import { Button } from "@/components/ui/button";
import { Moon, Sun, ChevronLeft } from "lucide-react";
import { useMatch, useNavigate } from "react-router-dom";
import { useMediaQuery } from "@mantine/hooks"; // Keep for now or replace with custom hook

interface HeaderBarProps {
    toggleColorScheme: () => void;
    colorScheme: "light" | "dark";
}

export function HeaderBar({ toggleColorScheme, colorScheme }: HeaderBarProps) {
    const match = useMatch("tracks/:trackId");
    const dark = colorScheme === "dark";
    const navigate = useNavigate();
    const handleOnClick = () => navigate("");
    const isMobile = useMediaQuery('(max-width: 768px)'); // Adjusted breakpoint to match Tailwind md
    const shouldRenderBackButton = isMobile && Boolean(match);

    return (
        <div className="flex w-full justify-between items-center">
            <div className="flex items-center gap-2">
                {shouldRenderBackButton && (
                    <Button variant="ghost" size="icon" onClick={handleOnClick}>
                        <ChevronLeft className="h-5 w-5" />
                    </Button>
                )}
                <span className="font-semibold text-lg">Run tracker</span>
            </div>

            <Button
                variant="outline"
                size="icon"
                onClick={toggleColorScheme}
                title="Toggle color scheme"
            >
                {dark ? <Sun className="h-[1.2rem] w-[1.2rem]" /> : <Moon className="h-[1.2rem] w-[1.2rem]" />}
            </Button>
        </div>
    );
}
