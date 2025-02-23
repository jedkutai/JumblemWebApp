import { Box, Typography, TextField, Button, CircularProgress } from "@mui/material";
import { useState } from "react";
import { UserModel, GameModel } from "../../../../Background/Models";
import { PrivateGameService } from "../../../../Background/Service";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { View, VStack } from "../../../../ReactSwiftly";
import GameRequirementsWarning from "../../../Components/GameRequirementsWarning";
import PrivateMatchMenuView from "./PrivateMatchMenuView";
import PlayPrivateGameView2 from "./PlayPrivateGameView2";

enum JoinPrivateGameModeState {
    enterMatchCode,
    findingMatch,
    matchFound,
    error
}

interface JoinPrivateGameViewProps {
    passedUser: UserModel
}

export default function JoinPrivateGameView({ passedUser }: JoinPrivateGameViewProps) {
    const [view, setView] = useState<"JoinPrivateGameView" | "PrivateMatchMenuView">("JoinPrivateGameView");
    // const [user, setUser] = useState<UserModel>(passedUser);
    const [gameModeState, setGameModeState] = useState<JoinPrivateGameModeState>(JoinPrivateGameModeState.enterMatchCode);
    const [game, setGame] = useState<GameModel | null>(null);
    const [code, setCode] = useState("");
    const { minDimension } = useWindowSize();

    const styles = {
        textField: {
            marginBottom: "10px",
            width: "100%",
        },
        buttonContainer: {
            display: "flex",
            flexDirection: "row" as const,
            justifyContent: "space-between",
        },
        button: {
            margin: "10px",
            flex: 1,
            backgroundColor: "rgb(227, 218, 195)",
            color: "black",
            fontWeight: 600,
        },
        logo: {
            maxWidth: `${Math.min(minDimension / 3, 300)}px`,
            maxHeight: `${Math.min(minDimension / 3, 200)}px`,
            marginBottom: "20px",
        },
        section: {
            backgroundImage:
                "linear-gradient(to bottom right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05))",
            borderRadius: "15px",
            border: "3px solid rgba(0, 0, 0, 0.1)",
            padding: "20px",
            marginBottom: "20px",
            width: "100%",
            maxWidth: `${Math.min(400, minDimension * 0.8)}px`,
        },
        sectionTitle: {
            fontWeight: "bold" as const,
            fontSize: "1.5rem",
            marginBottom: "10px",
            textAlign: "center" as const,
        },
    }

    async function findMatch() {
        const strippedGameId = code.trim();
        if (strippedGameId.length > 0) {
            setGameModeState(JoinPrivateGameModeState.findingMatch);
            try {
                const foundGame = await PrivateGameService.findGame(passedUser, strippedGameId);
                if (foundGame != null) {
                    setGame(foundGame);
                    setGameModeState(JoinPrivateGameModeState.matchFound);
                } else {
                    setGameModeState(JoinPrivateGameModeState.error);
                }
            } catch {
                setGameModeState(JoinPrivateGameModeState.error);
            }
        }
    }

    if (view === "PrivateMatchMenuView") {
        return <PrivateMatchMenuView passedUser={passedUser} />
    }

    if (gameModeState === JoinPrivateGameModeState.matchFound && game) {
        return (
            <PlayPrivateGameView2
                passedGame={game}
                passedUser={passedUser}
            />
        );
        //     return <PlayPrivateGameView passedUser={passedUser} passedGame={game} />;
    }

    return (
        <View>
            <VStack>
                {gameModeState === JoinPrivateGameModeState.enterMatchCode && (
                    <VStack>
                        <Box style={styles.section}>
                            <Typography style={styles.sectionTitle}>Enter Code</Typography>
                            <TextField
                                label="Code"
                                value={code}
                                onChange={(e) => {
                                    setCode(e.target.value);
                                }}
                                variant="outlined"
                                style={styles.textField}
                                type="password"
                            />
                            <Box style={{ display: "flex", justifyContent: "center" }} >
                                <Button variant="contained" style={styles.button} onClick={() => findMatch()}>
                                    FIND MATCH
                                </Button>
                            </Box>
                        </Box>

                        <Button
                            variant="contained"
                            color="error"
                            onClick={() => setView("PrivateMatchMenuView")}
                            style={{ marginTop: "10px" }}
                        >
                            Cancel
                        </Button>

                    </VStack>



                )}

                {gameModeState === JoinPrivateGameModeState.findingMatch && (
                    <>
                        <GameRequirementsWarning />
                        <CircularProgress sx={{ color: "black" }} />
                    </>
                )}


                {gameModeState === JoinPrivateGameModeState.error && (
                    <>
                        <p>There was an error when finding a match.</p>
                        <Button
                            color="error"
                            variant="contained"
                            onClick={() => setGameModeState(JoinPrivateGameModeState.enterMatchCode)}
                        >
                            Retry
                        </Button>

                    </>
                )}
            </VStack>
        </View>
    );

}