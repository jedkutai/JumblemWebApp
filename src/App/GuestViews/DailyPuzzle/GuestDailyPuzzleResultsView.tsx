import { useEffect, useState } from "react";
import { WordModel } from "../../../Background/Models";
import { FetchService } from "../../../Background/Service";
import { View, VStack } from "../../../ReactSwiftly";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";
import { useNavigate } from "react-router-dom";
import { Button, CircularProgress, Typography } from "@mui/material";
import { DailyPuzzleFunctions } from "../../../Background/Utils/DailyPuzzleFunctions";
import GuestDailyPuzzleFoundWords from "./GuestDailyPuzzleFoundWords";

enum PageState {
    loading,
    loaded,
    failed
}

export default function GuestDailyPuzzleResultsView() {
    const [pageState, setPageState] = useState<PageState>(PageState.loading);
    const [words, setWords] = useState<Record<string, [WordModel, number]>>({});
    const navigate = useNavigate();

    useEffect(() => {
        getResults();
    }, []);


    async function getResults() {
        setPageState(PageState.loading);
        try {
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
                        <Typography variant="h6" sx={{ color: 'black', textTransform: "none" }}>{`Score: ${DailyPuzzleFunctions.getScore(words)}`}</Typography>
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