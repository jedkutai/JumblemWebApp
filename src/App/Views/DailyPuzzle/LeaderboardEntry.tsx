import { useEffect, useState } from "react";
import { DailyPuzzleEntryModel, UserModel, WordModel } from "../../../Background/Models";
import { Box, Button, CircularProgress, Typography } from "@mui/material";
import { HSpacer, HStack, VStack } from "../../../ReactSwiftly";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { DisplayFunctions } from "../../../Background/Utils/DisplayFunctions";
import { FetchService } from "../../../Background/Service";
import DailyPuzzleFoundWords from "./DailyPuzzleFoundWords";
import { WordBankFunctions } from "../../../Background/Utils/WordBankFunctions";

enum ViewState {
    loading,
    loaded,
    hidden,
    failedToLoadPlayer
}

interface LeaderBoardEntryProps {
    position: number;
    entry: DailyPuzzleEntryModel;
    passedUser: UserModel;
}

export default function LeaderboardEntry({
    position,
    entry,
    passedUser
}: LeaderBoardEntryProps) {
    const [wordBankDict, setWordBankDict] = useState<Record<string, string[]>>({});
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
            const wordBank = await WordBankFunctions.getWordBank();
            setWordBankDict(wordBank);
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
                    const wordModel = await FetchService.fetchWordModelByWord(word, wordBankDict);
                    fetchedWords[word] = [wordModel, 1];
                }
            }
            setWords(fetchedWords);
            setWordsLoaded(true);
        } catch (error) {
        }
    }

    const style = {
        section: {
            backgroundImage:
                "linear-gradient(to bottom right, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.05))",
            borderRadius: "15px",
            border: passedUser.id == entry.userId ? "3px solid rgba(219, 112, 246, 0.83)" : "3px solid rgba(0, 0, 0, 0.1)",
            padding: "20px",
            width: `${Math.max(minDimension, upperBound) * 8 / dimensionDivider}px`,
        },
        button: {
            margin: "10px",
            flex: 1,
            backgroundColor: "rgb(227, 218, 195)",
            color: "black",
            fontWeight: 600,
        },
    }

    return (
        <>
            {expand ? (
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

                        {expand && wordsLoaded && (
                            <DailyPuzzleFoundWords correctWords={words} />
                        )}

                        {expand && !wordsLoaded && (
                            <CircularProgress />
                        )}


                        <Button onClick={() => setExpand(false)} variant="contained" style={style.button}>Minimize</Button>
                    </VStack>
                </Box>
            ) : (
                <Button onClick={() => setExpand(true)}>
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

                            {expand && wordsLoaded && (
                                <DailyPuzzleFoundWords correctWords={words} />
                            )}

                            {expand && !wordsLoaded && (
                                <CircularProgress />
                            )}

                        </VStack>
                    </Box>
                </Button>
            )}
        </>

    )
}