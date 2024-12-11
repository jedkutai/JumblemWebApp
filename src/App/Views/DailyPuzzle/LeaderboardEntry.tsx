import { useEffect, useState } from "react";
import { DailyPuzzleEntryModel, UserModel, WordModel } from "../../../Background/Models";
import { Box, Button, Typography } from "@mui/material";
import { HSpacer, HStack, VStack } from "../../../ReactSwiftly";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { DisplayFunctions } from "../../../Background/Utils/DisplayFunctions";
import { FetchService } from "../../../Background/Service";

enum ViewState {
    loading,
    loaded,
    hidden,
    failedToLoadPlayer
}

interface LeaderBoardEntryProps {
    position: number;
    entry: DailyPuzzleEntryModel;
    passedUser: UserModel;
}

export default function LeaderboardEntry({
    position,
    entry,
    passedUser
}: LeaderBoardEntryProps) {
    const [player, setPlayer] = useState<UserModel | null>(null);
    // const [correctWords, setCorrectWords] = useState<Record<string, [WordModel, number]>>({});
    const [viewState, setViewState] = useState<ViewState>(ViewState.hidden);
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;
    const { minDimension } = useWindowSize();

    useEffect(() => {
        onAppearActions();
    }, []);

    async function onAppearActions() {
        // fetch player
        try {
            const loadedPlayer = await FetchService.fetchUserByUid(entry.userId);
            setPlayer(loadedPlayer);
        } catch {
            setViewState(ViewState.failedToLoadPlayer);
        }
    }

    const style = {
        section: {
            backgroundImage:
                "linear-gradient(to bottom right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05))",
            borderRadius: "15px",
            border: "3px solid rgba(0, 0, 0, 0.1)",
            padding: "20px",
            // marginBottom: "20px",
            width: `${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`,
            // maxWidth: `${Math.min(400, minDimension * 0.8)}px`,
        },
    }

    return (
        <Button>
            <Box style={style.section}>
                <HStack>
                    <>
                        <Typography variant="h6" sx={{ color: 'black', textTransform: "none"}}>{position > 0 ? position : "-"}</Typography>

                        <HSpacer />
                        {(player && player.usernameDisplayed) ? (
                            <Typography variant="h6" sx={{ color: 'black', textTransform: "none"}}>{DisplayFunctions.displayUsername(player.usernameDisplayed)}</Typography>
                        ) : (
                            <Typography variant="h6" sx={{ color: 'black', textTransform: "none"}}>{"Loading..."}</Typography>
                        )}

                        <HSpacer />

                        <Typography variant="h6" sx={{ color: 'black', textTransform: "none"}}>{Math.floor(entry.score)}</Typography>
                    </>

                </HStack>
            </Box>
            {/* <HStack width={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}>

                <>
                    <Typography variant="h4">{position > 0 ? position : "-"}</Typography>

                    <HSpacer />
                    {(player && player.username) ? (
                        <Typography variant="h4">{DisplayFunctions.displayUsername(player.username)}</Typography>
                    ) : (
                        <Typography variant="h4">{"Loading..."}</Typography>
                    )}

                    <HSpacer />

                    <Typography variant="h4">{Math.floor(entry.score)}</Typography>
                </>

            </HStack> */}
        </Button>
    )
}