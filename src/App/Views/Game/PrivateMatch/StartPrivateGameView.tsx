import { useEffect, useState } from "react";
import { GameModel, UserModel } from "../../../../Background/Models";
import { Button, CircularProgress, Typography } from "@mui/material";
import { View, VStack } from "../../../../ReactSwiftly";
import HomeView from "../../Body/HomeView";
import { FetchService, PrivateGameService } from "../../../../Background/Service";
import PlayPrivateGameView from "./PlayPrivateGameView";

interface StartPrivateGameViewProps {
    passedUser: UserModel
}

enum PrivateGameModeState {
    findingMatch,
    matchFound,
    error
}

export default function StartPrivateGameView({ passedUser }: StartPrivateGameViewProps) {
    const [view, setView] = useState<"StartPrivateGameView" | "HomeView">("StartPrivateGameView");
    const [user, setUser] = useState<UserModel>(passedUser);
    const [gameModeState, setGameModeState] = useState<PrivateGameModeState>(PrivateGameModeState.findingMatch);
    const [game, setGame] = useState<GameModel | null>(null);
    const [hostOfMatch, setHostOfMatch] = useState(false);
    const [stopSearching, setStopSearching] = useState(false);
    const [ticker, setTicker] = useState(false);
    const [tickCount, setTickCount] = useState(0);

    useEffect(() => {
        onAppearActions();
    }, []);

    useEffect(() => {
        tickerActions();
    }, [ticker]);

    const dismiss = async () => {
        wipeGame();
        setView("HomeView");
    }

    const onAppearActions = async () => {
        try {
            const updatedUser = await FetchService.fetchUserByUid(user.id);
            setUser(updatedUser);

            const createdGame = await PrivateGameService.createGame(user);
            setGame(createdGame);
            setHostOfMatch(true);
            setTicker(!ticker);
        } catch (error) {
            setStopSearching(true);
            setGameModeState(PrivateGameModeState.error);
            wipeGame();
        }
    }

    const wipeGame = async () => {
        setStopSearching(true);
        if (hostOfMatch) {
            if (game) {
                try {
                    await PrivateGameService.destroyGame(game);
                    setGame(null);
                    setHostOfMatch(false);
                } catch {
                    wipeGame();
                }
            }
        }
    }

    const tickerActions = async () => {
        if (!stopSearching) {
            if (game) {
                const timeout = setTimeout(async () => {
                    try {
                        const gameUpdate = await PrivateGameService.getGameUpdate(game);
                        if (gameUpdate.matchFound && gameUpdate.playerTwoId !== undefined) {
                            setGame(gameUpdate);
                            setGameModeState(PrivateGameModeState.matchFound);
                            setStopSearching(true);
                        } else {
                            setTicker(!ticker);
                            setTickCount(tickCount + 1);
                        }
                    } catch (error) {
                        setStopSearching(true);
                        setGameModeState(PrivateGameModeState.error);
                    }
                }, 1000);

                return () => clearTimeout(timeout);
            }

        } else {
            wipeGame();
        }
    }

    const handleCopy = async (game: GameModel) => {
        try {
            await navigator.clipboard.writeText(game.id);
            alert("Text copied to clipboard!");
        } catch (error) {
            alert("Failed to copy text. Please try again.");
        }
    };

    if (view === "HomeView") {
        return <HomeView passedUser={user} />
    }

    if (gameModeState === PrivateGameModeState.matchFound && game) {
        return <PlayPrivateGameView passedUser={user} passedGame={game} />;
    }

    return (
        <View>
            <VStack>
                <Typography variant="h4" gutterBottom>
                    Jumblem
                </Typography>

                {gameModeState === PrivateGameModeState.findingMatch && (
                    <>
                        <p>Finding Private Match...</p>
                        <CircularProgress />
                    </>
                )}


                {gameModeState === PrivateGameModeState.error && (
                    <>
                        <p>There was an error when finding a match.</p>
                        <Button
                            color="primary"
                            variant="outlined"
                            onClick={onAppearActions}
                        >
                            Retry
                        </Button>

                        <p>or</p>
                    </>
                )}

                {game && (
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleCopy(game)}
                        style={{ marginTop: "10px" }}
                    >
                        Copy Code
                    </Button>
                )}

                <Button
                    variant="outlined"
                    color="secondary"
                    onClick={dismiss}
                    style={{ marginTop: "10px" }}
                >
                    Cancel
                </Button>
            </VStack>
        </View>
    );
}