import { useEffect, useState } from "react";
import { GameModel, UserModel } from "../../../../Background/Models";
import { View, VStack } from "../../../../ReactSwiftly";
import { Button, CircularProgress, Typography } from "@mui/material";
import HomeView from "../../Body/HomeView";
import { CasualGameService, FetchService } from "../../../../Background/Service";
import PlayCasualGameView from "./PlayCasualGameView";

interface StartCasualGameViewProps {
    passedUser: UserModel
}

enum CasualGameModeState {
    findingMatch,
    matchFound,
    error
}

export default function StartCasualGameView({ passedUser }: StartCasualGameViewProps) {
    const [view, setView] = useState<"StartCasualGameView" | "HomeView">("StartCasualGameView");
    const [user, setUser] = useState<UserModel>(passedUser);
    const [gameModeState, setGameModeState] = useState<CasualGameModeState>(CasualGameModeState.findingMatch);
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
        if (gameModeState !== CasualGameModeState.findingMatch) {
            setStopSearching(false);
            setGameModeState(CasualGameModeState.findingMatch);
        }
        try {
            const updatedUser = await FetchService.fetchUserByUid(user.id);
            setUser(updatedUser);

            const loadedGame = await CasualGameService.findGame(user);
            setGame(loadedGame);
            if (loadedGame) {
                const gameUpdate = await CasualGameService.getGameUpdate(loadedGame);
                if (gameUpdate.playerTwoId) {
                    if (gameUpdate.playerTwoId === user.id) {
                        setGameModeState(CasualGameModeState.matchFound);
                        setStopSearching(true);
                    } else {
                        setGame(null);
                    }
                } else {
                    setGame(null);
                }
            } else {
                const createdGame = await CasualGameService.createGame(user);
                setGame(createdGame);
                setHostOfMatch(true);
                setTicker(!ticker);
            }
        } catch (error) {
            setStopSearching(true);
            setGameModeState(CasualGameModeState.error);
            wipeGame();
        }
    }

    const wipeGame = async () => {
        setStopSearching(true);
        if (hostOfMatch) {
            if (game) {
                try {
                    await CasualGameService.destroyGame(game);
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
                        const gameUpdate = await CasualGameService.getGameUpdate(game);
                        if (gameUpdate.matchFound && gameUpdate.playerTwoId !== undefined) {
                            setGame(gameUpdate);
                            setGameModeState(CasualGameModeState.matchFound);
                            setStopSearching(true);
                        } else {
                            setTicker(!ticker);
                            setTickCount(tickCount + 1);
                        }
                    } catch (error) {
                        setStopSearching(true);
                        setGameModeState(CasualGameModeState.error);
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

    if (gameModeState === CasualGameModeState.matchFound && game) {
        return <PlayCasualGameView passedUser={user} passedGame={game} />;
    }

    return (
        <View>
            <VStack>
                <Typography variant="h4" gutterBottom>
                    Jumblem
                </Typography>

                {gameModeState === CasualGameModeState.findingMatch && (
                    <>
                        <p>Finding Casual Match...</p>
                        <CircularProgress />
                    </>
                )}


                {gameModeState === CasualGameModeState.error && (
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