import { useEffect, useState } from "react";
import { DailyPuzzleEntryModel, DailyPuzzleModel, UserModel, WordModel } from "../../../Background/Models";
import { HStack, View, VStack } from "../../../ReactSwiftly";
import { Button, CircularProgress, Typography } from "@mui/material";
import LeaderboardEntry from "./LeaderboardEntry";
import { FetchService } from "../../../Background/Service";
// import { Home } from "@mui/icons-material";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";
import { useNavigate } from "react-router-dom";
import DailyPuzzleFoundWords from "./DailyPuzzleFoundWords";
import { DisplayFunctions } from "../../../Background/Utils/DisplayFunctions";
// import ShareDailyPuzzleScore from "../../Components/ShareDailyPuzzleScore";

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
    const [user, setUser] = useState<UserModel>(passedUser);
    const [leaderboardState, setLeaderboardState] = useState<LeaderboardState>(LeaderboardState.loading);
    const [leaderboard, setLeaderboard] = useState<DailyPuzzleEntryModel[]>([]);
    const [userPuzzleEntry, setUserPuzzleEntry] = useState<DailyPuzzleEntryModel | null>(null);
    const navigate = useNavigate();

    const [wordsLoaded, setWordsLoaded] = useState(false);
    const [expand, setExpand] = useState(false); // first expand should load words
    const [words, setWords] = useState<Record<string, [WordModel, number]>>({});

    useEffect(() => {
        onAppearActions();
    }, []);

    useEffect(() => {
        fetchWords();
    }, [expand]);

    async function fetchWords() {
        if (wordsLoaded) {
            return;
        }
        if (userPuzzleEntry) {
            try {
                let fetchedWords: Record<string, [WordModel, number]> = {};
                for (const word of userPuzzleEntry.words) {
                    if (Object.keys(fetchedWords).includes(word)) {
                        fetchedWords[word][1] += 1;
                    } else {
                        const wordModel = await FetchService.fetchWordModelByWord(word);
                        fetchedWords[word] = [wordModel, 1];
                    }
                }
                setWords(fetchedWords);
                setWordsLoaded(true);
            } catch (error) {
                console.error("Failed to fetch words", error);
            }
        }
    }

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



    return (
        <View>
            <VStack>
                <Button onClick={() => navigate("/home")}>
                    <JumblemLogoSimple />
                </Button>
                {leaderboardState === LeaderboardState.loading && (
                    <CircularProgress sx={{ color: "black" }} />
                )}

                {leaderboardState === LeaderboardState.loaded && (
                    <>

                        <Typography>{DisplayFunctions.displayPuzzleDate(dailyPuzzle.timestamp)}</Typography>

                        {userPuzzleEntry && (
                            <>
                                <HStack>
                                    <Button style={{ backgroundColor: "rgb(0, 0, 0)", color: "white", fontWeight: 600 }} onClick={() => setExpand(!expand)}>
                                        {`Your score: ${Math.floor(userPuzzleEntry.score)}`.toUpperCase()}
                                    </Button>
                                    {/* <ShareDailyPuzzleScore username={passedUser.username} score={Math.floor(userPuzzleEntry.score)} timestamp={dailyPuzzle.timestamp}/> */}
                                    
                                </HStack>

                                {expand && wordsLoaded && (
                                    <DailyPuzzleFoundWords correctWords={words} />
                                )}

                                {expand && !wordsLoaded && (
                                    <CircularProgress sx={{ color: "black" }} />
                                )}
                            </>
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