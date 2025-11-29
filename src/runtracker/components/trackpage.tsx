import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Time, TimeProps } from "../domain/time";
import { Track, TrackProps } from "../domain/track";
import { TrackCard } from "./trackcard";
import { IconCalendar, IconClock, IconMessageCircle, IconPhoto } from "@tabler/icons-react";
import { translate } from "react-i18nify";
import { TrackSummary } from "../domain/tracksummary";
import { pathService } from "../domain/trackservice";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import "./trackpage.css";
import timeService from "../domain/timeservice";
import { TimeList } from "./timeList";
import TrackTimesGraph from "./tracktimesgraph";
import { useState } from "react";
import { toast } from "sonner";

type NewTimeFormValues = {
    trainingDate: string;
    durationString: string;
};

export interface TrackPageProps {
    trackSummary?: TrackSummary;
}

export function TrackPage(props: TrackPageProps) {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoadingOverlay, setIsLoadingOverlay] = useState(false);
    const { trackId } = useParams();
    const { isLoading, data } = useQuery(["track", trackId], () => pathService.findById(trackId || ""));

    const queryclient = useQueryClient();
    const { mutate } = useMutation((newTime: TimeProps) => timeService.createTime(trackId || "", newTime), {
        onSuccess: (savedTime) => {
            const currentPath: Track = queryclient.getQueryData(["track", trackId]) as Track;
            if (currentPath) {
                currentPath.times?.push(Time.of(savedTime));
                queryclient.setQueryData(["track", trackId], { ...currentPath });
            }
            queryclient.invalidateQueries(["paths"]);
            queryclient.invalidateQueries(["stats"]);

            toast.success(translate("newTime.saveSuccess") || "Time saved successfully");

            setIsLoadingOverlay(false);
            setIsDialogOpen(false);
        },
        onError: () => {
            setIsLoadingOverlay(false);
            toast.error(translate("newTime.saveError") || "Error saving time");
        },
    });

    const currentDateISO = new Date().toISOString().split('T')[0];
    const {
        register,
        formState: { errors, isDirty, isValid },
        handleSubmit,
        setValue,
        trigger,
    } = useForm<NewTimeFormValues>({ mode: "onBlur", defaultValues: { trainingDate: currentDateISO, durationString: "" } });

    const calculateDuration = (duration: string): number => {
        const durationComponents = duration.split(":");
        return parseInt(durationComponents[0]) * 60 + parseInt(durationComponents[1]);
    };

    const onSubmit = handleSubmit((form: NewTimeFormValues) => {
        setIsLoadingOverlay(true);
        const adaptedForm = {
            trainingDate: new Date(form.trainingDate),
            duration: calculateDuration(form.durationString),
        };
        mutate(adaptedForm);
    });

    const handleChange = (e: any) => {
        e.persist();
        setValue(e.target.name, e.target.value);
        trigger(e.target.name);
    };

    if (isLoading) {
        return <></>;
    }
    const track = new Track(data as TrackProps);

    return (
        <div className="h-full overflow-auto p-4 track-page">
            <div className="container mx-auto max-w-4xl">
                <TrackCard bestTime={props.trackSummary?.bestTime} track={track} open={() => setIsDialogOpen(true)} />

                <div className="h-8" />

                {/* Desktop View */}
                <div className="hidden md:block">
                    <Card className="p-6">
                        <TimeList times={track.times || []} distance={track.distance} />
                    </Card>
                    <div className="h-8" />
                    <Card className="p-4">
                        <TrackTimesGraph times={track.times || []} />
                    </Card>
                </div>

                {/* Mobile View */}
                <div className="md:hidden">
                    <Card>
                        <Tabs defaultValue="times" className="w-full">
                            <TabsList className="w-full grid grid-cols-2">
                                <TabsTrigger value="times" className="gap-2">
                                    <IconPhoto size="1.1rem" />
                                    {translate("labels.times")}
                                </TabsTrigger>
                                <TabsTrigger value="graph" className="gap-2">
                                    <IconMessageCircle size="1.1rem" />
                                    {translate("labels.graph")}
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="times" className="p-4">
                                <TimeList times={track.times || []} distance={track.distance} />
                            </TabsContent>

                            <TabsContent value="graph" className="p-4">
                                <TrackTimesGraph times={track.times || []} />
                            </TabsContent>
                        </Tabs>
                    </Card>
                </div>
            </div>

            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>{translate("newTime.title")}</DialogTitle>
                    </DialogHeader>

                    {isLoadingOverlay && (
                        <div className="absolute inset-0 bg-background/80 flex items-center justify-center z-50">
                            <span>Saving...</span>
                        </div>
                    )}

                    <form onSubmit={onSubmit} className="grid gap-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="trainingDate" className="flex items-center gap-1">
                                {translate("newTime.trainingDate")} <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <IconCalendar className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="trainingDate"
                                    type="date"
                                    className="pl-9"
                                    placeholder="Fecha del entrenamiento"
                                    {...register("trainingDate", { required: true, onBlur: handleChange })}
                                    aria-invalid={errors.trainingDate ? "true" : "false"}
                                />
                            </div>
                            {errors.trainingDate?.type === "required" && (
                                <small className="text-destructive text-xs">
                                    {translate("validation.mandatory")}
                                </small>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="durationString" className="flex items-center gap-1">
                                {translate("newTime.durationString")} <span className="text-destructive">*</span>
                            </Label>
                            <div className="relative">
                                <IconClock className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    id="durationString"
                                    placeholder="mm:ss"
                                    className="pl-9"
                                    {...register("durationString", {
                                        required: true,
                                        pattern: /^[0-9]?\d:[0-5]\d$/i,
                                        onBlur: handleChange,
                                    })}
                                    aria-invalid={errors.durationString ? "true" : "false"}
                                />
                            </div>
                            {errors.durationString?.type === "required" && (
                                <small className="text-destructive text-xs">
                                    {translate("validation.mandatory")}
                                </small>
                            )}
                            {errors.durationString?.type === "pattern" && (
                                <small className="text-destructive text-xs">
                                    {translate("validation.timeFormat")}
                                </small>
                            )}
                        </div>

                        <div className="flex justify-end mt-4">
                            <Button type="submit" disabled={!isDirty || !isValid}>
                                {translate("actions.save")}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
}
