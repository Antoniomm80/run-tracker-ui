import {Button, Container, createStyles, Group, LoadingOverlay, MediaQuery, Modal, Paper, Space, Tabs, TextInput,} from "@mantine/core";
import {Time, TimeProps} from "../domain/time";
import {Track, TrackProps} from "../domain/track";
import {TrackCard} from "./trackcard";
import {useDisclosure} from "@mantine/hooks";
import {IconCalendar, IconCircle0Filled, IconClock, IconMessageCircle, IconPhoto, IconX} from "@tabler/icons-react";
import {translate} from "react-i18nify";
import {TrackSummary} from "../domain/tracksummary";
import {pathService} from "../domain/trackservice";
import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {useParams} from "react-router-dom";

import {useForm} from "react-hook-form";
import "./trackpage.css";
import timeService from "../domain/timeservice";
import {TimeList} from "./timeList";
import TrackTimesGraph from "./tracktimesgraph";
import {notifications} from "@mantine/notifications";

type NewTimeFormValues = {
    trainingDate: string;
    durationString: string;
};

export interface TrackPageProps {
    trackSummary?: TrackSummary;
}

export function TrackPage(props: TrackPageProps) {
    const [opened, {open, close}] = useDisclosure(false);
    const [visible, {open: showOverlay, close: hideOverlay}] = useDisclosure(false);
    const {trackId} = useParams();
    const {isLoading, data} = useQuery(["track", trackId], () => pathService.findById(trackId || ""));

    const queryclient = useQueryClient();
    const {mutate} = useMutation((newTime: TimeProps) => timeService.createTime(trackId || "", newTime), {
        onSuccess: (savedTime) => {
            const currentPath: Track = queryclient.getQueryData(["track", trackId]) as Track;
            currentPath.times?.push(Time.of(savedTime));
            queryclient.setQueryData(["track", trackId], {...currentPath});
            //toastContext.showSuccessMessage(translate("newTime.saveSuccess"));
            notifications.show({
                withCloseButton: true,
                autoClose: 5000,
                title: translate("application.title"),
                message: translate("newTime.saveSuccess"),
                color: 'green',
                icon: <IconCircle0Filled/>,

                loading: false,
            });
            hideOverlay();
            close();
        },
        onError: () => {
            hideOverlay();
            notifications.show({
                withCloseButton: true,
                autoClose: 5000,
                title: translate("application.title"),
                message: translate("newTime.saveError"),
                color: 'red',
                icon: <IconX/>,

                loading: false,
            });
            close();
        },
    });
    const currentDateISO = new Date().toISOString().split('T')[0];
    const {
        register,
        formState: {errors, isDirty, isValid},
        handleSubmit,
        setValue,
        trigger,
    } = useForm<NewTimeFormValues>({mode: "onBlur", defaultValues: {trainingDate: currentDateISO, durationString: ""}});
    const useStyles = createStyles((theme) => ({
        card: {
            position: "relative",
            overflow: "visible",
            padding: theme.spacing.xl,
        },
    }));
    const {classes} = useStyles();

    const calculateDuration = (duration: string): number => {
        const durationComponents = duration.split(":");
        return parseInt(durationComponents[0]) * 60 + parseInt(durationComponents[1]);
    };

    const onSubmit = handleSubmit((form: NewTimeFormValues) => {
        showOverlay();
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
        <>
            <Container fluid>
                <TrackCard bestTime={props.trackSummary?.bestTime} track={track} open={open}/>
            </Container>
            <Space h="lg"/>
            <MediaQuery smallerThan="md" styles={{display: "none"}}>
                <Container fluid>
                    <Paper radius="lg" withBorder className={classes.card} p={"1.1rem"}>
                        <TimeList times={track.times || []} distance={track.distance}/>
                    </Paper>
                    <Space h="lg"/>
                    <Paper radius="md" withBorder className={classes.card}>
                        <TrackTimesGraph times={track.times || []}/>
                    </Paper>
                </Container>
            </MediaQuery>
            <MediaQuery largerThan="sm" styles={{display: "none"}}>
                <Container fluid>
                    <Paper radius="md" withBorder className={classes.card}>
                        <Tabs defaultValue="times">
                            <Tabs.List>
                                <Tabs.Tab value="times" icon={<IconPhoto size="1.1rem"/>}>
                                    {translate("labels.times")}
                                </Tabs.Tab>
                                <Tabs.Tab value="graph" icon={<IconMessageCircle size="1.1rem"/>}>
                                    {translate("labels.graph")}
                                </Tabs.Tab>
                            </Tabs.List>

                            <Tabs.Panel value="times" pt="xs">
                                <TimeList times={track.times || []} distance={track.distance}/>
                            </Tabs.Panel>

                            <Tabs.Panel value="graph" pt="xs">
                                <TrackTimesGraph times={track.times || []}/>
                            </Tabs.Panel>
                        </Tabs>
                    </Paper>
                </Container>
            </MediaQuery>
            <Modal opened={opened} onClose={close} size="md" title={translate("newTime.title")} centered>
                <form onSubmit={onSubmit}>
                    <LoadingOverlay visible={visible} overlayBlur={2}/>
                    <TextInput
                        label={translate("newTime.trainingDate")}
                        placeholder="Fecha del entrenamiento"
                        icon={<IconCalendar size="0.8rem"/>}
                        type="date"
                        {...register("trainingDate", {required: true, onBlur: handleChange})}
                        aria-invalid={errors.trainingDate ? "true" : "false"}
                        withAsterisk
                    />
                    {errors.trainingDate?.type === "required" && (
                        <small className="form-error" role="alert">
                            {translate("validation.mandatory")}
                        </small>
                    )}

                    <Space h="sm"/>
                    <TextInput
                        label={translate("newTime.durationString")}
                        placeholder="mm:ss"
                        icon={<IconClock size="0.8rem"/>}
                        {...register("durationString", {
                            required: true,
                            pattern: /^[0-9]?\d:[0-5]\d$/i,
                            onBlur: handleChange,
                        })}
                        aria-invalid={errors.durationString ? "true" : "false"}
                        withAsterisk
                    />
                    {errors.durationString?.type === "required" && (
                        <small className="form-error" role="alert">
                            {translate("validation.mandatory")}
                        </small>
                    )}
                    {errors.durationString?.type === "pattern" && (
                        <small className="form-error" role="alert">
                            {translate("validation.timeFormat")}
                        </small>
                    )}
                    <Space h="lg"/>
                    <Group position="right">
                        <Button type="submit" disabled={!isDirty || !isValid}>
                            {translate("actions.save")}
                        </Button>
                    </Group>
                </form>
            </Modal>
        </>
    );
}
