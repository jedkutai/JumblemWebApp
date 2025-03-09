import { Box, Typography, Button } from "@mui/material";
import { useWindowSize } from "../../Background/Utils/useWindowSize";
import { HStack, View, VStack } from "../../ReactSwiftly";
import JumblemLogoSimple from "../../App/Components/JumblemLogoSimple";
import { useNavigate } from "react-router-dom";
import RedditIcon from "../../App/Components/SiteIcons/RedditIcon";
import XIcon from "../../App/Components/SiteIcons/XIcon";
import DiscordIcon from "../../App/Components/SiteIcons/DiscordIcon";
import InstagramIcon from "../../App/Components/SiteIcons/InstagramIcon";
import AppStoreIcon from "../../App/Components/SiteIcons/AppStoreIcon";
import TikTokIcon from "../../App/Components/SiteIcons/TikTokIcon";

export default function MoreRoute() {
    const navigate = useNavigate();
    const { minDimension } = useWindowSize();
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
            backgroundColor: "rgb(88, 101, 242)",
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


    function openReddit() {
        window.open("https://www.reddit.com/r/Jumblem/", "_blank");
    }

    function openInstagram() {
        window.open("https://www.instagram.com/jumblemofficial/", "_blank");
    }

    function openDiscord() {
        window.open("https://discord.gg/8btEWRf7Y5", "_blank");
    }

    function openX() {
        window.open("https://x.com/jumblemofficial", "_blank");
    }

    function openAppStore() {
        window.open("https://apps.apple.com/us/app/jumblem/id6741139222", "_blank");
    }

    function openTikTok() {
        window.open("https://www.tiktok.com/@jumblemofficial?_t=ZP-8uC8l7OlVBH&_r=1", "_blank");
    }

    return (
        <View startAtTop={true}>
            <VStack>
                <Button onClick={() => navigate("/home")}>
                    <JumblemLogoSimple />
                </Button>

                <Box style={styles.section}>
                    <Typography style={styles.sectionTitle}>POLICY</Typography>
                    <Box style={styles.buttonContainer}>
                        <Button variant="contained" style={styles.button} onClick={() => navigate("/termsandconditions")}>
                            TERMS
                        </Button>
                        <Button variant="contained" style={styles.button} onClick={() => navigate("/privacypolicy")}>
                            PRIVACY
                        </Button>
                    </Box>

                </Box>

                <Box style={styles.section}>
                    <Typography style={styles.sectionTitle}>SUPPORT</Typography>

                    <Box style={{ display: "flex", justifyContent: "center" }}>
                        <Button onClick={openDiscord}>
                            <DiscordIcon />
                        </Button>
                    </Box>
                </Box>

                <Box style={styles.section}>
                    <Typography style={styles.sectionTitle}>DOWNLOAD</Typography>

                    <Box style={{ display: "flex", justifyContent: "center" }}>
                        <Button onClick={openAppStore}>
                            <AppStoreIcon />
                        </Button>
                    </Box>
                </Box>

                <Box style={styles.section}>
                    <Typography style={styles.sectionTitle}>CONNECT</Typography>
                    <HStack>
                        <Button onClick={openDiscord}>
                            <DiscordIcon />
                        </Button>

                        <Button onClick={openInstagram}>
                            <InstagramIcon />
                        </Button>

                        <Button onClick={openTikTok}>
                            <TikTokIcon />
                        </Button>
                        <Button onClick={openX}>
                            <XIcon />
                        </Button>

                        <Button onClick={openReddit}>
                            <RedditIcon />
                        </Button>
                        
                    </HStack>
                </Box>
            </VStack>
        </View>
    );
}