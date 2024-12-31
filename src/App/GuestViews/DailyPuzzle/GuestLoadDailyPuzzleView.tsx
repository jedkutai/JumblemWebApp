import { CircularProgress, Typography, Button } from "@mui/material";
import { Timestamp } from "firebase/firestore";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { DailyPuzzleModel, GridSpotModel } from "../../../Background/Models";
import { FetchService } from "../../../Background/Service";
import { DailyPuzzleFunctions } from "../../../Background/Utils/DailyPuzzleFunctions";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { View, VStack, VSpacer, HStack } from "../../../ReactSwiftly";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";
import GuestDailyPuzzleResultsView from "./GuestDailyPuzzleResultsView";
import GuestDailyPuzzleView from "./GuestDailyPuzzleView";

enum DailyPuzzleState {
    loading,
    loaded,
    alreadyPlayed,
    failed
}

export default function GuestLoadDailyPuzzleView() {
    const lastPuzzlePlayedId = localStorage.getItem("lastPuzzlePlayedId") ?? "";
    const [dailyPuzzle, setDailyPuzzle] = useState<DailyPuzzleModel | null>(null);
    const [dailyPuzzleState, setDailyPuzzleState] = useState<DailyPuzzleState>(DailyPuzzleState.loading);
    const [dailyPuzzleDict, setDailyPuzzleDict] = useState<Record<string, GridSpotModel>>({});
    const [view, setView] = useState<"LoadDailyPuzzle" | "PlayDailyPuzzle" | "Results">("LoadDailyPuzzle");
    const { height } = useWindowSize();
    const navigate = useNavigate();


    useEffect(() => {
        onAppearActions();
    }, []);

    function navigateToPuzzle() {
        setView("PlayDailyPuzzle");
    }



    function nextPuzzleDate(time: Timestamp): string {
        const nextPuzzleDate = new Date(time.toDate());
        nextPuzzleDate.setHours(nextPuzzleDate.getHours() + 24);
        return nextPuzzleDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric", hour: "numeric", minute: "numeric" });
    }

    async function onAppearActions() {
        setDailyPuzzleState(DailyPuzzleState.loading);
        try {

            const fetchedDailyPuzzle = await FetchService.fetchTodaysDailyPuzzle();
            setDailyPuzzle(fetchedDailyPuzzle);

            if (fetchedDailyPuzzle) {
                setDailyPuzzleDict(DailyPuzzleFunctions.signatureToGridDict(fetchedDailyPuzzle.signature));
                if (lastPuzzlePlayedId === fetchedDailyPuzzle.id) {
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
        case "PlayDailyPuzzle":
            if (dailyPuzzle) {
                return (<GuestDailyPuzzleView dailyPuzzle={dailyPuzzle} dailyPuzzleDict={dailyPuzzleDict} />);
            }
            break;
        case "Results":
            if (dailyPuzzle) {
                return (
                    <GuestDailyPuzzleResultsView />
                );
            }
            break;
        case "LoadDailyPuzzle":
            break;
        default:
            break;
    }

    return (
        <View>
            <VStack>
                <Button onClick={() => navigate("/home")}>
                    <JumblemLogoSimple />
                </Button>

                <VStack height={`${height / 2}px`}>
                    <VSpacer />

                    {dailyPuzzleState === DailyPuzzleState.loading && (
                        <CircularProgress sx={{ color: "black" }} />
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

                            <HStack>
                                <Button style={{ width: "100px" }} variant="contained" color="secondary" onClick={() => setView("Results")}>Results</Button>
                                <Button style={{ width: "100px" }} variant="contained" color="primary" onClick={() => navigate("/")}>Login</Button>
                            </HStack>
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

                <Button variant="contained" color="error" onClick={() => navigate("/home")}>Leave</Button>

            </VStack>
        </View>
    );

}