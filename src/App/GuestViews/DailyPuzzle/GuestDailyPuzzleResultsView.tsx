import { useEffect, useState } from "react";
import { DailyPuzzleModel, WordModel } from "../../../Background/Models";
import { FetchService } from "../../../Background/Service";
import { HStack, View, VStack } from "../../../ReactSwiftly";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress, Typography } from "@mui/material";
import { DailyPuzzleFunctions } from "../../../Background/Utils/DailyPuzzleFunctions";
import GuestDailyPuzzleFoundWords from "./GuestDailyPuzzleFoundWords";
import SharePuzzleResultsButton from "../../Components/SharePuzzleResultsButton";
// import ShareDailyPuzzleScore from "../../Components/ShareDailyPuzzleScore";

enum PageState {
    loading,
    loaded,
    failed
}

export default function GuestDailyPuzzleResultsView() {
    const [pageState, setPageState] = useState<PageState>(PageState.loading);
    const [words, setWords] = useState<Record<string, [WordModel, number]>>({});
    const [lastPuzzlePlayed, setLastPuzzlePlayed] = useState<DailyPuzzleModel | null>(null);
    const [wordsLoaded, setWordsLoaded] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        getResults();
    }, []);


    async function getResults() {
        setPageState(PageState.loading);
        try {
            let lastPuzzlePlayedId = localStorage.getItem("lastPuzzlePlayedId") ?? "";
            let fetchedPuzzle = await FetchService.fetchDailyPuzzleById(lastPuzzlePlayedId);
            setLastPuzzlePlayed(fetchedPuzzle);
            let fetchedWords: Record<string, [WordModel, number]> = {};

            const wordString = localStorage.getItem("lastPuzzlePlayedResults") ?? "";
            if (wordString !== "") {
                const splitWords = wordString.split(",");
                for (let splitWord of splitWords) {
                    if (Object.keys(fetchedWords).includes(splitWord)) {
                        fetchedWords[splitWord][1] += 1;
                    } else {
                        const wordModel = await FetchService.fetchWordModelByWord(splitWord);
                        fetchedWords[splitWord] = [wordModel, 1];
                    }
                }
            }

            setWords(fetchedWords);
            setWordsLoaded(true);
            setPageState(PageState.loaded);
        } catch {
            setPageState(PageState.failed);
            setWords({});
        }
    }

    return (
        <View>
            <VStack>
                <Button onClick={() => navigate("/home")}>
                    <JumblemLogoSimple />
                </Button>
                {pageState === PageState.loading && (
                    <CircularProgress sx={{ color: "black" }} />
                )}
                {pageState === PageState.loaded && (
                    <>
                        <HStack>
                            <Typography variant="h6" sx={{ color: 'black', textTransform: "none" }}>{`Score: ${DailyPuzzleFunctions.getScore(words)}`}</Typography>
                            {lastPuzzlePlayed && wordsLoaded && (
                                <SharePuzzleResultsButton date={lastPuzzlePlayed.timestamp} words={words} />
                            )}
                        </HStack>
                        <GuestDailyPuzzleFoundWords correctWords={words} />
                    </>
                )}
                {pageState === PageState.failed && (
                    <>
                        <Typography variant="h6" sx={{ color: 'black', textTransform: "none" }}>Failed to load results</Typography>
                        <Button onClick={() => getResults()} variant="contained" color="error">Retry</Button>
                    </>
                )}

                <Button onClick={() => navigate("/home")} variant="contained" color="primary">Home</Button>
            </VStack>
        </View>
    );
}