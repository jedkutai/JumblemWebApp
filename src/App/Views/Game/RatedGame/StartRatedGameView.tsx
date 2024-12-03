import { useEffect, useState } from "react";
import { GameModel, UserModel } from "../../../../Background/Models";
import { View, VStack } from "../../../../ReactSwiftly";
import { Button, CircularProgress, Typography } from "@mui/material";
import HomeView from "../../Body/HomeView";
import { RatedGameService, FetchService } from "../../../../Background/Service";
import PlayRatedGameView from "./PlayRatedGameView";

interface StartRatedGameViewProps {
    passedUser: UserModel
}

enum RatedGameModeState {
    findingMatch,
    matchFound,
    error
}

export default function StartRatedGameView({ passedUser }: StartRatedGameViewProps) {
    const [view, setView] = useState<"StartRatedGameView" | "HomeView">("StartRatedGameView");
    const [user, setUser] = useState<UserModel>(passedUser);
    const [gameModeState, setGameModeState] = useState<RatedGameModeState>(RatedGameModeState.findingMatch);
    const [game, setGame] = useState<GameModel | null>(null);
    const [hostOfMatch, setHostOfMatch] = useState(false);
    const [stopSearching, setStopSearching] = useState(false);
    const [takingLongToFindMatch, setTakingLongToFindMatch] = useState(false);
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
        if (gameModeState !== RatedGameModeState.findingMatch) {
            setStopSearching(false);
            setGameModeState(RatedGameModeState.findingMatch);
        }
        try {
            const updatedUser = await FetchService.fetchUserByUid(user.id);
            setUser(updatedUser);

            const loadedGame = await RatedGameService.findGame(user);
            setGame(loadedGame);
            if (loadedGame) {
                const gameUpdate = await RatedGameService.getGameUpdate(loadedGame);
                if (gameUpdate.playerTwoId) {
                    if (gameUpdate.playerTwoId === user.id) {
                        setGameModeState(RatedGameModeState.matchFound);
                        setStopSearching(true);
                    } else {
                        setGame(null);
                    }
                } else {
                    setGame(null);
                }
            } else {
                const createdGame = await RatedGameService.createGame(user);
                setGame(createdGame);
                setHostOfMatch(true);
                setTicker(!ticker);
            }
        } catch (error) {
            setStopSearching(true);
            console.error("Error finding a match", error);
            setGameModeState(RatedGameModeState.error);
            wipeGame();
        }
    }

    const wipeGame = async () => {
        setStopSearching(true);
        if (hostOfMatch) {
            if (game) {
                try {
                    await RatedGameService.destroyGame(game);
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
                        const gameUpdate = await RatedGameService.getGameUpdate(game);
                        if (gameUpdate.matchFound && gameUpdate.playerTwoId !== undefined) {
                            setGame(gameUpdate);
                            setGameModeState(RatedGameModeState.matchFound);
                            setStopSearching(true);
                        } else {
                            setTicker(!ticker);
                            setTickCount(tickCount + 1);
                        }
                    } catch (error) {
                        setStopSearching(true);
                        console.error("Error with ticker action", error);
                        setGameModeState(RatedGameModeState.error);
                    }
                }, 1000);

                return () => clearTimeout(timeout);
            }

            if (tickCount > 10 && !takingLongToFindMatch) {
                setTakingLongToFindMatch(true);
            }
        } else {
            wipeGame();
        }
    }

    if (view === "HomeView") {
        return <HomeView passedUser={user} />
    }

    if (gameModeState === RatedGameModeState.matchFound && game) {
        return <PlayRatedGameView passedUser={user} passedGame={game} />;
    }

    return (
        <View>
            <VStack>
                <Typography variant="h4" gutterBottom>
                    Jumblem
                </Typography>

                {gameModeState === RatedGameModeState.findingMatch && (
                    <>
                        <p>Finding Match...</p>
                        <CircularProgress />
                    </>
                )}


                {gameModeState === RatedGameModeState.error && (
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