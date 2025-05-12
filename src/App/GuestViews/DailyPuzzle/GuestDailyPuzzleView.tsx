import { Typography, Button } from "@mui/material";
import { useState, useEffect } from "react";
import { GridSpot } from "../../../Background/Extends/GridSpot";
import { DailyPuzzleModel, GridSpotModel, UserModel, WordModel } from "../../../Background/Models";
import { DailyPuzzleFunctions } from "../../../Background/Utils/DailyPuzzleFunctions";
import { DisplayFunctions } from "../../../Background/Utils/DisplayFunctions";
import { useWindowSize } from "../../../Background/Utils/useWindowSize";
import { View, VStack, HStack } from "../../../ReactSwiftly";
import JumblemLogoSimple from "../../Components/JumblemLogoSimple";
import DailyPuzzleFoundWords from "../../Views/DailyPuzzle/DailyPuzzleFoundWords";
import DailyPuzzleGrid from "../../Views/DailyPuzzle/DailyPuzzleGrid";
import DailyPuzzleLetterBank from "../../Views/DailyPuzzle/DailyPuzzleLetterBank";
import GuestDailyPuzzleResultsView from "./GuestDailyPuzzleResultsView";
import { WordBankFunctions } from "../../../Background/Utils/WordBankFunctions";
import PrepuzzleMessage from "../../Components/PrepuzzleMessage";
import HowToPlayHeader from "../../Components/HowToPlayHeader";
import { GameService } from "../../../Background/Service";
// import { UserModelGuest } from "../../../Background/Extends/UserModelGuest";

interface DailyPuzzleViewProps {
    dailyPuzzle: DailyPuzzleModel;
    dailyPuzzleDict: Record<string, GridSpotModel>;
    passedCorrectWords?: Record<string, [WordModel, number]>;
    passedGuessesDict?: Record<string, string[]>;
    passedLivesRemaining?: number;
    guestUser: UserModel;
}

