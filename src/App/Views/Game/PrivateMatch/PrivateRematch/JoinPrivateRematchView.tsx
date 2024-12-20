import { useEffect, useState } from "react";
import { UserModel, GameModel } from "../../../../../Background/Models";
import { FetchService, PrivateGameService } from "../../../../../Background/Service";
import { View, VStack } from "../../../../../ReactSwiftly";
import { Button, CircularProgress, Typography } from "@mui/material";
import PlayPrivateGameView from "../PlayPrivateGameView";
import { useNavigate } from "react-router-dom";

interface JoinPrivateRematchViewProps {
    passedUser: UserModel;
    previousGame: GameModel;
    // wins: number;
    // draws: number;
    // losses: number;
    // setWins: (wins: number) => void;
    // setDraws: (draws: number) => void;
    // setLosses: (losses: number) => void;
}

enum JoinPrivateRematchModeState {
    findingMatch,
    matchFound,
    error
}

export default function JoinPrivateRematchView({
    passedUser,
    previousGame,
    // wins,
    // draws,
    // losses,
    // setWins,
    // setDraws,
    // setLosses
}: JoinPrivateRematchViewProps) {
    // const [view, setView] = useState<"StartPrivateGameView" | "HomeView">("StartPrivateGameView");
    const [user, setUser] = useState<UserModel>(passedUser);
    const [gameModeState, setGameModeState] = useState<JoinPrivateRematchModeState>(JoinPrivateRematchModeState.findingMatch);
    const [game, setGame] = useState<GameModel | null>(null);
    const [stopSearching, setStopSearching] = useState(false);
    const [ticker, setTicker] = useState(false);
    const [rematchOffered, setRematchOffered] = useState(false);
    const navigate = useNavigate();
    
    useEffect(() => {
        onAppearActions();
    }, []);

    useEffect(() => {
        tickerActions()
    }, [ticker]);

    const onAppearActions = async () => {
        setStopSearching(false);
        try {
            const updatedUser = await FetchService.fetchUserByUid(user.id);
            setUser(updatedUser);

            setTicker(!ticker);
        } catch {
            setGameModeState(JoinPrivateRematchModeState.error);
            setStopSearching(true);
        }
    }

    const tickerActions = async () => {
        if (!stopSearching) {
            if (game == null) {
                const timeout = setTimeout(async () => {
                    try {
                        const newGame = await PrivateGameService.joinRematch(user, previousGame.playerTwoId);
                        if (newGame != null) {
                            setGame(newGame);
                            setGameModeState(JoinPrivateRematchModeState.matchFound);
                            setStopSearching(true);
                            await PrivateGameService.destroySpecificRematchOffer(previousGame);
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
                    } catch {
                        setStopSearching(true);
                        setGameModeState(JoinPrivateRematchModeState.error);
                    }

                }, 1000);

                return () => clearTimeout(timeout);
            }
        }
    }

    const dismiss = async () => {
        if (rematchOffered) {
            try {
                await PrivateGameService.destroySpecificRematchOffer(previousGame);
                navigate("/home");
            } catch {

            }
        }
    }


    if (gameModeState === JoinPrivateRematchModeState.matchFound && game) {
        return (
            <PlayPrivateGameView
                passedUser={user}
                passedGame={game}
                // wins={wins}
                // draws={draws}
                // losses={losses}
                // setWins={setWins}
                // setDraws={setDraws}
                // setLosses={setLosses}
            />);
    }

    return (
        <View>
            <VStack>
                <Typography variant="h4" gutterBottom>
                    Jumblem
                </Typography>

                {gameModeState === JoinPrivateRematchModeState.findingMatch && (
                    <>
                        <p>Finding Private Match...</p>
                        <CircularProgress />
                    </>
                )}


                {gameModeState === JoinPrivateRematchModeState.error && (
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