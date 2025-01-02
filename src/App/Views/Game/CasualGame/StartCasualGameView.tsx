import { useEffect, useState } from "react";
import { GameModel, UserModel } from "../../../../Background/Models";
import { View, VStack } from "../../../../ReactSwiftly";
import { Button, CircularProgress } from "@mui/material";
import { CasualGameService, FetchService } from "../../../../Background/Service";
import PlayCasualGameView from "./PlayCasualGameView";
import { useNavigate } from "react-router-dom";
import JumblemLogoSimple from "../../../Components/JumblemLogoSimple";
import BotPlayCasualGameView from "./CasualBot/BotPlayCasualGameView";
import GameRequirementsWarning from "../../../Components/GameRequirementsWarning";

interface StartCasualGameViewProps {
    passedUser: UserModel
}

enum CasualGameModeState {
    idle,
    findingMatch,
    matchFound,
    playBot,
    error
}

export default function StartCasualGameView({ passedUser }: StartCasualGameViewProps) {
    const [user, setUser] = useState<UserModel>(passedUser);
    const [gameModeState, setGameModeState] = useState<CasualGameModeState>(CasualGameModeState.idle);
    const [game, setGame] = useState<GameModel | null>(null);
    const [hostOfMatch, setHostOfMatch] = useState(false);
    const [stopSearching, setStopSearching] = useState(false);
    // const [takingLongToFindMatch, setTakingLongToFindMatch] = useState(false);
    const [ticker, setTicker] = useState(false);
    const [tickCount, setTickCount] = useState(0);
    const [botMatchCreated, setBotMatchCreated] = useState(false);
    const botMatchCreationDelay = Math.floor(Math.random() * 5) + 5;
    const navigate = useNavigate();


    useEffect(() => {
        tickerActions();
    }, [ticker]);

    const dismiss = async () => {
        wipeGame();
        navigate("/home");
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
                            if (gameUpdate.playerTwoId.startsWith("BOT-")) {
                                setGame(gameUpdate);
                                setGameModeState(CasualGameModeState.playBot);
                                setStopSearching(true);
                            } else {
                                setGame(gameUpdate);
                                setGameModeState(CasualGameModeState.matchFound);
                                setStopSearching(true);
                            }
                        } else {
                            if (tickCount > botMatchCreationDelay && !botMatchCreated) {
                                await CasualGameService.botJoinMatch(user, game);
                                setBotMatchCreated(true);
                            }
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


        } else {
            wipeGame();
        }
    }


    if (gameModeState === CasualGameModeState.matchFound && game) {
        return <PlayCasualGameView passedUser={user} passedGame={game} />;
    } else if (gameModeState === CasualGameModeState.playBot && game) {
        return <BotPlayCasualGameView passedUser={user} passedGame={game} />;
    }

    return (
        <View>
            <VStack>
                <JumblemLogoSimple />
                {gameModeState === CasualGameModeState.idle && (
                    <>
                        <Button
                            color="primary"
                            variant="contained"
                            onClick={onAppearActions}
                        >
                            Find Casual Match
                        </Button>
                    </>
                )}

                {gameModeState === CasualGameModeState.findingMatch && (
                    <>
                        <GameRequirementsWarning />
                        <CircularProgress sx={{ color: "black" }} />
                    </>
                )}


                {gameModeState === CasualGameModeState.error && (
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