export default function DailyPuzzleView({
    dailyPuzzle,
    dailyPuzzleDict,
    passedCorrectWords,
    passedGuessesDict,
    passedLivesRemaining,
    guestUser
}: DailyPuzzleViewProps) {
    const [correctWords, setCorrectWords] = useState<Record<string, [WordModel, number]>>(passedCorrectWords ?? {});
    const [guessesDict, setGuessesDict] = useState<Record<string, string[]>>(passedGuessesDict ?? {});
    const [livesRemaining, setLivesRemaining] = useState(passedLivesRemaining ?? 3);
    const [firstMoveMade, setFirstMoveMade] = useState<boolean>(passedGuessesDict != undefined);

    const [wordBankDict, setWordBankDict] = useState<Record<string, string[]>>({});
    const [selectedGridSpot, setSelectedGridSpot] = useState("");
    const [selectedLetter, setSelectedLetter] = useState("");
    const [repeatGuessWarning, setRepeatGuessWarning] = useState(false);
    const [checkingGuess, setCheckingGuess] = useState(false);
    const [goldenGrids, setGoldenGrids] = useState<string[]>([]);
    const [wrongGuessHighlight, setWrongGuessHighlight] = useState(false);
    const [showScoreDetails, setShowScoreDetails] = useState(false);
    const [recentlyCorrectWords, setRecentlyCorrectWords] = useState<Record<string, [WordModel, number]>>({});
    const [grid, setGrid] = useState<GridSpotModel[][]>(GridSpot.grid);
    const [submittingPuzzle, setSubmittingPuzzle] = useState(false);
    const [view, setView] = useState<"PlayPuzzle" | "Results">("PlayPuzzle");
    const { minDimension } = useWindowSize();
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;


    useEffect(() => {
        onAppearActions();
    }, []);

    useEffect(() => {
        DailyPuzzleFunctions.savePuzzleProgress(dailyPuzzle, guessesDict, livesRemaining, correctWords);
    }, [livesRemaining, correctWords, guessesDict]);

    useEffect(() => {
        if (repeatGuessWarning) {
            const timeout = setTimeout(async () => {
                setRepeatGuessWarning(false);
            }, 1000 * 2.5);

            return () => clearTimeout(timeout);
        }
    }, [repeatGuessWarning])

    useEffect(() => {
        if (selectedLetter.length > 0) {
            const leter = selectedLetter;
            const gridSpot = selectedGridSpot;
            checkForWord(gridSpot, leter, wordBankDict);

            setSelectedLetter("");

            if (!firstMoveMade) {
                setFirstMoveMade(true);
            }
        }
    }, [selectedLetter])

    useEffect(() => {
        if (wrongGuessHighlight) {
            const timeout = setTimeout(async () => {
                setWrongGuessHighlight(false);
            }, 1000);

            return () => clearTimeout(timeout);
        }
    }, [wrongGuessHighlight]);


    async function onAppearActions() {
        try {
            const wordBank = await WordBankFunctions.getWordBank();
            setWordBankDict(wordBank);
            localStorage.setItem("lastPuzzlePlayedId", dailyPuzzle.id);
            localStorage.setItem("lastPuzzlePlayedDate", DisplayFunctions.displayPuzzleDateShort(dailyPuzzle.timestamp));
            const newGrid = GridSpot.grid.map((row, r) =>
                row.map((_, c) => {
                    const key = `${r},${c}`;
                    return dailyPuzzleDict[key];
                })
            );
            setGrid(newGrid);
        } catch {

        }
    }

    async function checkForWord(gridSpot: string, letter: string, wordBankDict: Record<string, string[]>) {
        if (!checkingGuess) {
            setCheckingGuess(true);

            let canGuess = true;

            // Check if the guess already exists
            if (guessesDict[gridSpot]?.includes(letter.toLowerCase())) {
                canGuess = false;
                setRepeatGuessWarning(true); // Trigger warning
            }

            if (canGuess) {
                setRecentlyCorrectWords({});
                const [r, c] = DailyPuzzleFunctions.getCoordinateInts(gridSpot);

                // Update the grid immutably
                setGrid((prevGrid) =>
                    prevGrid.map((row, rowIndex) =>
                        row.map((cell, colIndex) =>
                            rowIndex === r && colIndex === c
                                ? { ...cell, letter }
                                : cell
                        )
                    )
                );

                // Update guessesDict immutably
                setGuessesDict((prevGuessesDict) => {
                    const newGuessesDict = { ...prevGuessesDict };
                    if (newGuessesDict[gridSpot]) {
                        newGuessesDict[gridSpot] = [...newGuessesDict[gridSpot], letter.toLowerCase()].sort();
                    } else {
                        newGuessesDict[gridSpot] = [letter.toLowerCase()];
                    }
                    return newGuessesDict;
                });

                if (gridSpot && letter) {
                    // Update dailyPuzzleDict immutably
                    const updatedSpot = { ...dailyPuzzleDict[gridSpot], letter: letter.toLowerCase() };
                    const updatedDailyPuzzleDict = { ...dailyPuzzleDict, [gridSpot]: updatedSpot };

                    try {
                        const words = await DailyPuzzleFunctions.checkWords(updatedSpot, updatedDailyPuzzleDict, wordBankDict);

                        // Update goldenGrids and correctWords immutably
                        words.forEach(([wordModel, winningGridSpots]) => {
                            setGoldenGrids((prevGoldenGrids) => [...prevGoldenGrids, ...winningGridSpots]);
                            setCorrectWords((prevCorrectWords) => {
                                const updatedCorrectWords = { ...prevCorrectWords };
                                if (updatedCorrectWords[wordModel.word]) {
                                    updatedCorrectWords[wordModel.word][1] += 1;
                                } else {
                                    updatedCorrectWords[wordModel.word] = [wordModel, 1];
                                }
                                return updatedCorrectWords;
                            });
                            setRecentlyCorrectWords((prevCorrectWords) => {
                                const updatedCorrectWords = { ...prevCorrectWords };
                                if (updatedCorrectWords[wordModel.word]) {
                                    updatedCorrectWords[wordModel.word][1] += 1;
                                } else {
                                    updatedCorrectWords[wordModel.word] = [wordModel, 1];
                                }
                                return updatedCorrectWords;
                            });
                        });

                        if (words.length === 0) {
                            setLivesRemaining((prevLives) => {
                                const newLives = prevLives - 1;
                                if (newLives <= 0) {
                                    setSelectedGridSpot("");
                                }
                                return newLives;
                            });
                            setWrongGuessHighlight(true); // Trigger wrong guess animation
                        }
                    } catch (error) {
                    }
                }

                // Reset grid and goldenGrids after a delay
                setTimeout(() => {
                    setGrid((prevGrid) =>
                        prevGrid.map((row, rowIndex) =>
                            row.map((cell, colIndex) =>
                                rowIndex === r && colIndex === c ? { ...cell, letter: "" } : cell
                            )
                        )
                    );
                    setGoldenGrids([]);
                }, 1000);
            }

            setCheckingGuess(false);
        }
    }



    async function submitPuzzle() {
        if (submittingPuzzle) return;

        setSubmittingPuzzle(true);
        try {
            const timeDuration = 0;
            await GameService.submitDailyPuzzleEntry(guestUser, dailyPuzzle, correctWords, timeDuration);
            DailyPuzzleFunctions.clearPuzzleProgress();
        } catch {

        }
        
        let saveString = "";
        for (const word of Object.keys(correctWords).sort((a, b) => a.localeCompare(b))) {
            for (let i = 0; i < correctWords[word][1]; i++) {
                saveString += saveString === "" ? word : `,${word}`;
            }
        }
        DailyPuzzleFunctions.clearPuzzleProgress();
        localStorage.setItem("lastPuzzlePlayedResults", saveString);

        setView("Results");
        setSubmittingPuzzle(false);
    }

    if (view === "Results") {
        return (
            <GuestDailyPuzzleResultsView />
        );
    }

    return (
        <View startAtTop={true}>
            <VStack spacing="0px">
                <HowToPlayHeader versus={false} />
                <JumblemLogoSimple />
                <Typography>Daily Puzzle: {DisplayFunctions.displayPuzzleDate(dailyPuzzle.timestamp)}</Typography>

                <DailyPuzzleGrid
                    grid={grid}
                    selectedGridSpot={selectedGridSpot}
                    setSelectedGridSpot={setSelectedGridSpot}
                    dailyPuzzleDict={dailyPuzzleDict}
                    goldenGrids={goldenGrids}
                />

                <HStack padding="10px">
                    <Typography color={livesRemaining > 1 ? "primary" : "error"}>{`Lives: ${livesRemaining}`}</Typography>

                    <Button variant={showScoreDetails ? "contained" : "outlined"} onClick={() => setShowScoreDetails(!showScoreDetails)}>
                        {`Score: ${DailyPuzzleFunctions.getScore(correctWords)}`}
                    </Button>

                    <Button variant={submittingPuzzle ? "outlined" : "contained"} onClick={() => submitPuzzle()}>
                        {submittingPuzzle ? "Submitting..." : "Submit"}
                    </Button>
                </HStack>

                {showScoreDetails && (
                    <DailyPuzzleFoundWords correctWords={correctWords} recentWords={recentlyCorrectWords} />
                )}

                {(livesRemaining > 0 || !submittingPuzzle) && (
                    <DailyPuzzleLetterBank
                        letters={dailyPuzzle.letterBank.sort()}
                        selectedGridSpot={selectedGridSpot}
                        setSelectedLetter={setSelectedLetter}
                        livesRemaining={livesRemaining}
                        blockDimension={Math.max(minDimension, upperBound) / dimensionDivider}
                    />
                )}

                {!firstMoveMade && (
                    <PrepuzzleMessage />
                )}
                <VStack spacing="0px" height="30px">

                    {repeatGuessWarning ? (
                        <Typography color="error">This is a duplicate guess!</Typography>
                    ) : (
                        <>
                            {guessesDict[selectedGridSpot] && guessesDict[selectedGridSpot].length > 0 && (
                                <>
                                    <Typography textAlign={"center"}>GUESSES</Typography>
                                    <Typography textAlign={"center"}>{`${guessesDict[selectedGridSpot].join(", ").toUpperCase()}`}</Typography>
                                </>
                            )}
                        </>
                    )}
                </VStack>
            </VStack>
        </View>
    );
}