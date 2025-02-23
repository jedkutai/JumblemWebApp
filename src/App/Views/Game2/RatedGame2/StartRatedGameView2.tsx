import { Button, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserModel, GameModel } from "../../../../Background/Models";
import { FetchService, RatedGameService } from "../../../../Background/Service";
import { View, VStack } from "../../../../ReactSwiftly";
import GameRequirementsWarning from "../../../Components/GameRequirementsWarning";
import JumblemLogoSimple from "../../../Components/JumblemLogoSimple";
import PlayRatedGameView2 from "./PlayRatedGameView2";

interface StartRatedGameView2Props {
    passedUser: UserModel
}

enum RatedGameModeState {
    idle,
    findingMatch,
    matchFound,
    error
}

export default function StartRatedGameView2({ passedUser }: StartRatedGameView2Props) {
    const [user, setUser] = useState<UserModel>(passedUser);
    const [gameModeState, setGameModeState] = useState<RatedGameModeState>(RatedGameModeState.idle);
    const [game, setGame] = useState<GameModel | null>(null);
    const [hostOfMatch, setHostOfMatch] = useState(false);
    const [stopSearching, setStopSearching] = useState(false);
    const [takingLongToFindMatch, setTakingLongToFindMatch] = useState(false);
    const [ticker, setTicker] = useState(false);
    const [tickCount, setTickCount] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        tickerActions();
    }, [ticker]);

    const dismiss = async () => {
        wipeGame();
        navigate("/home");
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

    if (gameModeState === RatedGameModeState.matchFound && game) {
        return <PlayRatedGameView2 passedUser={user} passedGame={game} />;
    }

    return (
        <View>
            <VStack>

                <Button onClick={dismiss}>
                    <JumblemLogoSimple />
                </Button>
                {gameModeState === RatedGameModeState.idle && (
                    <>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={onAppearActions}
                        >
                            Find Rated Match
                        </Button>
                    </>
                )}

                {gameModeState === RatedGameModeState.findingMatch && (
                    <>
                        <GameRequirementsWarning />
                        <CircularProgress sx={{ color: "black" }} />
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