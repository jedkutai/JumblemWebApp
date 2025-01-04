import { useEffect, useState } from "react";
import { PublicUsernameModel, UserModel } from "../../../Background/Models";
import { View, VStack } from "../../../ReactSwiftly";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";
import { Alert, Box, Button, CircularProgress, TextField, Typography } from "@mui/material";
import { AuthService, FetchService } from "../../../Background/Service";
import { DisplayFunctions } from "../../../Background/Utils/DisplayFunctions";
import { Checks } from "../../../Background/Utils/Checks";
import { useNavigate } from "react-router-dom";


interface ChangeUsernameViewProps {
    passedUser: UserModel;
}

enum PageState {
    loading,
    canChangeUsername,
    cannotChangeUsername,
    usernameChanged,
    error
}

export default function ChangeUsernameView({ passedUser }: ChangeUsernameViewProps) {
    const [username, setUsername] = useState("");
    const [previousUsername, setPreviousUsername] = useState<PublicUsernameModel | null>(null);
    const [isCheckingUsername, setIsCheckingUsername] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [pageState, setPageState] = useState<PageState>(PageState.loading);
    const navigate = useNavigate();

    useEffect(() => {
        onAppearActions();
    }, []);

    const styles = {
        container: {
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            backgroundColor: "rgb(227, 218, 195)",
            minHeight: "100vh",
            padding: "20px",
            boxSizing: "border-box" as const,
        },
        logo: {
            width: "150px",
            height: "auto",
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
            maxWidth: "400px",
        },
        sectionTitle: {
            fontWeight: "bold" as const,
            fontSize: "1.5rem",
            marginBottom: "10px",
            textAlign: "center" as const,
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
        bottomNav: {
            marginTop: "auto",
            display: "flex",
            flexDirection: "column" as const,
            alignItems: "center",
            width: "100%",
            maxWidth: "400px",
        },
        textField: {
            marginBottom: "10px",
            width: "100%",
        },
        logoutButton: {
            marginTop: "20px",
            width: "100%",
        },
    };


    async function onAppearActions() {
        setPageState(PageState.loading);
        try {
            const fetchedUsername = await FetchService.fetchPublicUserName(passedUser.id);
            setPreviousUsername(fetchedUsername);
            if (fetchedUsername) {
                if (isWithinLastThreeWeeks(fetchedUsername.timestamp.toDate())) {
                    setPageState(PageState.cannotChangeUsername);
                } else {
                    setPageState(PageState.canChangeUsername);
                }
            } else {
                setPageState(PageState.error);
            }
        } catch {
            setPageState(PageState.error);
        }
    }

    function isWithinLastThreeWeeks(date: Date): boolean {
        const now = new Date();
        const threeWeeksAgo = new Date();
        threeWeeksAgo.setDate(now.getDate() - 21);

        // Compare only the dates, ignoring the time part
        return date >= threeWeeksAgo && date <= now;
    }


    function threeWeeksFromDate(date: Date): Date {
        const resultDate = new Date(date); // Clone the input date
        resultDate.setDate(resultDate.getDate() + 21); // Add 21 days
        return resultDate;
    }

    async function handleCheckUsername() {
        if (!username.trim()) {
            setError("Please enter a username.");
            return;
        }

        setError(null);
        setIsCheckingUsername(true);

        try {
            const available = await Checks.isUsernameAvailable(
                username.toLowerCase()
            );
            setIsUsernameAvailable(available);

            if (!available) {
                setError("Username is already taken. Please try another one.");
            }
        } catch (err) {
            setError("Failed to check username availability. Please try again.");
        } finally {
            setIsCheckingUsername(false);
        }
    };

    async function handleSetUsername() {
        if (!isUsernameAvailable) {
            setError("Please check username availability before continuing.");
            return;
        }

        try {
            await AuthService.setUsername(passedUser, username);
            setPageState(PageState.usernameChanged);
        } catch (err) {
            setError("Failed to set username. Please try again.");
        }
    };


    return (
        <View startAtTop={true}>
            <VStack>
                <Button onClick={() => navigate("/home")}>
                    <JumblemLogoSimple />
                </Button>
                {pageState === PageState.loading && (
                    <CircularProgress sx={{ color: "black" }} />
                )}

                {pageState === PageState.canChangeUsername && previousUsername && (
                    <Box style={styles.section}>
                        <Typography variant="h6" style={styles.sectionTitle}>
                            Change Your Username
                        </Typography>
                        {error && (
                            <Alert severity="error" style={{ marginBottom: "10px" }}>
                                {error}
                            </Alert>
                        )}
                        {isUsernameAvailable && (
                            <Alert severity="success" style={{ marginBottom: "10px" }}>
                                Username is available!
                            </Alert>
                        )}
                        <TextField
                            label="Username"
                            value={username}
                            onChange={(e) => {
                                setUsername(e.target.value);
                                setIsUsernameAvailable(false);
                            }}
                            variant="outlined"
                            style={styles.textField}
                        />
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleCheckUsername}
                            disabled={isCheckingUsername || !username.trim()}
                            style={styles.button}
                        >
                            {isCheckingUsername ? "Checking..." : "Check Availability"}
                        </Button>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSetUsername}
                            disabled={!isUsernameAvailable}
                            style={styles.button}
                        >
                            Set Username
                        </Button>
                    </Box>
                )}

                {pageState === PageState.cannotChangeUsername && previousUsername && (
                    <>
                        <Typography variant="h4" style={{ textAlign: "center", color: "black" }}>
                            You can only change your username once every three weeks.
                        </Typography>

                        <Typography variant="h6" style={{ textAlign: "center", color: "black" }}>
                            Next change:
                        </Typography>
                        <Typography variant="h6" style={{ textAlign: "center", color: "gray" }}>
                            {DisplayFunctions.longDate(threeWeeksFromDate(previousUsername.timestamp.toDate()))}
                        </Typography>
                    </>
                )}

                {pageState === PageState.usernameChanged && previousUsername && (
                    <Typography variant="h4" style={{ textAlign: "center", color: "black" }}>
                        Your username has been changed!
                    </Typography>
                )}

                {pageState === PageState.error && (
                    <Button onClick={onAppearActions}>
                        Reload
                    </Button>
                )}

            </VStack>
        </View>
    );
}