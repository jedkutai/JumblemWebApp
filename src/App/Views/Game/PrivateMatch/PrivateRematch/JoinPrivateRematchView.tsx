import { useEffect, useState } from "react";
import { UserModel, GameModel } from "../../../../../Background/Models";
import { FetchService, PrivateGameService } from "../../../../../Background/Service";
import { View, VStack } from "../../../../../ReactSwiftly";
import { Button, CircularProgress } from "@mui/material";
import PlayPrivateGameView from "../PlayPrivateGameView";
import { useNavigate } from "react-router-dom";
import GameRequirementsWarning from "../../../../Components/GameRequirementsWarning";
import JumblemLogoSimple from "../../../../Components/JumblemLogoSimple";

interface JoinPrivateRematchViewProps {
    passedUser: UserModel;
    previousGame: GameModel;
}

enum JoinPrivateRematchModeState {
    findingMatch,
    matchFound,
    error
}

export default function JoinPrivateRematchView({
    passedUser,
    previousGame,
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
            if (user.username != "guest") {
                const updatedUser = await FetchService.fetchUserByUid(user.id);
                setUser(updatedUser);
            }

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
            />);
    }

    return (
        <View>
            <VStack>
                <JumblemLogoSimple/>
                {gameModeState === JoinPrivateRematchModeState.findingMatch && (
                    <>
                        <GameRequirementsWarning />
                        <CircularProgress sx={{ color: "black" }} />
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