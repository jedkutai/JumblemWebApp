import { useEffect, useState } from "react";
import { UserModel } from "../../../../Background/Models";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { View, VStack } from "../../../../ReactSwiftly";
import { Box, Button, Typography } from "@mui/material";
// import StartPrivateGameView from "./StartPrivateGameView";
// import JoinPrivateGameView from "./JoinPrivateGameView";
import { useNavigate } from "react-router-dom";
import JumblemLogoSimple from "../../../Components/JumblemLogoSimple";
import JoinPrivateGameView2 from "./JoinPrivateGameView2";
import StartPrivateGameView2 from "./StartPrivateGameView2";

interface PrivateMatchMenuViewProps {
    passedUser: UserModel;
}

export default function PrivateMatchMenuView({ passedUser }: PrivateMatchMenuViewProps) {
    const [view, setView] = useState<"Menu" | "Create" | "Join">("Menu");
    const { minDimension } = useWindowSize();
    const navigate = useNavigate();

    useEffect(() => {
        if (passedUser.username === null) {
            navigate("/home");
        }

    }, []);



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

    switch (view) {
        case "Create":
            return (<StartPrivateGameView2 passedUser={passedUser} />);
        case "Join":
            return (<JoinPrivateGameView2 passedUser={passedUser} />);
    }

    return (
        <View>
            <VStack>
                <Button onClick={() => navigate("/home")}>
                    <JumblemLogoSimple />
                </Button>
                <Box style={styles.section}>
                    <Typography style={styles.sectionTitle}>PRIVATE MATCH</Typography>
                    <Box style={styles.buttonContainer}>
                        <Button variant="contained" style={styles.button} onClick={() => setView("Create")}>
                            CREATE
                        </Button>
                        <Button variant="contained" style={styles.button} onClick={() => setView("Join")}>
                            JOIN
                        </Button>
                    </Box>
                </Box>

            </VStack>
        </View>
    );
}