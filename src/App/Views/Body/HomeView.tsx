import { useEffect, useState } from "react";
import { UserModel } from "../../../Background/Models";
import { getAuth, signOut } from "firebase/auth";
import MissingUsernameView from "../AppOpen/MissingUsernameView";
import { View, VStack } from "../../../ReactSwiftly";
import { Box, Button, Typography } from "@mui/material";
import { FetchService } from "../../../Background/Service";
import AppOpenView from "../AppOpen/AppOpenView";
import JumblemLogoSimple from "../../../assets/jumblem_logo_simple.png";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import StartCasualGameView from "../Game/CasualGame/StartCasualGameView";
import StartRatedGameView from "../Game/RatedGame/StartRatedGameView";
import PrivateMatchMenuView from "../Game/PrivateMatch/PrivateMatchMenuView";
import LoadDailyPuzzleView from "../DailyPuzzle/LoadDailyPuzzleView";

interface HomeViewProps {
    passedUser: UserModel;
}

export default function HomeView({
    passedUser,
}: HomeViewProps) {
    const [view, setView] = useState<"AppOpenView" | "Home" | "StartCasualGame" | "StartRatedGame" | "PrivateMatchMenu" | "DailyPuzzle">("Home");
    const [user, setUser] = useState<UserModel>(passedUser);
    const [isMissingUsername, setIsMissingUsername] = useState(!passedUser.username);
    const [newUsername, setNewUsername] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { minDimension } = useWindowSize();
    const [loadingUser, setLoadingUser] = useState(true);

    useEffect(() => {
        setLoadingUser(true);
        const firstMove = async () => {
            try {
                const updatedUser = await FetchService.fetchUserByUid(user.id)
                setUser(updatedUser);
            } catch {

            }
        }

        firstMove();
    }, []);

    useEffect(() => {
        if (!user.username) {
            setIsMissingUsername(true);
        } else {
            // refresh user
        }
        setLoadingUser(false);
    }, [user]);


    const handleLogout = async () => {
        const auth = getAuth();
        try {
            await signOut(auth);
            setView("AppOpenView");
        } catch (error) {
        }
    };

    const styles = {
        buttonContainer: {
            display: "flex",
            flexDirection: "row" as const,
            justifyContent: "space-between",
        },
        button: {
            margin: "10px",
            flex: 1,
            backgroundColor: "rgb(227, 218, 195)",
            color: loadingUser ? "gray" : "black",
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

    if (isMissingUsername) {
        return (
            <MissingUsernameView
                currentUser={user}

                error={error}
                setError={setError}

                newUsername={newUsername}
                setNewUsername={setNewUsername}

                isCheckingUsername={isCheckingUsername}
                setIsCheckingUsername={setIsCheckingUsername}

                isUsernameAvailable={isUsernameAvailable}
                setIsUsernameAvailable={setIsUsernameAvailable}

                setIsMissingUsername={setIsMissingUsername}
            />
        );
    }

    switch (view) {
        case "AppOpenView":
            return (<AppOpenView />);
        case "StartCasualGame":
            return (<StartCasualGameView passedUser={user} />);
        case "StartRatedGame":
            return (<StartRatedGameView passedUser={user} />);
        case "PrivateMatchMenu":
            return (<PrivateMatchMenuView passedUser={user}/>);
        case "DailyPuzzle":
            return (<LoadDailyPuzzleView passedUser={user} />);
    }

    return (
        <View>
            <VStack>
                <img src={JumblemLogoSimple} alt="Jumblem Logo" style={styles.logo} />
                <Box style={styles.section}>
                    <Typography style={styles.sectionTitle}>VERSUS</Typography>
                    <Box style={styles.buttonContainer}>
                        <Button variant="contained" style={styles.button} onClick={() => setView(loadingUser ? "Home" : "StartCasualGame")}>
                            CASUAL
                        </Button>
                        <Button variant="contained" style={styles.button} onClick={() => setView(loadingUser ? "Home" : "StartRatedGame")}>
                            RATED
                        </Button>
                    </Box>

                    <Box style={{ display: "flex", justifyContent: "center" }} onClick={() => setView(loadingUser ? "Home" : "PrivateMatchMenu")}>
                        <Button variant="contained" style={styles.button}>
                            PRIVATE MATCH
                        </Button>
                    </Box>
                </Box>


                <Box style={styles.section}>
                    <Typography style={styles.sectionTitle}>TRAIN</Typography>
                    <Box style={styles.buttonContainer}>
                        <Button variant="contained" style={styles.button} onClick={() => setView(loadingUser ? "Home" : "DailyPuzzle")}>
                            DAILY PUZZLE
                        </Button>
                        <Button variant="contained" style={styles.button}>
                            WORD TRAINER
                        </Button>
                    </Box>

                </Box>


                <Box style={styles.section}>
                    <Typography style={styles.sectionTitle}>HOW TO PLAY</Typography>
                    <Box style={styles.buttonContainer}>
                        <Button variant="contained" style={styles.button}>
                            DAILY PUZZLE
                        </Button>
                        <Button variant="contained" style={styles.button}>
                            CASUAL & RATED
                        </Button>
                    </Box>

                </Box>

                <Button variant="contained" onClick={handleLogout}>Logout</Button>
            </VStack>
        </View>
    );
}