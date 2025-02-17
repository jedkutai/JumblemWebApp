import { useEffect, useState } from "react";
import { DailyPuzzleEntryModel, DailyPuzzleModel, WordModel } from "../../../Background/Models";
import { FetchService } from "../../../Background/Service";
import { HStack, View, VStack } from "../../../ReactSwiftly";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress, Typography } from "@mui/material";
import { DailyPuzzleFunctions } from "../../../Background/Utils/DailyPuzzleFunctions";
import SharePuzzleResultsButton from "../../Components/SharePuzzleResultsButton";
import { DisplayFunctions } from "../../../Background/Utils/DisplayFunctions";
import { IoPerson } from "react-icons/io5";
import { FaGlobe } from "react-icons/fa";
import DailyPuzzleFoundWords from "../../Views/DailyPuzzle/DailyPuzzleFoundWords";
import GuestLeaderboardEntry from "./GuestLeaderboardEntry";
import { WordBankFunctions } from "../../../Background/Utils/WordBankFunctions";

enum LeaderboardState {
    loading,
    loaded,
    failed
}

export default function GuestDailyPuzzleResultsView() {
    const [wordBankDict, setWordBankDict] = useState<Record<string, string[]>>({});
    const [leaderboardState, setLeaderboardState] = useState<LeaderboardState>(LeaderboardState.loading);
    const [words, setWords] = useState<Record<string, [WordModel, number]>>({});
    const [wordsLoaded, setWordsLoaded] = useState(false);
    const navigate = useNavigate();


    const [dailyPuzzle, setDailyPuzzle] = useState<DailyPuzzleModel | null>(null);
    const [leaderboard, setLeaderboard] = useState<DailyPuzzleEntryModel[]>([]);
    const [expand, setExpand] = useState(true);
    const unselectedColor = "rgb(192, 191, 191)";
    const iconSize = 25;

    useEffect(() => {
        getResults();
    }, []);


    async function getResults() {
        setLeaderboardState(LeaderboardState.loading);
        try {
            const wordBank = await WordBankFunctions.getWordBank();
            setWordBankDict(wordBank);
            
            let lastPuzzlePlayedId = localStorage.getItem("lastPuzzlePlayedId") ?? "";
            let fetchedPuzzle = await FetchService.fetchDailyPuzzleById(lastPuzzlePlayedId);
            setDailyPuzzle(fetchedPuzzle);
            // setLastPuzzlePlayed(fetchedPuzzle);
            let fetchedWords: Record<string, [WordModel, number]> = {};

            const wordString = localStorage.getItem("lastPuzzlePlayedResults") ?? "";
            if (wordString !== "") {
                const splitWords = wordString.split(",");
                for (let splitWord of splitWords) {
                    if (Object.keys(fetchedWords).includes(splitWord)) {
                        fetchedWords[splitWord][1] += 1;
                    } else {
                        const wordModel = await FetchService.fetchWordModelByWord(splitWord, wordBankDict);
                        fetchedWords[splitWord] = [wordModel, 1];
                    }
                }
            }

            const loadedLeaderboard = await FetchService.fetchLeaderboard(fetchedPuzzle, 100);
            setLeaderboard(loadedLeaderboard);

            setWords(fetchedWords);
            setWordsLoaded(true);
            setLeaderboardState(LeaderboardState.loaded);
        } catch {
            setLeaderboardState(LeaderboardState.failed);
            setWords({});
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
                {leaderboardState === LeaderboardState.loaded && dailyPuzzle && (
                    <>
                        <Typography>{DisplayFunctions.displayPuzzleDate(dailyPuzzle.timestamp)}</Typography>

                        <HStack>
                            {wordsLoaded && (
                                <SharePuzzleResultsButton date={dailyPuzzle.timestamp} words={words} />
                            )}

                            <Button style={{
                                backgroundColor: expand ? "rgb(0, 0, 0)" : unselectedColor,
                                color: expand ? "white" : "black"
                            }}
                                onClick={() => setExpand(true)}>
                                <IoPerson size={iconSize} />
                            </Button>

                            <Button
                                style={{
                                    background: (!expand) ? "black" : unselectedColor,
                                    color: (!expand) ? "white" : "black",
                                }}
                                onClick={() => setExpand(false)}>

                                <FaGlobe size={iconSize} />
                            </Button>
                        </HStack>

                        <HStack spacing="0px">
                            <Button onClick={() => navigate("/createaccount")}>
                                <p>Create an account</p>
                            </Button>

                            <p>to add score to leaderboard.</p>



                        </HStack>

                        {expand && wordsLoaded && (
                            <>
                                <h2 style={{ color: "black" }}>{`Total: ${DailyPuzzleFunctions.getScore(words)}`}</h2>
                                <DailyPuzzleFoundWords correctWords={words} />
                            </>
                        )}

                        {expand && !wordsLoaded && (
                            <CircularProgress sx={{ color: "black" }} />
                        )}

                        {!expand && (
                            <>
                                {leaderboard.map((entry, index) => (
                                    <div key={index}>
                                        {(index > 0) ? (
                                            <>
                                                {(leaderboard[index - 1].score == entry.score) ? (
                                                    // position == -1
                                                    <GuestLeaderboardEntry position={-1} entry={entry} />

                                                ) : (
                                                    // position = index + 1
                                                    <GuestLeaderboardEntry position={index + 1} entry={entry} />
                                                )}
                                            </>
                                        ) : (
                                            // position = index + 1
                                            <GuestLeaderboardEntry position={index + 1} entry={entry} />
                                        )}

                                    </div>
                                ))}
                            </>
                        )}

                    </>
                )}
                {leaderboardState === LeaderboardState.failed && (
                    <>
                        <Typography variant="h6" sx={{ color: 'black', textTransform: "none" }}>Failed to load results</Typography>
                        <Button onClick={() => getResults()} variant="contained" color="error">Retry</Button>
                    </>
                )}

            </VStack>
        </View>
    );
}