import { useEffect, useState } from "react";
import { UserModel, GameModel } from "../../../../../Background/Models";
import HomeView from "../../../Body/HomeView";
import PlayPrivateGameView from "../PlayPrivateGameView";
import { View, VStack } from "../../../../../ReactSwiftly";
import { Button, CircularProgress, Typography } from "@mui/material";
import { FetchService, PrivateGameService } from "../../../../../Background/Service";

interface StartPrivateRematchViewProps {
    passedUser: UserModel;
    previousGame: GameModel;
}

enum StartPrivateRematchGameModeState {
    findingMatch,
    matchFound,
    canceledMatch,
    error
}

export default function StartPrivateRematchView({passedUser, previousGame}: StartPrivateRematchViewProps) {
    const [view, setView] = useState<"StartPrivateGameView" | "HomeView">("StartPrivateGameView");
    const [user, setUser] = useState<UserModel>(passedUser);
    const [gameModeState, setGameModeState] = useState<StartPrivateRematchGameModeState>(StartPrivateRematchGameModeState.findingMatch);
    const [game, setGame] = useState<GameModel | null>(null);
    const [stopSearching, setStopSearching] = useState(false);
    const [ticker, setTicker] = useState(false);
    const [rematchOffered, setRematchOffered] = useState(false);

    useEffect(() => {
        onAppearActions();
    }, []);

    useEffect(() => {
        tickerActions();
    }, [ticker]);

    const onAppearActions = async () => {
        setStopSearching(false);
        try {
            const updatedUser = await FetchService.fetchUserByUid(user.id);
            setUser(updatedUser);

            const createdGame = await PrivateGameService.createGame(user);
            setGame(createdGame);
            setTicker(!ticker);
        } catch {
            setGameModeState(StartPrivateRematchGameModeState.error);
            setStopSearching(true);
        }
    }

    const wipeGame = async () => {
        setStopSearching(true);
        if (game) {
            try {
                await PrivateGameService.destroyGame(game);
                setGame(null);
            } catch {
                wipeGame();
            }
        }

        if (rematchOffered) {
            await PrivateGameService.destroySpecificRematchOffer(previousGame);
        }
    }

    const tickerActions = async () => {
        if (!stopSearching) {
            if (game) {
                const timeout = setTimeout(async () => {
                    try {
                        const gameUpdate = await PrivateGameService.getGameUpdate(game);
                        if (gameUpdate.matchFound && gameUpdate.playerTwoId !== undefined) {
                            if (rematchOffered) {
                                await PrivateGameService.destroySpecificRematchOffer(previousGame);
                            }
                            setGame(gameUpdate);
                            setGameModeState(StartPrivateRematchGameModeState.matchFound);
                            setStopSearching(true);
                        } else {
                            if (!rematchOffered) {
                                try {
                                    await PrivateGameService.offerRematch(user, previousGame);
                                    setRematchOffered(true);
                                } catch {
                                    setRematchOffered(false);
                                }
                            }

                            setTicker(!ticker);
                        }
                    } catch (error) {
                        setStopSearching(true);
                        setGameModeState(StartPrivateRematchGameModeState.error);
                    }
                }, 1000);

                return () => clearTimeout(timeout);
            }

        } else {
            wipeGame();
        }
    }

    const dismiss = async () => {
        wipeGame();
        setView("HomeView");
    }

    if (view === "HomeView") {
        return <HomeView passedUser={user} />
    }

    if (gameModeState === StartPrivateRematchGameModeState.matchFound && game) {
        return <PlayPrivateGameView passedUser={user} passedGame={game} />;
    }

    return (
        <View>
            <VStack>
                <Typography variant="h4" gutterBottom>
                    Jumblem
                </Typography>

                {gameModeState === StartPrivateRematchGameModeState.findingMatch && (
                    <>
                        <p>Finding Private Match...</p>
                        <CircularProgress />
                    </>
                )}


                {gameModeState === StartPrivateRematchGameModeState.error && (
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