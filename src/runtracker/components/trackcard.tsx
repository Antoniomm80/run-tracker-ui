import {Button, createStyles, Group, Paper, rem, Space, Text, ThemeIcon} from "@mantine/core";
import {IconClock, IconRun} from "@tabler/icons-react";
import {TimeProps} from "../domain/time";
import {TrackProps} from "../domain/track";
import timeUtils from "../utils/timeutils";
import {translate} from "react-i18nify";

import "./trackcard.css";


const ICON_SIZE = rem(60);

const useStyles = createStyles((theme) => ({
    card: {
        position: "relative",
        overflow: "visible",
        padding: theme.spacing.xl,
        paddingTop: `calc(${theme.spacing.xl} * 1.5 + ${ICON_SIZE} / 3)`,
    },

    icon: {
        position: "absolute",
        top: `calc(-${ICON_SIZE} / 3)`,
        left: `calc(50% - ${ICON_SIZE} / 2)`,
    },

    title: {
        fontFamily: `Greycliff CF, ${theme.fontFamily}`,
        lineHeight: 1,
    },
}));

interface TrackCardProps {
    bestTime: TimeProps | undefined;
    track: TrackProps;
    open: () => void;
}

export function TrackCard(props: TrackCardProps) {
    const {classes} = useStyles();

    const buildBest = () => {
        if (props.bestTime) {
            return (
                <>
                    <p><strong>Duración: </strong>{`${timeUtils.printTime(props.bestTime.duration)}`} </p>
                    <p><strong>Fecha: </strong>{`${timeUtils.formatDate(props.bestTime.trainingDate)}`}</p>
                </>
            );
        }
        return <></>;
    };

    return (
        <Paper radius="md" withBorder className={classes.card} mt={`calc(${ICON_SIZE} / 3)`}>
            <div className="map-wrapper">
                <div className="map-container">
                    {props.track.pathToMap !== undefined &&
                        <iframe src={props.track.pathToMap} width="100%" height="300px" title="map" frameBorder="0"/>}
                </div>
            </div>
            <ThemeIcon className={classes.icon} size={ICON_SIZE} radius={ICON_SIZE}>
                <IconRun size="2rem" stroke={1.5}/>
            </ThemeIcon>
            <Space h="lg"/>
            <Text ta="left" fw={700} className={classes.title} mb={20}>
                {props.track.name}
            </Text>
            <Text c="dimmed" ta="left" lineClamp={3} px={0}>
                {props.track.description}
            </Text>


            <Group position="apart" mt="md">
                <Text fz="sm">{buildBest()}</Text>
                <Button leftIcon={<IconClock/>} onClick={props.open}>
                    {translate("actions.add")}
                </Button>
            </Group>
        </Paper>
    );
}
