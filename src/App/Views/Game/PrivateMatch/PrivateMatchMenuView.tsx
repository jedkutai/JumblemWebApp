import { useEffect, useState } from "react";
import { UserModel } from "../../../../Background/Models";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { FetchService } from "../../../../Background/Service";
import { View, VStack } from "../../../../ReactSwiftly";
import { Box, Button, Typography } from "@mui/material";
import HomeView from "../../Body/HomeView";
import StartPrivateGameView from "./StartPrivateGameView";
import JoinPrivateGameView from "./JoinPrivateGameView";

interface PrivateMatchMenuViewProps {
    passedUser: UserModel;
}

export default function PrivateMatchMenuView({passedUser}: PrivateMatchMenuViewProps) {
    const [user, setUser] = useState(passedUser);
    const [view, setView] = useState<"Home" | "Menu" | "Create" | "Join">("Menu");
    const [loadingUser, setLoadingUser] = useState(true);
    const { minDimension } = useWindowSize();

    useEffect(() => {
        const onAppearActions = async () => {
            try {
                const loadedUser = await FetchService.fetchUserByUid(user.id);
                setUser(loadedUser);
                setLoadingUser(false);
            } catch {
            }
        }
        onAppearActions();

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

    switch(view) {
        case "Home":
            return (<HomeView passedUser={user}/>);
        case "Create":
            return (<StartPrivateGameView passedUser={user}/>);
        case "Join":
            return (<JoinPrivateGameView passedUser={user}/>);
    }

    return (
        <View>
            <VStack>
            <Box style={styles.section}>
                    <Typography style={styles.sectionTitle}>PRIVATE MATCH</Typography>
                    <Box style={styles.buttonContainer}>
                        <Button variant="contained" style={styles.button} onClick={() => setView(loadingUser ? "Menu" : "Create")}>
                            CREATE
                        </Button>
                        <Button variant="contained" style={styles.button} onClick={() => setView(loadingUser ? "Menu" : "Join")}>
                            JOIN
                        </Button>
                    </Box>
                </Box>

                <Button
                    variant="outlined"
                    color="primary"
                    onClick={() => setView("Home")}
                    style={{ marginTop: "10px" }}
                >
                    Home
                </Button>
            </VStack>
        </View>
    );
}