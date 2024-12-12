import { useEffect, useState } from "react";
import { DailyPuzzleEntryModel, DailyPuzzleModel, UserModel } from "../../../Background/Models";
import { View, VStack } from "../../../ReactSwiftly";
import { Button, CircularProgress, Typography } from "@mui/material";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { Timestamp } from "firebase/firestore";
import LeaderboardEntry from "./LeaderboardEntry";
import { FetchService } from "../../../Background/Service";
// import { Home } from "@mui/icons-material";
import HomeView from "../Body/HomeView";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";
import { useNavigate } from "react-router-dom";

enum LeaderboardState {
    loading,
    loaded,
    error
}

interface DailyPuzzleLeaderboardViewProps {
    passedUser: UserModel;
    dailyPuzzle: DailyPuzzleModel;
}

export default function DailyPuzzleLeaderboardView({ passedUser, dailyPuzzle }: DailyPuzzleLeaderboardViewProps) {
    const [view, setView] = useState<"Leaderboard" | "Home">("Leaderboard");
    const [user, setUser] = useState<UserModel>(passedUser);
    const [leaderboardState, setLeaderboardState] = useState<LeaderboardState>(LeaderboardState.loading);
    const [leaderboard, setLeaderboard] = useState<DailyPuzzleEntryModel[]>([]);
    const [userPuzzleEntry, setUserPuzzleEntry] = useState<DailyPuzzleEntryModel | null>(null);
    const { minDimension } = useWindowSize();
    const navigate = useNavigate();
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

    async function onAppearActions() {
        setLeaderboardState(LeaderboardState.loading);
        try {
            const newUser = await FetchService.fetchUserByUid(user.id);
            setUser(newUser);
            const loadedLeaderboard = await FetchService.fetchLeaderboard(dailyPuzzle, 100);
            setLeaderboard(loadedLeaderboard);
            const userEntry = await FetchService.fetchUserPuzzleEntry(user, dailyPuzzle);
            setUserPuzzleEntry(userEntry);

            setLeaderboardState(LeaderboardState.loaded);

        } catch {
            setLeaderboardState(LeaderboardState.error);
        }
    }

    function displayPuzzleDate(time: Timestamp): string {
        const puzzleDate = new Date(time.toDate());
        return puzzleDate.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
    }

    if (view === "Home") {
        return (<HomeView passedUser={user} />);
    }

    return (
        <View>
            <VStack>
                <Button onClick={() => navigate("/home")}>
                    <JumblemLogoSimple />
                </Button>
                {leaderboardState === LeaderboardState.loading && (
                    <CircularProgress />
                )}

                {leaderboardState === LeaderboardState.loaded && (
                    <>
                        <Typography>{displayPuzzleDate(dailyPuzzle.timestamp)}</Typography>
                        {userPuzzleEntry && (
                            <></>
                        )}
                        {leaderboard.map((entry, index) => (
                            <div key={index}>
                                {(index > 0) ? (
                                    <>
                                        {(leaderboard[index - 1].score == entry.score) ? (
                                            // position == -1
                                            <LeaderboardEntry position={-1} entry={entry} passedUser={user} />

                                        ) : (
                                            // position = index + 1
                                            <LeaderboardEntry position={index + 1} entry={entry} passedUser={user} />
                                        )}
                                    </>
                                ) : (
                                    // position = index + 1
                                    <LeaderboardEntry position={index + 1} entry={entry} passedUser={user} />
                                )}

                            </div>
                        ))}

                    </>
                )}

                {leaderboardState === LeaderboardState.error && (
                    <Typography>Error</Typography>
                )}


            </VStack>
        </View>
    );
}