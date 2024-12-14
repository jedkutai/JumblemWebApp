import { useEffect, useState } from "react";
import { UserModel } from "../../../Background/Models";
import { getAuth, signOut } from "firebase/auth";
import MissingUsernameView from "../AppOpen/MissingUsernameView";
import { HStack, View, VStack } from "../../../ReactSwiftly";
import { Box, Button, Typography } from "@mui/material";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { useNavigate } from "react-router-dom";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";


interface HomeViewProps {
    passedUser: UserModel;
}

export default function HomeView({
    passedUser,
}: HomeViewProps) {
    const [user] = useState<UserModel>(passedUser);
    const [isMissingUsername, setIsMissingUsername] = useState(!passedUser.username);
    const [newUsername, setNewUsername] = useState("");
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { minDimension } = useWindowSize();
    const navigate = useNavigate();


    useEffect(() => {
        if (!user.username) {
            setIsMissingUsername(true);
        } else {
            // refresh user
        }
    });




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
            color: "black",
            fontWeight: 600,
        },
        moreButton: {
            margin: "10px",
            flex: 1,
            backgroundColor: "rgb(0, 0, 0)",
            color: "white",
            fontWeight: 600,
            width: "100%",
            maxWidth: `${Math.min(200, minDimension * 0.3)}px`,
        },
        wordTrainerButton: {
            margin: "10px",
            flex: 1,
            backgroundColor: "rgb(48, 146, 221)",
            color: "white",
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
            />
        );
    }


    return (
        <View>
            <VStack>
                <JumblemLogoSimple />
                <Box style={styles.section}>
                    <Typography style={styles.sectionTitle}>VERSUS</Typography>
                    <Box style={styles.buttonContainer}>
                        <Button variant="contained" style={styles.button} onClick={() => navigate("/casual")}>
                            CASUAL
                        </Button>
                        <Button variant="contained" style={styles.button} onClick={() => navigate("/rated")}>
                            RATED
                        </Button>
                    </Box>

                    <Box style={{ display: "flex", justifyContent: "center" }} onClick={() => navigate("/private")}>
                        <Button variant="contained" style={styles.button}>
                            PRIVATE MATCH
                        </Button>
                    </Box>
                </Box>


                <Box style={styles.section}>
                    <Typography style={styles.sectionTitle}>TRAIN</Typography>
                    <Box style={styles.buttonContainer}>
                        <Button variant="contained" style={styles.button} onClick={() => navigate("/dailypuzzle")}>
                            DAILY PUZZLE
                        </Button>
                        <Button variant="contained" style={styles.wordTrainerButton}>
                            WORD TRAINER
                        </Button>
                    </Box>

                </Box>


                <Box style={styles.section}>
                    <Typography style={styles.sectionTitle}>HOW TO PLAY</Typography>
                    <Box style={styles.buttonContainer}>
                        <Button variant="contained" style={styles.button} onClick={() => navigate("/howto/dailypuzzle")}>
                            DAILY PUZZLE
                        </Button>
                        <Button variant="contained" style={styles.button} onClick={() => navigate("/howto/versus")}>
                            CASUAL & RATED
                        </Button>
                    </Box>

                </Box>

                {/* <Button variant="contained" onClick={handleLogout}>Logout</Button> */}

                <HStack>
                    <Button variant="contained" style={styles.moreButton}>
                        People
                    </Button>

                    <Button variant="contained" style={styles.moreButton} onClick={() => navigate("/profile")}>
                        Profile
                    </Button>
                </HStack>
            </VStack>
        </View>
    );
}