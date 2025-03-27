import { useEffect, useState } from "react";
import { GameModel, UserModel } from "../../../../Background/Models";
import { FetchService } from "../../../../Background/Service";
import { HSpacer, HStack } from "../../../../ReactSwiftly";
import { Box, Typography } from "@mui/material";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { DisplayFunctions } from "../../../../Background/Utils/DisplayFunctions";

interface SpectateGamePreviewProps {
    passedGame: GameModel;
}

export default function SpectateGamePreview({ passedGame }: SpectateGamePreviewProps) {
    const upperBound = 650;
    const dimensionDivider = 9 * 1.75;
    const { minDimension } = useWindowSize();

    const [game, setGame] = useState<GameModel>(passedGame);
    const [playerOne, setPlayerOne] = useState<UserModel | null>(null);
    const [playerTwo, setPlayerTwo] = useState<UserModel | null>(null);

    const style = {
        section: {
            borderRadius: "15px",
            border: "3px solid rgba(0, 0, 0, 0.1)",
            padding: "20px",
            width: `${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`,
        },
    }
    useEffect(() => {
        refresh();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(async () => {
            refresh();
        }, 1000 * 7);

        return () => clearTimeout(timeout);
    }, [game]);

    async function refresh() {
        try {
            if (playerOne == null) {
                const fetchedUser = await FetchService.fetchUserByUid(game.playerOneId);
                setPlayerOne(fetchedUser);
            }
        } catch {

        }
        if (game.playerTwoId == undefined) {
            try {
                const newGame = await FetchService.fetchGameById(game.id);
                setGame(newGame);

                if (playerOne == null) {
                    const fetchedUser = await FetchService.fetchUserByUid(game.playerOneId);
                    setPlayerOne(fetchedUser);
                }
            } catch {
                setGame(passedGame);
            }
        } else {
            try {
                const fetchedUser = await FetchService.fetchUserByUid(game.playerTwoId);
                setPlayerTwo(fetchedUser);
            } catch {
                setGame(passedGame);
            }
        }
    }

    return (
        <Box style={style.section}>
            <HStack width={`${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`}>
                {game.gameMode == "casual" && (
                    <Typography
                        style={{
                            color: "gray",
                            padding: "0px",
                            margin: "0px",
                            textTransform: "none"
                        }}
                    >CASUAL</Typography>
                )}
                {game.gameMode == "standard" && (
                    <Typography
                        style={{
                            color: "gray",
                            padding: "0px",
                            margin: "0px",
                            textTransform: "none"
                        }}
                    >RATED</Typography>
                )}
                {game.gameMode == "private" && (
                    <Typography
                        style={{
                            color: "gray",
                            padding: "0px",
                            margin: "0px",
                            textTransform: "none"
                        }}
                    >PRIVATE</Typography>
                )}

                <HSpacer />
                <Typography
                    variant="h6"
                    style={{
                        color: "black",
                        fontWeight: "bold",
                        padding: "0px",
                        margin: "0px",
                        textTransform: "none"
                    }}
                >
                    {DisplayFunctions.displayUsername(playerOne?.usernameDisplayed ?? "loading")}
                </Typography>
                <Typography
                    style={{
                        color: "black",
                        padding: "0px",
                        margin: "0px",
                        textTransform: "none"
                    }}

                >
                    vs.
                </Typography>
                <Typography
                    variant="h6"
                    style={{
                        color: "black",
                        fontWeight: "bold",
                        padding: "0px",
                        margin: "0px",
                        textTransform: "none"
                    }}
                >
                    {DisplayFunctions.displayUsername(playerTwo?.usernameDisplayed ?? "Guest")}
                </Typography>
            </HStack>
        </Box>
    );


}