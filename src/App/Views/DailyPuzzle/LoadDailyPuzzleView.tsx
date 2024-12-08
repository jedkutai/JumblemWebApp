import { useEffect, useState } from "react";
import { DailyPuzzleModel, GridSpotModel, UserModel } from "../../../Background/Models";
import { View, VSpacer, VStack } from "../../../ReactSwiftly";
import { Button, CircularProgress, Typography } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { FetchService } from "../../../Background/Service";
import { DailyPuzzleFunctions } from "../../../Background/Utils/DailyPuzzleFunctions";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import JumblemLogoSimple from "../../../assets/jumblem_logo_simple.png";
import HomeView from "../Body/HomeView";
import DailyPuzzleView from "./DailyPuzzleView";

enum DailyPuzzleState {
    loading,
    loaded,
    alreadyPlayed,
    failed
}

interface LoadDailyPuzzleViewProps {
    passedUser: UserModel;
}

export default function LoadDailyPuzzleView({ passedUser }: LoadDailyPuzzleViewProps) {
    const [user, setUser] = useState<UserModel>(passedUser);
    const [dailyPuzzle, setDailyPuzzle] = useState<DailyPuzzleModel | null>(null);
    const [dailyPuzzleState, setDailyPuzzleState] = useState<DailyPuzzleState>(DailyPuzzleState.loading);
    const [dailyPuzzleDict, setDailyPuzzleDict] = useState<Record<string, GridSpotModel>>({});
    const [view, setView] = useState<"LoadDailyPuzzle" | "PlayDailyPuzzle" | "Home" | "LeaderBoard">("LoadDailyPuzzle");
    const { height, minDimension } = useWindowSize();

    const styles = {
        logo: {
            maxWidth: `${Math.min(minDimension / 3, 300)}px`,
            maxHeight: `${Math.min(minDimension / 3, 200)}px`,
            marginBottom: "20px",
        },
    }
    useEffect(() => {
        onAppearActions();
    }, []);

    function navigateToPuzzle() {
        setView("PlayDailyPuzzle");
    }

    function navigateToHome() {
        setView("Home");
    }

    function navigateToLeaderBoard() {
        setView("LeaderBoard");
    }

    function nextPuzzleDate(time: Timestamp): string {
        const nextPuzzleDate = new Date(time.toDate());
        nextPuzzleDate.setHours(nextPuzzleDate.getHours() + 24);
        return nextPuzzleDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" });
    }

    async function onAppearActions() {
        setDailyPuzzleState(DailyPuzzleState.loading);
        try {
            const updatedUser = await FetchService.fetchUserByUid(user.id);
            setUser(updatedUser);

            const fetchedDailyPuzzle = await FetchService.fetchTodaysDailyPuzzle();
            setDailyPuzzle(fetchedDailyPuzzle);

            if (fetchedDailyPuzzle) {
                setDailyPuzzleDict(DailyPuzzleFunctions.signatureToGridDict(fetchedDailyPuzzle.signature));
                if (user.lastPuzzlePlayedId != null && user.lastPuzzlePlayedId === fetchedDailyPuzzle.id) {
                    setDailyPuzzleState(DailyPuzzleState.alreadyPlayed);
                    return;
                } else {
                    setDailyPuzzleState(DailyPuzzleState.loaded);
                    return;
                }
            } else {
                setDailyPuzzleState(DailyPuzzleState.failed);
                return;
            }
        } catch {
            setDailyPuzzleState(DailyPuzzleState.failed);
            return;
        }

    }

    switch (view) {
        case "Home":
            return (<HomeView passedUser={user} />);
        case "PlayDailyPuzzle":
            if (dailyPuzzle) {
                return (<DailyPuzzleView passedUser={user} dailyPuzzle={dailyPuzzle} dailyPuzzleDict={dailyPuzzleDict} />);
            }
            break;
        case "LeaderBoard":
            break;
        case "LoadDailyPuzzle":
            break;
        default:
            break;
    }

    return (
        <View>
            <VStack>
                <img src={JumblemLogoSimple} alt="Jumblem Logo" style={styles.logo} />

                <VStack height={`${height / 2}px`}>
                    <VSpacer />

                    {dailyPuzzleState === DailyPuzzleState.loading && (
                        <CircularProgress />
                    )}
                    {dailyPuzzleState === DailyPuzzleState.loaded && (
                        <>
                            <Typography textAlign={"center"}>Note:</Typography>
                            <Typography textAlign={"center"}>Once you start today's puzzle, you can't replay it.</Typography>
                            <Typography textAlign={"center"}>The puzzle only ends when you hit submit. It doesn't matter if you've found all the words.</Typography>
                            <Button variant="contained" onClick={() => navigateToPuzzle()}>Play</Button>
                        </>
                    )}
                    {dailyPuzzleState === DailyPuzzleState.alreadyPlayed && dailyPuzzle && (
                        <>
                            <Typography textAlign={"center"}>You've already played today's puzzle.</Typography>
                            <Typography textAlign={"center"}>Next Puzzle:</Typography>
                            <Typography textAlign={"center"}>{nextPuzzleDate(dailyPuzzle.timestamp)}</Typography>

                            <Button variant="contained" color="secondary" onClick={navigateToLeaderBoard}>Leaderboard</Button>
                        </>
                    )}
                    {dailyPuzzleState === DailyPuzzleState.failed && (
                        <>
                            <Typography textAlign={"center"}>Failed to load today's puzzle.</Typography>
                            <Button variant="contained" color="error" onClick={onAppearActions}>Retry</Button>
                        </>
                    )}

                    <VSpacer />
                </VStack>

                <Button variant="outlined" onClick={navigateToHome}>Home</Button>

            </VStack>
        </View>
    );

}