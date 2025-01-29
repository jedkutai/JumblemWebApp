import { useEffect, useState } from "react";
import { DailyPuzzleEntryModel, DailyPuzzleModel, UserModel, WordModel } from "../../../Background/Models";
import { HStack, View, VStack } from "../../../ReactSwiftly";
import { Button, CircularProgress, Typography } from "@mui/material";
import LeaderboardEntry from "./LeaderboardEntry";
import { FetchService } from "../../../Background/Service";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";
import { useNavigate } from "react-router-dom";
import DailyPuzzleFoundWords from "./DailyPuzzleFoundWords";
import { DisplayFunctions } from "../../../Background/Utils/DisplayFunctions";
import SharePuzzleResultsButton from "../../Components/SharePuzzleResultsButton";
import { FaGlobe } from "react-icons/fa";
import { GiThreeFriends } from "react-icons/gi";
import { IoPerson } from "react-icons/io5";

enum LeaderboardState {
    loading,
    loaded,
    error
}

enum LeaderboardShown {
    global,
    followed
}

interface DailyPuzzleLeaderboardViewProps {
    passedUser: UserModel;
    dailyPuzzle: DailyPuzzleModel;
}

export default function DailyPuzzleLeaderboardView({ passedUser, dailyPuzzle }: DailyPuzzleLeaderboardViewProps) {
    const [user, setUser] = useState<UserModel>(passedUser);
    const [leaderboardState, setLeaderboardState] = useState<LeaderboardState>(LeaderboardState.loading);
    const [leaderboardShown, setLeaderboardShown] = useState<LeaderboardShown>(LeaderboardShown.global);
    const [leaderboard, setLeaderboard] = useState<DailyPuzzleEntryModel[]>([]);
    const [followedLeaderboard, setFollowedLeaderboard] = useState<DailyPuzzleEntryModel[]>([]);
    const [userPuzzleEntry, setUserPuzzleEntry] = useState<DailyPuzzleEntryModel | null>(null);
    const navigate = useNavigate();

    const [wordsLoaded, setWordsLoaded] = useState(false);
    const [expand, setExpand] = useState(false); // first expand should load words
    const [words, setWords] = useState<Record<string, [WordModel, number]>>({});

    const unselectedColor = "rgb(192, 191, 191)";
    const iconSize = 25;
    useEffect(() => {
        onAppearActions();
    }, []);

    useEffect(() => {
        fetchWords();
    }, [expand]);

    function selectGloabalLeaderboard() {
        setLeaderboardShown(LeaderboardShown.global);
        setExpand(false);
    }

    function selectFollowedLeaderboard() {
        setLeaderboardShown(LeaderboardShown.followed);
        setExpand(false);
    }

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
            try {
                const userEntry = await FetchService.fetchUserPuzzleEntry(user, dailyPuzzle);
                setUserPuzzleEntry(userEntry);
                setExpand(true);
            } catch {

            }
            const loadedFollowedLeaderboard = await FetchService.fetchFollowsLeaderboard(user, dailyPuzzle);
            setFollowedLeaderboard(loadedFollowedLeaderboard);

            

            setLeaderboardState(LeaderboardState.loaded);

        } catch {
            setLeaderboardState(LeaderboardState.error);
        }
    }



    return (
        <View startAtTop={true}>
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

                        <HStack>
                            {userPuzzleEntry && (
                                <>

                                    {wordsLoaded && (
                                        <SharePuzzleResultsButton date={dailyPuzzle.timestamp} words={words} />
                                    )}

                                    <Button style={{
                                        backgroundColor: expand ? "rgb(0, 0, 0)" : unselectedColor,
                                        color: expand ? "white" : "black"
                                    }}
                                        onClick={() => setExpand(!expand)}>
                                        <IoPerson size={iconSize} />
                                    </Button>
                                </>
                            )}
                            <Button
                                style={{
                                    background: (leaderboardShown === LeaderboardShown.global && !expand) ? "black" : unselectedColor,
                                    color: (leaderboardShown === LeaderboardShown.global && !expand) ? "white" : "black",
                                }}
                                onClick={selectGloabalLeaderboard}>

                                <FaGlobe size={iconSize} />
                            </Button>
                            <Button
                                style={{
                                    background: (leaderboardShown === LeaderboardShown.followed && !expand) ? "black" : unselectedColor,
                                    color: (leaderboardShown === LeaderboardShown.followed && !expand) ? "white" : "black",
                                }} onClick={selectFollowedLeaderboard}>
                                <GiThreeFriends size={iconSize} />
                            </Button>
                        </HStack>
                        {userPuzzleEntry && (
                            <>


                                {expand && wordsLoaded && (
                                    <>
                                        <h2 style={{ color: "black" }}>{`Total: ${Math.floor(userPuzzleEntry.score)}`}</h2>
                                        <DailyPuzzleFoundWords correctWords={words} />
                                    </>
                                )}

                                {expand && !wordsLoaded && (
                                    <CircularProgress sx={{ color: "black" }} />
                                )}
                            </>
                        )}
                        {leaderboardShown === LeaderboardShown.global && !expand && (
                            <>
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
                        {leaderboardShown === LeaderboardShown.followed && !expand && (
                            <>
                                {followedLeaderboard.map((entry, index) => (
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

                    </>
                )}

                {leaderboardState === LeaderboardState.error && (
                    <Typography>Error</Typography>
                )}


            </VStack>
        </View>
    );
}