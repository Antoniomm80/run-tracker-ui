import { HeaderBar } from "./headerbar";
import { TrackList } from "./tracksList";
import { Plus } from "lucide-react";
import { translate } from "react-i18nify";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { pathService } from "../domain/trackservice";
import { TrackSummary } from "../domain/tracksummary";
import { useRunTrackerStore } from "../../App";
import { Outlet } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Track, TrackProps } from "../domain/track";
import { FooterBar } from "./footerbar";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { toast } from "sonner";

type NewTrackFormValues = {
    name: string;
    description: string;
    pathToMap?: string;
    distance: number;
};

interface RunTrackerAppShellProps {
    toggleColorScheme: () => void;
    colorScheme: "light" | "dark";
}

export default function RunTrackerAppShell({ toggleColorScheme, colorScheme }: RunTrackerAppShellProps) {
    const queryclient = useQueryClient();
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoadingOverlay, setIsLoadingOverlay] = useState(false);

    const { mutate } = useMutation((newPath: TrackProps) => pathService.createPath(newPath), {
        onSuccess: (savedPath: TrackProps) => {
            const paths: TrackProps[] = queryclient.getQueryData(["tracks"]) as TrackProps[];
            if (paths) {
                paths.push(savedPath);
                queryclient.setQueryData(["tracks"], [...paths]);
            }
            setIsLoadingOverlay(false);
            setIsDialogOpen(false);
            reset();
            toast.success(translate("newPath.success") || "Track saved successfully");
        },
        onError: () => {
            setIsLoadingOverlay(false);
            toast.error(translate("newTime.saveError") || "Error saving track");
        },
    });

    const {
        register,
        formState: { errors, isDirty, isValid },
        handleSubmit,
        setValue,
        trigger,
        reset
    } = useForm<NewTrackFormValues>({ mode: "onBlur" });

    const setTracksSummary = useRunTrackerStore((state) => state.setTracksSummary);
    const setOpen = useRunTrackerStore((state) => state.setOpen);
    const { isLoading, data } = useQuery(["paths"], pathService.findAll);

    // Expose open function to store if needed, though typically we'd use local state
    setOpen(() => setIsDialogOpen(true));

    const onSubmit = handleSubmit((form: NewTrackFormValues) => {
        setIsLoadingOverlay(true);
        mutate(Track.ofProps(form));
    });

    const handleChange = (e: any) => {
        e.persist();
        setValue(e.target.name, e.target.value);
        trigger(e.target.name);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center h-screen">
                <span>Loading...</span>
            </div>
        );
    }
    const tracks = data?.map((p) => new TrackSummary(p)) || [];
    setTracksSummary(tracks);

    return (
        <div className="flex flex-col h-screen overflow-hidden">
            {/* Header */}
            <header className="h-[50px] md:h-[70px] border-b p-4 flex items-center bg-background z-10">
                <HeaderBar toggleColorScheme={toggleColorScheme} colorScheme={colorScheme} />
            </header>

            <div className="flex flex-1 overflow-hidden">
                {/* Sidebar (Desktop only) */}
                <aside className="hidden md:flex w-[300px] lg:w-[400px] flex-col border-r bg-muted/10">
                    <div className="p-4 border-b flex justify-center">
                        <Button onClick={() => setIsDialogOpen(true)} className="w-full" variant="default">
                            <Plus className="mr-2 h-4 w-4" />
                            {translate("newPath.action")}
                        </Button>
                    </div>
                    <div className="flex-1 overflow-auto p-2">
                        <TrackList tracks={tracks} navigation />
                    </div>
                </aside>

                {/* Main Content */}
                <main id="detail" className="flex-1 overflow-auto p-4 relative">
                    <Outlet />
                </main>
            </div>

            {/* Footer (Mobile only) */}
            <footer className="md:hidden h-[60px] border-t bg-background flex items-center justify-center z-10">
                <FooterBar />
            </footer>

            {/* New Track Dialog */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{translate("newPath.title")}</DialogTitle>
                    </DialogHeader>

                    {isLoadingOverlay && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
                            <span>Saving...</span>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="name" className="flex items-center gap-1">
                                {translate("newPath.name")} <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="name"
                                {...register("name", { required: true, onBlur: handleChange })}
                                aria-invalid={errors.name ? "true" : "false"}
                            />
                            {errors.name?.type === "required" && (
                                <small className="text-destructive text-xs">
                                    {translate("validation.mandatory")}
                                </small>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="distance" className="flex items-center gap-1">
                                {translate("newPath.distance")} <span className="text-destructive">*</span>
                            </Label>
                            <Input
                                id="distance"
                                type="number"
                                step="any"
                                {...register("distance", { required: true, onBlur: handleChange })}
                                aria-invalid={errors.distance ? "true" : "false"}
                            />
                            {errors.distance?.type === "required" && (
                                <small className="text-destructive text-xs">
                                    {translate("validation.mandatory")}
                                </small>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="pathToMap">
                                {translate("newPath.pathToMap")}
                            </Label>
                            <Input
                                id="pathToMap"
                                {...register("pathToMap", { onBlur: handleChange })}
                            />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description" className="flex items-center gap-1">
                                {translate("newPath.description")} <span className="text-destructive">*</span>
                            </Label>
                            <Textarea
                                id="description"
                                {...register("description", { required: true, onBlur: handleChange })}
                                aria-invalid={errors.description ? "true" : "false"}
                            />
                            {errors.description?.type === "required" && (
                                <small className="text-destructive text-xs">
                                    {translate("validation.mandatory")}
                                </small>
                            )}
                        </div>

                        <div className="flex justify-end mt-4">
                            <Button disabled={!isDirty || !isValid} type="submit">
                                {translate("actions.save")}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
