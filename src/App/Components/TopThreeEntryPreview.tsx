import { useEffect, useState } from "react";
import { DailyPuzzleEntryModel, UserModel } from "../../Background/Models";
import { HSpacer, HStack } from "../../ReactSwiftly";
import { Box, Typography } from "@mui/material";
import { DisplayFunctions } from "../../Background/Utils/DisplayFunctions";
import { FetchService } from "../../Background/Service";

interface TopThreeEntryPreviewProps {
    position: number;
    entry: DailyPuzzleEntryModel
}

export default function TopThreeEntryPreview({ position, entry }: TopThreeEntryPreviewProps) {
    const [player, setPlayer] = useState<UserModel | null>(null);
    const style = {
        section: {
            backgroundImage:
                "linear-gradient(to bottom right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05))",
            borderRadius: "15px",
            border: position == 1 ? "3px solid rgba(255,59,48,255" : position == 2 ? "3px solid rgba(175,82,221,255)" : "3px solid black",
            padding: "20px",
        }
    }

    async function onAppearActions() {
        // fetch player
        try {
            const loadedPlayer = await FetchService.fetchUserByUid(entry.userId);
            setPlayer(loadedPlayer);
        } catch {
        }
    }

    useEffect(() => {
        onAppearActions();
    }, []);

    return (
        <Box style={style.section}>
            <HStack>
                <>
                    <Typography variant="h6" sx={{ color: 'black', textTransform: "none" }}>{position > 0 ? position : "-"}</Typography>

                    <HSpacer />
                    {(player && player.usernameDisplayed) ? (
                        <Typography variant="h6" sx={{ color: 'black', textTransform: "none" }}>{DisplayFunctions.displayUsername(player.usernameDisplayed)}</Typography>
                    ) : (
                        <Typography variant="h6" sx={{ color: 'black', textTransform: "none" }}>{"Loading..."}</Typography>
                    )}

                    <HSpacer />

                    <Typography variant="h6" sx={{ color: 'black', textTransform: "none" }}>{Math.floor(entry.score)}</Typography>
                </>

            </HStack>
        </Box>
    );
}