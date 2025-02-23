import { CircularProgress, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { UserModel, GameModel } from "../../../../Background/Models";
import { FetchService, PrivateGameService } from "../../../../Background/Service";
import { View, VStack } from "../../../../ReactSwiftly";
import GameRequirementsWarning from "../../../Components/GameRequirementsWarning";
import JumblemLogoSimple from "../../../Components/JumblemLogoSimple";
import PrivateMatchMenuView from "./PrivateMatchMenuView";
import PlayPrivateGameView2 from "./PlayPrivateGameView2";

interface StartPrivateGameViewProps {
    passedUser: UserModel
}

enum PrivateGameModeState {
    findingMatch,
    matchFound,
    error
}

export default function StartPrivateGameView({ passedUser }: StartPrivateGameViewProps) {
    const [view, setView] = useState<"StartPrivateGameView" | "Menu">("StartPrivateGameView");
    const [user, setUser] = useState<UserModel>(passedUser);
    const [gameModeState, setGameModeState] = useState<PrivateGameModeState>(PrivateGameModeState.findingMatch);
    const [game, setGame] = useState<GameModel | null>(null);
    const [hostOfMatch, setHostOfMatch] = useState(false);
    const [stopSearching, setStopSearching] = useState(false);
    const [ticker, setTicker] = useState(false);
    const [tickCount, setTickCount] = useState(0);
    const [codeCopied, setCodeCopied] = useState(false);


    useEffect(() => {
        onAppearActions();
    }, []);

    useEffect(() => {
        tickerActions();
    }, [ticker]);



    const dismiss = async () => {
        wipeGame();
        setView("Menu");
    }

    const onAppearActions = async () => {
        try {
            if (user.username != "guest") {
                const updatedUser = await FetchService.fetchUserByUid(user.id);
                setUser(updatedUser);
            }

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
            setCodeCopied(true);
            const timeout = setTimeout(async () => {
                setCodeCopied(false);
            }, 1000);

            return () => clearTimeout(timeout);
        } catch (error) {

        }
    };

    if (view === "Menu") {
        return <PrivateMatchMenuView passedUser={user} />;
    }

    if (gameModeState === PrivateGameModeState.matchFound && game) {
        return (
            <PlayPrivateGameView2 
                passedGame={game}
                passedUser={user}
            />
        )
        // return <PlayPrivateGameView
        //     passedUser={user}
        //     passedGame={game}
        // />;
    }

    return (
        <View>
            <VStack>
                {/* <Typography variant="h4" gutterBottom>
                    Jumblem
                </Typography> */}
                <JumblemLogoSimple/>
                {gameModeState === PrivateGameModeState.findingMatch && (
                    <>
                        <GameRequirementsWarning />
                        <CircularProgress sx={{ color: "black" }} />
                    </>
                )}


                {gameModeState === PrivateGameModeState.error && (
                    <>
                        <p>There was an error when finding a match.</p>
                        <Button
                            color="primary"
                            variant="contained"
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
                        {codeCopied ? "Copied" : "Copy Code"}
                    </Button>
                )}

                <Button
                    variant="contained"
                    color="error"
                    onClick={dismiss}
                    style={{ marginTop: "10px" }}
                >
                    Cancel
                </Button>
            </VStack>
        </View>
    );
}