import {ActionIcon, Flex, Text, useMantineColorScheme} from "@mantine/core";
import {useMediaQuery} from "@mantine/hooks";
import {IconChevronLeft, IconMoonStars, IconSun} from "@tabler/icons-react";
import {useMatch, useNavigate} from "react-router-dom";

export function HeaderBar() {
    const match = useMatch("tracks/:trackId");
    const {colorScheme, toggleColorScheme} = useMantineColorScheme();
    const dark = colorScheme === "dark";
    const navigate = useNavigate();
    const handleOnClick = () => navigate("");
    const isMobile = useMediaQuery('(max-width: 48em)');
    const shouldRenderBackButton = isMobile && Boolean(match);
    return (
        <Flex gap="md" justify="space-between" align="center" direction="row" wrap="nowrap">
            {shouldRenderBackButton && <ActionIcon color="blue" size="lg" variant="transparent" onClick={handleOnClick}>
                <IconChevronLeft size="1.1rem"/>
            </ActionIcon>}
            <Text>Run-tracker</Text>
            <ActionIcon
                variant="outline"
                color={dark ? "yellow" : "blue"}
                onClick={() => toggleColorScheme()}
                title="Toggle color scheme"
            >
                {dark ? <IconSun size="1.1rem"/> : <IconMoonStars size="1.1rem"/>}
            </ActionIcon>
        </Flex>
    );
}
