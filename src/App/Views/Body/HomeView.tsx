import { useEffect, useState } from "react";
import { UserModel } from "../../../Background/Models";
import MissingUsernameView from "../AppOpen/MissingUsernameView";
import { HStack, View, VStack } from "../../../ReactSwiftly";
import { Box, Button, Typography } from "@mui/material";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { useNavigate } from "react-router-dom";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";

import { GiThreeFriends } from "react-icons/gi";
import { CiCirclePlus } from "react-icons/ci";
import { IoPerson } from "react-icons/io5";
import FirstOpenController from "../../General/FirstOpenController";

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
    const firstOpenSeen = localStorage.getItem("firstOpenSeen") ?? "false"

    const iconSize = 25;

    useEffect(() => {
        if (!user.username) {
            setIsMissingUsername(true);
        }
    });


    function openHowToDailyPuzzle() {
        // window.open("https://youtu.be/_V9frMe_Obo?feature=shared", "_blank");
        navigate("/howto/dailypuzzle");
    }

    function openHowToVersus() {
        // window.open("https://youtu.be/DvVO0vc1LQw?feature=shared", "_blank");
        navigate("/howto/versus");
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
        moreButton: {
            margin: "10px",
            flex: 1,
            backgroundColor: "rgb(0, 0, 0)",
            color: "white",
            fontWeight: 600,
            width: "100%",
            maxWidth: `${Math.min(200, minDimension * 0.15)}px`,
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
    } else if (firstOpenSeen == "false") {
        return (
            <FirstOpenController/>
        )
    }


    return (
        <View startAtTop={true}>
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

                    <Box style={{ display: "flex", justifyContent: "center" }}>
                        <Button variant="contained" style={styles.button} onClick={() => navigate("/private")}>
                            PRIVATE MATCH
                        </Button>
                    </Box>
                </Box>


                <Box style={styles.section}>
                    <Typography style={styles.sectionTitle}>PUZZLE</Typography>
                    <Box style={styles.buttonContainer}>
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
                    <Button variant="contained" style={styles.moreButton} onClick={() => navigate("/people")}>
                        <GiThreeFriends size={iconSize}/>
                    </Button>

                    <Button variant="contained" style={styles.moreButton} onClick={() => navigate("/profile")}>
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