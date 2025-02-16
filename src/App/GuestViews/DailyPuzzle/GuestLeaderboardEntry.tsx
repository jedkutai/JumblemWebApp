import { Button, Box, Typography, CircularProgress } from "@mui/material";
import { useState, useEffect } from "react";
import { DailyPuzzleEntryModel, UserModel, WordModel } from "../../../Background/Models";
import { FetchService } from "../../../Background/Service";
import { DisplayFunctions } from "../../../Background/Utils/DisplayFunctions";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { VStack, HStack, HSpacer } from "../../../ReactSwiftly";
import DailyPuzzleFoundWords from "../../Views/DailyPuzzle/DailyPuzzleFoundWords";

enum ViewState {
    loading,
    loaded,
    hidden,
    failedToLoadPlayer
}

interface GuestLeaderBoardEntryProps {
    position: number;
    entry: DailyPuzzleEntryModel;
}

export default function GuestLeaderboardEntry({
    position,
    entry,
}: GuestLeaderBoardEntryProps) {
    const [player, setPlayer] = useState<UserModel | null>(null);
    const [_viewState, setViewState] = useState<ViewState>(ViewState.hidden);
    const [wordsLoaded, setWordsLoaded] = useState(false);
    const [expand, setExpand] = useState(false); // first expand should load words
    const [words, setWords] = useState<Record<string, [WordModel, number]>>({});
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;
    const { minDimension } = useWindowSize();

    useEffect(() => {
        onAppearActions();
    }, []);

    useEffect(() => {
        fetchWords();
    }, [expand]);




    async function onAppearActions() {
        // fetch player
        try {
            const loadedPlayer = await FetchService.fetchUserByUid(entry.userId);
            setPlayer(loadedPlayer);
        } catch {
            setViewState(ViewState.failedToLoadPlayer);
        }
    }

    async function fetchWords() {
        if (wordsLoaded) {
            return;
        }
        try {
            let fetchedWords: Record<string, [WordModel, number]> = {};
            for (const word of entry.words) {
                if (Object.keys(fetchedWords).includes(word)) {
                    fetchedWords[word][1] += 1;
                } else {
                    const wordModel = await FetchService.fetchWordModelByWord(word);
                    fetchedWords[word] = [wordModel, 1];
                }
            }
            setWords(fetchedWords);
            setWordsLoaded(true);
        } catch(error) {
        }
    }

    const style = {
        section: {
            backgroundImage:
                "linear-gradient(to bottom right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05))",
            borderRadius: "15px",
            border: "3px solid rgba(0, 0, 0, 0.1)",
            padding: "20px",
            width: `${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`,
        },
    }

    return (
        <Button onClick={() => setExpand(!expand)}>
            <Box style={style.section}>
                <VStack>
                    <HStack>
                        <>
                            <Typography variant="h6" sx={{ color: 'black', textTransform: "none" }}>{position > 0 ? position : "-"}</Typography>

                            <HSpacer />
                            {(player && player.usernameDisplayed) ? (
                                <Typography variant="h6" sx={{ color: 'black', textTransform: "none" }}>{DisplayFunctions.displayUsername(player.usernameDisplayed)}</Typography>
                            ) : (
                                <Typography variant="h6" sx={{ color: 'black', textTransform: "none" }}>{"Loading..."}</Typography>
                            )}

                            <HSpacer />

                            <Typography variant="h6" sx={{ color: 'black', textTransform: "none" }}>{Math.floor(entry.score)}</Typography>
                        </>

                    </HStack>

                    {expand &&  wordsLoaded && (
                        <DailyPuzzleFoundWords correctWords={words} />
                    )}

                    {expand && !wordsLoaded && (
                        <CircularProgress/>
                    )}

                </VStack>
            </Box>
        </Button>
    )
}