import { MainNav } from "../MainNav";
import { ThemeToggle } from "../ThemeToggle";

/** Title, theme toggle and section switch at the top of the phone list and stats screens. */
export function PhoneHeader({ title }: { title: string }) {
    return (
        <header className="flex flex-col gap-3.5 px-4 pb-3 pt-[max(20px,env(safe-area-inset-top))]">
            <div className="flex items-center justify-between">
                <h1 className="font-display text-[30px] font-extrabold tracking-[-0.03em]">{title}</h1>
                <ThemeToggle />
            </div>
            <MainNav />
        </header>
    );
}
