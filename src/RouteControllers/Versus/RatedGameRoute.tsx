import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserModel } from "../../Background/Models";
import { FetchService } from "../../Background/Service";
import app from "../../firebase";
import { Button, Typography } from "@mui/material";
import { HStack, View, VStack } from "../../ReactSwiftly";
// import StartRatedGameView from "../../App/Views/Game/RatedGame/StartRatedGameView";
import JumblemLogoSimple from "../../App/Components/JumblemLogoSimple";
import AppLoadingView from "../../App/Views/AppOpen/AppLoadingView";
import VersusCrashCourse from "../../App/General/CrashCourses/Versus/VersusCrashCourse";
import StartRatedGameView2 from "../../App/Views/Game2/RatedGame2/StartRatedGameView2";
import { ClockFunctions } from "../../Background/Utils/ClockFunctions";

enum PageState {
    loading,
    loaded,
}

export default function RatedGameRoute() {
    const [user, setUser] = useState<UserModel | null>(null);
    const [timeOffset, setTimeOffset] = useState<number | null>(null);
    const [pageState, setPageState] = useState<PageState>(PageState.loading);
    const navigate = useNavigate();
    const crashCoursePlayed = localStorage.getItem("versusCrashCoursePlayed");

    useEffect(() => {
        onAppearActions();
    }, []);

    async function onAppearActions() {
        const auth = getAuth(app);

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            const fetchedTimeOffset = await ClockFunctions.getTimeOffset();
            setTimeOffset(fetchedTimeOffset);
            if (firebaseUser) {
                if (firebaseUser.isAnonymous) {
                    navigate("/home");
                } else {
                    try {
                        const fetchedUser = await FetchService.fetchUserByUid(firebaseUser.uid);

                        if (fetchedUser.username) {
                            setUser(fetchedUser);
                            setPageState(PageState.loaded);
                        } else {
                            navigate("/home");
                        }
                    } catch (error) {
                        setUser(null);
                        navigate("/");
                    }
                }
            } else {
                setUser(null);
                setPageState(PageState.loaded);
            }
        });

        return () => unsubscribe();
    }

    if (!crashCoursePlayed && user) {
        return (
            <VersusCrashCourse />
        );
    }

    switch (pageState) {
        case PageState.loading:
            return (
                <AppLoadingView />
            );

        case PageState.loaded:
            if (user && user.username !== "guest" && timeOffset) {
                return (
                    <StartRatedGameView2 passedUser={user} timeOffset={timeOffset} />
                );
            } else {
                return (
                    <View>
                        <VStack>
                            <Button onClick={() => navigate("/home")}>
                                <JumblemLogoSimple />
                            </Button>

                            <Typography textAlign={"center"}>Login required to play rated matches.</Typography>

                            <HStack>
                                <Button variant="contained" color="secondary" onClick={() => navigate("/login")}>Login</Button>
                                <Button variant="contained" color="primary">Download</Button>
                            </HStack>
                        </VStack>
                    </View>
                )
            }
            break;

    }
}