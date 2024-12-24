import { Box, Typography, Button } from "@mui/material";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { View, VStack } from "../../../ReactSwiftly";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";
import { AuthService } from "../../../Background/Service";


export default function GuestHomeView() {
    const { minDimension } = useWindowSize();
    const navigate = useNavigate();
    const [showLoginMessage, setShowLoginMessage] = useState(false);
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
        wordTrainerButton: {
            margin: "10px",
            flex: 1,
            backgroundColor: "rgb(48, 146, 221)",
            color: "white",
            fontWeight: 600,
        },
        bannedButton: {
            margin: "10px",
            flex: 1,
            backgroundColor: "rgb(227, 218, 195)",
            color: "gray",
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

    async function loginButton() {
        try {
            await AuthService.signOut();
        } catch {
            // console.error(error);
        }
    }
    return (
        <View>
            <VStack>
                <JumblemLogoSimple/>
                {showLoginMessage && (
                    <Typography variant="h6" style={{ textAlign: "center", color: "red" }} >Login for more modes!</Typography>
                )}
                <Box style={styles.section}>
                    <Typography style={styles.sectionTitle}>VERSUS</Typography>
                    <Box style={styles.buttonContainer}>
                        <Button variant="contained" style={styles.button} onClick={() => navigate("/casual")}>
                            CASUAL
                        </Button>
                        <Button variant="contained" style={styles.bannedButton} onClick={() => setShowLoginMessage(!showLoginMessage)}>
                            RATED
                        </Button>
                    </Box>

                    <Box style={{ display: "flex", justifyContent: "center" }} >
                        <Button variant="contained" style={styles.bannedButton} onClick={() => setShowLoginMessage(!showLoginMessage)}>
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

                <Button variant="contained" onClick={loginButton}>LOGIN</Button>
            </VStack>
        </View>
    );
}