import { Box, Typography, Button } from "@mui/material";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { HStack, View, VStack } from "../../../ReactSwiftly";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";
import { AuthService } from "../../../Background/Service";

import { CiCirclePlus } from "react-icons/ci";
import { IoPerson } from "react-icons/io5";

export default function GuestHomeView() {
    const { minDimension } = useWindowSize();
    const navigate = useNavigate();
    const [showLoginMessage, setShowLoginMessage] = useState(false);
    const iconSize = 25;

    function openHowToDailyPuzzle() {
        // window.open("https://youtu.be/_V9frMe_Obo?feature=shared", "_blank");
        navigate("/howto/dailypuzzle");
    }

    function openHowToVersus() {
        // window.open("https://youtu.be/DvVO0vc1LQw?feature=shared", "_blank");
        navigate("/howto/versus");
    }

    const styles = {
        moreButton: {
            margin: "10px",
            flex: 1,
            backgroundColor: "rgb(0, 0, 0)",
            color: "white",
            fontWeight: 600,
            width: "100%",
            maxWidth: `${Math.min(200, minDimension * 0.15)}px`,
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

        redditButton: {
            margin: "10px",
            flex: 1,
            backgroundColor: "rgb(255, 69, 2)",
            color: "white",
            fontWeight: 600,
        },
        youtubeButton: {
            margin: "10px",
            flex: 1,
            backgroundColor: "rgb(255, 0, 52)",
            color: "white",
            fontWeight: 600,
        },
        instagramButton: {
            margin: "10px",
            flex: 1,
            backgroundImage: "linear-gradient(to bottom right, rgb(79, 91, 213), rgb(150, 47, 191), rgb(214, 41, 118), rgb(250, 126, 30), rgb(254, 218, 117)",
            color: "white",
            fontWeight: 600,
        },
        discordButton: {
            margin: "10px",
            flex: 1,
            backgroundColor: "rgb(88, 101, 242)",
            color: "white",
            fontWeight: 600,
        },
        xButton: {
            margin: "10px",
            flex: 1,
            backgroundColor: "black",
            color: "white",
            fontWeight: 600,
        },
        appStoreButton: {
            margin: "10px",
            flex: 1,
            backgroundColor: "rgb(0, 122, 255)",
            color: "white",
            fontWeight: 600,
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
        <View startAtTop={true}>
            <VStack>
                <JumblemLogoSimple />
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
                        <Button variant="contained" style={styles.button} onClick={() => navigate("/private")}>
                            PRIVATE MATCH
                        </Button>
                    </Box>
                </Box>


                <Box style={styles.section}>
                    <Typography style={styles.sectionTitle}>PUZZLE</Typography>
                    <Box style={{ display: "flex", justifyContent: "center" }}>
                        <Button variant="contained" style={styles.button} onClick={() => navigate("/dailypuzzle")}>
                            DAILY PUZZLE
                        </Button>
                    </Box>

                </Box>


                <Box style={styles.section}>
                    <Typography style={styles.sectionTitle}>HOW TO PLAY</Typography>
                    <Box style={styles.buttonContainer}>
                        <Button variant="contained" style={styles.button} onClick={openHowToDailyPuzzle}>
                            DAILY PUZZLE
                        </Button>
                        <Button variant="contained" style={styles.button} onClick={openHowToVersus}>
                            VERSUS
                        </Button>
                    </Box>

                </Box>

                <HStack>
                    <Button variant="contained" style={styles.moreButton} onClick={loginButton}>
                        <IoPerson size={iconSize}/>
                    </Button>

                    <Button variant="contained" style={styles.moreButton} onClick={() => navigate("/more")}>
                        <CiCirclePlus size={iconSize}/>
                    </Button>
                </HStack>
            </VStack>
        </View>
    );
}