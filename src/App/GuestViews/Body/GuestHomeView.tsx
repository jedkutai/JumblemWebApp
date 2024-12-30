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
    function openReddit() {
        window.open("https://www.reddit.com/r/Jumblem/", "_blank");
    }

    function openYoutube() {
        window.open("https://www.youtube.com/@JumblemOfficial", "_blank");
    }

    function openInstagram() {
        window.open("https://www.instagram.com/jumblemofficial/", "_blank");
    }

    function openDiscord() {
        window.open("https://discord.gg/bpG4AJRu", "_blank");
    }

    function openX() {
        window.open("https://x.com/jumblemofficial", "_blank");
    }

    function openAppStore() {
        window.open("https://apps.apple.com/us/app/jumblem/id6737129433", "_blank");
    }

    function openHowToDailyPuzzle() {
        window.open("https://youtu.be/_V9frMe_Obo?feature=shared", "_blank");
    }

    function openHowToVersus() {
        window.open("https://youtu.be/DvVO0vc1LQw?feature=shared", "_blank");
    }

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
                    <Typography style={styles.sectionTitle}>PUZZLE</Typography>
                    <Box style={{ display: "flex", justifyContent: "center" }}>
                        <Button variant="contained" style={styles.button} onClick={() => navigate("/dailypuzzle")}>
                            DAILY PUZZLE
                        </Button>
                    </Box>
                    {/* <Box style={styles.buttonContainer}>
                        <Button variant="contained" style={styles.button} onClick={() => navigate("/dailypuzzle")}>
                            DAILY PUZZLE
                        </Button>
                        <Button variant="contained" style={styles.wordTrainerButton}>
                            WORD TRAINER
                        </Button>
                    </Box> */}

                </Box>


                <Box style={styles.section}>
                    <Typography style={styles.sectionTitle}>HOW TO PLAY</Typography>
                    <Box style={styles.buttonContainer}>
                        <Button variant="contained" style={styles.button} onClick={openHowToDailyPuzzle}>
                            DAILY PUZZLE
                        </Button>
                        <Button variant="contained" style={styles.button} onClick={openHowToVersus}>
                            CASUAL & RATED
                        </Button>
                    </Box>

                </Box>

                <Box style={styles.section}>
                    <Typography style={styles.sectionTitle}>CONNECT</Typography>
                    <Box style={styles.buttonContainer}>
                        <Button variant="contained" style={styles.redditButton} onClick={openReddit}>
                            Reddit
                        </Button>

                        <Button variant="contained" style={styles.youtubeButton} onClick={openYoutube}>
                            YouTube
                        </Button>
                    </Box>

                    <Box style={{ display: "flex", justifyContent: "center" }}>
                        <Button variant="contained" style={styles.xButton} onClick={openX}>
                            {"X (Twitter)"}
                        </Button>
                    </Box>

                    <Box style={styles.buttonContainer}>
                        <Button variant="contained" style={styles.discordButton} onClick={openDiscord}>
                            Discord
                        </Button>

                        <Button variant="contained" style={styles.instagramButton} onClick={openInstagram}>
                            Instagram
                        </Button>
                    </Box>
                </Box>

                <Box style={styles.section}>
                    <Typography style={styles.sectionTitle}>DOWNLOAD</Typography>

                    <Box style={{ display: "flex", justifyContent: "center" }}>
                        <Button variant="contained" style={styles.appStoreButton} onClick={openAppStore}>
                            {"App Store"}
                        </Button>
                    </Box>
                </Box>

                <Button variant="contained" onClick={loginButton}>LOGIN</Button>
            </VStack>
        </View>
    );
}