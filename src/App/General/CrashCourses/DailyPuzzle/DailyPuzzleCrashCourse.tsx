import { useEffect, useState } from "react";
import { DailyPuzzleModel, GridSpotModel, WordModel } from "../../../../Background/Models";
import { GridSpot } from "../../../../Background/Extends/GridSpot";
import { useWindowSize } from "../../../../Background/Utils/useWindowSize";
import { HStack, View, VStack } from "../../../../ReactSwiftly";
import { CrashCoursePuzzle } from "../../../../Background/Extends/DailyPuzzleCrashCourse";
import { Typography, Button } from "@mui/material";
import JumblemLogoSimple from "../../../Components/JumblemLogoSimple";
import HowToPlayDailyPuzzle from "../../../Views/HowToPlay/HowToPlayDailyPuzzle";
import { DisplayFunctions } from "../../../../Background/Utils/DisplayFunctions";
import DailyPuzzleGrid from "../../../Views/DailyPuzzle/DailyPuzzleGrid";
import { DailyPuzzleFunctions } from "../../../../Background/Utils/DailyPuzzleFunctions";
import DailyPuzzleFoundWords from "../../../Views/DailyPuzzle/DailyPuzzleFoundWords";
import DailyPuzzleLetterBank from "../../../Views/DailyPuzzle/DailyPuzzleLetterBank";
import { WordBankFunctions } from "../../../../Background/Utils/WordBankFunctions";

enum PuzzleState {
    intro,
    howTo,
    active,
    submitted
}

export default function DailyPuzzleCrashCourse() {
    const [wordBankDict, setWordBankDict] = useState<Record<string, string[]>>({});
    const dailyPuzzle: DailyPuzzleModel = CrashCoursePuzzle;
    const [puzzleState, setPuzzleState] = useState<PuzzleState>(PuzzleState.intro);
    const [selectedGridSpot, setSelectedGridSpot] = useState("");
    const [selectedLetter, setSelectedLetter] = useState("");
    const [repeatGuessWarning, setRepeatGuessWarning] = useState(false);
    const [checkingGuess, setCheckingGuess] = useState(false);
    const [guessesDict, setGuessesDict] = useState<Record<string, string[]>>({});
    const [livesRemaining, setLivesRemaining] = useState(3);
    const [goldenGrids, setGoldenGrids] = useState<string[]>([]);
    const [wrongGuessHighlight, setWrongGuessHighlight] = useState(false);
    const [showScoreDetails, setShowScoreDetails] = useState(false);
    const [correctWords, setCorrectWords] = useState<Record<string, [WordModel, number]>>({});
    const [grid, setGrid] = useState<GridSpotModel[][]>(GridSpot.grid);
    const [firstMoveMade, setFirstMoveMade] = useState(false);
    const dailyPuzzleDict: Record<string, GridSpotModel> = DailyPuzzleFunctions.signatureToGridDict(dailyPuzzle.signature);
    const { minDimension } = useWindowSize();
    const dimensionDivider = 9 * 1.75;
    const upperBound = 650;
    const { height } = useWindowSize();

    useEffect(() => {
        onAppearActions();
    }, []);

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

    async function submitPuzzle() {
        localStorage.setItem("dailyPuzzleCrashCoursePlayed", "true");
        setPuzzleState(PuzzleState.submitted);
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
                        console.error("Error checking words:", error);
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

    async function onAppearActions() {
        try {
            const wordBank = await WordBankFunctions.getWordBank();
            setWordBankDict(wordBank);

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

    return (
        <View startAtTop={true}>
            <VStack>
                {puzzleState == PuzzleState.intro && (
                    <>
                        <JumblemLogoSimple />
                        <Typography>{"Daily Puzzle Crash Course".toUpperCase()}</Typography>

                        <div style={{ height: `${Math.max((height - 200) * .4, 100)}px` }}></div>
                        <Button onClick={() => setPuzzleState(PuzzleState.howTo)}>
                            Continue
                        </Button>
                    </>
                )}
                {puzzleState == PuzzleState.howTo && (
                    <>
                        <Button onClick={() => setPuzzleState(PuzzleState.active)}>
                            Next
                        </Button>

                        <HowToPlayDailyPuzzle />

                        <Button onClick={() => setPuzzleState(PuzzleState.active)}>
                            Next
                        </Button>
                    </>

                )}
                {puzzleState == PuzzleState.active && (
                    <VStack spacing="0px">
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

                            <Button variant={"contained"} onClick={() => submitPuzzle()}>
                                {"Submit"}
                            </Button>
                        </HStack>

                        {showScoreDetails && (
                            <DailyPuzzleFoundWords correctWords={correctWords} />
                        )}

                        {(livesRemaining > 0) && (
                            <DailyPuzzleLetterBank
                                letters={dailyPuzzle.letterBank}
                                selectedGridSpot={selectedGridSpot}
                                setSelectedLetter={setSelectedLetter}
                                livesRemaining={livesRemaining}
                                blockDimension={Math.max(minDimension, upperBound) / dimensionDivider}
                            />
                        )}



                        <VStack spacing="0px" height="40px">
                            {repeatGuessWarning ? (
                                <Typography color="error">This is a duplicate guess!</Typography>
                            ) : (
                                <>
                                <div style={{ height: "100%" }}></div>
                                    {guessesDict[selectedGridSpot] && guessesDict[selectedGridSpot].length > 0 && (
                                        <>
                                            <Typography textAlign={"center"}>GUESSES</Typography>
                                            <Typography textAlign={"center"}>{`${guessesDict[selectedGridSpot].join(", ").toUpperCase()}`}</Typography>
                                        </>
                                    )}
                                </>
                            )}
                        </VStack>

                        {Object.keys(correctWords).length <= 2 ? (
                            <>
                                <div style={{ height: "20px" }}></div>
                                <Typography textAlign={"center"}>
                                    {"Select an empty square adjacent to a letter (above, below, left, or right)."}
                                </Typography>
                                <div style={{ height: "10px" }}></div>

                                <Typography textAlign={"center"}>
                                    {"Then tap one of the letters below to guess a word."}
                                </Typography>
                                <div style={{ height: "10px" }}></div>

                                <Typography textAlign={"center"}>
                                    {"Only 4-7 letters words are valid."}
                                </Typography>
                            </>
                        ) : (
                            <>
                                <div style={{ height: "20px" }}></div>
                                <Typography textAlign={"center"}>
                                    {"Tap the score button to view all the words you've found so far."}
                                </Typography>
                                <div style={{ height: "10px" }}></div>

                                <Typography textAlign={"center"}>
                                    {"When you run out of lives or give up, tap Submit."}
                                </Typography>
                            </>
                        )}
                    </VStack>
                )}
                {puzzleState == PuzzleState.submitted && (
                    <VStack>
                        <Button onClick={() => window.location.reload()}>
                            Done
                        </Button>
                        <Button onClick={() => window.location.reload()}>
                            <JumblemLogoSimple />
                        </Button>

                        {Object.keys(correctWords).length > 0 && (
                            <Typography>{"Click on a word to see the definition."}</Typography>
                        )}

                        <h2 style={{ color: "black" }}>{`Total: ${DailyPuzzleFunctions.getScore(correctWords)}`}</h2>
                        <DailyPuzzleFoundWords correctWords={correctWords} />
                    </VStack>
                )}
            </VStack>
        </View>
    );
}